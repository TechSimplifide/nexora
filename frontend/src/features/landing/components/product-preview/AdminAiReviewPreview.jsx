import { Sparkles, Check, AlertTriangle, X, ShieldCheck } from "lucide-react";

// Product preview demonstration for AI Proposal Review.
function AdminAiReviewPreview() {
  const criteria = [
    { name: "Clear Problem", result: "PASS", isCustom: false },
    { name: "Technical Depth", result: "PARTIAL", isCustom: false },
    { name: "Working Prototype", result: "FAIL", isCustom: true },
    { name: "Academic Value", result: "PASS", isCustom: false },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-3.5">
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              AI Proposal Review
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              #PR-2026-092
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-foreground">
            Smart Campus Resource Management
          </h4>
        </div>

        {/* Recommendation & Confidence Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 rounded-full border border-warning-200 bg-warning-50 px-2.5 py-1 text-xs font-bold text-warning-800">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            NEEDS IMPROVEMENT
          </span>
          <span className="rounded-md border border-border bg-surface-secondary px-2 py-1 text-[11px] font-semibold text-muted-foreground">
            87% Confidence
          </span>
        </div>
      </div>

      {/* Evaluated Criteria Breakdown Grid */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Evaluated Criteria</span>
          <span className="text-[10px] font-normal lowercase text-muted-foreground">
            college-configured criteria
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {criteria.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between rounded-lg border border-border/70 bg-surface-secondary/40 px-2.5 py-1.5 text-xs"
            >
              <div className="flex items-center gap-1.5 truncate mr-2">
                <span className="font-medium text-foreground text-xs truncate">
                  {c.name}
                </span>
                {c.isCustom && (
                  <span className="rounded bg-primary-50 px-1 py-0.2 text-[9px] font-semibold text-primary">
                    Custom
                  </span>
                )}
              </div>

              {c.result === "PASS" && (
                <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold bg-success-50 text-success-700 border border-success-200 shrink-0">
                  <Check className="h-2.5 w-2.5" /> PASS
                </span>
              )}
              {c.result === "PARTIAL" && (
                <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold bg-warning-50 text-warning-800 border border-warning-200 shrink-0">
                  <AlertTriangle className="h-2.5 w-2.5" /> PARTIAL
                </span>
              )}
              {c.result === "FAIL" && (
                <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold bg-danger-50 text-danger-700 border border-danger-200 shrink-0">
                  <X className="h-2.5 w-2.5" /> FAIL
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation Summary Box */}
      <div className="rounded-lg border border-border/80 bg-surface-secondary/50 p-2.5 sm:p-3 text-xs space-y-1">
        <span className="font-semibold text-muted-foreground text-[11px] block">
          AI Evaluation Summary:
        </span>
        <p className="text-foreground-secondary leading-relaxed text-xs">
          The proposal presents a strong problem domain but requires greater technical depth in backend architecture and a clear milestone for a working prototype.
        </p>
      </div>

      {/* Footer: Advisory Disclaimer + Admin Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-border/70 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
          <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
          <span>AI assists the review. Faculty makes the final decision.</span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="rounded-md border border-danger-200 bg-danger-50 px-2.5 py-1 text-xs font-semibold text-danger-700">
            Reject
          </span>
          <span className="rounded-md bg-success-600 px-2.5 py-1 text-xs font-semibold text-white shadow-2xs">
            Approve
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminAiReviewPreview;
