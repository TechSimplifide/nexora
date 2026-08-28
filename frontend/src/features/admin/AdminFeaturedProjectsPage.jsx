import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Star, Sparkles, AlertCircle, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  getFeaturedProjects,
  unfeatureProject,
} from "@/services/project.service";
import AdminProjectCard from "@/features/admin/components/AdminProjectCard";
import AdminFeatureProjectModal from "@/features/admin/components/AdminFeatureProjectModal";

function AdminFeaturedProjectsPage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State for Unfeaturing
  const [selectedProject, setSelectedProject] = useState(null);
  const [isUnfeaturing, setIsUnfeaturing] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const fetchFeatured = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getFeaturedProjects();
      setFeaturedProjects(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err.message || "Unable to load featured projects.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await getFeaturedProjects();
        if (isMounted) {
          setFeaturedProjects(
            Array.isArray(response?.data) ? response.data : []
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to load featured projects.");
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
  }, []);

  const handleOpenUnfeatureModal = (project) => {
    setSelectedProject(project);
    setModalError(null);
  };

  const handleCloseModal = () => {
    if (isUnfeaturing) return;
    setSelectedProject(null);
    setModalError(null);
  };

  const handleConfirmUnfeature = async () => {
    if (!selectedProject) return;

    const projectId = selectedProject._id || selectedProject.id;
    setIsUnfeaturing(true);
    setModalError(null);

    try {
      await unfeatureProject(projectId);
      setFeaturedProjects((prev) =>
        prev.filter((p) => (p._id || p.id) !== projectId)
      );
      setSelectedProject(null);
      setFeedbackMessage(
        `"${selectedProject.title || "Project"}" has been removed from featured showcase.`
      );
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      setModalError(
        err.message || "Failed to remove project from featured showcase."
      );
    } finally {
      setIsUnfeaturing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-warning-200 bg-warning-50 px-2.5 py-0.5 text-xs font-bold text-warning-800">
              <Star className="h-3 w-3 fill-warning-600 text-warning-600" aria-hidden="true" />
              <span>Current Academic Year</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Featured Projects
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Manage the standout projects currently showcased across your college.
          </p>
        </div>

        <Link
          to="/app/admin/projects"
          className="self-start sm:self-auto shrink-0"
        >
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
            <span>View All Projects</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </Link>
      </div>

      {/* 2. Success Banner (Temporary) */}
      {feedbackMessage && (
        <div className="flex items-center justify-between rounded-xl bg-success-50 p-4 border border-success-200 text-xs text-success-800 shadow-nexora-sm animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success-600 shrink-0" aria-hidden="true" />
            <span className="font-medium">{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-success-700 hover:text-success-900 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Summary Count Bar */}
      {!isLoading && !error && featuredProjects.length > 0 && (
        <div className="flex items-center justify-between border-b border-border/80 pb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-warning-600" aria-hidden="true" />
            <span>
              Showing <strong className="font-semibold text-foreground">{featuredProjects.length}</strong>{" "}
              {featuredProjects.length === 1 ? "featured project" : "featured projects"}
            </span>
          </div>
        </div>
      )}

      {/* 4. Main Content States */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-nexora-sm"
            >
              <div className="flex justify-between items-start">
                <div className="h-4 w-24 rounded bg-surface-secondary" />
                <div className="h-4 w-16 rounded bg-surface-secondary" />
              </div>
              <div className="h-6 w-3/4 rounded bg-surface-secondary" />
              <div className="h-10 w-full rounded bg-surface-secondary/70" />
              <div className="h-5 w-1/2 rounded bg-surface-secondary/60" />
              <div className="pt-3 border-t border-border/60 flex justify-between items-center">
                <div className="h-4 w-24 rounded bg-surface-secondary" />
                <div className="h-7 w-28 rounded bg-surface-secondary" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-danger-100 bg-surface p-8 text-center shadow-nexora-sm sm:p-12 space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-50 text-danger-600">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Unable to load featured projects
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={fetchFeatured}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      ) : featuredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <AdminProjectCard
              key={project._id || project.id}
              project={{ ...project, isFeatured: true }}
              onUnfeature={handleOpenUnfeatureModal}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-2xs space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-warning-50 text-warning-600">
            <Star className="h-7 w-7 fill-warning-500 text-warning-600" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              No featured projects yet
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              There are currently no projects featured for this academic year. You can feature outstanding student projects directly from the project catalog.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/app/admin/projects">
              <Button variant="primary" size="md" className="gap-2">
                <span>Browse Projects</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 5. Unfeature Confirmation Modal */}
      <AdminFeatureProjectModal
        isOpen={Boolean(selectedProject)}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUnfeature}
        project={selectedProject ? { ...selectedProject, isFeatured: true } : null}
        isSubmitting={isUnfeaturing}
        error={modalError}
      />
    </div>
  );
}

export default AdminFeaturedProjectsPage;
