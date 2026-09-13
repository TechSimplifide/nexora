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
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/date";
import ProposalProgressTimeline from "@/components/common/ProposalProgressTimeline";

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
          <ProposalProgressTimeline status={proposal.status} />
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
            <Link to="/app/student/proposals/new">
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
