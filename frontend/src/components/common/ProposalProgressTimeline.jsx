import { Check, Circle, X } from "lucide-react";
import { motion } from "motion/react";

// 3-stage proposal lifecycle progress timeline (Submitted -> Under Review -> Approved/Rejected).
function ProposalProgressTimeline({
  status = "PENDING",
  showHeader = true,
  subtitle,
  className = "",
}) {
  const normalized = (status || "").toUpperCase();
  const isRejected = normalized === "REJECTED";
  const isApproved = normalized === "APPROVED";

  // 3-stage lifecycle definition based on status
  const stages = isRejected
    ? [
        { id: "submitted", label: "Submitted", state: "completed" },
        { id: "review", label: "Under Review", state: "completed" },
        { id: "rejected", label: "Rejected", state: "rejected" },
      ]
    : [
        { id: "submitted", label: "Submitted", state: "completed" },
        {
          id: "review",
          label: "Under Review",
          state: isApproved ? "completed" : "current",
        },
        {
          id: "approved",
          label: "Approved",
          state: isApproved ? "completed" : "upcoming",
        },
      ];

  const progressTargetWidth = isRejected
    ? "100%"
    : isApproved
    ? "100%"
    : `${(1 / (stages.length - 1)) * 100}%`;

  const defaultSubtitle = isApproved
    ? "Your proposal is approved. You're ready to start development."
    : isRejected
    ? "Your proposal was not approved."
    : "Your proposal is currently under review.";

  return (
    <div className={`pt-4 border-t border-border/70 ${className}`}>
      {showHeader && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Proposal Progress
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            {subtitle ?? defaultSubtitle}
          </span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. DESKTOP TIMELINE (Horizontal, sm and above)                */}
      {/* ============================================================ */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Connecting Line Track */}
          <div
            className="absolute left-3 right-3 top-3 -translate-y-1/2 h-0.5 bg-border"
            aria-hidden="true"
          />

          {/* Active / Completed Colored Progress Line */}
          <motion.div
            className={`absolute left-3 top-3 -translate-y-1/2 h-0.5 ${
              isRejected
                ? "bg-danger-500"
                : isApproved
                ? "bg-success-500"
                : "bg-primary"
            }`}
            initial={{ width: 0 }}
            animate={{ width: progressTargetWidth }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            aria-hidden="true"
          />

          {/* Stage Nodes */}
          {stages.map((stage, idx) => {
            const isCompleted = stage.state === "completed";
            const isCurrent = stage.state === "current";
            const isStageRejected = stage.state === "rejected";

            return (
              <motion.div
                key={stage.id}
                className="relative z-10 flex flex-col items-center group"
                style={{ width: `${100 / stages.length}%` }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
              >
                {/* Node Circle */}
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : isCurrent
                      ? "border-primary bg-surface text-primary ring-4 ring-primary/15 font-bold"
                      : isStageRejected
                      ? "border-danger-600 bg-danger-600 text-white shadow-2xs"
                      : "border-border-strong bg-surface text-muted-foreground/40"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                  ) : isStageRejected ? (
                    <X className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                  ) : isCurrent ? (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  ) : (
                    <Circle className="h-2 w-2 stroke-[1.5]" />
                  )}
                </div>

                {/* Node Label */}
                <span
                  className={`mt-2 text-center text-xs tracking-tight ${
                    isCurrent
                      ? "font-bold text-foreground"
                      : isCompleted
                      ? "font-semibold text-foreground-secondary"
                      : isStageRejected
                      ? "font-bold text-danger-700"
                      : "font-medium text-muted-foreground/70"
                  }`}
                >
                  {stage.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MOBILE TIMELINE (Vertical stack, <sm)                      */}
      {/* ============================================================ */}
      <div className="block sm:hidden space-y-0 relative pl-2">
        {stages.map((stage, idx) => {
          const isCompleted = stage.state === "completed";
          const isCurrent = stage.state === "current";
          const isStageRejected = stage.state === "rejected";
          const isLast = idx === stages.length - 1;

          return (
            <motion.div
              key={stage.id}
              className="relative flex items-start gap-3 pb-3.5 last:pb-0"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
            >
              {/* Vertical Connecting Line */}
              {!isLast && (
                <div
                  className={`absolute left-2.5 top-5 bottom-0 w-0.5 -translate-x-1/2 ${
                    isCompleted && stages[idx + 1]?.state !== "upcoming"
                      ? isRejected
                        ? "bg-danger-500"
                        : "bg-primary"
                      : "bg-border"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Node Circle */}
              <div
                className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all mt-0.5 ${
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                    : isCurrent
                    ? "border-primary bg-surface text-primary ring-3 ring-primary/15"
                    : isStageRejected
                    ? "border-danger-600 bg-danger-600 text-white shadow-2xs"
                    : "border-border-strong bg-surface text-muted-foreground/40"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
                ) : isStageRejected ? (
                  <X className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
                ) : isCurrent ? (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                ) : (
                  <Circle className="h-1.5 w-1.5 stroke-[1.5]" />
                )}
              </div>

              {/* Label & Status Note */}
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span
                    className={`${
                      isCurrent
                        ? "font-bold text-foreground"
                        : isCompleted
                        ? "font-semibold text-foreground-secondary"
                        : isStageRejected
                        ? "font-bold text-danger-700"
                        : "font-medium text-muted-foreground"
                    }`}
                  >
                    {stage.label}
                  </span>

                  {isCurrent && (
                    <span className="rounded bg-primary-50 px-1.5 py-0.2 text-[10px] font-bold text-primary border border-primary/20">
                      Active Stage
                    </span>
                  )}
                  {isStageRejected && (
                    <span className="rounded bg-danger-50 px-1.5 py-0.2 text-[10px] font-bold text-danger-700 border border-danger-200">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default ProposalProgressTimeline;
