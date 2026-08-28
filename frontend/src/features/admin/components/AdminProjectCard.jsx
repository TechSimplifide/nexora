import { Link } from "react-router-dom";
import {
  Star,
  Layers,
  Building,
  GraduationCap,
  User,
  ArrowRight,
  Calendar,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/date";

function AdminProjectCard({
  project,
  onUnfeature = null,
  isUnfeaturing = false,
}) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  const creatorName =
    project.createdBy?.fullName ||
    project.createdBy?.username ||
    "Student Creator";

  const projectId = project._id || project.id;

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm transition-all hover:border-border-strong hover:shadow-nexora-md">
      <div className="space-y-4">
        {/* Top Badges: Featured & Category */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2.5 py-0.5 text-xs font-bold text-warning-800 border border-warning-200 shadow-2xs">
                <Star className="h-3 w-3 fill-warning-600 text-warning-600" aria-hidden="true" />
                Featured
              </span>
            )}
            {project.domain && (
              <span className="inline-flex items-center gap-1 rounded-md bg-surface-secondary px-2 py-0.5 text-xs font-medium text-foreground-secondary border border-border/60">
                <Layers className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                {project.domain}
              </span>
            )}
          </div>

          {project.academicYear && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              {project.academicYear}
            </span>
          )}
        </div>

        {/* Title & Summary */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary leading-snug">
            <Link
              to={`/app/admin/projects/${projectId}`}
              className="focus-visible:outline-none focus-visible:underline"
            >
              {project.title || "Untitled Project"}
            </Link>
          </h3>
          {project.summary && (
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {project.summary}
            </p>
          )}
        </div>

        {/* Department & Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/60">
          {project.department && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-foreground-secondary">
              <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
              <span className="truncate">{project.department}</span>
            </div>
          )}

          {project.createdAt && (
            <div className="flex items-center gap-1 text-[11px] ml-auto">
              <Calendar className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{formatDate(project.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Technologies Stack */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="rounded-md border border-border/70 bg-surface-secondary/60 px-2 py-0.5 text-[11px] font-medium text-foreground-secondary"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 4 && (
              <span className="rounded-md border border-border/50 bg-surface-secondary/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                +{technologies.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Creator info and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-border/80 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground truncate max-w-[170px]">
          <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate text-[11px]">
            Created by <strong className="font-semibold text-foreground">{creatorName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onUnfeature && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUnfeaturing}
              onClick={() => onUnfeature(project)}
              className="text-xs text-muted-foreground hover:text-danger-700 hover:border-danger-200"
            >
              <span>Remove Featured</span>
            </Button>
          )}

          <Link
            to={`/app/admin/projects/${projectId}`}
            tabIndex={-1}
            aria-hidden="true"
          >
            <Button
              type="button"
              variant={onUnfeature ? "primary" : "outline"}
              size="sm"
              className="gap-1.5 text-xs font-semibold"
            >
              <span>View Project</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default AdminProjectCard;
