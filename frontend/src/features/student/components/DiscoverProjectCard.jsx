import { Link } from "react-router-dom";
import { GraduationCap, Calendar, ArrowRight, User } from "lucide-react";

function DiscoverProjectCard({ project }) {
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  const projectId = project._id || project.id;
  const projectLink = projectId
    ? `/app/student/projects/${projectId}`
    : "/app/student/projects";

  const authorName =
    project.createdBy?.fullName ||
    project.createdBy?.username ||
    (Array.isArray(project.teamMembers) && project.teamMembers.length > 0
      ? project.teamMembers[0].name
      : null);

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-nexora-sm transition-all duration-200 hover:border-border-strong hover:shadow-nexora-md hover:-translate-y-0.5">
      <div>
        {/* Domain Badge */}
        {project.domain ? (
          <div className="mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {project.domain}
            </span>
          </div>
        ) : null}

        {/* Project Title */}
        <h3 className="text-base font-bold tracking-tight text-foreground line-clamp-2">
          {project.title || "Untitled Project"}
        </h3>

        {/* Project Summary */}
        {project.summary && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
            {project.summary}
          </p>
        )}

        {/* Department & Academic Year Metadata */}
        <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
          {project.department && (
            <div className="flex items-center gap-1">
              <GraduationCap
                className="h-3 w-3 text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <span className="truncate max-w-[150px]">{project.department}</span>
            </div>
          )}

          {project.academicYear && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
              <span>{project.academicYear}</span>
            </div>
          )}
        </div>

        {/* Technologies Tag List */}
        {technologies.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/60">
            <div className="flex flex-wrap gap-1.5" aria-label="Technologies used">
              {technologies.slice(0, 4).map((tech, index) => (
                <span
                  key={`${tech}-${index}`}
                  className="rounded-md border border-border/50 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="rounded-md border border-border/50 bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  +{technologies.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Creator Info & View Project Link */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
        {authorName ? (
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="truncate max-w-[130px] sm:max-w-[150px]">
              Created by <strong className="font-semibold text-foreground">{authorName}</strong>
            </span>
          </div>
        ) : (
          <span />
        )}

        <Link
          to={projectLink}
          className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm shrink-0 ml-2"
        >
          <span>View Project</span>
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

export default DiscoverProjectCard;
