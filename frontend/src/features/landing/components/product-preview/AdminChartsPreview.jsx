import { useState } from "react";

/**
 * AdminChartsPreview
 * Contains SVG-based Technology Adoption vertical column chart,
 * Year-over-year Academic Year trendline chart, and Proportional Domain Treemap.
 * Refined with balanced internal padding and comfortable breathing room.
 */
function AdminChartsPreview() {
  const [hoveredTechIndex, setHoveredTechIndex] = useState(null);
  const [hoveredYearIndex, setHoveredYearIndex] = useState(null);

  // 1. Technology Adoption Data
  const techData = [
    { name: "React/TS", count: 42, percentage: 85 },
    { name: "Python", count: 36, percentage: 72 },
    { name: "Node.js", count: 28, percentage: 56 },
    { name: "Postgres", count: 22, percentage: 44 },
    { name: "Docker", count: 18, percentage: 36 },
  ];

  // 2. Academic Year Trendline Data (Matches AdminProjectsByAcademicYearChart.jsx)
  const yearData = [
    { year: "2022–23", count: 45 },
    { year: "2023–24", count: 78 },
    { year: "2024–25", count: 142 },
    { year: "2025–26", count: 248 },
  ];

  // Chart coordinate calculation for Trendline
  const maxYearCount = 250;
  const svgWidth = 360;
  const svgHeight = 110;
  const padL = 28;
  const padR = 20;
  const padT = 16;
  const padB = 24;
  const innerW = svgWidth - padL - padR;
  const innerH = svgHeight - padT - padB;

  const points = yearData.map((d, i) => {
    const x = padL + (i / (yearData.length - 1)) * innerW;
    const y = padT + innerH - (d.count / maxYearCount) * innerH;
    return { ...d, x, y };
  });

  const linePath = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + innerH} L ${points[0].x} ${padT + innerH} Z`;

  return (
    <div className="space-y-4">
      {/* 2-Column Analytics: Tech Column Chart & Domain Treemap */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-stretch">
        {/* Technology Adoption SVG Vertical Column Chart */}
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Technology Adoption
              </h4>
              <p className="text-[11px] text-muted-foreground">Top curriculum technology stacks</p>
            </div>
            <span className="text-[11px] font-mono font-medium text-muted-foreground">
              144 Projects
            </span>
          </div>

          <div className="pt-1 select-none">
            <svg
              viewBox="0 0 360 110"
              className="w-full h-28 overflow-visible"
              role="img"
              aria-label="Technology adoption column chart"
            >
              {/* Baseline Axis */}
              <line x1="8" y1="90" x2="352" y2="90" className="stroke-border" strokeWidth="1" />

              {techData.map((item, idx) => {
                const barWidth = 32;
                const slotWidth = 340 / techData.length;
                const x = 16 + idx * slotWidth + slotWidth / 2 - barWidth / 2;
                const maxH = 68;
                const h = (item.percentage / 100) * maxH;
                const y = 90 - h;
                const isHovered = hoveredTechIndex === idx;

                return (
                  <g
                    key={item.name}
                    onMouseEnter={() => setHoveredTechIndex(idx)}
                    onMouseLeave={() => setHoveredTechIndex(null)}
                    className="cursor-pointer"
                  >
                    {/* Count label above bar */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 4}
                      textAnchor="middle"
                      className={`text-[9px] font-bold transition-colors ${
                        isHovered ? "fill-primary" : "fill-muted-foreground"
                      }`}
                    >
                      {item.count}
                    </text>

                    {/* Column Rect with transform origin bottom scale transition */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={h}
                      rx="4"
                      className={`transition-colors duration-200 ${
                        isHovered
                          ? "fill-primary"
                          : idx === 0
                          ? "fill-primary"
                          : "fill-primary/75"
                      }`}
                    />

                    {/* X-axis Label */}
                    <text
                      x={x + barWidth / 2}
                      y="102"
                      textAnchor="middle"
                      className="text-[9px] font-medium fill-foreground-secondary"
                    >
                      {item.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Project Research Domains Proportional Tiles (Treemap) with Refined Bottom Spacing */}
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Project Domains
              </h4>
              <p className="text-[11px] text-muted-foreground">Student research focus areas</p>
            </div>
            <span className="text-[11px] font-mono font-medium text-muted-foreground">
              3 Core Domains
            </span>
          </div>

          {/* Treemap grid with comfortable breathing room below tiles */}
          <div className="pt-1 pb-1">
            <div className="grid grid-cols-2 gap-2.5 h-28">
              {/* Primary Hero Domain Tile */}
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 flex flex-col justify-between transition-colors hover:bg-primary/15">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary truncate">
                  AI & Machine Learning
                </span>
                <div>
                  <div className="text-xl font-extrabold text-foreground font-mono">48%</div>
                  <span className="text-[10px] text-muted-foreground">119 projects</span>
                </div>
              </div>

              {/* Secondary Domain Tiles */}
              <div className="flex flex-col gap-2">
                <div className="flex-1 rounded-lg border border-border/80 bg-surface-secondary/70 px-3 py-1.5 flex items-center justify-between transition-colors hover:bg-surface-secondary">
                  <div>
                    <div className="text-[11px] font-bold text-foreground">Full-Stack Web</div>
                    <span className="text-[10px] text-muted-foreground">79 projects</span>
                  </div>
                  <span className="text-sm font-bold text-foreground font-mono">32%</span>
                </div>

                <div className="flex-1 rounded-lg border border-border/80 bg-surface-secondary/70 px-3 py-1.5 flex items-center justify-between transition-colors hover:bg-surface-secondary">
                  <div>
                    <div className="text-[11px] font-bold text-foreground">Cloud & DevOps</div>
                    <span className="text-[10px] text-muted-foreground">50 projects</span>
                  </div>
                  <span className="text-sm font-bold text-foreground font-mono">20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Year Volume Trendline Chart (Matches AdminProjectsByAcademicYearChart.jsx) */}
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Academic Year Project Volume
            </h4>
            <p className="text-[11px] text-muted-foreground">Historical preservation growth across cohorts</p>
          </div>
          <span className="text-xs font-semibold text-foreground px-2 py-0.5 rounded-md bg-surface-secondary border border-border/60">
            <strong className="font-bold">248</strong> Total Archived
          </span>
        </div>

        <div className="pt-2 select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-24 overflow-visible"
            role="img"
            aria-label="Academic year volume line chart"
          >
            <defs>
              <linearGradient id="adminAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary-500, #6366f1)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--color-primary-500, #6366f1)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid line */}
            <line x1={padL} y1={padT + innerH} x2={svgWidth - padR} y2={padT + innerH} className="stroke-border" strokeWidth="1" />
            <line x1={padL} y1={padT + innerH / 2} x2={svgWidth - padR} y2={padT + innerH / 2} className="stroke-border/50" strokeDasharray="3 3" strokeWidth="1" />

            {/* Area Fill */}
            <path d={areaPath} fill="url(#adminAreaGradient)" />

            {/* Stroke Line */}
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-primary, #4f46e5)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Circles & Labels */}
            {points.map((p, idx) => {
              const isHovered = hoveredYearIndex === idx;
              return (
                <g
                  key={p.year}
                  onMouseEnter={() => setHoveredYearIndex(idx)}
                  onMouseLeave={() => setHoveredYearIndex(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3.5}
                    className="fill-surface stroke-primary transition-all duration-200"
                    strokeWidth="2.5"
                  />
                  <text
                    x={p.x}
                    y={padT + innerH + 14}
                    textAnchor="middle"
                    className="text-[9px] font-medium fill-foreground-secondary"
                  >
                    {p.year}
                  </text>
                  {isHovered && (
                    <text
                      x={p.x}
                      y={p.y - 8}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-primary"
                    >
                      {p.count}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default AdminChartsPreview;
