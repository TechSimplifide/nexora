import {
  Code2,
  Globe,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Loader2,
  Calendar,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/date";

const resourceConfig = {
  github: {
    label: "GitHub Repository",
    icon: Code2,
  },
  deployedLink: {
    label: "Live Application Demo",
    icon: Globe,
  },
  supportingDocument: {
    label: "Supporting Document",
    icon: FileText,
  },
};

function ProjectOwnerAccessRequestCard({
  request,
  onApprove,
  onInitiateReject,
  isProcessing,
}) {
  const resource = resourceConfig[request.resourceType] || {
    label: request.resourceType || "Project Resource",
    icon: FileText,
  };
  const ResourceIcon = resource.icon;
  const status = (request.status || "pending").toLowerCase();
  const requester = request.requestedBy || {};

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-nexora-sm transition-all hover:border-border-strong hover:shadow-nexora-md">
      <div className="space-y-3.5">
        {/* Requester Profile & Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary border border-primary/20">
              <User className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-foreground truncate">
                {requester.fullName || requester.username || "Student"}
              </h4>
              {requester.email && (
                <p className="text-[11px] text-muted-foreground truncate">
                  {requester.email}
                </p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {status === "approved" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700 border border-success-200">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Approved
              </span>
            ) : status === "rejected" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-danger-50 px-2.5 py-0.5 text-xs font-semibold text-danger-700 border border-danger-200">
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2.5 py-0.5 text-xs font-medium text-warning-800 border border-warning-200">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Pending
              </span>
            )}
          </div>
        </div>

        {/* Requested Resource Pill */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-surface-secondary/50 px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-surface text-primary border border-border/50 shadow-xs">
            <ResourceIcon className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">
              {resource.label}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">
              {request.resourceType === "deployedLink"
                ? "Live Application Demo"
                : request.resourceType === "supportingDocument"
                ? "Supporting Document"
                : "GitHub Repository"}
            </p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-0.5">
          {request.createdAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>Requested {formatDate(request.createdAt)}</span>
            </div>
          )}

          {status !== "pending" && request.respondedAt && (
            <div className="flex items-center gap-1">
              <span>
                {status === "approved" ? "Approved" : "Rejected"} on{" "}
                {formatDate(request.respondedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions (Pending only) */}
      {status === "pending" && (
        <div className="mt-4 pt-3.5 border-t border-border/70 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onInitiateReject(request)}
            disabled={isProcessing}
            className="text-xs text-danger-700 hover:bg-danger-50 border-danger-200"
          >
            <span>Reject</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onApprove(request)}
            disabled={isProcessing}
            className="gap-1.5 text-xs font-semibold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Approve</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProjectOwnerAccessRequestCard;
