import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building,
  Users,
  FolderKanban,
  Clock,
  Star,
} from "lucide-react";
import Button from "@/components/ui/Button";

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
      {/* Subtle atmospheric glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[450px] w-full max-w-7xl opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at top, var(--color-primary-500) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Positioning & Value Proposition */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow Pill */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground-secondary shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span>Institutional Project Workspace</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl sm:leading-[1.12]">
            The project platform built for colleges.
          </h1>

          {/* Supporting Copy */}
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Nexora gives colleges one structured workspace to collect, review, preserve,
            discover, and manage student projects across every academic cycle.
          </p>

          {/* Direct CTA Hierarchy */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2 font-semibold shadow-nexora-sm">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <a href="#product" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium">
                Explore Nexora
              </Button>
            </a>
          </div>
        </div>

        {/* Real Product UI Window Frame */}
        <div className="mt-14 sm:mt-18">
          <div className="relative mx-auto max-w-6xl rounded-2xl border border-border bg-surface shadow-nexora-lg overflow-hidden">
            {/* Realistic Application Window Bar */}
            <div className="flex items-center justify-between border-b border-border bg-surface-secondary/70 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <div className="h-3 w-3 rounded-full bg-border-strong/70" />
                  <div className="h-3 w-3 rounded-full bg-border-strong/70" />
                  <div className="h-3 w-3 rounded-full bg-border-strong/70" />
                </div>
                <span className="hidden text-[11px] font-mono font-medium text-muted-foreground sm:inline-block">
                  app.nexora.edu / workspace / engineering
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground">
                  <Building className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                  <span className="truncate max-w-[160px] sm:max-w-[200px]">
                    Faculty of Technology & Engineering
                  </span>
                </div>
              </div>
            </div>

            {/* Application Canvas Preview */}
            <div className="p-4 sm:p-6 lg:p-8 bg-background/50 space-y-6">
              {/* Workspace Context & Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-border/70">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    Institutional Control Center
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Academic Year 2025–2026 Archive & Approval Pipeline
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-warning-200 bg-warning-50 px-3 py-1 text-xs font-semibold text-warning-800 self-start sm:self-auto">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>12 Proposals Awaiting Review</span>
                </div>
              </div>

              {/* 4 Authentic KPI Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Students
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">640</div>
                  <p className="text-[10px] text-muted-foreground">Enrolled workspace accounts</p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Archive
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-secondary text-foreground-secondary border border-border/70">
                      <FolderKanban className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">248</div>
                  <p className="text-[10px] text-muted-foreground">Archived college projects</p>
                </div>

                <div className="rounded-xl border border-warning-300/80 bg-warning-50/15 ring-1 ring-warning-200/50 p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Pending
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning-50 text-warning-800 border border-warning-200">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">12</div>
                  <p className="text-[10px] text-warning-800 font-medium">Action required</p>
                </div>

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

              {/* Sample Authentic Project Row Preview */}
              <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-[10px] font-bold text-warning-800 border border-warning-200">
                      <Star className="h-2.5 w-2.5 fill-warning-600 text-warning-600" aria-hidden="true" />
                      Featured Project
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Artificial Intelligence
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">2025–26</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Autonomous Agricultural Crop Disease Detection using Vision Transformers
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      High-accuracy edge diagnostic model for automated multi-spectral leaf anomaly classification.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="rounded-md border border-border/70 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                      PyTorch
                    </span>
                    <span className="rounded-md border border-border/70 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                      FastAPI
                    </span>
                    <span className="rounded-md border border-border/70 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                      React
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
