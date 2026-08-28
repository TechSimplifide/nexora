import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  GraduationCap,
  Calendar,
  User,
  Users,
  AlertCircle,
  RotateCcw,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  getProjectById,
  getMyProjectAccessRequests,
  deleteProject,
} from "@/services/project.service";
import ProjectResourceCard from "@/features/student/components/ProjectResourceCard";
import { formatDate } from "@/utils/date";

function StudentProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [myAccessRequests, setMyAccessRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchProjectData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [projectRes, requestsRes] = await Promise.all([
        getProjectById(id),
        getMyProjectAccessRequests().catch(() => null),
      ]);
      setProject(projectRes?.data || null);
      if (requestsRes?.data) {
        setMyAccessRequests(
          Array.isArray(requestsRes.data) ? requestsRes.data : []
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load project details.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialProject() {
      if (!id) return;
      try {
        const [projectRes, requestsRes] = await Promise.all([
          getProjectById(id),
          getMyProjectAccessRequests().catch(() => null),
        ]);
        if (isMounted) {
          setProject(projectRes?.data || null);
          if (requestsRes?.data) {
            setMyAccessRequests(
              Array.isArray(requestsRes.data) ? requestsRes.data : []
            );
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load project details.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleRequestCreated = useCallback((newRequest) => {
    setMyAccessRequests((prev) => {
      const newProjId =
        newRequest.project?._id || newRequest.project?.id || newRequest.project;
      const filtered = prev.filter((r) => {
        const pId = r.project?._id || r.project?.id || r.project;
        return !(pId === newProjId && r.resourceType === newRequest.resourceType);
      });
      return [...filtered, newRequest];
    });
  }, []);

  const handleDeleteProject = async () => {
    if (!project?._id && !id) return;
    const targetId = project?._id || project?.id || id;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteProject(targetId);
      setIsDeleteModalOpen(false);
      navigate("/app/student/projects", {
        replace: true,
        state: {
          successMessage: `"${project?.title || "Project"}" was deleted successfully.`,
        },
      });
    } catch (err) {
      setDeleteError(
        err.message || "Failed to delete project. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-4 w-32 rounded bg-surface-secondary" />
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-nexora-sm">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-surface-secondary" />
            <div className="h-8 w-3/4 rounded bg-surface-secondary" />
            <div className="h-4 w-1/2 rounded bg-surface-secondary/70" />
          </div>
          <div className="aspect-video w-full rounded-xl bg-surface-secondary" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-surface-secondary/70" />
            <div className="h-4 w-5/6 rounded bg-surface-secondary/70" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="rounded-2xl border border-danger-100 bg-surface p-8 text-center shadow-nexora-sm sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-50 text-danger-600 mb-3">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Project not found
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {error ||
              "We couldn't find the requested project. It may have been removed or you may not have access."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/app/student/projects">
              <Button variant="outline" size="sm">
                ← Back to Projects
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={fetchProjectData}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];
  const screenshots = Array.isArray(project.screenshots)
    ? project.screenshots.filter((s) => s?.url)
    : [];
  const teamMembers = Array.isArray(project.teamMembers)
    ? project.teamMembers
    : [];

  const projectId = project._id || project.id || id;
  const currentUserId = user?._id || user?.id;
  const creatorId =
    project.createdBy?._id ||
    project.createdBy?.id ||
    (typeof project.createdBy === "string" ? project.createdBy : null);
  const isOwner = Boolean(
    currentUserId && creatorId && currentUserId === creatorId
  );

  const getRequestForResource = (resourceType) => {
    return myAccessRequests.find((r) => {
      const pId = r.project?._id || r.project?.id || r.project;
      return pId === projectId && r.resourceType === resourceType;
    });
  };

  const hasGithub = Boolean(
    project.github && (project.github.url || project.github.access)
  );
  const hasDeployedLink = Boolean(
    project.deployedLink &&
      (project.deployedLink.url || project.deployedLink.access)
  );
  const hasSupportingDoc = Boolean(
    project.supportingDocument &&
      (project.supportingDocument.url || project.supportingDocument.access)
  );
  const hasAnyResources = hasGithub || hasDeployedLink || hasSupportingDoc;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          to="/app/student/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Main Project Header Card */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              {/* Badges: Domain & Featured */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {project.domain && (
                  <span className="inline-flex items-center rounded-sm bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase tracking-wider">
                    {project.domain}
                  </span>
                )}

                {project.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
                    Featured Project
                  </span>
                )}
              </div>

              {/* Project Title */}
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {project.title}
              </h1>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-start">
                <Link to={`/app/student/projects/${projectId}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit Project</span>
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDeleteError(null);
                    setIsDeleteModalOpen(true);
                  }}
                  className="gap-1.5 text-xs font-semibold text-danger-700 hover:text-danger-800 hover:border-danger-200"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Delete</span>
                </Button>
              </div>
            )}
          </div>

          {/* Metadata Row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground border-b border-border/70 pb-4">
            {project.department && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>{project.department}</span>
              </div>
            )}

            {project.academicYear && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>{project.academicYear}</span>
              </div>
            )}

            {project.createdAt && (
              <div className="flex items-center gap-1.5">
                <span>Submitted on {formatDate(project.createdAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Screenshots Showcase (if available) */}
        {screenshots.length > 0 && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-border bg-surface-secondary aspect-video">
              <img
                src={screenshots[activeScreenshot]?.url}
                alt={`${project.title} preview ${activeScreenshot + 1}`}
                className="h-full w-full object-cover"
              />
            </div>

            {screenshots.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Screenshots thumbnail list">
                {screenshots.map((shot, index) => (
                  <button
                    key={shot.publicId || shot.url || index}
                    type="button"
                    onClick={() => setActiveScreenshot(index)}
                    aria-label={`View screenshot ${index + 1}`}
                    className={`relative aspect-video w-20 shrink-0 overflow-hidden rounded-lg border transition-all ${
                      activeScreenshot === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={shot.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Summary */}
        {project.summary && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Summary
            </h2>
            <p className="text-sm leading-relaxed text-foreground-secondary">
              {project.summary}
            </p>
          </div>
        )}

        {/* Project Full Description */}
        {project.description && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Description
            </h2>
            <div className="text-sm leading-relaxed text-foreground-secondary whitespace-pre-wrap">
              {project.description}
            </div>
          </div>
        )}

        {/* Technologies List */}
        {technologies.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Technologies & Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <span
                  key={`${tech}-${index}`}
                  className="rounded-lg border border-border/70 bg-surface-secondary px-3 py-1 text-xs font-medium text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project Resources & Access Control */}
        {hasAnyResources && (
          <div className="space-y-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Resources & Access
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Access project codebases, live deployments, and documentation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hasGithub && (
                <ProjectResourceCard
                  projectId={projectId}
                  resourceType="github"
                  resourceData={project.github}
                  request={getRequestForResource("github")}
                  onRequestCreated={handleRequestCreated}
                  isOwner={isOwner}
                />
              )}

              {hasDeployedLink && (
                <ProjectResourceCard
                  projectId={projectId}
                  resourceType="deployedLink"
                  resourceData={project.deployedLink}
                  request={getRequestForResource("deployedLink")}
                  onRequestCreated={handleRequestCreated}
                  isOwner={isOwner}
                />
              )}

              {hasSupportingDoc && (
                <ProjectResourceCard
                  projectId={projectId}
                  resourceType="supportingDocument"
                  resourceData={project.supportingDocument}
                  request={getRequestForResource("supportingDocument")}
                  onRequestCreated={handleRequestCreated}
                  isOwner={isOwner}
                />
              )}
            </div>
          </div>
        )}

        {/* Team & Creator Info */}
        <div className="border-t border-border/70 pt-6 grid gap-6 sm:grid-cols-2">
          {/* Creator */}
          {project.createdBy && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Project Lead / Creator
              </h2>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary border border-primary/20">
                  <User className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {project.createdBy.fullName || project.createdBy.username || "Student"}
                  </p>
                  {project.createdBy.username && (
                    <p className="text-xs text-muted-foreground">
                      @{project.createdBy.username}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Team Members */}
          {teamMembers.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Team Members
              </h2>
              <div className="space-y-1.5">
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    <span className="font-medium text-foreground">{member.name}</span>
                    {member.role && (
                      <span className="text-muted-foreground font-normal">
                        ({member.role})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-project-dialog-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-xs transition-opacity"
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger-50 text-danger-600 border border-danger-200/50">
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3
                  id="delete-project-dialog-title"
                  className="text-lg font-bold text-foreground leading-snug"
                >
                  Delete Project?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You are about to permanently delete{" "}
                  <strong className="text-foreground font-semibold">
                    &quot;{project.title}&quot;
                  </strong>.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-danger-100 bg-danger-50/50 p-3.5 text-xs text-danger-800 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-danger-900">
                This action cannot be undone.
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-danger-700">
                <li>Project database record will be permanently deleted</li>
                <li>All associated screenshots in cloud storage will be removed</li>
                <li>Supporting documentation PDF will be deleted</li>
              </ul>
            </div>

            {deleteError && (
              <div className="flex items-start gap-2 rounded-xl border border-danger-200 bg-danger-50 p-3 text-xs text-danger-700 animate-in fade-in duration-100">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={isDeleting}
                onClick={handleDeleteProject}
                className="gap-1.5 text-xs font-semibold"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Delete Project</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProjectDetailPage;
