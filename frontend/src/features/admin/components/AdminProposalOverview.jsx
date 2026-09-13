import { FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { motion } from "motion/react";

function AdminProposalOverview({ data = {} }) {
  const pending = Number(data?.pending) || 0;
  const approved = Number(data?.approved) || 0;
  const rejected = Number(data?.rejected) || 0;
  const total = pending + approved + rejected;

  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;
  const approvedPct = total > 0 ? Math.round((approved / total) * 100) : 0;
  const rejectedPct = total > 0 ? Math.round((rejected / total) * 100) : 0;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-nexora-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            Proposal Overview
          </h2>
          <p className="text-xs text-muted-foreground">
            Current project proposal review status and distribution.
          </p>
        </div>
        {total > 0 && (
          <span className="text-xs font-semibold text-foreground px-2.5 py-0.5 rounded-md bg-surface-secondary border border-border/60 shrink-0">
            <span className="font-bold text-foreground">{total}</span>{" "}
            <span className="text-muted-foreground font-medium">
              {total === 1 ? "Total Submission" : "Total Submissions"}
            </span>
          </span>
        )}
      </div>

      {total > 0 ? (
        <div className="space-y-4 pt-1">
          {/* Segmented Distribution Bar */}
          <div className="space-y-1.5">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-secondary border border-border/60">
              {approved > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(approved / total) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-success-500"
                  title={`Approved: ${approved} (${approvedPct}%)`}
                />
              )}
              {pending > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(pending / total) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                  className="bg-warning-500"
                  title={`Pending: ${pending} (${pendingPct}%)`}
                />
              )}
              {rejected > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(rejected / total) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                  className="bg-danger-500"
                  title={`Rejected: ${rejected} (${rejectedPct}%)`}
                />
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
              <span>{approvedPct}% Approved</span>
              <span>{pendingPct}% Pending</span>
              <span>{rejectedPct}% Rejected</span>
            </div>
          </div>

          {/* Clean Metric Row */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-border/60">
            {/* Approved */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-surface-secondary/40 border border-border/50 py-2.5 px-2 text-center transition-colors">
              <div className="flex items-center gap-1 text-[11px] font-medium text-foreground-secondary mb-0.5">
                <CheckCircle2 className="h-3 w-3 shrink-0 text-success-600" aria-hidden="true" />
                <span>Approved</span>
              </div>
              <span className="text-xl font-bold text-success-600">
                {approved}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {approvedPct}% of total
              </span>
            </div>

            {/* Pending */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-surface-secondary/40 border border-border/50 py-2.5 px-2 text-center transition-colors">
              <div className="flex items-center gap-1 text-[11px] font-medium text-foreground-secondary mb-0.5">
                <Clock className="h-3 w-3 shrink-0 text-warning-600" aria-hidden="true" />
                <span>Pending</span>
              </div>
              <span className="text-xl font-bold text-warning-600">
                {pending}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {pendingPct}% of total
              </span>
            </div>

            {/* Rejected */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-surface-secondary/40 border border-border/50 py-2.5 px-2 text-center transition-colors">
              <div className="flex items-center gap-1 text-[11px] font-medium text-foreground-secondary mb-0.5">
                <XCircle className="h-3 w-3 shrink-0 text-danger-600" aria-hidden="true" />
                <span>Rejected</span>
              </div>
              <span className="text-xl font-bold text-danger-600">
                {rejected}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {rejectedPct}% of total
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-muted-foreground space-y-1.5 border border-dashed border-border/70 rounded-lg">
          <FileText className="h-7 w-7 text-muted-foreground/60" />
          <p className="font-semibold text-foreground">
            No proposal records submitted yet
          </p>
          <p className="text-[11px] text-muted-foreground">
            Proposal reviews and status distributions will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminProposalOverview;
