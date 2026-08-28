import { Building, ShieldCheck, FolderKanban, Users, Lock } from "lucide-react";

function MultiCollegeSection() {
  return (
    <section id="for-colleges" className="border-t border-border bg-surface py-16 md:py-28 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Multi-Tenant Architecture
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            One secure platform. Dedicated college workspaces.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Nexora provides complete tenant isolation. Every college operates within its own private workspace with scoped permissions, students, faculty, and project archives.
          </p>
        </div>

        {/* Visual Multi-Tenant SaaS Workspace Diagram */}
        <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-background p-6 sm:p-10 shadow-nexora-sm">
          {/* Top Platform Core Node */}
          <div className="mx-auto mb-8 max-w-md text-center">
            <div className="inline-flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-5 py-3 shadow-2xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-nexora-sm">
                <Building className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">Nexora Multi-Tenant Core</p>
                <p className="text-[11px] text-muted-foreground">
                  Global infrastructure & authorization layer
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Connecting Hierarchy Indicator */}
          <div className="relative mb-8 hidden md:block" aria-hidden="true">
            <div className="mx-auto h-5 w-0.5 bg-border-strong" />
            <div className="mx-auto w-3/4 border-t-2 border-dashed border-border-strong" />
            <div className="grid grid-cols-3 pt-1 text-center">
              <div className="mx-auto h-4 w-0.5 bg-border-strong" />
              <div className="mx-auto h-4 w-0.5 bg-border-strong" />
              <div className="mx-auto h-4 w-0.5 bg-border-strong" />
            </div>
          </div>

          {/* 3 Isolated Tenant Workspaces */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* College Workspace 1 */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary text-xs font-bold border border-primary/20">
                  01
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-bold text-success-700 border border-success-200">
                  <Lock className="h-2.5 w-2.5" />
                  Isolated Tenant
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground">Engineering Institute</h3>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                  Code: ENG-2026
                </p>
              </div>

              <div className="space-y-2 border-t border-border/70 pt-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <FolderKanban className="h-3.5 w-3.5 text-primary" /> Archive Scope
                  </span>
                  <span className="font-semibold text-foreground">Private</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" /> Student Roster
                  </span>
                  <span className="font-semibold text-foreground">640 Enrolled</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Faculty Team
                  </span>
                  <span className="font-semibold text-foreground">18 Reviewers</span>
                </div>
              </div>
            </div>

            {/* College Workspace 2 */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary text-xs font-bold border border-primary/20">
                  02
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-bold text-success-700 border border-success-200">
                  <Lock className="h-2.5 w-2.5" />
                  Isolated Tenant
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground">Technology Academy</h3>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                  Code: TECH-902
                </p>
              </div>

              <div className="space-y-2 border-t border-border/70 pt-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <FolderKanban className="h-3.5 w-3.5 text-primary" /> Archive Scope
                  </span>
                  <span className="font-semibold text-foreground">Private</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" /> Student Roster
                  </span>
                  <span className="font-semibold text-foreground">420 Enrolled</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Faculty Team
                  </span>
                  <span className="font-semibold text-foreground">12 Reviewers</span>
                </div>
              </div>
            </div>

            {/* College Workspace 3 */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary text-xs font-bold border border-primary/20">
                  03
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-bold text-success-700 border border-success-200">
                  <Lock className="h-2.5 w-2.5" />
                  Isolated Tenant
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground">Polytechnic College</h3>
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                  Code: POLY-550
                </p>
              </div>

              <div className="space-y-2 border-t border-border/70 pt-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <FolderKanban className="h-3.5 w-3.5 text-primary" /> Archive Scope
                  </span>
                  <span className="font-semibold text-foreground">Private</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" /> Student Roster
                  </span>
                  <span className="font-semibold text-foreground">310 Enrolled</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Faculty Team
                  </span>
                  <span className="font-semibold text-foreground">9 Reviewers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MultiCollegeSection;
