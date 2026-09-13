import { useState, useRef } from "react";
import { GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import ChartFloatingTooltip from "./ChartFloatingTooltip";

/**
 * AdminProjectsByAcademicYearChart
 * Institutional line chart visualizing project volume trend across academic years.
 */
function AdminProjectsByAcademicYearChart({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const chartContainerRef = useRef(null);

  const rawData = Array.isArray(data) ? data : [];
  const chartData = rawData.map((item) => ({
    academicYear: item.academicYear || "Unknown",
    count: Math.max(0, Number(item.count) || 0),
  }));

  const maxCount = chartData.reduce(
    (max, item) => Math.max(max, item.count),
    0
  );
  const totalProjects = chartData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const hasData = chartData.length > 0 && maxCount > 0;

  // Chart dimensions & coordinate bounds
  const svgWidth = 480;
  const svgHeight = 160;
  const paddingLeft = 36;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 32;

  const innerWidth = svgWidth - paddingLeft - paddingRight;
  const innerHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates (Y-axis starts at 0)
  const points = chartData.map((item, idx) => {
    const x =
      chartData.length === 1
        ? paddingLeft + innerWidth / 2
        : paddingLeft + (idx / (chartData.length - 1)) * innerWidth;

    const normalizedHeight =
      maxCount > 0 ? (item.count / maxCount) * innerHeight : 0;
    const y = paddingTop + innerHeight - normalizedHeight;

    return { x, y, ...item };
  });

  // Build SVG path string for the line
  const linePath =
    points.length > 1
      ? points.reduce(
          (acc, p, i) =>
            i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`,
          ""
        )
      : "";

  // Build SVG path string for subtle under-line fill
  const areaPath =
    points.length > 1
      ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`
      : "";

  // 3 ticks on Y-axis (top = maxCount, mid = maxCount / 2, baseline = 0)
  const yTicks = [
    { value: maxCount, y: paddingTop },
    {
      value: Math.round(maxCount / 2),
      y: paddingTop + innerHeight / 2,
    },
    { value: 0, y: paddingTop + innerHeight },
  ];

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-nexora-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            Project Archive
          </h2>
          <p className="text-xs text-muted-foreground">
            Project volume across academic years
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
          {/* SVG Line Chart Viewport */}
          <div ref={chartContainerRef} className="relative w-full select-none">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-44 overflow-visible"
              role="img"
              aria-label="Project volume trend across academic years"
            >
              {/* Subtle Horizontal Gridlines & Y-Axis Ticks */}
              {yTicks.map((tick, idx) => (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={tick.y}
                    x2={svgWidth - paddingRight}
                    y2={tick.y}
                    className="stroke-border/70"
                    strokeDasharray={idx === 2 ? "0" : "3 3"}
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={tick.y + 3.5}
                    textAnchor="end"
                    className="fill-muted-foreground text-[9px] font-mono select-none"
                  >
                    {tick.value}
                  </text>
                </g>
              ))}

              {/* Area Under Line (Subtle Accent) */}
              {points.length > 1 && (
                <motion.path
                  d={areaPath}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="fill-primary/6 transition-all duration-300"
                />
              )}

              {/* Connecting Trend Line */}
              {points.length > 1 && (
                <motion.path
                  d={linePath}
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="stroke-primary transition-all duration-300"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points & Interactive Hit Columns */}
              {points.map((p, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <g
                    key={p.academicYear || idx}
                    className="cursor-pointer group focus:outline-none"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${p.academicYear}: ${p.count} projects`}
                    onFocus={() => setHoveredIdx(idx)}
                    onBlur={() => setHoveredIdx(null)}
                  >
                    {/* Transparent Column Hit Target */}
                    <rect
                      x={p.x - 20}
                      y={paddingTop}
                      width={40}
                      height={innerHeight}
                      fill="transparent"
                    />

                    {/* Vertical Hover Guideline */}
                    {isHovered && (
                      <line
                        x1={p.x}
                        y1={paddingTop}
                        x2={p.x}
                        y2={paddingTop + innerHeight}
                        className="stroke-primary/40"
                        strokeDasharray="2 2"
                        strokeWidth="1"
                      />
                    )}

                    {/* Outer Ping Ring on Hover */}
                    {isHovered && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="7"
                        className="fill-primary/20 animate-ping"
                      />
                    )}

                    {/* Data Point Dot */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 5 : points.length === 1 ? 5.5 : 3.5}
                      className="fill-surface stroke-primary stroke-2 transition-all duration-150"
                    />

                    {/* X-Axis Label */}
                    <text
                      x={p.x}
                      y={paddingTop + innerHeight + 18}
                      textAnchor="middle"
                      className={`text-[11px] select-none transition-colors duration-150 ${
                        isHovered
                          ? "fill-foreground font-bold"
                          : "fill-muted-foreground font-medium"
                      }`}
                    >
                      {p.academicYear}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Smart Collision-Aware Floating Tooltip */}
            <ChartFloatingTooltip
              containerRef={chartContainerRef}
              anchor={
                hoveredIdx !== null && points[hoveredIdx]
                  ? {
                      svgX: points[hoveredIdx].x,
                      svgY: points[hoveredIdx].y,
                      svgWidth,
                      svgHeight,
                    }
                  : null
              }
              title={
                hoveredIdx !== null && points[hoveredIdx]
                  ? points[hoveredIdx].academicYear
                  : ""
              }
              count={
                hoveredIdx !== null && points[hoveredIdx]
                  ? points[hoveredIdx].count
                  : 0
              }
              visible={hoveredIdx !== null && !!points[hoveredIdx]}
            />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-muted-foreground space-y-1.5 border border-dashed border-border/70 rounded-lg">
          <GraduationCap
            className="h-6 w-6 text-muted-foreground/60"
            aria-hidden="true"
          />
          <p className="font-semibold text-foreground">
            No project archive data available
          </p>
          <p className="text-[11px] text-muted-foreground">
            Academic year distributions will show once projects are approved.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminProjectsByAcademicYearChart;
