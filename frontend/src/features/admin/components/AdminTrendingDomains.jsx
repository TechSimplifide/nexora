import { useState } from "react";
import { Layers } from "lucide-react";

/**
 * AdminTrendingDomains
 * Responsive Treemap / Proportional Tile visualization for project domains.
 */
function AdminTrendingDomains({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const rawList = Array.isArray(data) ? data : [];

  // Sort descending by project count & limit to top 6
  const sortedDomains = [...rawList]
    .map((item) => ({
      domain: item.domain || "General",
      count: Math.max(0, Number(item.count) || 0),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const totalProjects = sortedDomains.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const hasData = sortedDomains.length > 0 && totalProjects > 0;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-nexora-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            Project Domains
          </h2>
          <p className="text-xs text-muted-foreground">
            Where students are building
          </p>
        </div>
        {hasData && (
          <span className="text-xs font-semibold text-foreground px-2.5 py-0.5 rounded-md bg-surface-secondary border border-border/60 shrink-0">
            <span className="font-bold text-foreground">{totalProjects}</span>{" "}
            <span className="text-muted-foreground font-medium">
              {totalProjects === 1 ? "project" : "projects"}
            </span>
          </span>
        )}
      </div>

      {hasData ? (
        <div className="pt-1">
          {/* CASE 1: Single Domain (100% full-area hero card) */}
          {sortedDomains.length === 1 && (
            <div
              className="h-44 w-full rounded-lg border border-primary/30 bg-primary/10 p-5 flex flex-col items-center justify-center text-center transition-all duration-200 hover:border-primary/50 cursor-pointer focus:outline-none"
              tabIndex={0}
              role="button"
              aria-label={`${sortedDomains[0].domain}: ${sortedDomains[0].count} projects (100% of domains)`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 font-mono">
                Top Domain
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-foreground truncate max-w-full px-2">
                {sortedDomains[0].domain}
              </h3>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-extrabold text-primary font-mono">
                  {sortedDomains[0].count}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {sortedDomains[0].count === 1 ? "project" : "projects"}
                </span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground mt-1">
                100% of domain volume
              </span>
            </div>
          )}

          {/* CASE 2: Two Domains (Proportional split) */}
          {sortedDomains.length === 2 && (
            <div className="h-44 flex gap-2.5">
              {sortedDomains.map((item, idx) => {
                const isHovered = hoveredIdx === idx;
                const pct =
                  totalProjects > 0
                    ? Math.round((item.count / totalProjects) * 100)
                    : 0;
                const isPrimary = idx === 0;

                return (
                  <div
                    key={item.domain || idx}
                    style={{ flex: item.count || 1 }}
                    className={`h-full rounded-lg p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer border focus:outline-none ${
                      isPrimary
                        ? isHovered
                          ? "border-primary/50 bg-primary/15"
                          : "border-primary/30 bg-primary/10"
                        : isHovered
                        ? "border-border-strong bg-surface-secondary"
                        : "border-border/60 bg-surface-secondary/50"
                    }`}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onFocus={() => setHoveredIdx(idx)}
                    onBlur={() => setHoveredIdx(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${item.domain}: ${item.count} projects (${pct}%)`}
                  >
                    <div>
                      <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                        #{idx + 1}
                      </span>
                      <h3
                        className={`text-sm sm:text-base font-bold truncate mt-0.5 ${
                          isPrimary ? "text-primary" : "text-foreground"
                        }`}
                        title={item.domain}
                      >
                        {item.domain}
                      </h3>
                    </div>
                    <div className="flex items-baseline justify-between mt-auto">
                      <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
                        {item.count}
                        <span className="text-[11px] font-normal text-muted-foreground ml-1">
                          {item.count === 1 ? "proj" : "projs"}
                        </span>
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CASE 3: 3 to 6 Domains (Treemap Layout: Hero Left Column + Stacked Sub-tiles Right) */}
          {sortedDomains.length >= 3 && (
            <div className="h-44 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              {/* Left Hero Tile (Top Domain) */}
              <div
                className={`sm:col-span-6 h-full rounded-lg p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer border focus:outline-none ${
                  hoveredIdx === 0
                    ? "border-primary/50 bg-primary/15"
                    : "border-primary/30 bg-primary/10"
                }`}
                onMouseEnter={() => setHoveredIdx(0)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setHoveredIdx(0)}
                onBlur={() => setHoveredIdx(null)}
                tabIndex={0}
                role="button"
                aria-label={`Top Domain: ${sortedDomains[0].domain}, ${sortedDomains[0].count} projects`}
              >
                <div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-primary">
                    #01 Top Domain
                  </span>
                  <h3
                    className="text-base sm:text-lg font-bold text-foreground truncate mt-1"
                    title={sortedDomains[0].domain}
                  >
                    {sortedDomains[0].domain}
                  </h3>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-primary font-mono">
                    {sortedDomains[0].count}
                    <span className="text-xs font-normal text-muted-foreground ml-1.5">
                      {sortedDomains[0].count === 1 ? "project" : "projects"}
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground font-mono">
                    {totalProjects > 0
                      ? Math.round(
                          (sortedDomains[0].count / totalProjects) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
              </div>

              {/* Right Stacked Tiles (Rank 2+) */}
              <div className="sm:col-span-6 flex flex-col gap-2 h-full justify-between">
                {sortedDomains.slice(1).map((item, subIdx) => {
                  const idx = subIdx + 1;
                  const isHovered = hoveredIdx === idx;
                  const pct =
                    totalProjects > 0
                      ? Math.round((item.count / totalProjects) * 100)
                      : 0;

                  return (
                    <div
                      key={item.domain || idx}
                      className={`flex-1 rounded-md px-3 py-1.5 flex items-center justify-between border transition-all duration-150 cursor-pointer focus:outline-none ${
                        isHovered
                          ? "border-border-strong bg-surface-secondary text-foreground"
                          : "border-border/60 bg-surface-secondary/50 text-foreground"
                      }`}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      onFocus={() => setHoveredIdx(idx)}
                      onBlur={() => setHoveredIdx(null)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Rank ${idx + 1}, ${item.domain}: ${item.count} projects (${pct}%)`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`text-xs font-semibold truncate transition-colors ${
                            isHovered ? "text-primary" : "text-foreground"
                          }`}
                          title={item.domain}
                        >
                          {item.domain}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                        <span
                          className={`font-bold ${
                            isHovered ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {item.count}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          ({pct}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-muted-foreground space-y-1.5 border border-dashed border-border/70 rounded-lg">
          <Layers
            className="h-6 w-6 text-muted-foreground/60"
            aria-hidden="true"
          />
          <p className="font-semibold text-foreground">
            No domain data available
          </p>
          <p className="text-[11px] text-muted-foreground">
            Domain categories will appear once projects are archived.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminTrendingDomains;
