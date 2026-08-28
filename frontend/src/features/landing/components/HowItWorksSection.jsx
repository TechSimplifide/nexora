import { FilePlus2, ClipboardCheck, Archive } from "lucide-react";

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      phase: "Submit",
      title: "Students submit proposals & projects",
      description:
        "Students draft structured proposals with team rosters, abstracts, technology tags, and supporting PDFs.",
      icon: FilePlus2,
    },
    {
      number: "02",
      phase: "Review",
      title: "Faculty evaluate & approve",
      description:
        "Administrators inspect abstracts in-app, provide feedback remarks, and approve or reject submissions.",
      icon: ClipboardCheck,
    },
    {
      number: "03",
      phase: "Preserve",
      title: "Institutional archive & discovery",
      description:
        "Approved projects become part of the permanent searchable collection for accreditation and student discovery.",
      icon: Archive,
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-border bg-background py-16 md:py-28 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-18">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            Platform Workflow
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            A continuous lifecycle from submission to preservation.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Designed to replace ad-hoc forms and lost drive links with a standardized institutional workflow.
          </p>
        </div>

        {/* 3-Step Horizontal Sequence (Desktop) / Vertical (Mobile) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-nexora-sm transition-all hover:border-border-strong hover:shadow-nexora-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary-50 border border-primary/20">
                      PHASE {step.number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-secondary text-primary border border-border/70">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 text-xs font-semibold text-foreground-secondary flex items-center gap-1.5">
                  <span className="capitalize">{step.phase} Phase</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
