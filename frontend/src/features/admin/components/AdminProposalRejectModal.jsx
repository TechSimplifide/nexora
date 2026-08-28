import { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

function RejectFormContent({
  onClose,
  onConfirmReject,
  proposal,
  isSubmitting,
}) {
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState(null);

  const trimmed = remarks.trim();
  const charCount = remarks.length;
  const isTooShort = trimmed.length < 5;
  const isTooLong = trimmed.length > 800;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!trimmed) {
      setError("Please provide a reason for rejecting this proposal.");
      return;
    }

    if (trimmed.length < 5) {
      setError("Rejection remarks must be at least 5 characters.");
      return;
    }

    if (trimmed.length > 800) {
      setError("Rejection remarks cannot exceed 800 characters.");
      return;
    }

    onConfirmReject(proposal, trimmed);
  };

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600 border border-danger-200 shrink-0">
          <AlertCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close reject dialog"
          className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <h3
          id="reject-proposal-dialog-title"
          className="text-lg font-bold text-foreground"
        >
          Reject Project Proposal
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Please provide faculty feedback explaining why{" "}
          <strong className="font-semibold text-foreground">
            &quot;{proposal.title || "this proposal"}&quot;
          </strong>{" "}
          needs revision. The student will receive this feedback and can
          resubmit.
        </p>
      </div>

      {/* Rejection Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
        <div className="space-y-1.5">
          <label
            htmlFor="admin-remarks"
            className="block text-xs font-semibold text-foreground"
          >
            Faculty Remarks / Feedback <span className="text-danger-600">*</span>
          </label>
          <textarea
            id="admin-remarks"
            rows={4}
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. The proposed scope is too broad for a 2-person team. Please refine the core deliverables or specify the dataset you plan to use."
            disabled={isSubmitting}
            className={`w-full rounded-xl border bg-surface p-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500/20 ${
              error || (charCount > 0 && (isTooShort || isTooLong))
                ? "border-danger-500 focus:border-danger-500"
                : "border-border focus:border-primary"
            }`}
          />

          <div className="flex items-center justify-between text-[11px]">
            <span
              className={
                charCount > 0 && isTooShort
                  ? "font-medium text-danger-600"
                  : "text-muted-foreground"
              }
            >
              Minimum 5 characters required
            </span>
            <span
              className={
                isTooLong
                  ? "font-bold text-danger-600"
                  : "text-muted-foreground"
              }
            >
              {charCount}/800 characters
            </span>
          </div>

          {error && (
            <p className="text-[11px] font-medium text-danger-600">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            size="sm"
            disabled={isSubmitting || isTooShort || isTooLong}
            className="gap-1.5 text-xs bg-danger-600 hover:bg-danger-700 text-white min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Rejecting...</span>
              </>
            ) : (
              <span>Reject Proposal</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function AdminProposalRejectModal({
  isOpen,
  onClose,
  onConfirmReject,
  proposal,
  isSubmitting,
}) {
  if (!isOpen || !proposal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-proposal-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <RejectFormContent
        key={proposal._id}
        onClose={onClose}
        onConfirmReject={onConfirmReject}
        proposal={proposal}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default AdminProposalRejectModal;
