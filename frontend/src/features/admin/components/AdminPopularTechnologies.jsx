import { useState, useRef } from "react";
import { Code2 } from "lucide-react";
import { motion } from "motion/react";
import ChartFloatingTooltip from "./ChartFloatingTooltip";

/**
 * AdminPopularTechnologies
 * Premium SVG-based vertical column chart for technology adoption analytics.
 */
function AdminPopularTechnologies({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const chartContainerRef = useRef(null);

  const rawList = Array.isArray(data) ? data : [];

  // Sort descending by project count & limit to top 6 for optimal column breathing room
  const sortedTechnologies = [...rawList]
    .map((item) => ({
      technology: item.technology || "Unknown",
      count: Math.max(0, Number(item.count) || 0),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const maxCount = sortedTechnologies.reduce(
    (max, item) => Math.max(max, item.count),
    0
  );

  const totalProjects = sortedTechnologies.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const hasData = sortedTechnologies.length > 0 && maxCount > 0;

  // Chart Coordinate Dimensions
  const svgWidth = 480;
  const svgHeight = 176;
  const paddingLeft = 16;
  const paddingRight = 16;
  const paddingTop = 26; // Space for count labels above bars
  const paddingBottom = 30; // Space for X-axis technology names

  const innerWidth = svgWidth - paddingLeft - paddingRight;
  const innerHeight = svgHeight - paddingTop - paddingBottom;
  const numItems = sortedTechnologies.length;
  const slotWidth = numItems > 0 ? innerWidth / numItems : innerWidth;
  const barWidth = Math.min(36, Math.max(18, slotWidth * 0.48));

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-nexora-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            Technology Adoption
          </h2>
          <p className="text-xs text-muted-foreground">
            Technology usage across the project archive
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
        <div className="space-y-2 pt-1">
          {/* SVG Vertical Column Chart */}
          <div ref={chartContainerRef} className="relative w-full select-none">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-44 overflow-visible"
              role="img"
              aria-label="Technology adoption vertical bar chart"
            >
              {/* Baseline Axis */}
              <line
                x1={paddingLeft - 4}
                y1={paddingTop + innerHeight}
                x2={svgWidth - paddingRight + 4}
                y2={paddingTop + innerHeight}
                className="stroke-border/70"
                strokeWidth="1"
              />

              {/* Vertical Columns & Labels */}
              {sortedTechnologies.map((item, idx) => {
                const isHovered = hoveredIdx === idx;
                const slotCenterX = paddingLeft + idx * slotWidth + slotWidth / 2;
                const barX = slotCenterX - barWidth / 2;
                const barHeight =
                  maxCount > 0 ? (item.count / maxCount) * innerHeight : 0;
                const barY = paddingTop + innerHeight - barHeight;

                // Truncate long technology names for SVG axis display
                const labelDisplay =
                  item.technology.length > 9
                    ? `${item.technology.slice(0, 8)}…`
                    : item.technology;

                return (
                  <g
                    key={item.technology || idx}
                    className="cursor-pointer group focus:outline-none"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${item.technology}: ${item.count} projects`}
                    onFocus={() => setHoveredIdx(idx)}
                    onBlur={() => setHoveredIdx(null)}
                  >
                    {/* Transparent Column Hit Target */}
                    <rect
                      x={paddingLeft + idx * slotWidth}
                      y={0}
                      width={slotWidth}
                      height={svgHeight}
                      fill="transparent"
                    />

                    {/* Exact Count Above Column */}
                    <text
                      x={slotCenterX}
                      y={barY - 7}
                      textAnchor="middle"
                      className={`text-[11px] font-mono transition-colors duration-150 ${
                        isHovered
                          ? "fill-primary font-bold"
                          : "fill-foreground font-semibold"
                      }`}
                    >
                      {item.count}
                    </text>

                    {/* Vertical Column Bar */}
                    <motion.rect
                      x={barX}
                      width={barWidth}
                      rx="4"
                      ry="4"
                      initial={{
                        height: 0,
                        y: paddingTop + innerHeight,
                      }}
                      animate={{
                        height: Math.max(barHeight, 3),
                        y: barY,
                      }}
                      transition={{
                        duration: 0.45,
                        delay: idx * 0.06,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className={`transition-colors duration-200 ${
                        isHovered
                          ? "fill-primary-hover shadow-xs"
                          : "fill-primary"
                      }`}
                    />

                    {/* X-Axis Technology Name */}
                    <text
                      x={slotCenterX}
                      y={paddingTop + innerHeight + 18}
                      textAnchor="middle"
                      className={`text-[11px] select-none transition-colors duration-150 ${
                        isHovered
                          ? "fill-foreground font-bold"
                          : "fill-muted-foreground font-medium"
                      }`}
                    >
                      {labelDisplay}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Smart Collision-Aware Floating Tooltip */}
            <ChartFloatingTooltip
              containerRef={chartContainerRef}
              anchor={
                hoveredIdx !== null && sortedTechnologies[hoveredIdx]
                  ? {
                      svgX:
                        paddingLeft +
                        hoveredIdx * slotWidth +
                        slotWidth / 2,
                      svgY:
                        paddingTop +
                        innerHeight -
                        (maxCount > 0
                          ? (sortedTechnologies[hoveredIdx].count /
                              maxCount) *
                            innerHeight
                          : 0),
                      svgWidth,
                      svgHeight,
                    }
                  : null
              }
              title={
                hoveredIdx !== null && sortedTechnologies[hoveredIdx]
                  ? sortedTechnologies[hoveredIdx].technology
                  : ""
              }
              count={
                hoveredIdx !== null && sortedTechnologies[hoveredIdx]
                  ? sortedTechnologies[hoveredIdx].count
                  : 0
              }
              visible={
                hoveredIdx !== null && !!sortedTechnologies[hoveredIdx]
              }
            />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-muted-foreground space-y-1.5 border border-dashed border-border/70 rounded-lg">
          <Code2
            className="h-6 w-6 text-muted-foreground/60"
            aria-hidden="true"
          />
          <p className="font-semibold text-foreground">
            No technology data available
          </p>
          <p className="text-[11px] text-muted-foreground">
            Technology stacks will appear once projects are archived.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminPopularTechnologies;
