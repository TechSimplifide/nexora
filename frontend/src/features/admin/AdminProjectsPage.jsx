import { useEffect, useState, useCallback } from "react";
import {
  RotateCcw,
  AlertCircle,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { getProjects } from "@/services/project.service";
import AdminProjectCard from "@/features/admin/components/AdminProjectCard";
import ProjectFilterBar from "@/features/projects/components/ProjectFilterBar";

function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalProjects: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State (Mirrors Student Dashboard exactly)
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [academicYearFilter, setAcademicYearFilter] = useState("");
  const [technologyFilter, setTechnologyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProjectCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getProjects({
        search: searchTerm,
        domain: domainFilter,
        department: departmentFilter,
        academicYear: academicYearFilter,
        technology: technologyFilter,
        page: currentPage,
        limit: 9,
      });

      const responseData = response?.data;
      if (responseData) {
        setProjects(
          Array.isArray(responseData.projects) ? responseData.projects : []
        );
        if (responseData.pagination) {
          setPagination(responseData.pagination);
        }
      } else {
        setProjects([]);
      }
    } catch (err) {
      setError(err.message || "Unable to retrieve projects at this time.");
    } finally {
      setIsLoading(false);
    }
  }, [
    searchTerm,
    domainFilter,
    departmentFilter,
    academicYearFilter,
    technologyFilter,
    currentPage,
  ]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await getProjects({
          search: searchTerm,
          domain: domainFilter,
          department: departmentFilter,
          academicYear: academicYearFilter,
          technology: technologyFilter,
          page: currentPage,
          limit: 9,
        });

        const responseData = response?.data;
        if (isMounted) {
          if (responseData) {
            setProjects(
              Array.isArray(responseData.projects) ? responseData.projects : []
            );
            if (responseData.pagination) {
              setPagination(responseData.pagination);
            }
          } else {
            setProjects([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Unable to retrieve projects at this time.");
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
  }, [
    searchTerm,
    domainFilter,
    departmentFilter,
    academicYearFilter,
    technologyFilter,
    currentPage,
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDomainFilter("");
    setDepartmentFilter("");
    setAcademicYearFilter("");
    setTechnologyFilter("");
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    searchTerm ||
      domainFilter ||
      departmentFilter ||
      academicYearFilter ||
      technologyFilter
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Projects Catalog
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Browse, discover, and manage all institutional projects, academic papers, and student capstones.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <ProjectFilterBar
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        onSearchSubmit={handleSearchSubmit}
        domainFilter={domainFilter}
        onDomainChange={(val) => {
          setDomainFilter(val);
          setCurrentPage(1);
        }}
        departmentFilter={departmentFilter}
        onDepartmentChange={(val) => {
          setDepartmentFilter(val);
          setCurrentPage(1);
        }}
        academicYearFilter={academicYearFilter}
        onAcademicYearChange={(val) => {
          setAcademicYearFilter(val);
          setCurrentPage(1);
        }}
        technologyFilter={technologyFilter}
        onTechnologyChange={(val) => {
          setTechnologyFilter(val);
          setCurrentPage(1);
        }}
        onResetFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        projects={projects}
      />

      {/* Projects Grid / Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-nexora-sm"
            >
              <div className="h-4 w-28 rounded bg-surface-secondary" />
              <div className="h-6 w-3/4 rounded bg-surface-secondary" />
              <div className="h-10 w-full rounded bg-surface-secondary/70" />
              <div className="h-6 w-1/2 rounded bg-surface-secondary/60" />
              <div className="pt-3 border-t border-border/60 flex justify-between items-center">
                <div className="h-4 w-24 rounded bg-surface-secondary" />
                <div className="h-7 w-20 rounded bg-surface-secondary" />
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
            Unable to load projects
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={fetchProjectCatalog}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      ) : projects.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <AdminProjectCard key={project._id || project.id} project={project} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground text-center sm:text-left">
                Showing page <strong className="font-semibold text-foreground">{pagination.page}</strong> of{" "}
                <strong className="font-semibold text-foreground">{pagination.totalPages}</strong> ({pagination.totalProjects} total)
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage || isLoading}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage || isLoading}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="gap-1 text-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-muted-foreground mb-4">
            <FolderKanban className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            No projects found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {hasActiveFilters
              ? "There are no projects matching your search criteria or filter selections."
              : "No projects have been uploaded to your college workspace yet."}
          </p>
          {hasActiveFilters && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProjectsPage;
