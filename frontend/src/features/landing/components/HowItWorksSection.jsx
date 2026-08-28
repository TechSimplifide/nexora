import {
  FilePlus2,
  ClipboardCheck,
  Archive,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { motion } from "motion/react";

/**
 * HowItWorksSection
 * 3-stage continuous institutional workflow from student proposal submission to faculty review and permanent preservation with subtle entrance motion.
 */
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      phase: "Submit",
      title: "Students Submit Proposals",
      description:
        "Students form teams, define project scopes, attach abstract PDFs, and submit structured proposals for departmental review.",
      icon: FilePlus2,
      renderVisual: () => (
        <div className="rounded-xl border border-border bg-surface-secondary/40 p-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Draft #PR-2026-084
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
              Submitted
            </span>
          </div>

          <h4 className="text-xs font-bold text-foreground line-clamp-1">
            Decentralized Healthcare Record Verification
          </h4>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Team of 4</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3 text-primary" />
              <span className="font-mono text-[10px]">abstract_v2.pdf</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: "02",
      phase: "Review",
      title: "Faculty Review & Governance",
      description:
        "Department administrators inspect abstracts in-app, provide formal review feedback remarks, and approve or request modifications.",
      icon: ClipboardCheck,
      renderVisual: () => (
        <div className="rounded-xl border border-border bg-surface-secondary/40 p-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Proposal Review
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2 py-0.5 text-[10px] font-semibold text-warning-800 border border-warning-200">
              <Clock className="h-3 w-3" />
              Under Review
            </span>
          </div>

          <div className="rounded bg-surface p-2 border border-border/70 text-[10px] text-foreground-secondary space-y-0.5">
            <div className="flex items-center gap-1 font-semibold text-muted-foreground">
              <MessageSquare className="h-3 w-3 text-primary" />
              <span>Faculty Remarks:</span>
            </div>
            <p className="line-clamp-1 text-muted-foreground">
              Quantization benchmarks look solid. Proceed with testnet validation.
            </p>
          </div>

          <div className="flex items-center justify-end gap-1.5 pt-0.5">
            <span className="rounded border border-border bg-surface px-2 py-0.5 text-[9px] font-medium text-foreground-secondary">
              Remarks
            </span>
            <span className="rounded bg-primary px-2 py-0.5 text-[9px] font-semibold text-primary-foreground shadow-2xs">
              Approve
            </span>
          </div>
        </div>
      ),
    },
    {
      number: "03",
      phase: "Preserve",
      title: "Permanent Archive & Discovery",
      description:
        "Approved capstones enter the permanent multi-year institutional catalog, accessible for student discovery and institutional accreditation.",
      icon: Archive,
      renderVisual: () => (
        <div className="rounded-xl border border-border bg-surface-secondary/40 p-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              AI & Machine Learning
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-semibold text-success-700 border border-success-200">
              <CheckCircle2 className="h-3 w-3" />
              Archived
            </span>
          </div>

          <h4 className="text-xs font-bold text-foreground line-clamp-1">
            Campus Vision Assistant
          </h4>

          <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[10px]">
            <span className="text-muted-foreground font-mono">2025–26</span>
            <div className="flex items-center gap-1">
              <span className="rounded bg-surface px-1.5 py-0.2 font-medium text-foreground-secondary border border-border/60">
                React
              </span>
              <span className="rounded bg-surface px-1.5 py-0.2 font-medium text-foreground-secondary border border-border/60">
                PyTorch
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-border bg-background py-16 md:py-28 transition-colors"
      aria-label="Platform Workflow"
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
            Platform Workflow
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            A continuous lifecycle from submission to preservation.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Designed to replace lost emails and ad-hoc drive links with a standardized, audit-ready institutional workflow.
          </p>
        </motion.div>

        {/* 3-Stage Connected Workflow Cards */}
        <div className="relative">
          {/* Horizontal Connecting Spine on Desktop (md+) */}
          <div
            className="absolute top-1/2 left-12 right-12 -translate-y-1/2 h-0.5 border-t-2 border-dashed border-border-strong hidden md:block"
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-nexora-sm space-y-5 transition-all duration-200 hover:border-border-strong hover:shadow-nexora-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary px-2.5 py-0.5 rounded-md bg-primary-50 border border-primary/20">
                        PHASE {step.number}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary text-primary border border-border/70">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-foreground">
                      {step.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Authentic Visual Fragment */}
                  <div>
                    {step.renderVisual()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
