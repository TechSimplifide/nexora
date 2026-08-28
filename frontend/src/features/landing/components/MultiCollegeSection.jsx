import { Building, ShieldCheck, FolderKanban, Users, Lock, Server } from "lucide-react";
import { motion } from "motion/react";

/**
 * MultiCollegeSection
 * Explains Nexora's isolated multi-tenant architecture and institutional workspace boundary with subtle entrance motion.
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
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center mb-12 md:mb-16"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            Built for Multiple Institutions
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            One platform. Separate institutional workspaces.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Each college operates inside its own isolated Nexora workspace with private project archives, scoped student rosters, and role-based permissions while sharing the same reliable platform infrastructure.
          </p>
        </motion.div>

        {/* Visual Multi-Tenant SaaS Workspace Diagram */}
        <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-background p-5 sm:p-8 lg:p-10 shadow-nexora-sm">
          {/* Top Platform Core Node */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4 }}
            className="mx-auto mb-6 sm:mb-8 max-w-md text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-xl border border-primary/20 bg-primary-50/50 px-5 py-3 shadow-2xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-nexora-sm">
                <Server className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">Nexora Multi-Tenant Core</p>
                <p className="text-[11px] text-muted-foreground">
                  Global infrastructure & isolation authorization layer
                </p>
              </div>
            </div>
          </motion.div>

          {/* Desktop Connecting Hierarchy Diagram */}
          <div className="relative mb-6 hidden md:block select-none" aria-hidden="true">
            <div className="mx-auto h-4 w-0.5 bg-border-strong" />
            <div className="mx-auto w-3/4 border-t border-dashed border-border-strong" />
            <div className="grid grid-cols-3 pt-0.5 text-center">
              <div className="mx-auto h-4 w-0.5 bg-border-strong" />
              <div className="mx-auto h-4 w-0.5 bg-border-strong" />
              <div className="mx-auto h-4 w-0.5 bg-border-strong" />
            </div>
          </div>

          {/* 3 Isolated Tenant Workspaces with Staggered Entrance */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {tenants.map((tenant, idx) => (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-4 transition-all duration-200 hover:border-border-strong hover:shadow-nexora-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary text-xs font-bold border border-primary/20">
                    {tenant.id}
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-bold text-success-700 border border-success-200">
                    <Lock className="h-2.5 w-2.5" />
                    Isolated Tenant
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
                    Scope ID: {tenant.code}
                  </p>
                </div>

                <div className="space-y-2 border-t border-border/70 pt-3 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FolderKanban className="h-3.5 w-3.5 text-primary" /> Archive Scope
                    </span>
                    <span className="font-semibold text-foreground">{tenant.projects} Projects</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" /> Student Roster
                    </span>
                    <span className="font-semibold text-foreground">{tenant.students} Enrolled</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Faculty Reviewers
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
