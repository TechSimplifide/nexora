import {
  Sparkles,
  Lightbulb,
  Layers,
  Users,
  Check,
  AlertTriangle,
  X,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

/**
 * AiSection
 * Section 5: AI Intelligence
 * Focused, restrained demonstration of Nexora's 2 core AI capabilities:
 * 1. AI Project Recommendations (for students)
 * 2. AI Proposal Review (for institutions/faculty)
 */
function AiSection() {
  return (
    <section
      id="capabilities"
      className="scroll-mt-20 border-t border-border bg-background py-16 md:py-28 transition-colors"
      aria-label="AI Capabilities"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center mb-12 md:mb-18"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Integrated Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Intelligence built into the project lifecycle.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed text-balance">
            Practical AI tools engineered to assist student discovery and accelerate faculty evaluation — keeping educators firmly in control of all final decisions.
          </p>
        </motion.div>

        {/* 2 Focused AI Capability Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* ============================================================ */}
          {/* 1. AI PROJECT RECOMMENDATIONS                                */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-6"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>For Students · Idea Discovery</span>
              </div>

              <h3 className="text-xl font-bold text-foreground tracking-tight">
                AI-Powered Project Recommendations
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Helps students formulate rigorous, research-backed capstone directions based on their domain interests, preferred technology stacks, team size, and academic difficulty.
              </p>
            </div>

            {/* Visual Fragment: AI Recommendation Card */}
            <div className="rounded-xl border border-border bg-surface-secondary/40 p-4 space-y-3 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                      AI Recommended
                    </span>
                    <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60">
                      Intermediate · Real World
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    Intelligent Campus Resource Assistant
                  </h4>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono shrink-0">
                  AI & ML
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground border-t border-border/60 pt-2">
                <div className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>Computer Science</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>Team of 3–4</span>
                </div>
              </div>

              {/* Rationale Callout */}
              <div className="rounded-lg border border-primary/20 bg-primary-50/40 p-2.5 text-xs space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-primary">
                  <Lightbulb className="h-3 w-3" />
                  <span>Why Recommended For You</span>
                </div>
                <p className="leading-relaxed text-[11px] text-foreground-secondary">
                  Matches your focus in full-stack architecture with measurable campus utility and clear research deliverables.
                </p>
              </div>

              {/* Suggested Stack */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-border/60">
                <span className="text-[10px] text-muted-foreground font-medium">Suggested Stack:</span>
                <div className="flex flex-wrap gap-1">
                  {["React", "FastAPI", "PostgreSQL", "PyTorch"].map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-primary/20 bg-primary-50/50 px-1.5 py-0.2 text-[9px] font-semibold text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* 2. AI PROPOSAL REVIEW                                       */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm space-y-6"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>For Faculty · Triage & Evaluation</span>
              </div>

              <h3 className="text-xl font-bold text-foreground tracking-tight">
                AI-Assisted Proposal Review
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Evaluates incoming student submissions against standard or custom college criteria, generating confidence breakdowns and constructive feedback for faculty.
              </p>
            </div>

            {/* Visual Fragment: AI Evaluation Breakdown Card */}
            <div className="rounded-xl border border-border bg-surface-secondary/40 p-4 space-y-3 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground">Proposal #PR-2026-084</span>
                  <h4 className="text-sm font-bold text-foreground">
                    Neural Network Compression for Microcontrollers
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-full border border-warning-200 bg-warning-50 px-2 py-0.5 text-[10px] font-bold text-warning-800">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    REVISE
                  </span>
                  <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                    87%
                  </span>
                </div>
              </div>

              {/* Evaluated Criteria Grid */}
              <div className="space-y-1 pt-1">
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { name: "Clear Problem", result: "PASS" },
                    { name: "Technical Depth", result: "PARTIAL" },
                    { name: "Scope Feasibility", result: "PASS" },
                    { name: "Prototype Plan", result: "FAIL" },
                  ].map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between rounded border border-border/70 bg-surface px-2 py-1 text-[10px]"
                    >
                      <span className="truncate text-foreground-secondary">{c.name}</span>
                      {c.result === "PASS" && (
                        <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] font-bold bg-success-50 text-success-700 border border-success-200 shrink-0">
                          <Check className="h-2.5 w-2.5" /> PASS
                        </span>
                      )}
                      {c.result === "PARTIAL" && (
                        <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] font-bold bg-warning-50 text-warning-800 border border-warning-200 shrink-0">
                          <AlertTriangle className="h-2.5 w-2.5" /> PARTIAL
                        </span>
                      )}
                      {c.result === "FAIL" && (
                        <span className="inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] font-bold bg-danger-50 text-danger-700 border border-danger-200 shrink-0">
                          <X className="h-2.5 w-2.5" /> FAIL
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Callout */}
              <div className="rounded-lg border border-border/80 bg-surface p-2.5 text-[11px] text-foreground-secondary space-y-0.5">
                <div className="font-semibold text-[10px] text-muted-foreground">AI Assessment:</div>
                <p className="line-clamp-2 leading-relaxed">
                  Solid theoretical premise. Needs concrete quantization benchmark goals before final approval.
                </p>
              </div>

              {/* Advisory Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                  <span>AI assists. Faculty makes the decision.</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="rounded bg-danger-50 text-danger-700 border border-danger-200 px-1.5 py-0.5">Reject</span>
                  <span className="rounded bg-success-600 text-white px-2 py-0.5">Approve</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AiSection;
