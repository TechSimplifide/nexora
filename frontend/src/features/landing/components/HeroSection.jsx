import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building,
  Users,
  FolderKanban,
  Clock,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";

// Product-led SaaS Hero section.
function HeroSection() {
  const techData = [
    { name: "React/TS", count: 42, height: 50 },
    { name: "Python", count: 36, height: 42 },
    { name: "Node.js", count: 28, height: 32 },
    { name: "Docker", count: 18, height: 22 },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
      {/* Subtle atmospheric gradient behind hero */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[440px] w-full max-w-7xl opacity-30 dark:opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at top, var(--color-primary-500) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Positioning & Value Proposition */}
        <div className="mx-auto max-w-3xl text-center space-y-4 sm:space-y-5">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-medium text-foreground-secondary shadow-2xs"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span>Institutional Project Workspace</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
          >
            The project platform built for colleges.
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-relaxed max-w-2xl mx-auto text-balance"
          >
            Nexora gives colleges one structured workspace to collect, review, preserve,
            discover, and manage student projects across every academic cycle.
          </motion.p>

          {/* Direct CTA Hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="pt-2 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto gap-2 font-semibold shadow-nexora-sm transition-shadow hover:shadow-nexora-md"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </Link>
            <a href="#platform" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-medium shadow-2xs"
                >
                  Explore Nexora
                </Button>
              </motion.div>
            </a>
          </motion.div>
        </div>

        {/* Real Institutional Control Center Window Frame */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-14"
        >
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-border bg-surface shadow-nexora-lg overflow-hidden transition-shadow duration-300 hover:shadow-nexora-xl">
            {/* Top Browser / Application Chrome Bar */}
            <div className="flex items-center justify-between border-b border-border bg-surface-secondary/70 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <div className="h-2.5 w-2.5 rounded-full bg-border-strong/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border-strong/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border-strong/70" />
                </div>
                <div className="hidden rounded-md border border-border/80 bg-surface px-2.5 py-0.5 text-[11px] font-mono font-medium text-muted-foreground sm:inline-block">
                  app.nexora.edu / admin / dashboard
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground">
                  <Building className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                  <span className="truncate max-w-[160px] sm:max-w-[200px]">
                    Faculty of Engineering
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard Canvas Preview */}
            <div className="p-4 sm:p-6 lg:p-7 bg-background/50 space-y-5">
              {/* Context Header & Pipeline Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-border/70">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    Institutional Control Center
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Academic Year 2025–2026 Archive & Approval Pipeline
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-warning-200 bg-warning-50 px-3 py-1 text-xs font-semibold text-warning-800 self-start sm:self-auto">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>12 Proposals Awaiting Review</span>
                </div>
              </div>

              {/* 4 Authentic Admin KPI Cards (Matches AdminDashboardKpis.jsx) */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {/* Total Students */}
                <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Total Students
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">640</div>
                  <p className="text-[10px] text-muted-foreground">Enrolled student accounts</p>
                </div>

                {/* Total Projects */}
                <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Total Projects
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-secondary text-foreground-secondary border border-border/60">
                      <FolderKanban className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">248</div>
                  <p className="text-[10px] text-muted-foreground">Archived college projects</p>
                </div>

                {/* Pending Proposals with Action Needed Highlight */}
                <div className="rounded-xl border border-warning-300/80 bg-warning-50/15 ring-1 ring-warning-200/50 p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Pending
                      </span>
                      <span className="rounded-md bg-warning-100/80 px-1.5 py-0.2 text-[9px] font-bold text-warning-900 border border-warning-200/60">
                        Action needed
                      </span>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning-50 text-warning-800 border border-warning-200">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">12</div>
                  <p className="text-[10px] text-warning-800 font-medium">Submissions awaiting review</p>
                </div>

                {/* Featured Projects */}
                <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Featured
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning-50 text-warning-700 border border-warning-200">
                      <Star className="h-3.5 w-3.5 fill-warning-600 text-warning-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">16</div>
                  <p className="text-[10px] text-muted-foreground">Showcased capstones</p>
                </div>
              </div>

              {/* 2-Column Analytics: Proposal Overview + Curriculum Technology Adoption */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Proposal Overview */}
                <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground">
                        Proposal Overview
                      </h3>
                      <span className="text-[11px] font-semibold text-foreground px-2 py-0.5 rounded-md bg-surface-secondary border border-border/60">
                        <strong className="font-bold text-foreground">42</strong> Submissions
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Current project proposal review status and distribution
                    </p>
                  </div>

                  {/* Proportional Segmented Color Bar */}
                  <div className="space-y-2">
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-secondary border border-border/60">
                      <div
                        style={{ width: "62%" }}
                        className="bg-success-500 transition-all duration-500"
                        title="Approved: 62%"
                      />
                      <div
                        style={{ width: "28%" }}
                        className="bg-warning-500 transition-all duration-500"
                        title="Pending: 28%"
                      />
                      <div
                        style={{ width: "10%" }}
                        className="bg-danger-500 transition-all duration-500"
                        title="Rejected: 10%"
                      />
                    </div>

                    {/* Status Breakdown Labels */}
                    <div className="grid grid-cols-3 gap-1 pt-1 text-center">
                      <div className="rounded-lg bg-surface-secondary/70 p-1.5 border border-border/50">
                        <div className="text-[11px] font-bold text-success-600">26</div>
                        <div className="text-[9px] text-foreground-secondary">Approved (62%)</div>
                      </div>
                      <div className="rounded-lg bg-surface-secondary/70 p-1.5 border border-border/50">
                        <div className="text-[11px] font-bold text-warning-600">12</div>
                        <div className="text-[9px] text-foreground-secondary">Pending (28%)</div>
                      </div>
                      <div className="rounded-lg bg-surface-secondary/70 p-1.5 border border-border/50">
                        <div className="text-[11px] font-bold text-danger-600">4</div>
                        <div className="text-[9px] text-foreground-secondary">Rejected (10%)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technology Adoption SVG Column Chart */}
                <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-foreground">
                        Technology Adoption
                      </h3>
                      <p className="text-[11px] text-muted-foreground">Top curriculum technology stacks</p>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-muted-foreground">
                      144 Projects
                    </span>
                  </div>

                  <div className="pt-1 select-none">
                    <svg
                      viewBox="0 0 280 85"
                      className="w-full h-20 overflow-visible"
                      role="img"
                      aria-label="Technology adoption chart"
                    >
                      <line x1="4" y1="68" x2="276" y2="68" className="stroke-border" strokeWidth="1" />
                      {techData.map((item, idx) => {
                        const barWidth = 28;
                        const slotWidth = 270 / techData.length;
                        const x = 10 + idx * slotWidth + slotWidth / 2 - barWidth / 2;
                        const y = 68 - item.height;

                        return (
                          <g key={item.name}>
                            <text
                              x={x + barWidth / 2}
                              y={y - 3}
                              textAnchor="middle"
                              className="text-[8px] font-bold fill-primary"
                            >
                              {item.count}
                            </text>
                            <rect
                              x={x}
                              y={y}
                              width={barWidth}
                              height={item.height}
                              rx="3"
                              className="fill-primary/80 hover:fill-primary transition-colors"
                            />
                            <text
                              x={x + barWidth / 2}
                              y="78"
                              textAnchor="middle"
                              className="text-[8px] font-medium fill-foreground-secondary"
                            >
                              {item.name}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
