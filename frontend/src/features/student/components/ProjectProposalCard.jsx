import { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Calendar,
  Trash2,
  Edit3,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import PdfViewerModal from "@/components/common/PdfViewerModal";
import { formatDate } from "@/utils/date";

function ProjectProposalCard({ proposal, onEdit, onInitiateDelete }) {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const status = (proposal.status || "pending").toLowerCase();
  const team = proposal.team || { size: 1, members: [] };
  const creatorName = (proposal.createdBy?.fullName || proposal.creator?.fullName || "").trim().toLowerCase();
  const rawMembers = Array.isArray(team.members) ? team.members : [];
  const additionalMembers = rawMembers.filter((m) => {
    const name = (typeof m === "string" ? m : m?.name || "").trim().toLowerCase();
    return !creatorName || name !== creatorName;
  });
  const teamSize = team.size || Math.max(1, 1 + additionalMembers.length);
  const pdfUrl = proposal.abstractPdf?.url;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-nexora-sm transition-all hover:border-border-strong hover:shadow-nexora-md">
      <div className="space-y-4">
        {/* Header: Title & Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold tracking-tight text-foreground truncate">
              {proposal.title || "Untitled Proposal"}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>{teamSize === 1 ? "Individual Project" : `Team of ${teamSize}`}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {status === "approved" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700 border border-success-200">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Approved
              </span>
            ) : status === "rejected" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-50 px-2.5 py-1 text-xs font-semibold text-danger-700 border border-danger-200">
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-medium text-warning-800 border border-warning-200">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Pending
              </span>
            )}
          </div>
        </div>

        {/* Team Members List */}
        {additionalMembers.length > 0 && (
          <div className="rounded-lg border border-border/70 bg-surface-secondary/40 p-3 space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Additional Team Members ({additionalMembers.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {additionalMembers.map((m, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-foreground border border-border/60 shadow-2xs"
                >
                  {(typeof m === "string" ? m : m.name) || `Member ${idx + 1}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Abstract Document Link */}
        {pdfUrl && (
          <div className="flex items-center justify-between rounded-lg border border-border/70 bg-surface px-3 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary border border-primary/20">
                <FileText className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-foreground truncate">
                Abstract Document (PDF)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label={`View abstract PDF for ${proposal.title}`}
            >
              <span>View Abstract</span>
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Admin Feedback (Rejected only) */}
        {status === "rejected" && proposal.adminRemarks && (
          <div className="rounded-lg border border-danger-200 bg-danger-50/70 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-danger-800">
              <AlertCircle className="h-4 w-4 text-danger-700 shrink-0" aria-hidden="true" />
              <span>Admin Feedback</span>
            </div>
            <p className="text-xs leading-relaxed text-danger-900 whitespace-pre-wrap">
              {proposal.adminRemarks}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-1">
          {proposal.createdAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
              <span>Submitted {formatDate(proposal.createdAt)}</span>
            </div>
          )}

          {proposal.reviewedAt && (
            <div className="flex items-center gap-1">
              <span>
                {status === "approved" ? "Approved" : "Reviewed"}{" "}
                {formatDate(proposal.reviewedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-border/70 flex items-center justify-between">
        {status === "approved" ? (
          <span className="text-xs font-medium text-success-700">
            Proposal Approved
          </span>
        ) : status === "pending" ? (
          <>
            <span className="text-xs text-muted-foreground">
              Awaiting admin review
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onInitiateDelete(proposal)}
              className="gap-1.5 text-xs text-danger-700 hover:bg-danger-50 border-danger-200"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Delete</span>
            </Button>
          </>
        ) : (
          /* status === "rejected" */
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onInitiateDelete(proposal)}
              className="gap-1.5 text-xs text-danger-700 hover:bg-danger-50 border-danger-200"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Delete</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onEdit(proposal)}
              className="gap-1.5 text-xs"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Edit & Resubmit</span>
            </Button>
          </>
        )}
      </div>

      {/* In-App Abstract PDF Modal */}
      {isPdfModalOpen && pdfUrl && (
        <PdfViewerModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          documentUrl={pdfUrl}
          title={`Abstract: ${proposal.title || "Project Proposal"}`}
          subtitle="Submitted Proposal Abstract Document"
          downloadFilename={`Abstract_${proposal.title || "Proposal"}.pdf`}
        />
      )}
    </div>
  );
}

export default ProjectProposalCard;
