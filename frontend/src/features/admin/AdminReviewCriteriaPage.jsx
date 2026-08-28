import { useEffect, useState } from "react";
import {
  SlidersHorizontal,
  Plus,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import Button from "@/components/ui/Button";
import ReviewCriterionCard from "@/features/admin/components/ReviewCriterionCard";
import CustomReviewCriterionModal from "@/features/admin/components/CustomReviewCriterionModal";
import {
  getProjectReviewCriteria,
  updateProjectReviewCriteria,
} from "@/services/projectReviewCriteria.service";

export function AdminReviewCriteriaPage() {
  const [standardCriteria, setStandardCriteria] = useState([]);
  const [customCriteria, setCustomCriteria] = useState([]);
  const [autoReview, setAutoReview] = useState({
    enabled: false,
    confidenceThreshold: 0.9,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mutation Loading & Feedback
  const [isMutating, setIsMutating] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  // Modal State for Add / Edit
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create", // 'create' | 'edit'
    data: null,
    index: null,
  });

  // Delete Confirmation State
  const [criterionToDelete, setCriterionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initial Data Load
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getProjectReviewCriteria();
        const data = response?.data;
        if (isMounted && data) {
          setStandardCriteria(
            Array.isArray(data.standardCriteria) ? data.standardCriteria : []
          );
          setCustomCriteria(
            Array.isArray(data.customCriteria) ? data.customCriteria : []
          );
          if (data.autoReview) {
            setAutoReview(data.autoReview);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Unable to load review criteria. Please try again."
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

  // Manual Refresh Handler
  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProjectReviewCriteria();
      const data = response?.data;
      if (data) {
        setStandardCriteria(
          Array.isArray(data.standardCriteria) ? data.standardCriteria : []
        );
        setCustomCriteria(
          Array.isArray(data.customCriteria) ? data.customCriteria : []
        );
        if (data.autoReview) {
          setAutoReview(data.autoReview);
        }
      }
    } catch (err) {
      setError(
        err.message || "Unable to load review criteria. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generic Save Handler to sync with backend
  const saveCriteria = async (
    updatedStandard,
    updatedCustom,
    successMessage = "Review criteria updated successfully."
  ) => {
    setIsMutating(true);
    try {
      const res = await updateProjectReviewCriteria({
        standardCriteria: updatedStandard,
        customCriteria: updatedCustom,
        autoReview,
      });

      if (res?.data) {
        setStandardCriteria(res.data.standardCriteria || updatedStandard);
        setCustomCriteria(res.data.customCriteria || updatedCustom);
        if (res.data.autoReview) setAutoReview(res.data.autoReview);
      }

      setFeedbackBanner({
        type: "success",
        message: successMessage,
      });
      return true;
    } catch (err) {
      setFeedbackBanner({
        type: "error",
        message: err.message || "Failed to update review criteria.",
      });
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  // Toggle Standard Criterion Enabled
  const handleToggleStandardEnabled = async (criterion) => {
    const updated = standardCriteria.map((c) =>
      c.key === criterion.key ? { ...c, enabled: !c.enabled } : c
    );
    const success = await saveCriteria(
      updated,
      customCriteria,
      `Criterion "${criterion.name}" ${
        criterion.enabled ? "disabled" : "enabled"
      }.`
    );
    if (!success) {
      // rollback handled by not mutating state locally if save fails
    }
  };

  // Toggle Standard Criterion Required
  const handleToggleStandardRequired = async (criterion) => {
    const updated = standardCriteria.map((c) =>
      c.key === criterion.key ? { ...c, required: !c.required } : c
    );
    await saveCriteria(
      updated,
      customCriteria,
      `Criterion "${criterion.name}" marked as ${
        criterion.required ? "optional" : "required"
      }.`
    );
  };

  // Toggle Custom Criterion Enabled
  const handleToggleCustomEnabled = async (criterion) => {
    const updated = customCriteria.map((c) =>
      c._id === criterion._id || c.name === criterion.name
        ? { ...c, enabled: !c.enabled }
        : c
    );
    await saveCriteria(
      standardCriteria,
      updated,
      `Custom criterion "${criterion.name}" ${
        criterion.enabled ? "disabled" : "enabled"
      }.`
    );
  };

  // Toggle Custom Criterion Required
  const handleToggleCustomRequired = async (criterion) => {
    const updated = customCriteria.map((c) =>
      c._id === criterion._id || c.name === criterion.name
        ? { ...c, required: !c.required }
        : c
    );
    await saveCriteria(
      standardCriteria,
      updated,
      `Custom criterion "${criterion.name}" marked as ${
        criterion.required ? "optional" : "required"
      }.`
    );
  };

  // Handle Add / Edit Custom Criterion Submit
  const handleModalSubmit = async (formData) => {
    let updatedCustom;
    if (modalState.mode === "edit" && modalState.index !== null) {
      updatedCustom = [...customCriteria];
      updatedCustom[modalState.index] = {
        ...updatedCustom[modalState.index],
        ...formData,
      };
    } else {
      updatedCustom = [...customCriteria, formData];
    }

    const success = await saveCriteria(
      standardCriteria,
      updatedCustom,
      modalState.mode === "edit"
        ? `Custom criterion "${formData.name}" updated successfully.`
        : `Custom criterion "${formData.name}" added successfully.`
    );

    if (success) {
      setModalState({ isOpen: false, mode: "create", data: null, index: null });
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!criterionToDelete) return;
    setIsDeleting(true);

    const updatedCustom = customCriteria.filter(
      (c) =>
        (criterionToDelete._id && c._id !== criterionToDelete._id) ||
        (!criterionToDelete._id && c.name !== criterionToDelete.name)
    );

    const success = await saveCriteria(
      standardCriteria,
      updatedCustom,
      `Custom criterion "${criterionToDelete.name}" deleted.`
    );

    setIsDeleting(false);
    if (success) {
      setCriterionToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20">
              <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Review Criteria
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Configure the criteria Nexora AI uses when reviewing student project proposals.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isMutating}
          className="self-start sm:self-auto gap-2 text-xs"
        >
          <RotateCcw
            className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Subtle Information Note */}
      <div className="rounded-xl border border-border bg-surface p-4 text-xs text-muted-foreground flex items-start gap-2.5 shadow-nexora-xs">
        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <span className="leading-relaxed">
          Only <strong>enabled</strong> criteria are sent to the AI for evaluation. AI recommendations remain advisory — the administrator makes the final approval or rejection decision.
        </span>
      </div>

      {/* Feedback Banner */}
      {feedbackBanner && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-xs font-medium ${
            feedbackBanner.type === "success"
              ? "border-success-200 bg-success-50 text-success-700"
              : "border-danger-200 bg-danger-50 text-danger-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackBanner.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success-700" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-danger-700" />
            )}
            <span>{feedbackBanner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="p-1 hover:opacity-75 transition-opacity"
            aria-label="Dismiss message"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Content */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-40 rounded-lg bg-surface-secondary animate-pulse" />
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 w-full rounded-2xl border border-border bg-surface animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-danger-200 bg-danger-50/50 p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-danger-100 text-danger-700">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Unable to Load Review Criteria
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Section 1: Standard Criteria */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Standard Criteria
                </h2>
                <p className="text-xs text-muted-foreground">
                  Core evaluation standards predefined by Nexora. You can enable/disable them or toggle required status.
                </p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground self-start sm:self-auto">
                {standardCriteria.filter((c) => c.enabled).length} of{" "}
                {standardCriteria.length} Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {standardCriteria.map((criterion) => (
                <ReviewCriterionCard
                  key={criterion.key}
                  criterion={criterion}
                  isCustom={false}
                  onToggleEnabled={handleToggleStandardEnabled}
                  onToggleRequired={handleToggleStandardRequired}
                  isMutating={isMutating}
                />
              ))}
            </div>
          </section>

          {/* Section 2: Custom Criteria */}
          <section className="space-y-4 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Custom Criteria
                </h2>
                <p className="text-xs text-muted-foreground">
                  Institution-specific requirements added by your college (e.g. working prototypes, datasets, domain depth).
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  setModalState({
                    isOpen: true,
                    mode: "create",
                    data: null,
                    index: null,
                  })
                }
                disabled={isMutating || customCriteria.length >= 20}
                className="gap-1.5 text-xs font-semibold self-start sm:self-auto shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add Custom Criterion</span>
              </Button>
            </div>

            {customCriteria.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface-secondary/20 p-10 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-sm font-bold text-foreground">
                    No Custom Criteria Yet
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Create additional criteria specific to your college&apos;s project evaluation guidelines.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setModalState({
                      isOpen: true,
                      mode: "create",
                      data: null,
                      index: null,
                    })
                  }
                  className="gap-1.5 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create First Custom Criterion</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {customCriteria.map((criterion, idx) => (
                  <ReviewCriterionCard
                    key={criterion._id || criterion.name || idx}
                    criterion={criterion}
                    isCustom={true}
                    onToggleEnabled={handleToggleCustomEnabled}
                    onToggleRequired={handleToggleCustomRequired}
                    onEdit={() =>
                      setModalState({
                        isOpen: true,
                        mode: "edit",
                        data: criterion,
                        index: idx,
                      })
                    }
                    onDelete={() => setCriterionToDelete(criterion)}
                    isMutating={isMutating}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Add / Edit Custom Criterion Modal */}
      <CustomReviewCriterionModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.data}
        onClose={() =>
          setModalState({
            isOpen: false,
            mode: "create",
            data: null,
            index: null,
          })
        }
        onSubmit={handleModalSubmit}
        isSubmitting={isMutating}
      />

      {/* Delete Confirmation Modal */}
      {criterionToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-criterion-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-700 border border-danger-200 shrink-0">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setCriterionToDelete(null)}
                disabled={isDeleting}
                aria-label="Close dialog"
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3
                id="delete-criterion-dialog-title"
                className="text-base font-bold text-foreground"
              >
                Delete Custom Criterion?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Are you sure you want to delete{" "}
                <strong className="font-semibold text-foreground">
                  &quot;{criterionToDelete.name}&quot;
                </strong>
                ? It will no longer be included in future AI proposal evaluations.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCriterionToDelete(null)}
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
                className="gap-1.5 text-xs bg-danger-600 hover:bg-danger-700 text-white min-w-[100px]"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Criterion</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReviewCriteriaPage;
