import { Link } from "react-router-dom";
import {
  Code2,
  Globe,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trash2,
  Calendar,
  User,
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

function ProjectAccessRequestCard({ request, onInitiateCancel }) {
  const resource = resourceConfig[request.resourceType] || {
    label: request.resourceType || "Project Resource",
    icon: FileText,
  };

  const ResourceIcon = resource.icon;
  const project = request.project || {};
  const projectId =
    project._id || project.id || (typeof project === "string" ? project : null);
  const projectTitle = project.title || "Untitled Project";
  const status = (request.status || "pending").toLowerCase();

  // Academic metadata parts
  const metaParts = [
    project.domain,
    project.department,
    project.academicYear,
  ].filter(Boolean);

  const creatorName =
    project.createdBy?.fullName ||
    project.createdBy?.username ||
    (typeof project.createdBy === "string" && !project.createdBy.startsWith("6")
      ? project.createdBy
      : null);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-nexora-sm transition-all hover:border-border-strong hover:shadow-nexora-md">
      <div className="space-y-3">
        {/* Header: Title, Academic Meta & Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold tracking-tight text-foreground truncate">
              {projectTitle}
            </h3>
            {metaParts.length > 0 && (
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {metaParts.join(" · ")}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {status === "approved" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700 border border-success-200">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Approved
              </span>
            ) : status === "rejected" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-50 px-2.5 py-1 text-xs font-semibold text-danger-700 border border-danger-200">
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-medium text-warning-800 border border-warning-200">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Pending
              </span>
            )}
          </div>
        </div>

        {/* Project Summary if available */}
        {project.summary && (
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {project.summary}
          </p>
        )}

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
                ? "Live Demo Access"
                : request.resourceType === "supportingDocument"
                ? "Document Access"
                : "Repository Access"}
            </p>
          </div>
        </div>

        {/* Dates & Creator info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground pt-1">
          {request.createdAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
              <span>Requested {formatDate(request.createdAt)}</span>
            </div>
          )}

          {request.respondedAt && (
            <div className="flex items-center gap-1">
              <span>
                {status === "approved" ? "Approved" : "Responded"}{" "}
                {formatDate(request.respondedAt)}
              </span>
            </div>
          )}

          {creatorName && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
              <span className="truncate max-w-[140px]">By {creatorName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3.5 border-t border-border/70 flex items-center justify-between">
        {status === "pending" ? (
          <>
            <span className="text-xs text-muted-foreground">Waiting for response</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onInitiateCancel(request)}
              className="gap-1.5 text-xs text-danger-700 hover:bg-danger-50 border-danger-200"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Cancel Request</span>
            </Button>
          </>
        ) : (
          <>
            <span className="text-xs text-muted-foreground">
              {status === "approved" ? "Access granted" : "Request closed"}
            </span>
            {projectId ? (
              <Link to={`/app/student/projects/${projectId}`}>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="gap-1.5 text-xs"
                >
                  <span>View Project</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </Link>
            ) : (
              <span />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectAccessRequestCard;
