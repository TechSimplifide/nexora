import { ShieldCheck, Lock, FileCheck2, Archive } from "lucide-react";
import { motion } from "motion/react";

/**
 * WhyNexoraSection
 * 4 institutional trust principles grounded directly in real platform architecture and security capabilities with subtle entrance motion.
 */
function WhyNexoraSection() {
  const trustPrinciples = [
    {
      number: "01",
      title: "Tenant Isolation",
      description:
        "Every college operates inside its own scoped workspace, archive, student roster, and departmental permissions.",
      microLabel: "Dedicated Workspace Boundary",
      icon: Lock,
    },
    {
      number: "02",
      title: "Role-Based Access",
      description:
        "Students and administrators see only the workflows, approval queues, and resources appropriate to their role.",
      microLabel: "Student & Admin Scopes",
      icon: ShieldCheck,
    },
    {
      number: "03",
      title: "In-App Documents",
      description:
        "Technical abstracts and protected resources can be reviewed inside Nexora without unnecessary external downloads.",
      microLabel: "Integrated PDF Viewer",
      icon: FileCheck2,
    },
    {
      number: "04",
      title: "Permanent Archive",
      description:
        "Approved academic projects remain organized as a searchable institutional knowledge base across graduation cycles.",
      microLabel: "Multi-Year Catalog",
      icon: Archive,
    },
  ];

  return (
    <section
      id="trust"
      className="scroll-mt-20 border-t border-border bg-surface py-16 md:py-28 transition-colors"
      aria-label="Institutional Trust"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center mb-12 md:mb-16"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            Institutional Trust
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for institutional governance and data integrity.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Nexora delivers the structure, access controls, and multi-tenant isolation required for academic repositories and accreditation audits.
          </p>
        </motion.div>

        {/* 4 Architectural Trust Cards with Staggered Entrance */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustPrinciples.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 shadow-nexora-sm space-y-4 transition-all duration-200 hover:border-border-strong hover:shadow-nexora-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {item.number}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20">
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <span className="inline-flex items-center rounded-md bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground-secondary border border-border/60">
                    {item.microLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyNexoraSection;
