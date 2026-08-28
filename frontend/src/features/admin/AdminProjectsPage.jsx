import { useEffect, useState, useCallback } from "react";
import {
  Search,
  RotateCcw,
  AlertCircle,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { getProjects } from "@/services/project.service";
import AdminProjectCard from "@/features/admin/components/AdminProjectCard";

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

      {/* Search & Filter Bar (Mirrors Student Dashboard) */}
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search projects by title, summary, or author..."
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="hidden sm:inline-flex"
          >
            Search
          </Button>
        </form>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:flex lg:items-center lg:gap-3">
          {/* Domain Filter */}
          <input
            type="text"
            placeholder="Domain..."
            value={domainFilter}
            onChange={(e) => {
              setDomainFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full lg:w-40 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          />

          {/* Department Filter */}
          <input
            type="text"
            placeholder="Department..."
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full lg:w-40 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          />

          {/* Academic Year Filter */}
          <input
            type="text"
            placeholder="Year (e.g. 2026-27)..."
            value={academicYearFilter}
            onChange={(e) => {
              setAcademicYearFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full lg:w-40 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          />

          {/* Technology Filter */}
          <input
            type="text"
            placeholder="Tech (e.g. React)..."
            value={technologyFilter}
            onChange={(e) => {
              setTechnologyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full lg:w-40 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          />

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="col-span-2 sm:col-span-4 lg:col-span-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-danger-700 hover:bg-danger-50 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

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
            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
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
