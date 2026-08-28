import { useState, useEffect } from "react";
import { X, SlidersHorizontal, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

function CriterionFormContent({
  mode = "create",
  initialData = null,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [enabled, setEnabled] = useState(
    typeof initialData?.enabled === "boolean" ? initialData.enabled : true
  );
  const [required, setRequired] = useState(
    typeof initialData?.required === "boolean" ? initialData.required : true
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName) {
      newErrors.name = "Criterion name is required.";
    } else if (trimmedName.length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Name must not exceed 100 characters.";
    }

    if (!trimmedDesc) {
      newErrors.description = "Criterion description is required.";
    } else if (trimmedDesc.length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    } else if (trimmedDesc.length > 500) {
      newErrors.description = "Description must not exceed 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      enabled,
      required,
    });
  };

  const isEdit = mode === "edit";

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20 shrink-0">
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3
              id="criterion-modal-title"
              className="text-base font-bold text-foreground"
            >
              {isEdit ? "Edit Custom Criterion" : "Add Custom Criterion"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEdit
                ? "Update custom evaluation standards for your college."
                : "Define specific project expectations for AI proposal evaluation."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
          className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="criterion-name"
              className="block text-xs font-semibold text-foreground"
            >
              Criterion Name <span className="text-danger-600">*</span>
            </label>
            <span className="text-[11px] text-muted-foreground">
              {name.length}/100
            </span>
          </div>
          <input
            id="criterion-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
            }}
            placeholder="e.g. Working Prototype, Hardware Setup, Dataset Quality"
            disabled={isSubmitting}
            maxLength={100}
            className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.name
                ? "border-danger-500 focus:border-danger-500"
                : "border-border focus:border-primary"
            }`}
          />
          {errors.name && (
            <p className="text-[11px] font-medium text-danger-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="criterion-description"
              className="block text-xs font-semibold text-foreground"
            >
              Evaluation Instructions / Description{" "}
              <span className="text-danger-600">*</span>
            </label>
            <span className="text-[11px] text-muted-foreground">
              {description.length}/500
            </span>
          </div>
          <textarea
            id="criterion-description"
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description)
                setErrors((prev) => ({ ...prev, description: null }));
            }}
            placeholder="Explain clearly what the AI should check in the student proposal to determine whether this criterion passes or fails."
            disabled={isSubmitting}
            maxLength={500}
            className={`w-full rounded-xl border bg-surface p-3 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.description
                ? "border-danger-500 focus:border-danger-500"
                : "border-border focus:border-primary"
            }`}
          />
          {errors.description && (
            <p className="text-[11px] font-medium text-danger-600">
              {errors.description}
            </p>
          )}
        </div>

        {/* Toggles Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Enabled Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary/40 p-3">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Enabled
              </span>
              <span className="text-[11px] text-muted-foreground">
                Include in AI evaluations
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label={`Toggle enabled state for ${name || "criterion"}`}
              onClick={() => setEnabled((prev) => !prev)}
              disabled={isSubmitting}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                enabled ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                  enabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Required Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary/40 p-3">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Required
              </span>
              <span className="text-[11px] text-muted-foreground">
                Crucial for passing
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={required}
              aria-label={`Toggle required state for ${name || "criterion"}`}
              onClick={() => setRequired((prev) => !prev)}
              disabled={isSubmitting}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                required ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                  required ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
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
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="gap-1.5 text-xs min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEdit ? "Update Criterion" : "Create Criterion"}</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function CustomReviewCriterionModal({
  isOpen,
  mode = "create",
  initialData = null,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="criterion-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <CriterionFormContent
        key={initialData?._id || initialData?.name || mode}
        mode={mode}
        initialData={initialData}
        onClose={onClose}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default CustomReviewCriterionModal;
