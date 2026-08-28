import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Layers,
  Building,
  GraduationCap,
  Calendar,
  User,
  Users,
  Code2,
  Globe,
  FileText,
  Lock,
  ExternalLink,
  AlertCircle,
  RotateCcw,
  Check,
  X,
  ImageIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import {
  getProjectById,
  featureProject,
  unfeatureProject,
} from "@/services/project.service";
import { formatDate } from "@/utils/date";
import AdminFeatureProjectModal from "@/features/admin/components/AdminFeatureProjectModal";
import PdfViewerModal from "@/components/common/PdfViewerModal";

function AdminProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Feature / Unfeature Modal State
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isSubmittingFeature, setIsSubmittingFeature] = useState(false);
  const [featureError, setFeatureError] = useState(null);

  // In-App Document PDF Viewer Modal State
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  // Screenshot Preview Lightbox
  const [previewImage, setPreviewImage] = useState(null);

  // Dismissible Feedback Banner
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  const fetchProjectData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProjectById(id);
      setProject(response?.data || null);
    } catch (err) {
      setError(
        err.message || "Unable to load project details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!id) return;
      try {
        const response = await getProjectById(id);
        if (isMounted) {
          setProject(response?.data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Unable to load project details. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle Feature / Unfeature Confirmation
  const handleConfirmFeatureToggle = async () => {
    if (!project?._id) return;
    setIsSubmittingFeature(true);
    setFeatureError(null);

    const isCurrentlyFeatured = Boolean(project.isFeatured);

    try {
      let response;
      if (isCurrentlyFeatured) {
        response = await unfeatureProject(project._id);
      } else {
        response = await featureProject(project._id);
      }

      const updatedProject = response?.data || {
        ...project,
        isFeatured: !isCurrentlyFeatured,
      };

      setProject(updatedProject);
      setIsFeatureModalOpen(false);
      setFeedbackBanner({
        type: "success",
        message: isCurrentlyFeatured
          ? "Project removed from Featured showcase."
          : "Project successfully added to Featured showcase!",
      });
    } catch (err) {
      setFeatureError(
        err.message ||
          "Failed to update featured status. Note: Only projects from the current academic year can be featured."
      );
    } finally {
      setIsSubmittingFeature(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-4 w-32 rounded bg-surface-secondary" />
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-3/4 rounded bg-surface-secondary" />
            <div className="h-4 w-full rounded bg-surface-secondary/70" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-surface-secondary/50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-danger-100 bg-surface p-8 text-center shadow-nexora-sm sm:p-12 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-50 text-danger-600">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-foreground sm:text-xl">
          Unable to load project details
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {error || "The requested project could not be found."}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/app/admin/projects">
            <Button variant="outline" size="sm">
              Back to Projects
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={fetchProjectData}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
        </div>
      </div>
    );
  }

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];
  const teamMembers = Array.isArray(project.teamMembers)
    ? project.teamMembers
    : [];
  const screenshots = Array.isArray(project.screenshots)
    ? project.screenshots
    : [];

  // Direct root resource properties on project returned by backend
  const hasGithubUrl = Boolean(project.github?.url);
  const hasGithub = Boolean(
    project.github && (project.github.url || project.github.access)
  );

  const hasDeployedLinkUrl = Boolean(project.deployedLink?.url);
  const hasDeployedLink = Boolean(
    project.deployedLink &&
      (project.deployedLink.url || project.deployedLink.access)
  );

  const hasSupportingDocUrl = Boolean(project.supportingDocument?.url);
  const hasSupportingDoc = Boolean(
    project.supportingDocument &&
      (project.supportingDocument.url || project.supportingDocument.access)
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          to="/app/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Projects Archive</span>
        </Link>
      </div>

      {/* Feedback Banner */}
      {feedbackBanner && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-xs border shadow-xs ${
            feedbackBanner.type === "success"
              ? "bg-success-50 text-success-800 border-success-200"
              : "bg-danger-50 text-danger-800 border-danger-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackBanner.type === "success" ? (
              <Check className="h-4 w-4 text-success-700 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-4 w-4 text-danger-700 shrink-0" aria-hidden="true" />
            )}
            <span className="font-medium">{feedbackBanner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="p-1 rounded-md transition-colors opacity-70 hover:opacity-100"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Project Overview Card */}
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-6">
        {/* Title & Featured Status Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {project.isFeatured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-3 py-1 text-xs font-bold text-warning-800 border border-warning-200 shadow-2xs">
                  <Star className="h-3.5 w-3.5 fill-warning-600 text-warning-600" aria-hidden="true" />
                  Featured Project
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-surface-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground border border-border/60">
                  Standard Project Archive
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl leading-snug">
              {project.title || "Untitled Project"}
            </h1>
          </div>

          {/* Quick Feature/Unfeature Toggle Action */}
          <Button
            type="button"
            variant={project.isFeatured ? "outline" : "primary"}
            size="sm"
            onClick={() => {
              setFeatureError(null);
              setIsFeatureModalOpen(true);
            }}
            className={`gap-1.5 text-xs font-semibold self-start sm:self-auto shrink-0 ${
              project.isFeatured ? "hover:border-danger-300 hover:text-danger-700" : ""
            }`}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                project.isFeatured ? "fill-warning-500 text-warning-500" : ""
              }`}
              aria-hidden="true"
            />
            <span>{project.isFeatured ? "Remove from Featured" : "Feature Project"}</span>
          </Button>
        </div>

        {/* Project Summary */}
        {project.summary && (
          <p className="text-sm leading-relaxed text-foreground-secondary border-l-2 border-primary/30 pl-3.5 italic bg-primary-50/20 py-2 rounded-r-lg">
            {project.summary}
          </p>
        )}

        {/* Metadata Badges Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2 text-xs">
          <div className="rounded-xl border border-border/80 bg-surface-secondary/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Domain</span>
            </div>
            <p className="font-semibold text-foreground truncate">
              {project.domain || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-surface-secondary/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Building className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Department</span>
            </div>
            <p className="font-semibold text-foreground truncate">
              {project.department || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-surface-secondary/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Academic Year</span>
            </div>
            <p className="font-semibold text-foreground truncate">
              {project.academicYear || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-surface-secondary/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Archived</span>
            </div>
            <p className="font-semibold text-foreground truncate">
              {project.createdAt ? formatDate(project.createdAt) : "Recently"}
            </p>
          </div>
        </div>

        {/* Technologies Used */}
        {technologies.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/70">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Technologies & Frameworks
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-primary/20 bg-primary-50/50 px-2.5 py-1 text-xs font-semibold text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Project Description */}
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-3">
        <h2 className="text-base font-bold text-foreground sm:text-lg">
          Project Description
        </h2>
        <div className="text-xs leading-relaxed text-foreground-secondary whitespace-pre-wrap">
          {project.description || "No full description provided for this project."}
        </div>
      </section>

      {/* Team & Creator Info */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Creator Information */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/70 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
              <User className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Project Creator</h3>
              <p className="text-[11px] text-muted-foreground">Lead Student Author</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Full Name:</span>
              <span className="font-semibold text-foreground">
                {project.createdBy?.fullName || "Student Lead"}
              </span>
            </div>
            {project.createdBy?.username && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Username:</span>
                <span className="font-mono text-foreground">
                  @{project.createdBy.username}
                </span>
              </div>
            )}
            {project.createdBy?.email && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground truncate max-w-[200px]">
                  {project.createdBy.email}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
                <Users className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Team Members</h3>
                <p className="text-[11px] text-muted-foreground">Collaborators</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {teamMembers.length} {teamMembers.length === 1 ? "Member" : "Members"}
            </span>
          </div>

          {teamMembers.length > 0 ? (
            <ul className="space-y-2 text-xs list-none">
              {teamMembers.map((member, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-surface-secondary/40 px-3 py-2 border border-border/60"
                >
                  <span className="font-medium text-foreground">
                    {member.name || `Member ${idx + 1}`}
                  </span>
                  {member.role && (
                    <span className="text-[11px] text-muted-foreground">
                      {member.role}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Individual project (no additional team members listed).
            </p>
          )}
        </div>
      </section>

      {/* Screenshots Gallery */}
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            Project Screenshots & Previews
          </h2>
        </div>

        {screenshots.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {screenshots.map((s, idx) => {
              const imgUrl = typeof s === "string" ? s : s?.url;
              if (!imgUrl) return null;
              return (
                <div
                  key={idx}
                  onClick={() => setPreviewImage(imgUrl)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-surface-secondary aspect-video transition-all hover:border-primary hover:shadow-nexora-md"
                >
                  <img
                    src={imgUrl}
                    alt={`Screenshot ${idx + 1} for ${project.title}`}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="rounded-lg bg-surface/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs">
                      Enlarge Preview
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            No screenshots available for this project.
          </div>
        )}
      </section>

      {/* Project Resources / Links (Respecting Authorization) */}
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-4">
        <h2 className="text-base font-bold text-foreground sm:text-lg">
          Project Resources & Code
        </h2>
        <p className="text-xs text-muted-foreground">
          Public deliverables and documentation associated with this project.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
          {/* GitHub Repository */}
          <div className="rounded-xl border border-border bg-surface-secondary/40 p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-foreground" aria-hidden="true" />
              <span className="text-xs font-bold text-foreground">GitHub Repository</span>
            </div>
            {hasGithubUrl ? (
              <a
                href={project.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                <span>View GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : hasGithub ? (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
                <Lock className="h-3 w-3" aria-hidden="true" />
                <span>Protected repository</span>
              </div>
            ) : (
              <div className="text-[11px] text-muted-foreground pt-1">
                Not provided
              </div>
            )}
          </div>

          {/* Live Deployment */}
          <div className="rounded-xl border border-border bg-surface-secondary/40 p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-xs font-bold text-foreground">Live Deployment</span>
            </div>
            {hasDeployedLinkUrl ? (
              <a
                href={project.deployedLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                <span>Open Live Project</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : hasDeployedLink ? (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
                <Lock className="h-3 w-3" aria-hidden="true" />
                <span>Protected deployment link</span>
              </div>
            ) : (
              <div className="text-[11px] text-muted-foreground pt-1">
                Not provided
              </div>
            )}
          </div>

          {/* Supporting Document (In-App Modal Viewer) */}
          <div className="rounded-xl border border-border bg-surface-secondary/40 p-4 space-y-2 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-success-700" aria-hidden="true" />
              <span className="text-xs font-bold text-foreground">Supporting Document</span>
            </div>
            {hasSupportingDocUrl ? (
              <button
                type="button"
                onClick={() => setIsDocumentViewerOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
              >
                <span>View Document</span>
                <FileText className="h-3 w-3" />
              </button>
            ) : hasSupportingDoc ? (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
                <Lock className="h-3 w-3" aria-hidden="true" />
                <span>Protected document</span>
              </div>
            ) : (
              <div className="text-[11px] text-muted-foreground pt-1">
                Not provided
              </div>
            )}
          </div>
        </div>
      </section>

      {/* In-App Supporting Document PDF Viewer Modal */}
      {hasSupportingDocUrl && (
        <PdfViewerModal
          isOpen={isDocumentViewerOpen}
          onClose={() => setIsDocumentViewerOpen(false)}
          documentUrl={project.supportingDocument?.url}
          title={project.supportingDocument?.name || "Supporting Document"}
          subtitle={project.title || "Project Documentation"}
          downloadFilename={
            project.supportingDocument?.name ||
            `${project.title || "Project"}_Document.pdf`
          }
        />
      )}

      {/* Feature / Unfeature Confirmation Modal */}
      <AdminFeatureProjectModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        onConfirm={handleConfirmFeatureToggle}
        project={project}
        isSubmitting={isSubmittingFeature}
        error={featureError}
      />

      {/* Screenshot Lightbox Modal */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot lightbox"
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-surface border border-border shadow-nexora-lg">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              aria-label="Close image preview"
              className="absolute right-3 top-3 z-10 rounded-full bg-foreground/60 p-1.5 text-surface hover:bg-foreground/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewImage}
              alt="Expanded preview"
              className="max-h-[80vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProjectDetailPage;
