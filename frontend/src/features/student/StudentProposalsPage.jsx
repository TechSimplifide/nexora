import { useEffect, useState, useCallback, useMemo } from "react";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  X,
  Check,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import {
  getMyProjectProposals,
  deleteProjectProposal,
} from "@/services/projectProposal.service";
import ProjectProposalCard from "@/features/student/components/ProjectProposalCard";
import ProjectProposalModal from "@/features/student/components/ProjectProposalModal";

function StudentProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalToEdit, setProposalToEdit] = useState(null);

  // Deletion Confirmation State
  const [proposalToDelete, setProposalToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Feedback Notification Banner
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  const fetchProposals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyProjectProposals();
      setProposals(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(
        err.message || "Unable to load your proposals. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await getMyProjectProposals();
        if (isMounted) {
          setProposals(Array.isArray(response?.data) ? response.data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Unable to load your proposals. Please try again."
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

  // Filter Counts
  const counts = useMemo(() => {
    const total = proposals.length;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    proposals.forEach((p) => {
      const status = (p.status || "pending").toLowerCase();
      if (status === "approved") approved += 1;
      else if (status === "rejected") rejected += 1;
      else pending += 1;
    });

    return { total, pending, approved, rejected };
  }, [proposals]);

  // Filtered Proposals
  const filteredProposals = useMemo(() => {
    if (activeFilter === "all") return proposals;
    return proposals.filter(
      (p) => (p.status || "pending").toLowerCase() === activeFilter
    );
  }, [proposals, activeFilter]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setProposalToEdit(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal for Rejected Proposal
  const handleOpenEditModal = (proposal) => {
    setProposalToEdit(proposal);
    setIsModalOpen(true);
  };

  // Handle Form Submission Success
  const handleModalSuccess = (savedProposal, isEdit) => {
    if (isEdit && savedProposal) {
      setProposals((prev) =>
        prev.map((p) =>
          p._id === savedProposal._id
            ? { ...p, ...savedProposal, status: "pending", adminRemarks: null }
            : p
        )
      );
      setFeedbackBanner({
        type: "success",
        message: "Project proposal updated and resubmitted successfully.",
      });
    } else if (savedProposal) {
      setProposals((prev) => [savedProposal, ...prev]);
      setFeedbackBanner({
        type: "success",
        message: "Project proposal submitted successfully.",
      });
    } else {
      fetchProposals();
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!proposalToDelete?._id) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteProjectProposal(proposalToDelete._id);
      setProposals((prev) => prev.filter((p) => p._id !== proposalToDelete._id));
      setFeedbackBanner({
        type: "success",
        message: "Project proposal deleted successfully.",
      });
      setProposalToDelete(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete proposal. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Primary Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Proposals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Submit project ideas, track approval status, and respond to faculty feedback.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          className="gap-2 font-semibold shadow-nexora-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>New Proposal</span>
        </Button>
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

      {/* Status Filter Tabs */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/80"
        aria-label="Filter proposals by status"
      >
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors shrink-0 ${
            activeFilter === "all"
              ? "bg-primary-50 text-primary border border-primary/20"
              : "text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent"
          }`}
        >
          <span>All</span>
          <span className="text-[11px] font-medium">({counts.total})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("pending")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors shrink-0 ${
            activeFilter === "pending"
              ? "bg-warning-50 text-warning-800 border border-warning-200"
              : "text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent"
          }`}
        >
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Pending</span>
          <span className="text-[11px] font-medium">({counts.pending})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("approved")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors shrink-0 ${
            activeFilter === "approved"
              ? "bg-success-50 text-success-700 border border-success-200"
              : "text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Approved</span>
          <span className="text-[11px] font-medium">({counts.approved})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("rejected")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors shrink-0 ${
            activeFilter === "rejected"
              ? "bg-danger-50 text-danger-700 border border-danger-200"
              : "text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent"
          }`}
        >
          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Rejected</span>
          <span className="text-[11px] font-medium">({counts.rejected})</span>
        </button>
      </div>

      {/* Main Content State */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-nexora-sm"
            >
              <div className="flex justify-between items-start">
                <div className="h-4 w-36 rounded bg-surface-secondary" />
                <div className="h-5 w-16 rounded bg-surface-secondary" />
              </div>
              <div className="h-12 w-full rounded-lg bg-surface-secondary/70" />
              <div className="h-9 w-full rounded-lg bg-surface-secondary/60" />
              <div className="pt-3 border-t border-border/60 flex justify-between items-center">
                <div className="h-4 w-24 rounded bg-surface-secondary" />
                <div className="h-7 w-20 rounded bg-surface-secondary" />
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
            Unable to load your proposals
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={fetchProposals}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      ) : proposals.length === 0 ? (
        /* Empty State: No proposals created yet */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary mb-4 border border-primary/20">
            <FileText className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            No project proposals yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Submit your first project proposal and track its approval here.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenCreateModal}
              className="gap-2 font-semibold"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>New Proposal</span>
            </Button>
          </div>
        </div>
      ) : filteredProposals.length === 0 ? (
        /* Filter-specific Empty State */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary text-muted-foreground mb-3">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-foreground capitalize">
            No {activeFilter} proposals
          </h2>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            You don&apos;t have any {activeFilter} project proposals.
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter("all")}
              className="text-xs"
            >
              View All Proposals
            </Button>
          </div>
        </div>
      ) : (
        /* Proposals Grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProposals.map((proposal) => (
            <ProjectProposalCard
              key={proposal._id}
              proposal={proposal}
              onEdit={handleOpenEditModal}
              onInitiateDelete={(p) => {
                setDeleteError(null);
                setProposalToDelete(p);
              }}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Proposal Modal */}
      <ProjectProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        proposalToEdit={proposalToEdit}
      />

      {/* Delete Confirmation Dialog */}
      {proposalToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-proposal-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600 border border-danger-200">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setProposalToDelete(null)}
                disabled={isDeleting}
                aria-label="Close dialog"
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3
                id="delete-proposal-dialog-title"
                className="text-lg font-bold text-foreground"
              >
                Delete project proposal?
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                This action cannot be undone. The proposal for{" "}
                <strong className="font-semibold text-foreground">
                  &quot;{proposalToDelete.title || "Untitled Proposal"}&quot;
                </strong>{" "}
                and its uploaded abstract will be permanently deleted.
              </p>
            </div>

            {deleteError && (
              <div className="rounded-lg bg-danger-50 p-3 text-xs text-danger-800 border border-danger-200">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setProposalToDelete(null)}
                disabled={isDeleting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="gap-1.5 text-xs bg-danger-600 hover:bg-danger-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Proposal</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProposalsPage;
