import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FolderKanban } from "lucide-react";
import { getStudentDashboard } from "@/services/dashboard.service";
import { getProjects } from "@/services/project.service";
import StudentDashboardHeader from "@/features/student/components/StudentDashboardHeader";
import StudentDashboardKpis from "@/features/student/components/StudentDashboardKpis";
import StudentProposalCard from "@/features/student/components/StudentProposalCard";
import FeaturedProjectShowcase from "@/features/student/components/FeaturedProjectShowcase";
import DiscoverProjectCard from "@/features/student/components/DiscoverProjectCard";
import StudentDashboardSkeleton from "@/features/student/components/StudentDashboardSkeleton";
import StudentDashboardError from "@/features/student/components/StudentDashboardError";

function StudentDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [discoverProjectsList, setDiscoverProjectsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredProjectIds, setFeaturedProjectIds] = useState(new Set());

  const handleLoadedFeaturedIds = useCallback((ids) => {
    setFeaturedProjectIds(new Set(ids));
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashRes, projectsRes] = await Promise.all([
        getStudentDashboard(),
        getProjects({ limit: 12 }).catch(() => null),
      ]);
      setDashboardData(dashRes?.data || null);
      if (projectsRes?.data?.projects) {
        setDiscoverProjectsList(projectsRes.data.projects);
      } else if (dashRes?.data?.discoverProjects) {
        setDiscoverProjectsList(dashRes.data.discoverProjects);
      }
    } catch (err) {
      setError(
        err.message ||
          "We couldn't retrieve your dashboard information right now."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [dashRes, projectsRes] = await Promise.all([
          getStudentDashboard(),
          getProjects({ limit: 12 }).catch(() => null),
        ]);
        if (isMounted) {
          setDashboardData(dashRes?.data || null);
          if (projectsRes?.data?.projects) {
            setDiscoverProjectsList(projectsRes.data.projects);
          } else if (dashRes?.data?.discoverProjects) {
            setDiscoverProjectsList(dashRes.data.discoverProjects);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message ||
              "We couldn't retrieve your dashboard information right now."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const kpis = dashboardData?.kpis || {};
  const proposal = dashboardData?.proposal || { exists: false };

  // Filter out featured projects from Discover Projects list and limit to 6
  const rawProjects = Array.isArray(discoverProjectsList)
    ? discoverProjectsList
    : [];

  const nonFeaturedProjects = rawProjects
    .filter((project) => {
      const id = project._id || project.id;
      return !project.isFeatured && !featuredProjectIds.has(id);
    })
    .slice(0, 6);

  if (isLoading) {
    return <StudentDashboardSkeleton />;
  }

  if (error) {
    return (
      <StudentDashboardError onRetry={fetchDashboardData} message={error} />
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* 1. Header */}
      <StudentDashboardHeader />

      {/* 2. KPIs Grid */}
      <StudentDashboardKpis kpis={kpis} />

      {/* 3. My Proposal Section */}
      <StudentProposalCard proposal={proposal} />

      {/* 4. Featured Project Showcase Preview */}
      <FeaturedProjectShowcase onLoadedFeaturedIds={handleLoadedFeaturedIds} />

      {/* 5. Discover Projects Section (Non-Featured Institutional Projects with populated createdBy) */}
      <section aria-labelledby="discover-projects-heading" className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="discover-projects-heading"
              className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
            >
              Discover Projects
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explore the projects created by your college community.
            </p>
          </div>

          {nonFeaturedProjects.length > 0 && (
            <Link
              to="/app/student/projects"
              className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm self-start sm:self-auto"
            >
              Explore All Projects →
            </Link>
          )}
        </div>

        {nonFeaturedProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nonFeaturedProjects.map((project) => (
              <DiscoverProjectCard
                key={project._id || project.id || project.title}
                project={project}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary text-muted-foreground mb-3">
              <FolderKanban className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No projects to discover yet
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              New projects from your college will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentDashboardPage;
