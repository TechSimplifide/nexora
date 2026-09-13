import {
  Users,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  Archive,
  Compass,
} from "lucide-react";
import { motion } from "motion/react";

/**
 * ProductValueSection
 * Section 2: Platform Mental Model
 * A continuous project journey diagram communicating how academic work
 * moves through Nexora from student team formulation to permanent institutional discovery.
 */
function ProductValueSection() {
  const steps = [
    {
      number: "01",
      title: "Team",
      description: "Students form their team and define the project idea.",
      icon: Users,
    },
    {
      number: "02",
      title: "Proposal",
      description: "Submit the project proposal with team details and abstract PDF.",
      icon: FileText,
    },
    {
      number: "03",
      title: "Institutional Review",
      description: "Administrators review proposals, with AI-assisted evaluation available.",
      icon: ClipboardCheck,
    },
    {
      number: "04",
      title: "Approval",
      description: "Administrators approve or reject proposals and provide remarks.",
      icon: CheckCircle2,
    },
    {
      number: "05",
      title: "Project Archive",
      description: "Approved projects are preserved as a searchable institutional archive.",
      icon: Archive,
    },
    {
      number: "06",
      title: "Discovery & Recommendations",
      description: "Students explore archived work and receive AI-generated project recommendations.",
      icon: Compass,
    },
  ];

  return (
    <section
      id="platform"
      className="scroll-mt-20 border-t border-border bg-surface py-16 md:py-24 transition-colors"
      aria-label="Platform Mental Model"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center mb-12 md:mb-16"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            Platform Mental Model
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            How a project moves through Nexora.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed text-balance">
            From initial team formation to permanent institutional preservation, Nexora coordinates every milestone of the capstone journey in one continuous workflow.
          </p>
        </motion.div>

        {/* Continuous Workflow Journey Container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-6xl rounded-2xl border border-border bg-background/50 p-6 sm:p-8 lg:p-10 shadow-nexora-sm"
        >
          {/* Desktop Horizontal Connected Journey (lg+) */}
          <div className="hidden lg:grid lg:grid-cols-6 lg:gap-4 relative">
            {/* Horizontal Continuous Connecting Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute top-6 left-10 right-10 h-0.5 bg-border-strong origin-left -z-0"
              aria-hidden="true"
            />

            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.08, ease: "easeOut" }}
                  className="relative z-10 flex flex-col items-center text-center space-y-3 px-1"
                >
                  {/* Step Milestone Node */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-2xs transition-transform hover:scale-105">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  {/* Milestone Content */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        {item.number}
                      </span>
                      <h3 className="text-xs font-bold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[170px] mx-auto">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile & Tablet Vertical Connected Timeline (< lg) */}
          <div className="relative space-y-6 lg:hidden pl-2">
            {/* Vertical Continuous Connecting Track */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute top-5 bottom-5 left-6 w-0.5 bg-border-strong origin-top -z-0"
              aria-hidden="true"
            />

            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, delay: idx * 0.06, ease: "easeOut" }}
                  className="relative z-10 flex items-start gap-4"
                >
                  {/* Step Milestone Node */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-2xs">
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </div>

                  {/* Milestone Content */}
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        {item.number}
                      </span>
                      <h3 className="text-sm font-bold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ProductValueSection;
