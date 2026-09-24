import { useMemo } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Check,
  X,
  Lightbulb,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

// Helper to parse a finding or suggestion string into a title and body.
function parseFindingText(text) {
  if (!text || typeof text !== "string") {
    return { title: null, body: "" };
  }
  const colonIndex = text.indexOf(":");
  if (colonIndex > 0 && colonIndex <= 45) {
    const title = text.slice(0, colonIndex).trim();
    const body = text.slice(colonIndex + 1).trim();
    if (body.length > 0) {
      return { title, body };
    }
  }
  return { title: null, body: text };
}

// Circular progress gauge for AI Confidence score.
function ConfidenceGauge({ score = 0 }) {
  const rawScore = Number(score) || 0;
  const pct = Math.min(
    Math.max(rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore), 0),
    100
  );

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  let strokeColor;
  let label;
  let badgeStyle;

  if (pct >= 80) {
    strokeColor = "stroke-primary";
    label = "High Confidence";
    badgeStyle = "bg-primary-50 text-primary border-primary/20";
  } else if (pct >= 60) {
    strokeColor = "stroke-warning-500";
    label = "Moderate Confidence";
    badgeStyle = "bg-warning-50 text-warning-700 border-warning-200";
  } else {
    strokeColor = "stroke-danger-500";
    label = "Low Confidence";
    badgeStyle = "bg-danger-50 text-danger-700 border-danger-200";
  }

  return (
    <div className="flex items-center gap-4">
      {/* SVG Radial Gauge */}
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          {/* Background track */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            className="stroke-surface-secondary"
            strokeWidth="5"
            fill="none"
          />
          {/* Active progress track */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            className={`${strokeColor} transition-all duration-700 ease-out`}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className="absolute text-sm font-extrabold text-foreground tracking-tight">
          {pct}%
        </span>
      </div>

      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}`}
          >
            {label}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Extracted from document completeness and structured criteria alignment.
        </p>
      </div>
    </div>
  );
}

// Status badge for individual review criteria (PASS, PARTIAL, FAIL).
function CriterionStatusBadge({ result }) {
  const norm = String(result || "").toUpperCase();
  if (norm === "PASS") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-50 text-success-700 border border-success-200 shrink-0">
        <Check className="h-3 w-3" aria-hidden="true" />
        <span>PASS</span>
      </span>
    );
  }
  if (norm === "PARTIAL") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning-50 text-warning-700 border border-warning-200 shrink-0">
        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
        <span>PARTIAL</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger-50 text-danger-700 border border-danger-200 shrink-0">
      <X className="h-3 w-3" aria-hidden="true" />
      <span>FAIL</span>
    </span>
  );
}

// Modernized right-side analysis section for AI Proposal Review.
export function AdminAIReviewAnalysis({ analysisResult }) {
  // Criteria summary metrics
  const criteriaSummary = useMemo(() => {
    const criteria = Array.isArray(analysisResult?.criteriaBreakdown)
      ? analysisResult.criteriaBreakdown
      : [];
    const total = criteria.length;
    const passCount = criteria.filter(
      (c) => String(c.result || "").toUpperCase() === "PASS"
    ).length;
    const partialCount = criteria.filter(
      (c) => String(c.result || "").toUpperCase() === "PARTIAL"
    ).length;
    const failCount = criteria.filter(
      (c) => String(c.result || "").toUpperCase() === "FAIL"
    ).length;

    const passPct = total > 0 ? (passCount / total) * 100 : 0;
    const partialPct = total > 0 ? (partialCount / total) * 100 : 0;
    const failPct = total > 0 ? (failCount / total) * 100 : 0;

    return {
      total,
      passCount,
      partialCount,
      failCount,
      passPct,
      partialPct,
      failPct,
    };
  }, [analysisResult]);

  if (!analysisResult) return null;

  const rawConfidence = Number(analysisResult.confidenceScore) || 0;
  const confidenceScore = rawConfidence <= 1 ? rawConfidence : rawConfidence / 100;

  const reasons = Array.isArray(analysisResult.reasons)
    ? analysisResult.reasons
    : [];
  const suggestions = Array.isArray(analysisResult.improvementSuggestions)
    ? analysisResult.improvementSuggestions
    : [];
  const criteria = Array.isArray(analysisResult.criteriaBreakdown)
    ? analysisResult.criteriaBreakdown
    : [];

  return (
    <div className="space-y-5">
      {/* 1. AI Confidence & Executive Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* AI Confidence Card */}
        <div className="md:col-span-5 rounded-2xl border border-border bg-surface p-5 shadow-nexora-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              AI Confidence
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              Completeness Metric
            </span>
          </div>

          <ConfidenceGauge score={confidenceScore} />

          <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-snug">
            Confidence represents document information depth and structural clarity, not final faculty approval.
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="md:col-span-7 rounded-2xl border border-border bg-surface p-5 shadow-nexora-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Executive Summary
            </h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>AI Document Synthesis</span>
            </span>
          </div>

          <div className="border-l-2 border-primary/40 pl-3.5 py-1">
            <p className="text-xs sm:text-[13px] text-foreground/90 leading-relaxed">
              {analysisResult.summary || "No executive summary provided for this proposal."}
            </p>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Automated synthesis of submitted abstract PDF</span>
            <span className="font-mono text-[10px] text-muted-foreground/80">
              Advisory only
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Evaluation Reasons & Actionable Improvements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Key Evaluation Reasons (Findings) */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-nexora-xs space-y-3.5 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Key Evaluation Reasons
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Why the AI reached this recommendation
              </p>
            </div>
            {reasons.length > 0 && (
              <span className="text-[11px] font-semibold text-muted-foreground px-2 py-0.5 rounded bg-surface-secondary border border-border/60">
                {reasons.length} {reasons.length === 1 ? "Finding" : "Findings"}
              </span>
            )}
          </div>

          {reasons.length > 0 ? (
            <div className="space-y-2.5 flex-1">
              {reasons.map((reason, idx) => {
                const parsed = parseFindingText(reason);
                const findingNumber = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/70 bg-surface-secondary/30 p-3.5 space-y-1.5 transition-all hover:border-border-strong hover:bg-surface-secondary/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-primary bg-primary-50 border border-primary/20 rounded px-1.5 py-0.5 shrink-0">
                        {findingNumber}
                      </span>
                      {parsed.title ? (
                        <h5 className="text-xs font-bold text-foreground leading-snug">
                          {parsed.title}
                        </h5>
                      ) : null}
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed pl-7">
                      {parsed.body}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
              No specific evaluation reasons listed.
            </div>
          )}
        </div>

        {/* Actionable Improvement Suggestions (Next Steps) */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-nexora-xs space-y-3.5 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-warning-600 dark:text-warning-500 shrink-0" aria-hidden="true" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Actionable Improvements
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Recommended next steps for student team
              </p>
            </div>
            {suggestions.length > 0 && (
              <span className="text-[11px] font-semibold text-warning-700 dark:text-warning-400 px-2 py-0.5 rounded bg-warning-50 border border-warning-200">
                {suggestions.length} {suggestions.length === 1 ? "Action" : "Actions"}
              </span>
            )}
          </div>

          {suggestions.length > 0 ? (
            <div className="space-y-2.5 flex-1">
              {suggestions.map((suggestion, idx) => {
                const parsed = parseFindingText(suggestion);
                const stepNumber = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/70 bg-surface-secondary/30 p-3.5 space-y-1.5 transition-all hover:border-border-strong hover:bg-surface-secondary/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-warning-700 dark:text-warning-400 bg-warning-50 border border-warning-200 rounded px-1.5 py-0.5 shrink-0">
                        {stepNumber}
                      </span>
                      {parsed.title ? (
                        <h5 className="text-xs font-bold text-foreground leading-snug">
                          {parsed.title}
                        </h5>
                      ) : null}
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed pl-7">
                      {parsed.body}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
              No specific improvements required for this proposal.
            </div>
          )}
        </div>
      </div>

      {/* 3. Institutional Criteria Breakdown Matrix */}
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-nexora-xs space-y-4">
        {/* Header & Aggregate Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              <h4 className="text-sm font-bold tracking-tight text-foreground">
                Institutional Criteria Breakdown
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Evaluation against academic standards configured for your college.
            </p>
          </div>

          {criteriaSummary.total > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-surface-secondary border border-border text-foreground">
                <span className="text-primary font-extrabold">
                  {criteriaSummary.passCount} / {criteriaSummary.total}
                </span>
                <span className="text-muted-foreground font-medium">
                  Criteria Passed
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Aggregate Distribution Bar */}
        {criteriaSummary.total > 0 && (
          <div className="space-y-2 rounded-xl border border-border/60 bg-surface-secondary/30 p-3">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-secondary border border-border/40">
              {criteriaSummary.passPct > 0 && (
                <div
                  className="bg-success-500 transition-all duration-500"
                  style={{ width: `${criteriaSummary.passPct}%` }}
                  title={`${criteriaSummary.passCount} Passed`}
                />
              )}
              {criteriaSummary.partialPct > 0 && (
                <div
                  className="bg-warning-500 transition-all duration-500"
                  style={{ width: `${criteriaSummary.partialPct}%` }}
                  title={`${criteriaSummary.partialCount} Partial`}
                />
              )}
              {criteriaSummary.failPct > 0 && (
                <div
                  className="bg-danger-500 transition-all duration-500"
                  style={{ width: `${criteriaSummary.failPct}%` }}
                  title={`${criteriaSummary.failCount} Failed`}
                />
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground pt-0.5">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full bg-success-500 shrink-0" />
                  <span>{criteriaSummary.passCount} Passed</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full bg-warning-500 shrink-0" />
                  <span>{criteriaSummary.partialCount} Partial</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <span className="h-2 w-2 rounded-full bg-danger-500 shrink-0" />
                  <span>{criteriaSummary.failCount} Failed</span>
                </span>
              </div>

              <span className="text-[10px] text-muted-foreground/80">
                {criteriaSummary.total} Standards Evaluated
              </span>
            </div>
          </div>
        )}

        {/* Criteria Evaluation Matrix */}
        {criteria.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {criteria.map((crit, idx) => {
              const norm = String(crit.result || "").toUpperCase();
              let StatusIcon = CheckCircle2;
              let iconColor = "text-success-600";
              if (norm === "PARTIAL") {
                StatusIcon = AlertTriangle;
                iconColor = "text-warning-600";
              } else if (norm === "FAIL") {
                StatusIcon = XCircle;
                iconColor = "text-danger-600";
              }

              return (
                <div
                  key={crit.key || idx}
                  className="rounded-xl border border-border/80 bg-surface-secondary/30 p-3.5 space-y-2 transition-all hover:border-border-strong hover:bg-surface-secondary/50 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <StatusIcon
                        className={`h-4 w-4 shrink-0 ${iconColor}`}
                        aria-hidden="true"
                      />
                      <span className="text-xs font-bold text-foreground truncate">
                        {crit.name || crit.key || `Criterion ${idx + 1}`}
                      </span>
                      {crit.isCustom && (
                        <span className="rounded bg-primary-50 px-1.5 py-0.2 text-[9px] font-semibold text-primary border border-primary/20 shrink-0">
                          Custom
                        </span>
                      )}
                    </div>
                    <CriterionStatusBadge result={crit.result} />
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                    {crit.reason || "No detailed remarks provided."}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground">
            No institutional criteria breakdown available.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAIReviewAnalysis;
