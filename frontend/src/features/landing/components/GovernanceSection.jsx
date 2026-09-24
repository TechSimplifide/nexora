import { Building, Lock, ClipboardCheck, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

// Section 7: Institutional Trust & Governance.
function GovernanceSection() {
  const principles = [
    {
      number: "01",
      title: "College Isolation",
      tag: "Tenant Scoped",
      description:
        "Each institution operates within its own college-scoped workspace and project context.",
      icon: Building,
    },
    {
      number: "02",
      title: "Permission-Based Access",
      tag: "Access Governed",
      description:
        "Protected project details and resources can require an explicit access request and approval.",
      icon: Lock,
    },
    {
      number: "03",
      title: "Controlled Proposal Approval",
      tag: "Auditable Trail",
      description:
        "Proposal status, reviewer information, remarks, and timestamps provide a clear approval trail.",
      icon: ClipboardCheck,
    },
  ];

  return (
    <section
      id="why-nexora"
      className="scroll-mt-20 border-t border-border bg-background py-16 md:py-24 transition-colors"
      aria-label="Institutional Trust"
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
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            Institutional Trust
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            How Nexora maintains institutional control.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed text-balance">
            The multi-tenant isolation, access controls, and auditable approval workflows colleges require for academic project governance.
          </p>
        </motion.div>

        {/* Vertically Stacked Framework Rows */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-surface shadow-nexora-sm overflow-hidden divide-y divide-border">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.08, ease: "easeOut" }}
                className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-secondary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Number & Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-secondary text-primary border border-border/70">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        {item.number}
                      </span>
                      <h3 className="text-base font-bold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Supporting Status Tag */}
                <div className="self-end sm:self-center shrink-0">
                  <span className="inline-flex items-center gap-1 rounded-md bg-surface-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground-secondary border border-border/60">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {item.tag}
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

export default GovernanceSection;
