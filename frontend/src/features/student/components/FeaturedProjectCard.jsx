import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, FolderGit2, ArrowRight, User, GraduationCap, Calendar } from "lucide-react";

function FeaturedProjectCard({ project }) {
  const [imageError, setImageError] = useState(false);
  const screenshotUrl = project.screenshots?.[0]?.url;
  const hasValidScreenshot = Boolean(screenshotUrl && !imageError);

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];
  const maxVisibleTechs = 3;
  const visibleTechs = technologies.slice(0, maxVisibleTechs);
  const remainingCount = technologies.length - maxVisibleTechs;

  const authorName =
    project.createdBy?.fullName ||
    project.createdBy?.username ||
    (Array.isArray(project.teamMembers) && project.teamMembers.length > 0
      ? project.teamMembers[0].name
      : null);

  const projectId = project._id || project.id;
  const projectLink = projectId
    ? `/app/student/projects/${projectId}`
    : "/app/student/projects";

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface shadow-nexora-sm transition-all duration-200 hover:border-border-strong hover:shadow-nexora-md">
      <div>
        {/* Visual Preview / Screenshot Header */}
        <div className="relative aspect-video w-full overflow-hidden border-b border-border/70 bg-surface-secondary">
          {hasValidScreenshot ? (
            <img
              src={screenshotUrl}
              alt={project.title ? `${project.title} screenshot preview` : "Project preview"}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-secondary to-surface p-6 text-muted-foreground">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-border/80 shadow-xs">
                <FolderGit2 className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
            </div>
          )}

          {/* Featured Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur-xs shadow-xs">
              <Star className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
              Featured
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Domain Category */}
          {project.domain && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {project.domain}
            </span>
          )}

          {/* Title */}
          <h3 className="mt-1 text-base font-bold tracking-tight text-foreground line-clamp-2">
            {project.title || "Untitled Project"}
          </h3>

          {/* Summary */}
          {project.summary && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {project.summary}
            </p>
          )}

          {/* Academic & Department Metadata */}
          <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
            {project.department && (
              <div className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
                <span className="truncate max-w-[140px]">{project.department}</span>
              </div>
            )}

            {project.academicYear && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
                <span>{project.academicYear}</span>
              </div>
            )}
          </div>

          {/* Technologies Tags */}
          {technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {visibleTechs.map((tech, index) => (
                <span
                  key={`${tech}-${index}`}
                  className="rounded-md border border-border/60 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary"
                >
                  {tech}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="rounded-md border border-border/60 bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  +{remainingCount} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Author & Link */}
      <div className="flex items-center justify-between border-t border-border/70 bg-surface-secondary/30 px-5 py-3 text-xs">
        {authorName ? (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[120px]">
              Created by <strong className="font-semibold text-foreground">{authorName}</strong>
            </span>
          </div>
        ) : (
          <span />
        )}

        <Link
          to={projectLink}
          className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          <span>View Project</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default FeaturedProjectCard;
