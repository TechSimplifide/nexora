import { Link } from "react-router-dom";
import {
  FileText,
  Users,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Check,
  Circle,
  X,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/date";

function getStatusBadge(status) {
  const normalized = (status || "").toUpperCase();

  switch (normalized) {
    case "APPROVED":
      return {
        label: "Approved",
        icon: CheckCircle2,
        className: "bg-success-50 text-success-700 border-success-200",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        icon: XCircle,
        className: "bg-danger-50 text-danger-700 border-danger-200",
      };
    case "PENDING":
    default:
      return {
        label: normalized === "PENDING" ? "Under Review" : status || "Under Review",
        icon: Clock,
        className: "bg-warning-50 text-warning-800 border-warning-200",
      };
  }
}

/**
 * Compact Proposal Stage Timeline
 * Renders horizontal on desktop (sm+) and vertical on mobile (<sm)
 */
function ProposalTimeline({ status }) {
  const normalized = (status || "").toUpperCase();
  const isRejected = normalized === "REJECTED";
  const isApproved = normalized === "APPROVED";

  // Define stages based on status
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
        {
          id: "development",
          label: "Development",
          state: isApproved ? "current" : "upcoming",
        },
      ];

  return (
    <div className="pt-4 border-t border-border/70">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Proposal Progress
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">
          {isApproved
            ? "Your proposal is approved. You're ready to start development."
            : isRejected
            ? "Your proposal was not approved."
            : "Your proposal is currently under review."}
        </span>
      </div>

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
          <div
            className={`absolute left-3 top-3 -translate-y-1/2 h-0.5 transition-all duration-300 ${
              isRejected
                ? "bg-danger-500"
                : isApproved
                ? "bg-success-500"
                : "bg-primary"
            }`}
            style={{
              width: isRejected
                ? "100%"
                : isApproved
                ? "100%"
                : `${(1 / (stages.length - 1)) * 100}%`,
            }}
            aria-hidden="true"
          />

          {/* Stage Nodes */}
          {stages.map((stage) => {
            const isCompleted = stage.state === "completed";
            const isCurrent = stage.state === "current";
            const isStageRejected = stage.state === "rejected";

            return (
              <div
                key={stage.id}
                className="relative z-10 flex flex-col items-center group"
                style={{ width: `${100 / stages.length}%` }}
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
              </div>
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
            <div key={stage.id} className="relative flex items-start gap-3 pb-3.5 last:pb-0">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudentProposalCard({ proposal }) {
  const hasProposal = Boolean(proposal && proposal.exists);

  return (
    <section aria-labelledby="my-proposal-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2
          id="my-proposal-heading"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          My Proposal
        </h2>

        {hasProposal && (
          <Link
            to="/app/student/proposals"
            className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm flex items-center gap-1"
          >
            <span>View Proposals</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>

      {hasProposal ? (
        <div className="rounded-xl border border-border bg-surface p-5 shadow-nexora-sm sm:p-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2 flex-1">
              {/* Proposal Title */}
              <h3 className="text-lg font-bold text-foreground">
                {proposal.title || "Untitled Proposal"}
              </h3>

              {/* Proposal Metadata */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                {proposal.teamSize ? (
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span>Team of {proposal.teamSize}</span>
                  </div>
                ) : null}

                {proposal.createdAt ? (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    <span>Submitted {formatDate(proposal.createdAt)}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Status Badge */}
            {(() => {
              const badge = getStatusBadge(proposal.status);
              const StatusIcon = badge.icon;
              return (
                <div
                  className={`inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1 text-xs font-semibold ${badge.className}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{badge.label}</span>
                </div>
              );
            })()}
          </div>

          {/* Admin Remarks Box (When Available) */}
          {proposal.adminRemarks && proposal.adminRemarks.trim() ? (
            <div className="rounded-lg border border-border/80 bg-surface-secondary/60 p-3.5 text-xs text-foreground">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground mb-1">
                <MessageSquare className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>Admin Remarks</span>
              </div>
              <p className="leading-relaxed text-foreground-secondary">
                {proposal.adminRemarks}
              </p>
            </div>
          ) : null}

          {/* Proposal Lifecycle Timeline */}
          <ProposalTimeline status={proposal.status} />
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary text-muted-foreground mb-3">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            No project proposal yet
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            Submit your project proposal to start your project journey.
          </p>
          <div className="mt-4">
            <Link to="/app/student/proposals">
              <Button variant="primary" size="sm" className="gap-1.5">
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                <span>Create Proposal</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default StudentProposalCard;
