import { Check } from "lucide-react";

/**
 * ProposalTimelinePreview
 * Compact, accessible 4-stage proposal lifecycle timeline
 * Matches the visual design of StudentProposalCard.jsx
 */
function ProposalTimelinePreview({ status = "APPROVED", activeStageIndex = 3 }) {
  const stages = [
    { id: "submitted", label: "Submitted", state: activeStageIndex >= 0 ? "completed" : "upcoming" },
    { id: "review", label: "Under Review", state: activeStageIndex >= 1 ? "completed" : "upcoming" },
    { id: "approved", label: "Approved", state: activeStageIndex >= 2 ? "completed" : "upcoming" },
    { id: "development", label: "Development", state: activeStageIndex >= 3 ? "current" : "upcoming" },
  ];

  return (
    <div className="space-y-3 pt-3 border-t border-border/70">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Proposal Progress
        </span>
        <span className="text-muted-foreground font-medium text-[11px] hidden sm:inline">
          {status === "APPROVED"
            ? "Your proposal is approved. You're ready to start development."
            : "Your proposal is currently under faculty review."}
        </span>
      </div>

      {/* 1. DESKTOP TIMELINE (Horizontal, sm+) */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Background Track */}
          <div
            className="absolute left-3 right-3 top-3 -translate-y-1/2 h-0.5 bg-border"
            aria-hidden="true"
          />

          {/* Progress Fill */}
          <div
            className="absolute left-3 top-3 -translate-y-1/2 h-0.5 bg-success-500 transition-all duration-500"
            style={{ width: `${(activeStageIndex / (stages.length - 1)) * 100}%` }}
            aria-hidden="true"
          />

          {stages.map((stage) => {
            const isCompleted = stage.state === "completed";
            const isCurrent = stage.state === "current";

            return (
              <div
                key={stage.id}
                className="relative z-10 flex flex-col items-center"
                style={{ width: `${100 / stages.length}%` }}
              >
                {/* Node Circle */}
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : isCurrent
                      ? "border-primary bg-surface text-primary ring-4 ring-primary/15 font-bold"
                      : "border-border-strong bg-surface text-muted-foreground/40"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
                  ) : isCurrent ? (
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-border-strong" />
                  )}
                </div>

                {/* Node Label */}
                <span
                  className={`mt-2 text-center text-xs tracking-tight ${
                    isCurrent
                      ? "font-bold text-foreground"
                      : isCompleted
                      ? "font-semibold text-foreground-secondary"
                      : "font-medium text-muted-foreground"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MOBILE TIMELINE (Vertical, <sm) */}
      <div className="block sm:hidden space-y-2.5">
        {stages.map((stage) => {
          const isCompleted = stage.state === "completed";
          const isCurrent = stage.state === "current";

          return (
            <div key={stage.id} className="flex items-center gap-2.5 text-xs">
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                    ? "border-primary bg-surface text-primary ring-3 ring-primary/15"
                    : "border-border-strong bg-surface"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-3 w-3 stroke-[2.5]" />
                ) : isCurrent ? (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                ) : (
                  <div className="h-1 w-1 rounded-full bg-border-strong" />
                )}
              </div>
              <span
                className={`text-xs ${
                  isCurrent
                    ? "font-bold text-foreground"
                    : isCompleted
                    ? "font-semibold text-foreground-secondary"
                    : "text-muted-foreground"
                }`}
              >
                {stage.label}
              </span>
              {isCurrent && (
                <span className="rounded bg-primary-50 px-1.5 py-0.2 text-[10px] font-bold text-primary border border-primary/20 ml-auto">
                  Active Stage
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProposalTimelinePreview;
