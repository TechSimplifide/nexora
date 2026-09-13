import { useMemo } from "react";
import { Search, RotateCcw, X } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  COMMON_DOMAINS,
  COMMON_DEPARTMENTS,
  COMMON_TECHNOLOGIES,
  getAcademicYearOptions,
} from "@/features/projects/constants/projectFilterOptions";

function ProjectFilterBar({
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  domainFilter = "",
  onDomainChange,
  departmentFilter = "",
  onDepartmentChange,
  academicYearFilter = "",
  onAcademicYearChange,
  technologyFilter = "",
  onTechnologyChange,
  onResetFilters,
  hasActiveFilters = false,
  projects = [],
}) {
  const academicYears = useMemo(() => getAcademicYearOptions(), []);

  // Compute unique technologies dynamically from available projects combined with common catalog
  const technologyOptions = useMemo(() => {
    const projectTechs = Array.isArray(projects)
      ? projects.flatMap((p) =>
          Array.isArray(p?.technologies) ? p.technologies : []
        )
      : [];

    const allTechs = new Set([
      ...COMMON_TECHNOLOGIES,
      ...projectTechs,
      ...(technologyFilter ? [technologyFilter] : []),
    ]);

    return Array.from(allTechs).filter(Boolean).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  }, [projects, technologyFilter]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-4">
      {/* Search Bar */}
      <form onSubmit={onSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by title, summary, or author..."
            className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
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

      {/* Filter Select Controls */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 items-center">
        {/* Domain Filter */}
        <select
          id="filter-domain"
          aria-label="Filter by Domain"
          value={domainFilter}
          onChange={(e) => onDomainChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
        >
          <option value="">All Domains</option>
          {COMMON_DOMAINS.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>

        {/* Department Filter */}
        <select
          id="filter-department"
          aria-label="Filter by Department"
          value={departmentFilter}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
        >
          <option value="">All Departments</option>
          {COMMON_DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Academic Year Filter */}
        <select
          id="filter-academic-year"
          aria-label="Filter by Academic Year"
          value={academicYearFilter}
          onChange={(e) => onAcademicYearChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
        >
          <option value="">All Academic Years</option>
          {academicYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Technology Filter */}
        <select
          id="filter-technology"
          aria-label="Filter by Technology"
          value={technologyFilter}
          onChange={(e) => onTechnologyChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
        >
          <option value="">All Technologies</option>
          {technologyOptions.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Filters Option (Active Filter Bar Indicator) */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
          <span className="text-muted-foreground">
            Filters applied
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 font-semibold text-danger-700 hover:text-danger-800 hover:underline transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectFilterBar;
