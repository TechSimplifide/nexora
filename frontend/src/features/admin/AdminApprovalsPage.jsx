import { useEffect, useState, useCallback } from "react";
import {
  ClipboardCheck,
  RotateCcw,
  Check,
  AlertCircle,
  X,
  Loader2,
  Clock,
} from "lucide-react";
import Button from "@/components/ui/Button";
import {
  getPendingProjectProposals,
  approveProjectProposal,
  rejectProjectProposal,
} from "@/services/projectProposal.service";
import AdminProposalCard from "@/features/admin/components/AdminProposalCard";
import AdminAbstractPdfModal from "@/features/admin/components/AdminAbstractPdfModal";
import AdminProposalRejectModal from "@/features/admin/components/AdminProposalRejectModal";

function AdminApprovalsPage() {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // PDF Viewer Modal State
  const [selectedProposalForPdf, setSelectedProposalForPdf] = useState(null);

  // Approval Confirmation Dialog State
  const [proposalToApprove, setProposalToApprove] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState(null);

  // Rejection Modal State
  const [proposalToReject, setProposalToReject] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);

  // Feedback Notification Banner
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  const fetchPendingProposals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPendingProjectProposals();
      setProposals(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(
        err.message || "Unable to load pending proposals. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await getPendingProjectProposals();
        if (isMounted) {
          setProposals(Array.isArray(response?.data) ? response.data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Unable to load pending proposals. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Approve Confirmation
  const handleConfirmApprove = async () => {
    if (!proposalToApprove?._id) return;
    setIsApproving(true);
    setApproveError(null);

    try {
      await approveProjectProposal(proposalToApprove._id);
      setProposals((prev) =>
        prev.filter((p) => p._id !== proposalToApprove._id)
      );
      setFeedbackBanner({
        type: "success",
        message: `Proposal "${proposalToApprove.title || "Project"}" approved successfully.`,
      });
      setProposalToApprove(null);
      window.dispatchEvent(new CustomEvent("nexora:notifications-updated"));
    } catch (err) {
      setApproveError(
        err.message || "Failed to approve proposal. Please try again."
      );
    } finally {
      setIsApproving(false);
    }
  };

  // Handle Reject Submission
  const handleConfirmReject = async (proposal, adminRemarks) => {
    if (!proposal?._id) return;
    setIsRejecting(true);

    try {
      await rejectProjectProposal({
        proposalId: proposal._id,
        adminRemarks,
      });
      setProposals((prev) => prev.filter((p) => p._id !== proposal._id));
      setFeedbackBanner({
        type: "success",
        message: `Proposal "${proposal.title || "Project"}" has been rejected with feedback.`,
      });
      setProposalToReject(null);
      window.dispatchEvent(new CustomEvent("nexora:notifications-updated"));
    } catch (err) {
      setFeedbackBanner({
        type: "error",
        message:
          err.message || "Failed to reject proposal. Please check inputs and retry.",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header & Status Indicator */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Project Approvals
            </h1>
            {!isLoading && !error && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2.5 py-0.5 text-xs font-semibold text-warning-800 border border-warning-200">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {proposals.length} {proposals.length === 1 ? "Pending" : "Pending"}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Review, approve, or reject student project proposals submitted for faculty evaluation.
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackBanner && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-xs border shadow-xs ${
            feedbackBanner.type === "success"
              ? "bg-success-50 text-success-800 border-success-200"
              : "bg-danger-50 text-danger-800 border-danger-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackBanner.type === "success" ? (
              <Check className="h-4 w-4 text-success-700 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-4 w-4 text-danger-700 shrink-0" aria-hidden="true" />
            )}
            <span className="font-medium">{feedbackBanner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="p-1 rounded-md transition-colors opacity-70 hover:opacity-100"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content States */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-nexora-sm"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 rounded bg-surface-secondary" />
                  <div className="h-6 w-2/3 rounded bg-surface-secondary" />
                </div>
                <div className="h-6 w-24 rounded bg-surface-secondary" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-20 rounded-xl bg-surface-secondary/70" />
                <div className="h-20 rounded-xl bg-surface-secondary/70" />
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border/60">
                <div className="h-8 w-28 rounded bg-surface-secondary" />
                <div className="flex gap-2">
                  <div className="h-8 w-20 rounded bg-surface-secondary" />
                  <div className="h-8 w-20 rounded bg-surface-secondary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-danger-100 bg-surface p-8 text-center shadow-nexora-sm sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-50 text-danger-600 mb-3">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Unable to load pending proposals
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={fetchPendingProposals}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      ) : proposals.length === 0 ? (
        /* Empty State: No proposals pending review */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-700 mb-4 border border-success-200">
            <ClipboardCheck className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            No Pending Proposals
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            There are currently no project proposals waiting for review. New student submissions will appear here automatically.
          </p>
        </div>
      ) : (
        /* Proposals List */
        <div className="space-y-5">
          {proposals.map((proposal) => (
            <AdminProposalCard
              key={proposal._id}
              proposal={proposal}
              onViewAbstract={(p) => setSelectedProposalForPdf(p)}
              onInitiateApprove={(p) => {
                setApproveError(null);
                setProposalToApprove(p);
              }}
              onInitiateReject={(p) => setProposalToReject(p)}
            />
          ))}
        </div>
      )}

      {/* In-App Abstract PDF Viewer Modal */}
      <AdminAbstractPdfModal
        isOpen={Boolean(selectedProposalForPdf)}
        onClose={() => setSelectedProposalForPdf(null)}
        proposal={selectedProposalForPdf}
      />

      {/* Rejection Modal with Remarks */}
      <AdminProposalRejectModal
        isOpen={Boolean(proposalToReject)}
        onClose={() => setProposalToReject(null)}
        onConfirmReject={handleConfirmReject}
        proposal={proposalToReject}
        isSubmitting={isRejecting}
      />

      {/* Approve Confirmation Modal */}
      {proposalToApprove && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="approve-proposal-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-700 border border-success-200">
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setProposalToApprove(null)}
                disabled={isApproving}
                aria-label="Close dialog"
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3
                id="approve-proposal-dialog-title"
                className="text-lg font-bold text-foreground"
              >
                Approve Project Proposal?
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Are you sure you want to approve{" "}
                <strong className="font-semibold text-foreground">
                  &quot;{proposalToApprove.title || "this proposal"}&quot;
                </strong>
                ? This will officially approve the concept and notify the
                student team.
              </p>
            </div>

            {approveError && (
              <div className="rounded-lg bg-danger-50 p-3 text-xs text-danger-800 border border-danger-200">
                {approveError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setProposalToApprove(null)}
                disabled={isApproving}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleConfirmApprove}
                disabled={isApproving}
                className="gap-1.5 text-xs bg-success-600 hover:bg-success-700 text-white min-w-[130px]"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <span>Approve Proposal</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminApprovalsPage;
