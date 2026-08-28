import { useState } from "react";
import { ShieldCheck, GraduationCap, Building } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import StudentWorkspacePreview from "./product-preview/StudentWorkspacePreview";
import AdminWorkspacePreview from "./product-preview/AdminWorkspacePreview";

/**
 * ProductPreview (Product Experience Showcase)
 * One platform. Two purpose-built workspaces.
 * Interactive, high-fidelity visual demonstration of authentic Student and Admin workspaces.
 */
function ProductPreview() {
  const [activeRole, setActiveRole] = useState("student"); // "student" | "admin"

  // Accessible keyboard navigation for role tabs (ArrowLeft, ArrowRight, Home, End)
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const nextRole = activeRole === "student" ? "admin" : "student";
      setActiveRole(nextRole);
      const nextTab = document.getElementById(`tab-${nextRole}`);
      if (nextTab) nextTab.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveRole("student");
      const tab = document.getElementById("tab-student");
      if (tab) tab.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveRole("admin");
      const tab = document.getElementById("tab-admin");
      if (tab) tab.focus();
    }
  };

  return (
    <section
      id="product"
      className="scroll-mt-20 border-t border-border bg-surface py-16 md:py-28 transition-colors"
      aria-label="Product Experience"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-10 md:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            Product Experience
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            One platform. Two purpose-built workspaces.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Experience the actual workflows built for colleges — from AI-guided idea discovery and student proposal tracking to institutional faculty approvals and curriculum analytics.
          </p>

          {/* Accessible Role Switcher Tabs */}
          <div
            role="tablist"
            aria-label="Select workspace role"
            onKeyDown={handleKeyDown}
            className="mt-8 inline-flex rounded-xl border border-border bg-surface-secondary p-1 shadow-2xs"
          >
            <button
              type="button"
              role="tab"
              id="tab-student"
              aria-selected={activeRole === "student"}
              aria-controls="tabpanel-student"
              tabIndex={activeRole === "student" ? 0 : -1}
              onClick={() => setActiveRole("student")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeRole === "student"
                  ? "bg-surface text-foreground shadow-nexora-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Student Workspace</span>
            </button>

            <button
              type="button"
              role="tab"
              id="tab-admin"
              aria-selected={activeRole === "admin"}
              aria-controls="tabpanel-admin"
              tabIndex={activeRole === "admin" ? 0 : -1}
              onClick={() => setActiveRole("admin")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeRole === "admin"
                  ? "bg-surface text-foreground shadow-nexora-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Administrator Workspace</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Role UI Window */}
        <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-surface shadow-nexora-md overflow-hidden transition-all duration-300">
          {/* Top Browser / Application Chrome Bar */}
          <div className="flex items-center justify-between border-b border-border bg-surface-secondary/70 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="h-3 w-3 rounded-full bg-border-strong/70" />
                <div className="h-3 w-3 rounded-full bg-border-strong/70" />
                <div className="h-3 w-3 rounded-full bg-border-strong/70" />
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                <span className="text-xs font-semibold text-foreground truncate max-w-[160px] sm:max-w-[220px]">
                  Faculty of Engineering
                </span>
                <span className="text-[11px] font-mono text-muted-foreground hidden md:inline">
                  {activeRole === "student"
                    ? "• app.nexora.edu / student / dashboard"
                    : "• app.nexora.edu / admin / dashboard"}
                </span>
              </div>
            </div>

            {/* Context Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-surface px-2.5 py-1 text-[10px] font-bold text-foreground-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              <span>{activeRole === "student" ? "ROLE: STUDENT" : "ROLE: ADMIN"}</span>
            </div>
          </div>

          {/* Unified Workspace Canvas with AnimatePresence */}
          <div className="p-4 sm:p-6 lg:p-7 bg-background/50">
            <AnimatePresence mode="wait">
              {activeRole === "student" ? (
                <motion.div
                  key="student"
                  role="tabpanel"
                  id="tabpanel-student"
                  aria-labelledby="tab-student"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <StudentWorkspacePreview />
                </motion.div>
              ) : (
                <motion.div
                  key="admin"
                  role="tabpanel"
                  id="tabpanel-admin"
                  aria-labelledby="tab-admin"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <AdminWorkspacePreview />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductPreview;
