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
  Search,
  CheckCircle2,
  Check,
  Lightbulb,
  GraduationCap,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

/**
 * CapabilitiesSection
 * High-fidelity, product-led demonstration of the 5 core Nexora platform capabilities with scroll reveals.
 */
function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      className="scroll-mt-20 border-t border-border bg-background py-16 md:py-28 transition-colors"
      aria-label="Platform Capabilities"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center mb-12 md:mb-18"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            Platform Capabilities
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything your college needs to discover, review, and archive student projects.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            From AI-guided idea discovery and faculty proposal evaluation to permanent institutional preservation and curriculum intelligence.
          </p>
        </motion.div>

        {/* Editorial Feature Blocks */}
        <div className="space-y-8 md:space-y-12">
          {/* ============================================================ */}
          {/* CAPABILITY 1: AI IDEA DISCOVERY                             */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10 shadow-nexora-sm transition-all hover:shadow-nexora-md"
          >
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>01 — AI Idea Discovery</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Turn student interests into viable, research-backed project directions.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Students input their interests, domain focus, and preferred technology stacks to generate structured capstone proposals complete with rationale and feasibility guidance.
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

            {/* Visual UI Fragment: Authentic AI Recommendation Card */}
            <div className="lg:col-span-7 rounded-xl border border-border bg-surface-secondary/40 p-4 sm:p-5">
              <article className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-3.5">
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                        AI Recommended
                      </span>
                      <span className="rounded bg-surface-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground border border-border/60">
                        Intermediate · Real World
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-foreground">
                      Intelligent Campus Resource Assistant
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono shrink-0">
                    AI & ML
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs border-t border-border/60 pt-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Domain: Computer Science</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Team of 3–4 Members</span>
                  </div>
                </div>

                {/* Why Recommended Callout (Authentic Nexora Rationale) */}
                <div className="rounded-lg border border-primary/20 bg-primary-50/40 p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Why Recommended For You</span>
                  </div>
                  <p className="leading-relaxed text-foreground-secondary">
                    Matches your interest in AI and full-stack development while providing strong opportunities for academic research and measurable campus impact.
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60 text-xs">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Suggested Stack:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded-md border border-primary/20 bg-primary-50/50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      React
                    </span>
                    <span className="rounded-md border border-primary/20 bg-primary-50/50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      FastAPI
                    </span>
                    <span className="rounded-md border border-primary/20 bg-primary-50/50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      PostgreSQL
                    </span>
                    <span className="rounded-md border border-primary/20 bg-primary-50/50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      PyTorch
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* CAPABILITY 2: INSTITUTIONAL PROJECT ARCHIVE                 */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10 shadow-nexora-sm transition-all hover:shadow-nexora-md"
          >
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

            {/* Visual UI Fragment: Archive Search & Discover Card */}
            <div className="lg:col-span-7 rounded-xl border border-border bg-surface-secondary/40 p-4 sm:p-5 lg:order-1 space-y-3">
              {/* Archive Search Facets Filter Bar */}
              <div className="rounded-lg border border-border bg-surface p-2.5 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 rounded-md bg-surface-secondary px-2.5 py-1.5 text-xs text-muted-foreground">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  <span className="truncate">Search projects by title, stack, or domain...</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="font-semibold text-foreground-secondary">Filters:</span>
                  <span className="rounded bg-surface-secondary px-2 py-0.5 border border-border/60">
                    Domain: Distributed Systems
                  </span>
                  <span className="rounded bg-surface-secondary px-2 py-0.5 border border-border/60">
                    Year: 2025–26
                  </span>
                  <span className="rounded bg-primary-50 px-2 py-0.5 text-primary font-semibold border border-primary/20">
                    Stack: Rust
                  </span>
                </div>
              </div>

              {/* Authentic DiscoverProjectCard Representation */}
              <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Cloud & Distributed Systems
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
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

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3 text-muted-foreground" />
                    <span>Computer Science & Engineering</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/60">
                  <span className="rounded-md border border-border/60 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                    Rust
                  </span>
                  <span className="rounded-md border border-border/60 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                    Apache Kafka
                  </span>
                  <span className="rounded-md border border-border/60 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                    Docker
                  </span>
                  <span className="rounded-md border border-border/60 bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary">
                    PostgreSQL
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
          </motion.div>

          {/* ============================================================ */}
          {/* CAPABILITY 3: STRUCTURED PROPOSAL APPROVAL PIPELINE        */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10 shadow-nexora-sm transition-all hover:shadow-nexora-md"
          >
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>03 — Proposal Pipeline</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Structured proposal review & faculty governance.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Students track proposals along a 4-stage lifecycle while faculty evaluate submissions, review attached abstracts, and leave formal review remarks before development begins.
              </p>
            </div>

            {/* Visual UI Fragment: Proposal Card with Lifecycle Timeline */}
            <div className="lg:col-span-7 rounded-xl border border-border bg-surface-secondary/40 p-4 sm:p-5">
              <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                      Proposal #PR-2026-084
                    </span>
                    <h4 className="text-base font-bold text-foreground">
                      Neural Network Compression for Microcontroller Deployments
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Team of 4</span>
                      <span>•</span>
                      <span>Submitted Feb 24, 2026</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-warning-200 bg-warning-50 px-2.5 py-0.5 text-xs font-semibold text-warning-800 shrink-0 self-start sm:self-auto">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Under Review</span>
                  </span>
                </div>

                {/* Abstract PDF Attachment */}
                <div className="flex items-center justify-between rounded-lg border border-border/80 bg-surface-secondary/50 p-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">abstract_proposal_v2.pdf</span>
                    <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">(1.2 MB)</span>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    Abstract Verified
                  </span>
                </div>

                {/* Faculty Remarks Callout */}
                <div className="rounded-lg border border-border/80 bg-surface-secondary/60 p-3 text-xs">
                  <div className="font-semibold text-muted-foreground mb-1">Faculty Feedback:</div>
                  <p className="text-foreground-secondary leading-relaxed">
                    Quantization benchmarks are solid. Ensure database schema supports multi-tenant isolation before production deployment.
                  </p>
                </div>

                {/* 4-Stage Lifecycle Timeline */}
                <div className="space-y-2 pt-2 border-t border-border/70">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Review Stage</span>
                    <span className="text-[11px]">2 of 4 Complete</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-medium">
                    <div className="rounded bg-primary-50 p-1.5 text-primary border border-primary/20 font-bold flex items-center justify-center gap-1">
                      <Check className="h-3 w-3" /> Submitted
                    </div>
                    <div className="rounded bg-warning-50 p-1.5 text-warning-800 border border-warning-200 font-bold flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" /> Review
                    </div>
                    <div className="rounded bg-surface-secondary p-1.5 text-muted-foreground border border-border/60">
                      Approved
                    </div>
                    <div className="rounded bg-surface-secondary p-1.5 text-muted-foreground border border-border/60">
                      Development
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* CAPABILITY 4 & 5 (2-Column Grid)                            */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Capability 4: Secure Resources & Document Viewing */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-4 transition-all hover:shadow-nexora-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  <span>04 — Secure Resources</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  In-App PDF viewing and access permission control.
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Project assets, code repositories, and supporting documentation are governed by role-based access requests. Attached PDFs open seamlessly in an in-app viewer.
                </p>
              </div>

              {/* Visual Mock: Document Viewer & Access Status Badges */}
              <div className="rounded-xl border border-border bg-surface-secondary/40 p-3.5 space-y-2.5 text-xs">
                {/* PDF Viewer Frame Mock */}
                <div className="rounded-lg border border-border bg-surface p-3 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-foreground text-xs">
                        technical_specification_v2.pdf
                      </span>
                    </div>
                    <span className="rounded bg-success-50 px-2 py-0.5 text-[10px] font-bold text-success-700 border border-success-200">
                      In-App Viewer
                    </span>
                  </div>
                  <div className="rounded bg-surface-secondary/60 p-2 space-y-1 text-[11px] text-muted-foreground">
                    <div className="font-semibold text-foreground">1. System Architecture & Edge Topology</div>
                    <p className="text-[10px] line-clamp-2 leading-relaxed">
                      Detailed hardware specifications, quantization thresholds, and micro-controller memory limits.
                    </p>
                  </div>
                </div>

                {/* Access Request Status Badges (Matches ProjectAccessRequestCard.jsx) */}
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-2.5">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground text-xs">Source Code Repository</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-[10px] font-semibold text-warning-800 border border-warning-200">
                    <Clock className="h-3 w-3" />
                    Access Pending
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground text-xs">Benchmark Dataset</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold text-success-700 border border-success-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Access Approved
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Capability 5: Curriculum Intelligence */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-4 transition-all hover:shadow-nexora-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                  <span>05 — Curriculum Intelligence</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Technology adoption and research domain analytics.
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Gain instant institutional visibility into emerging technology trends, domain adoption proportions, and academic research volume across cohorts.
                </p>
              </div>

              {/* Visual Mock: Authentic SVG Mini-Chart & Proportional Treemap */}
              <div className="rounded-xl border border-border bg-surface-secondary/40 p-3.5 space-y-3 text-xs">
                {/* SVG Mini Column Chart */}
                <div className="rounded-lg border border-border bg-surface p-3 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Curriculum Tech Adoption
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">144 Projects</span>
                  </div>

                  <div className="pt-1 select-none">
                    <svg viewBox="0 0 320 65" className="w-full h-16 overflow-visible" aria-label="Curriculum tech chart">
                      <line x1="0" y1="52" x2="320" y2="52" className="stroke-border" strokeWidth="1" />
                      {[
                        { name: "React/TS", h: 42, count: "42" },
                        { name: "Python", h: 36, count: "36" },
                        { name: "Node.js", h: 28, count: "28" },
                        { name: "Docker", h: 20, count: "20" },
                      ].map((item, idx) => {
                        const w = 36;
                        const slot = 320 / 4;
                        const x = idx * slot + slot / 2 - w / 2;
                        const y = 52 - item.h;
                        return (
                          <g key={item.name}>
                            <text x={x + w / 2} y={y - 3} textAnchor="middle" className="text-[8px] font-bold fill-primary">
                              {item.count}
                            </text>
                            <rect x={x} y={y} width={w} height={item.h} rx="3" className="fill-primary/80 hover:fill-primary transition-colors" />
                            <text x={x + w / 2} y="62" textAnchor="middle" className="text-[8px] font-medium fill-foreground-secondary">
                              {item.name}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Domain Distribution Mini Tiles */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="rounded-md border border-primary/20 bg-primary-50/50 p-2">
                    <div className="text-xs font-bold text-primary font-mono">48%</div>
                    <div className="text-[9px] text-muted-foreground truncate">AI & ML</div>
                  </div>
                  <div className="rounded-md border border-border bg-surface p-2">
                    <div className="text-xs font-bold text-foreground font-mono">32%</div>
                    <div className="text-[9px] text-muted-foreground truncate">Web Systems</div>
                  </div>
                  <div className="rounded-md border border-border bg-surface p-2">
                    <div className="text-xs font-bold text-foreground font-mono">20%</div>
                    <div className="text-[9px] text-muted-foreground truncate">Cloud/DevOps</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CapabilitiesSection;
