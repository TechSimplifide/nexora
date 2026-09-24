import { useState } from "react";
import { GraduationCap, ShieldCheck, Check, Building } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import StudentWorkspacePreview from "./product-preview/StudentWorkspacePreview";
import AdminWorkspacePreview from "./product-preview/AdminWorkspacePreview";

// Section 4: Two purpose-built workspaces (Students vs Institutions).
function WorkspacesSection() {
  const [activeRole, setActiveRole] = useState("student"); // "student" | "admin"

  const studentFeatures = [
    "Discover previous capstones & tech stacks",
    "Receive AI project recommendations",
    "Submit and track proposal milestones",
    "Manage contributions & request asset access",
  ];

  const adminFeatures = [
    "Centralized proposal review queue",
    "AI-assisted criteria evaluation & scoring",
    "Departmental scopes & student rosters",
    "Permanent institutional project archive",
  ];

  return (
    <section
      id="workspaces"
      className="scroll-mt-20 border-t border-border bg-surface py-16 md:py-28 transition-colors"
      aria-label="Platform Workspaces"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center mb-10 md:mb-14"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            Purpose-Built Workspaces
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            One platform. Two purpose-built workspaces.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed text-balance">
            Tailored interfaces engineered for the distinct workflows of students building projects and faculty administrators governing them.
          </p>
        </motion.div>

        {/* Lightweight 2-Column Comparison Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto">
          {/* Students Column */}
          <div
            onClick={() => setActiveRole("student")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveRole("student");
              }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={activeRole === "student"}
            className={`cursor-pointer rounded-xl p-5 transition-all duration-200 ${
              activeRole === "student"
                ? "bg-surface-secondary/70 border border-primary/40 ring-1 ring-primary/20 shadow-2xs"
                : "bg-transparent border border-border/70 hover:bg-surface-secondary/40 opacity-80 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">For Students</h3>
                  <p className="text-[11px] text-muted-foreground">Discovery, Proposals & Execution</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                activeRole === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}>
                {activeRole === "student" ? "Active Preview" : "Click to view"}
              </span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-foreground-secondary pt-1">
              {studentFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-1.5">
                  <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutions Column */}
          <div
            onClick={() => setActiveRole("admin")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveRole("admin");
              }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={activeRole === "admin"}
            className={`cursor-pointer rounded-xl p-5 transition-all duration-200 ${
              activeRole === "admin"
                ? "bg-surface-secondary/70 border border-primary/40 ring-1 ring-primary/20 shadow-2xs"
                : "bg-transparent border border-border/70 hover:bg-surface-secondary/40 opacity-80 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">For Institutions</h3>
                  <p className="text-[11px] text-muted-foreground">Governance, Review & Preservation</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                activeRole === "admin" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}>
                {activeRole === "admin" ? "Active Preview" : "Click to view"}
              </span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-foreground-secondary pt-1">
              {adminFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-1.5">
                  <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Strong Single Product Preview Frame */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl rounded-2xl border border-border bg-surface shadow-nexora-md overflow-hidden"
        >
          {/* Top Browser / Window Chrome */}
          <div className="flex items-center justify-between border-b border-border bg-surface-secondary/70 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="h-2.5 w-2.5 rounded-full bg-border-strong/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-border-strong/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-border-strong/70" />
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                <span className="text-xs font-semibold text-foreground truncate">
                  Faculty of Engineering
                </span>
                <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                  • app.nexora.edu / {activeRole}
                </span>
              </div>
            </div>

            {/* Quick Segmented Toggle */}
            <div className="flex items-center rounded-lg border border-border bg-surface p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveRole("student")}
                className={`rounded-md px-3 py-1 text-[11px] font-semibold transition-colors ${
                  activeRole === "student"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Student View
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("admin")}
                className={`rounded-md px-3 py-1 text-[11px] font-semibold transition-colors ${
                  activeRole === "admin"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Admin View
              </button>
            </div>
          </div>

          {/* Canvas Preview Area */}
          <div className="p-4 sm:p-6 lg:p-7 bg-background/50">
            <AnimatePresence mode="wait">
              {activeRole === "student" ? (
                <motion.div
                  key="student"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <StudentWorkspacePreview />
                </motion.div>
              ) : (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <AdminWorkspacePreview />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default WorkspacesSection;
