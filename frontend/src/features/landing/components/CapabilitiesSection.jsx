import {
  Sparkles,
  FolderKanban,
  FileText,
  Lock,
  Clock,
  Calendar,
  User,
  ArrowRight,
  Code2,
  Layers,
  Bookmark,
  ChevronDown,
  Info,
} from "lucide-react";

function CapabilitiesSection() {
  return (
    <section id="capabilities" className="border-t border-border bg-background py-16 md:py-28 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-18">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            Platform Capabilities
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything your college needs to discover, review, and archive student projects.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            From initial AI idea discovery and proposal evaluation to permanent institutional preservation.
          </p>
        </div>

        {/* Editorial Feature Blocks */}
        <div className="space-y-8 md:space-y-12">
          {/* ============================================================ */}
          {/* CAPABILITY 1: AI IDEA DISCOVERY                             */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10 shadow-nexora-sm">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>01 — AI Idea Discovery</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Turn interests into project directions worth building.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Students describe what they want to explore, choose their preferred technologies, and get structured project directions to move from a blank page to a viable idea.
              </p>

              {/* Sub-lifecycle contextual indicator */}
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Discovery to Archive Lifecycle
                </p>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-secondary font-medium">
                  <span className="px-2 py-0.5 rounded bg-primary-50 text-primary font-semibold border border-primary/20">
                    Discover Idea
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-2 py-0.5 rounded bg-surface-secondary">
                    Draft Proposal
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-2 py-0.5 rounded bg-surface-secondary">
                    Faculty Review
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-2 py-0.5 rounded bg-surface-secondary">
                    Preserve
                  </span>
                </div>
              </div>
            </div>

            {/* Visual UI Fragment: Real Nexora Discovery Interface */}
            <div className="lg:col-span-7 rounded-xl border border-border bg-surface-secondary/40 p-4 sm:p-5 space-y-4">
              <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-4">
                {/* Discovery Form Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border/70">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    AI Project Idea Discovery
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Student Workspace
                  </span>
                </div>

                {/* Form Inputs Mock */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Research Domain
                    </label>
                    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-foreground font-medium">
                      <span>Artificial Intelligence & Machine Learning</span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Preferred Technologies
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-md border border-primary/30 bg-primary-50 px-2 py-1 text-[11px] font-semibold text-primary">
                        Python
                      </span>
                      <span className="rounded-md border border-primary/30 bg-primary-50 px-2 py-1 text-[11px] font-semibold text-primary">
                        PyTorch
                      </span>
                      <span className="rounded-md border border-primary/30 bg-primary-50 px-2 py-1 text-[11px] font-semibold text-primary">
                        FastAPI
                      </span>
                      <span className="rounded-md border border-border/70 bg-surface-secondary px-2 py-1 text-[11px] text-muted-foreground">
                        + Add skill
                      </span>
                    </div>
                  </div>
                </div>

                {/* Generated Idea Result Card */}
                <div className="rounded-xl border border-border/80 bg-surface-secondary/50 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="rounded bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                          Intermediate
                        </span>
                        <span className="rounded bg-surface px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60">
                          Real World
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground">
                        Edge-Optimized Plant Pathology Classification System
                      </h4>
                    </div>
                    <span className="rounded-md border border-border/80 bg-surface px-2 py-1 text-[10px] font-bold text-foreground-secondary shrink-0">
                      Idea #01
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A lightweight computer-vision system for identifying crop anomalies in resource-constrained agricultural environments.
                  </p>

                  {/* Why this direction reasoning box */}
                  <div className="rounded-lg border border-border/60 bg-surface p-2.5 text-[11px] text-foreground-secondary flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong className="font-semibold text-foreground">Why this direction: </strong>
                      Matches your selected AI/ML domain, computer-vision interest, and preferred Python/PyTorch stack.
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                      <span>Python · PyTorch · FastAPI</span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer">
                      <Bookmark className="h-3.5 w-3.5" />
                      <span>Save to Ideas</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CAPABILITY 2: INSTITUTIONAL PROJECT ARCHIVE                 */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10 shadow-nexora-sm">
            <div className="lg:col-span-5 space-y-4 lg:order-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <FolderKanban className="h-4 w-4" aria-hidden="true" />
                <span>02 — Permanent Archive</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Searchable institutional project repository.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Preserve capstone projects, research code, and technical documentation across departments and academic cycles. Filter by technology stack, research domain, department, or graduation year.
              </p>
            </div>

            {/* Visual UI Fragment: Catalog Card */}
            <div className="lg:col-span-7 rounded-xl border border-border bg-surface-secondary/40 p-4 sm:p-5 lg:order-1">
              <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Cloud & Distributed Systems
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>2025–2026</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-foreground">
                    High-Throughput Edge Stream Processing Engine
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    Distributed event-driven architecture evaluating real-time IoT sensory telemetry with zero cold-start latency.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="rounded-md border border-border/60 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                    Rust
                  </span>
                  <span className="rounded-md border border-border/60 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                    Apache Kafka
                  </span>
                  <span className="rounded-md border border-border/60 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                    Docker
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/70 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-[11px]">
                      Created by <strong className="font-semibold text-foreground">Aarav Patel</strong>
                    </span>
                  </div>
                  <span className="font-semibold text-primary text-xs inline-flex items-center gap-1">
                    <span>View Project</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CAPABILITY 3: STRUCTURED PROPOSAL APPROVAL PIPELINE        */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10 shadow-nexora-sm">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>03 — Proposal Pipeline</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Structured proposal review & faculty feedback.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Students submit project proposals with team members and abstracts. Faculty administrators evaluate submissions, request modifications, or approve them with formal remarks.
              </p>
            </div>

            {/* Visual UI Fragment: Proposal Card */}
            <div className="lg:col-span-7 rounded-xl border border-border bg-surface-secondary/40 p-4 sm:p-5">
              <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Proposal #PR-2026-084
                    </span>
                    <h4 className="text-sm font-bold text-foreground mt-0.5">
                      Neural Network Compression for Microcontroller Deployments
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-warning-200 bg-warning-50 px-2.5 py-0.5 text-xs font-semibold text-warning-800 shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>Under Review</span>
                  </span>
                </div>

                <div className="rounded-lg border border-border/80 bg-surface-secondary/60 p-3 text-xs">
                  <div className="font-semibold text-muted-foreground mb-1">Faculty Feedback:</div>
                  <p className="text-foreground-secondary leading-relaxed">
                    Quantization benchmarks are solid. Please attach the supporting architecture PDF before final committee sign-off.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <span className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground-secondary">
                    View Abstract PDF
                  </span>
                  <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                    Approve Submission
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CAPABILITY 4 & 5 (2-Column Grid)                            */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Capability 4: Protected Resources */}
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Lock className="h-4 w-4" aria-hidden="true" />
                <span>04 — Secure Resources</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                In-App PDF viewing and access permission control.
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Project code, supporting documentation, and live links are guarded with role-based access. Supporting PDFs render seamlessly inside Nexora with zero external redirection.
              </p>

              <div className="rounded-xl border border-border bg-surface-secondary/40 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">Technical Specification (PDF)</span>
                  </div>
                  <span className="rounded bg-success-50 px-2 py-0.5 text-[10px] font-bold text-success-700 border border-success-200">
                    In-App Viewer
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-2.5">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground-secondary">Source Code Repository</span>
                  </div>
                  <span className="rounded bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                    Access on Request
                  </span>
                </div>
              </div>
            </div>

            {/* Capability 5: Institutional Insights */}
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Layers className="h-4 w-4" aria-hidden="true" />
                <span>05 — Curriculum Intelligence</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Technology adoption and research domain trends.
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gain instant visibility into emerging technologies, departmental project distributions, and year-over-year research volume across your entire college.
              </p>

              <div className="rounded-xl border border-border bg-surface-secondary/40 p-3.5 space-y-2 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-foreground text-[11px]">
                    <span>AI / Machine Learning</span>
                    <span className="text-muted-foreground">38 Projects</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                    <div style={{ width: "75%" }} className="h-full bg-primary rounded-full" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-foreground text-[11px]">
                    <span>Full-Stack Web Systems</span>
                    <span className="text-muted-foreground">29 Projects</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                    <div style={{ width: "58%" }} className="h-full bg-primary/80 rounded-full" />
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

export default CapabilitiesSection;
