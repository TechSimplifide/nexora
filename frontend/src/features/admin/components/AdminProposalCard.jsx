import {
  FileText,
  Clock,
  User,
  Users,
  CheckCircle2,
  XCircle,
  Mail,
  Calendar,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/date";

function AdminProposalCard({
  proposal,
  onViewAbstract,
  onInitiateApprove,
  onInitiateReject,
}) {
  const creatorName = (proposal.createdBy?.fullName || "").trim().toLowerCase();
  const rawMembers = Array.isArray(proposal.team?.members)
    ? proposal.team.members
    : [];

  // Deduplicate creator from members list if present (handles legacy records)
  const additionalMembers = rawMembers.filter((m) => {
    const name = (m.name || "").trim().toLowerCase();
    return name && name !== creatorName;
  });

  const totalTeamCount =
    proposal.team?.size || Math.max(1, 1 + additionalMembers.length);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm transition-all hover:border-border-strong hover:shadow-nexora-md space-y-5">
      {/* Header: Title, Pending Badge, Submission Date & Team Size */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2.5 py-0.5 text-xs font-semibold text-warning-800 border border-warning-200">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Pending Review
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Users className="h-3 w-3" aria-hidden="true" />
              {totalTeamCount === 1
                ? "Individual Project"
                : `${totalTeamCount} Members Total`}
            </span>
            {proposal.createdAt && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                Submitted {formatDate(proposal.createdAt)}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl leading-snug">
            {proposal.title || "Untitled Proposal"}
          </h3>
        </div>
      </div>

      {/* Student Creator & Team Information */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1 border-t border-border/70 text-xs">
        {/* Creator Info */}
        <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Lead Student / Creator</span>
          </div>
          <div className="space-y-1 pl-5">
            <p className="font-semibold text-foreground">
              {proposal.createdBy?.fullName || "Student Lead"}
            </p>
            {proposal.createdBy?.email && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{proposal.createdBy.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="rounded-xl border border-border/70 bg-surface-secondary/40 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Project Team</span>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              {additionalMembers.length === 0
                ? "Individual Project"
                : additionalMembers.length === 1
                ? "1 Additional Member"
                : `${additionalMembers.length} Additional Members`}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pl-5 pt-0.5">
            {additionalMembers.length > 0 ? (
              additionalMembers.map((member, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-border/80 bg-surface px-2 py-0.5 text-[11px] font-medium text-foreground"
                >
                  {member.name || `Member ${idx + 1}`}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-muted-foreground">
                No additional members
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions: View Abstract, Reject, Approve */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-border/80">
        {/* View Abstract Button */}
        {proposal.abstractPdf?.url ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onViewAbstract(proposal)}
            className="gap-2 text-xs font-semibold self-start sm:self-auto"
          >
            <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>View Abstract</span>
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            No abstract attached
          </span>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onInitiateReject(proposal)}
            className="gap-1.5 text-xs font-semibold bg-danger-50 text-danger-700 hover:bg-danger-100 hover:text-danger-800 border border-danger-200"
          >
            <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reject</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onInitiateApprove(proposal)}
            className="gap-1.5 text-xs font-semibold bg-success-600 hover:bg-success-700 text-white"
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Approve</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminProposalCard;
