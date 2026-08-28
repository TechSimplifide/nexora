import { useState } from "react";
import {
  Code2,
  Globe,
  FileText,
  Lock,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Loader2,
  RotateCcw,
  AlertCircle,
  Check,
} from "lucide-react";
import Button from "@/components/ui/Button";
import PdfViewerModal from "@/components/common/PdfViewerModal";
import {
  createProjectAccessRequest,
  getProjectResource,
} from "@/services/project.service";

const resourceConfig = {
  github: {
    defaultLabel: "GitHub Repository",
    icon: Code2,
    actionLabel: "Open GitHub",
  },
  deployedLink: {
    defaultLabel: "Live Application Demo",
    icon: Globe,
    actionLabel: "Open Live Demo",
  },
  supportingDocument: {
    defaultLabel: "Supporting Document (PDF)",
    icon: FileText,
    actionLabel: "View Document",
  },
};

function ProjectResourceCard({
  projectId,
  resourceType,
  resourceData,
  request,
  onRequestCreated,
  isOwner = false,
}) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [viewerDocumentUrl, setViewerDocumentUrl] = useState(null);

  // If resource data is completely missing or empty, do not render
  if (!resourceData || (!resourceData.url && !resourceData.access)) {
    return null;
  }

  const config = resourceConfig[resourceType] || {
    defaultLabel: "Project Resource",
    icon: FileText,
    actionLabel: "Open Resource",
  };

  const IconComponent = config.icon;
  const resourceTitle = resourceData.name || config.defaultLabel;

  const isPublic = resourceData.access === "public";
  const hasDirectUrl = Boolean(resourceData.url);

  // Request status
  const requestStatus = request?.status; // "pending" | "approved" | "rejected" | undefined

  const isApproved =
    isOwner ||
    requestStatus === "approved" ||
    (!isPublic && hasDirectUrl);

  const isPending = !isApproved && requestStatus === "pending";
  const isRejected = !isApproved && requestStatus === "rejected";

  // Handle Request Access
  const handleRequestAccess = async () => {
    setIsRequesting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await createProjectAccessRequest(projectId, resourceType);
      const createdRequest = response?.data || {
        project: projectId,
        resourceType,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setSuccessMsg("Access request sent to the project owner.");
      if (onRequestCreated) {
        onRequestCreated(createdRequest);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit access request.");
    } finally {
      setIsRequesting(false);
    }
  };

  // Handle Secure Open
  const handleOpenResource = async () => {
    setErrorMsg(null);

    // If resource is supporting document, open in-app via PdfViewerModal
    if (resourceType === "supportingDocument") {
      if (isPublic && resourceData.url) {
        setViewerDocumentUrl(resourceData.url);
        setIsPdfModalOpen(true);
        return;
      }

      setIsOpening(true);
      try {
        const response = await getProjectResource(projectId, resourceType);
        const resourceUrl = response?.data?.url;
        if (resourceUrl) {
          setViewerDocumentUrl(resourceUrl);
          setIsPdfModalOpen(true);
        } else {
          throw new Error("No URL returned for this document.");
        }
      } catch (err) {
        setErrorMsg(
          err.message || "You do not have permission to access this document."
        );
      } finally {
        setIsOpening(false);
      }
      return;
    }

    // External resources (GitHub, Live Demo) open externally in new tab
    if (isPublic && resourceData.url) {
      window.open(resourceData.url, "_blank", "noopener,noreferrer");
      return;
    }

    setIsOpening(true);
    try {
      const response = await getProjectResource(projectId, resourceType);
      const resourceUrl = response?.data?.url;
      if (resourceUrl) {
        window.open(resourceUrl, "_blank", "noopener,noreferrer");
      } else {
        throw new Error("No URL returned for this resource.");
      }
    } catch (err) {
      setErrorMsg(
        err.message || "You do not have permission to access this resource."
      );
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-4 shadow-nexora-sm transition-all hover:border-border-strong">
      <div className="space-y-3">
        {/* Header: Icon, Title & Access Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-foreground-secondary border border-border/70">
              <IconComponent className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {resourceTitle}
              </h3>
              <p className="text-[11px] text-muted-foreground capitalize">
                {resourceType === "deployedLink"
                  ? "Live Demo"
                  : resourceType === "supportingDocument"
                  ? "Document"
                  : "Repository"}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {isPublic ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-foreground-secondary border border-border/60">
                Public
              </span>
            ) : isApproved ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-700 border border-success-200">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Access Granted
              </span>
            ) : isPending ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-warning-50 px-2 py-0.5 text-[11px] font-medium text-warning-800 border border-warning-200">
                <Clock className="h-3 w-3" aria-hidden="true" />
                Pending
              </span>
            ) : isRejected ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-danger-50 px-2 py-0.5 text-[11px] font-medium text-danger-700 border border-danger-200">
                <XCircle className="h-3 w-3" aria-hidden="true" />
                Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground border border-border/70">
                <Lock className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                Restricted
              </span>
            )}
          </div>
        </div>

        {/* Informational Text Description */}
        <div className="text-xs leading-relaxed text-muted-foreground">
          {isPublic ? (
            <p>Available to everyone with access to this project.</p>
          ) : isApproved ? (
            <p className="text-success-700">
              You have been granted access to view and use this resource.
            </p>
          ) : isPending ? (
            <p className="text-warning-800">
              Your access request is pending approval from the project owner.
            </p>
          ) : isRejected ? (
            <p className="text-danger-700">
              The project owner did not approve your previous access request.
            </p>
          ) : (
            <p>This resource is protected and requires permission from the project owner.</p>
          )}
        </div>

        {/* Feedback Messages (Success / Error) */}
        {successMsg && (
          <div className="flex items-center gap-1.5 rounded-lg bg-success-50 px-2.5 py-1.5 text-xs font-medium text-success-800 border border-success-200">
            <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-1.5 rounded-lg bg-danger-50 px-2.5 py-1.5 text-xs font-medium text-danger-800 border border-danger-200">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="break-words">{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-3 border-t border-border/70 flex items-center justify-end">
        {isPublic ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenResource}
            className="w-full sm:w-auto gap-1.5 text-xs font-medium"
          >
            <span>{config.actionLabel}</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </Button>
        ) : isApproved ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleOpenResource}
            disabled={isOpening}
            className="w-full sm:w-auto gap-1.5 text-xs font-semibold"
          >
            {isOpening ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Opening...</span>
              </>
            ) : (
              <>
                <span>{config.actionLabel}</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            )}
          </Button>
        ) : isPending ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground py-1">
            <Clock className="h-3.5 w-3.5 text-warning-600" aria-hidden="true" />
            <span>Waiting for approval</span>
          </div>
        ) : isRejected ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRequestAccess}
            disabled={isRequesting}
            className="w-full sm:w-auto gap-1.5 text-xs text-danger-700 hover:bg-danger-50 border-danger-200"
          >
            {isRequesting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Requesting...</span>
              </>
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Request Access Again</span>
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleRequestAccess}
            disabled={isRequesting}
            className="w-full sm:w-auto gap-1.5 text-xs font-medium"
          >
            {isRequesting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Requesting...</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Request Access</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* In-App PDF Document Viewer */}
      {isPdfModalOpen && viewerDocumentUrl && (
        <PdfViewerModal
          isOpen={isPdfModalOpen}
          onClose={() => {
            setIsPdfModalOpen(false);
            setViewerDocumentUrl(null);
          }}
          documentUrl={viewerDocumentUrl}
          title={resourceTitle || "Supporting Document"}
          subtitle="Project Supporting Documentation"
          downloadFilename={`${resourceTitle || "Supporting_Document"}.pdf`}
        />
      )}
    </div>
  );
}

export default ProjectResourceCard;
