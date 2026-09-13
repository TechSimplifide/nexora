import { Building, ShieldCheck, FolderKanban, Users, Lock, Layers } from "lucide-react";
import { motion } from "motion/react";

/**
 * MultiCollegeSection
 * Section 6: Built for Multiple Institutions
 * Explains Nexora's clean, multi-tenant architecture where colleges operate
 * independently while powered by a shared, secure platform foundation.
 */
function MultiCollegeSection() {
  const tenants = [
    {
      id: "01",
      name: "Faculty of Engineering",
      code: "ENG-2026",
      students: "640",
      projects: "248",
      reviewers: "18",
      scope: "Private Archive",
    },
    {
      id: "02",
      name: "School of Computing",
      code: "COMP-902",
      students: "420",
      projects: "176",
      reviewers: "12",
      scope: "Private Archive",
    },
    {
      id: "03",
      name: "Institute of Technology",
      code: "TECH-550",
      students: "310",
      projects: "124",
      reviewers: "9",
      scope: "Private Archive",
    },
  ];

  return (
    <section
      id="for-colleges"
      className="scroll-mt-20 border-t border-border bg-surface py-16 md:py-28 transition-colors"
      aria-label="Multi-Tenant Architecture"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto max-w-3xl text-center mb-12 md:mb-16"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            Built for Multiple Institutions
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            One platform. Dedicated institutional workspaces.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed text-balance">
            Every college operates inside its own isolated Nexora workspace with private project archives, scoped student rosters, and role-based permissions.
          </p>
        </motion.div>

        {/* Visual Multi-Tenant SaaS Workspace Hierarchy */}
        <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-background/50 p-5 sm:p-8 lg:p-10 shadow-nexora-sm">
          {/* Top Platform Core Node */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mx-auto max-w-md text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-xl border border-primary/30 bg-surface px-5 py-3 shadow-nexora-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                <Layers className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">One Nexora Platform</p>
                <p className="text-[11px] text-muted-foreground">
                  Multi-tenant isolation & institutional scoping layer
                </p>
              </div>
            </div>
          </motion.div>

          {/* Desktop Clean Orthogonal Hierarchy Connectors */}
          <div className="relative my-6 hidden md:block select-none" aria-hidden="true">
            {/* Center Drop Stem */}
            <div className="mx-auto h-5 w-px bg-border-strong" />
            {/* Horizontal Distribution Line */}
            <div className="mx-auto w-[68%] border-t border-border-strong" />
            {/* 3 Column Drop Stems directly aligned with cards */}
            <div className="grid grid-cols-3 mx-auto w-[68%]">
              <div className="h-5 w-px bg-border-strong -ml-px justify-self-start" />
              <div className="h-5 w-px bg-border-strong justify-self-center" />
              <div className="h-5 w-px bg-border-strong -mr-px justify-self-end" />
            </div>
          </div>

          {/* Mobile Vertical Indicator */}
          <div className="my-4 flex items-center justify-center md:hidden" aria-hidden="true">
            <div className="h-6 w-px bg-border-strong" />
          </div>

          {/* 3 Isolated Tenant Workspaces */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {tenants.map((tenant, idx) => (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-4 transition-all duration-200 hover:border-border-strong hover:shadow-nexora-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-50 text-primary text-[11px] font-bold border border-primary/20">
                      {tenant.id}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-bold text-success-700 border border-success-200">
                      <Lock className="h-2.5 w-2.5" />
                      Tenant Workspace
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                      <h3 className="text-sm font-bold text-foreground truncate">
                        {tenant.name}
                      </h3>
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      Tenant Scope: {tenant.code}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border/70 pt-3 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FolderKanban className="h-3.5 w-3.5 text-primary shrink-0" /> Archive Scope
                    </span>
                    <span className="font-semibold text-foreground">{tenant.projects} Projects</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary shrink-0" /> Student Roster
                    </span>
                    <span className="font-semibold text-foreground">{tenant.students} Enrolled</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" /> Reviewers
                    </span>
                    <span className="font-semibold text-foreground">{tenant.reviewers} Active</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MultiCollegeSection;
