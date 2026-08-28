import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import { getFeaturedProjects } from "@/services/project.service";
import FeaturedProjectCard from "@/features/student/components/FeaturedProjectCard";

function FeaturedProjectShowcase({ onLoadedFeaturedIds }) {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getFeaturedProjects();
      const list = Array.isArray(response?.data) ? response.data : [];
      setFeaturedProjects(list);
      if (onLoadedFeaturedIds) {
        onLoadedFeaturedIds(list.map((p) => p._id || p.id));
      }
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
          const list = Array.isArray(response?.data) ? response.data : [];
          setFeaturedProjects(list);
          if (onLoadedFeaturedIds) {
            onLoadedFeaturedIds(list.map((p) => p._id || p.id));
          }
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
  }, [onLoadedFeaturedIds]);

  const previewProjects = featuredProjects.slice(0, 3);

  return (
    <section aria-labelledby="featured-projects-heading" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>College Showcase</span>
          </div>
          <h2
            id="featured-projects-heading"
            className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            Featured Projects
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Explore exceptional projects selected by your college.
          </p>
        </div>

        {featuredProjects.length > 0 && (
          <Link
            to="/app/student/featured-projects"
            className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm self-start sm:self-auto"
          >
            Explore Featured Projects →
          </Link>
        )}
      </div>

      {/* Content State */}
      {isLoading ? (
        /* Showcase Skeleton */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3].map((i) => (
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
        /* Showcase Compact Error */
        <div className="rounded-xl border border-danger-100 bg-surface p-6 text-center shadow-xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600 mb-2.5">
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Unable to load featured projects
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            {error}
          </p>
          <div className="mt-3.5">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchFeatured}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      ) : previewProjects.length > 0 ? (
        /* Showcase Grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previewProjects.map((project) => (
            <FeaturedProjectCard
              key={project._id || project.id || project.title}
              project={project}
            />
          ))}
        </div>
      ) : (
        /* Showcase Empty State */
        <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary mb-3">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            No featured projects yet
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your college hasn&apos;t featured any projects for the current academic year yet.
            Check back later to discover projects selected for the college showcase.
          </p>
        </div>
      )}
    </section>
  );
}

export default FeaturedProjectShowcase;
