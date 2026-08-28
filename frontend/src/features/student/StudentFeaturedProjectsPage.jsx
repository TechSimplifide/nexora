import { useEffect, useState } from "react";
import { Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import { getFeaturedProjects } from "@/services/project.service";
import FeaturedProjectCard from "@/features/student/components/FeaturedProjectCard";

function StudentFeaturedProjectsPage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
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
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitialFeatured() {
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

    loadInitialFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-primary/20 bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>College Showcase</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Featured Projects
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Explore standout projects selected for the college showcase. These initiatives demonstrate excellence, innovation, and practical impact.
        </p>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-border bg-surface shadow-nexora-sm"
            >
              <div className="aspect-video w-full bg-surface-secondary" />
              <div className="p-5 space-y-3">
                <div className="h-3.5 w-24 rounded bg-surface-secondary" />
                <div className="h-5 w-4/5 rounded bg-surface-secondary" />
                <div className="h-3.5 w-full rounded bg-surface-secondary/70" />
                <div className="h-3.5 w-2/3 rounded bg-surface-secondary/70" />
                <div className="pt-3 border-t border-border/60 flex gap-1.5">
                  <div className="h-4 w-12 rounded bg-surface-secondary" />
                  <div className="h-4 w-14 rounded bg-surface-secondary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-danger-100 bg-surface p-8 text-center shadow-nexora-sm sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-50 text-danger-600 mb-3">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Unable to load featured projects
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <div className="mt-6">
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
            <FeaturedProjectCard
              key={project._id || project.id || project.title}
              project={project}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary mb-4">
            <Sparkles className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            No featured projects yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your college hasn&apos;t selected any projects for the showcase yet.
            Check back later to discover curated projects highlighted by your faculty and administrators.
          </p>
        </div>
      )}
    </div>
  );
}

export default StudentFeaturedProjectsPage;
