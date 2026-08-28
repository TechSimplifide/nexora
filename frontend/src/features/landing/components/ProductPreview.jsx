import { useState } from "react";
import {
  ShieldCheck,
  GraduationCap,
  FolderKanban,
  CheckCircle2,
  Send,
  Inbox,
  Sparkles,
} from "lucide-react";

function ProductPreview() {
  const [activeRole, setActiveRole] = useState("admin"); // "admin" | "student"

  return (
    <section id="product" className="border-t border-border bg-surface py-16 md:py-28 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-10 md:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Product Experience
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tailored workspaces for students and administrators.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Every user operates with clear role boundaries, targeted insights, and purposeful workflows.
          </p>

          {/* Role Switcher Controls */}
          <div className="mt-8 inline-flex rounded-xl border border-border bg-surface-secondary p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveRole("admin")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeRole === "admin"
                  ? "bg-surface text-foreground shadow-nexora-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Administrator Workspace</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole("student")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeRole === "student"
                  ? "bg-surface text-foreground shadow-nexora-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Student Workspace</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Role UI Window */}
        <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-surface shadow-nexora-md overflow-hidden transition-all duration-300">
          {/* Top Window Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface-secondary/70 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-foreground">
                {activeRole === "admin"
                  ? "Administrator Control Center"
                  : "Student Project Dashboard"}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                {activeRole === "admin"
                  ? "• Real-time Faculty Pipeline"
                  : "• Student Submissions & Catalog"}
              </span>
            </div>

            <span className="rounded-md border border-border/80 bg-surface px-2.5 py-0.5 text-[10px] font-bold text-primary">
              {activeRole === "admin" ? "ROLE: ADMIN" : "ROLE: STUDENT"}
            </span>
          </div>

          {/* Role Content Preview */}
          {activeRole === "admin" ? (
            /* ============================================================ */
            /* 1. ADMINISTRATOR ROLE VIEW                                   */
            /* ============================================================ */
            <div className="p-5 sm:p-7 bg-background/50 space-y-6 animate-in fade-in duration-200">
              {/* Proposal Overview Pipeline Bar */}
              <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Proposal Review Pipeline</h3>
                    <p className="text-xs text-muted-foreground">
                      Current student project submissions distribution
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    42 Total Submissions
                  </span>
                </div>

                {/* Segmented Bar */}
                <div className="space-y-1.5">
                  <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-secondary border border-border/60">
                    <div style={{ width: "62%" }} className="bg-success-500" title="Approved: 62%" />
                    <div style={{ width: "28%" }} className="bg-warning-500" title="Pending: 28%" />
                    <div style={{ width: "10%" }} className="bg-danger-500" title="Rejected: 10%" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-success-500" />
                      26 Approved (62%)
                    </span>
                    <span className="flex items-center gap-1 text-warning-800 font-medium">
                      <span className="h-2 w-2 rounded-full bg-warning-500" />
                      12 Pending (28%)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-danger-500" />
                      4 Rejected (10%)
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-Column Analytics Preview */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Popular Technologies Breakdown */}
                <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Popular Technologies
                    </h4>
                    <span className="text-[11px] text-muted-foreground">Top Curriculum Stacks</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between font-medium text-foreground mb-1">
                        <span>React / TypeScript</span>
                        <span className="text-muted-foreground">42 projects</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
                        <div style={{ width: "85%" }} className="h-full bg-primary rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-medium text-foreground mb-1">
                        <span>Python / PyTorch</span>
                        <span className="text-muted-foreground">36 projects</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
                        <div style={{ width: "72%" }} className="h-full bg-primary/80 rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-medium text-foreground mb-1">
                        <span>Node.js / Express</span>
                        <span className="text-muted-foreground">28 projects</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
                        <div style={{ width: "56%" }} className="h-full bg-primary/70 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trending Domains */}
                <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Trending Domains
                    </h4>
                    <span className="text-[11px] text-muted-foreground">Research Focus</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between font-medium text-foreground mb-1">
                        <span>Artificial Intelligence & ML</span>
                        <span className="text-muted-foreground">48%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
                        <div style={{ width: "48%" }} className="h-full bg-primary rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-medium text-foreground mb-1">
                        <span>Full-Stack Web Systems</span>
                        <span className="text-muted-foreground">32%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
                        <div style={{ width: "32%" }} className="h-full bg-primary/80 rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-medium text-foreground mb-1">
                        <span>Cloud & DevOps Architecture</span>
                        <span className="text-muted-foreground">20%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
                        <div style={{ width: "20%" }} className="h-full bg-primary/70 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* 2. STUDENT ROLE VIEW                                         */
            /* ============================================================ */
            <div className="p-5 sm:p-7 bg-background/50 space-y-5 animate-in fade-in duration-200">
              {/* Student KPI Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-surface p-4 shadow-nexora-sm">
                  <div className="flex items-center justify-between text-muted-foreground mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Contributions</span>
                    <FolderKanban className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="text-xl font-bold text-foreground">2</div>
                  <p className="text-[10px] text-muted-foreground">Active projects</p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-4 shadow-nexora-sm">
                  <div className="flex items-center justify-between text-muted-foreground mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Requests Sent</span>
                    <Send className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xl font-bold text-foreground">3</div>
                  <p className="text-[10px] text-muted-foreground">Peer documents</p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-4 shadow-nexora-sm">
                  <div className="flex items-center justify-between text-muted-foreground mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Requests Received</span>
                    <Inbox className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xl font-bold text-foreground">5</div>
                  <p className="text-[10px] text-muted-foreground">On your projects</p>
                </div>
              </div>

              {/* Active Proposal Card Status */}
              <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Active Proposal Status
                    </span>
                    <h3 className="text-sm font-bold text-foreground mt-0.5">
                      Decentralized Healthcare Record Verification System
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success-200 bg-success-50 px-3 py-1 text-xs font-semibold text-success-700 self-start sm:self-auto">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Approved by Faculty</span>
                  </span>
                </div>

                <div className="rounded-lg border border-border/80 bg-surface-secondary/50 p-3 text-xs text-foreground-secondary">
                  <p className="font-semibold text-muted-foreground mb-0.5">Faculty Remarks:</p>
                  <p className="leading-relaxed">
                    Architecture approved. Proceed with the smart contract testnet deployment and prepare supporting documentation.
                  </p>
                </div>
              </div>

              {/* AI Idea Discovery Notification Card */}
              <div className="rounded-xl border border-border bg-surface p-4 shadow-nexora-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      AI Idea Discovery
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded bg-primary-50 border border-primary/20">
                    3 Matched Directions
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                  <div>
                    <p className="font-semibold text-foreground">
                      3 project directions match your research interests.
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      AI/ML · Python · Computer Vision
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-primary hover:underline cursor-pointer self-start sm:self-auto shrink-0">
                    Explore recommendations →
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductPreview;
