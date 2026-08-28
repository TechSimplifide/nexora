import { Pencil, Trash2 } from "lucide-react";

function ReviewCriterionCard({
  criterion,
  isCustom = false,
  onToggleEnabled,
  onToggleRequired,
  onEdit,
  onDelete,
  isMutating = false,
}) {
  const isEnabled = Boolean(criterion.enabled);
  const isRequired = Boolean(criterion.required);

  return (
    <div
      className={`group rounded-2xl border bg-surface p-5 shadow-nexora-xs transition-all ${
        isEnabled
          ? "border-border hover:border-border-strong"
          : "border-border/60 bg-surface-secondary/20 opacity-80"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Left: Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-foreground">
              {criterion.name || "Criterion"}
            </h4>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isCustom
                  ? "bg-primary-50 text-primary border-primary/20"
                  : "bg-surface-secondary text-muted-foreground border-border"
              }`}
            >
              {isCustom ? "Custom" : "Standard"}
            </span>

            {!isEnabled && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted-foreground/10 text-muted-foreground">
                Disabled
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {criterion.description || "No description provided."}
          </p>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex flex-wrap items-center sm:items-end sm:flex-col gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/70">
          {/* Toggles Strip */}
          <div className="flex items-center gap-4">
            {/* Enabled Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-semibold text-foreground">
                Enabled
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                aria-label={`Enable ${criterion.name} criterion`}
                disabled={isMutating}
                onClick={() => onToggleEnabled(criterion)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 ${
                  isEnabled ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    isEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </label>

            {/* Required Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-semibold text-foreground">
                Required
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isRequired}
                aria-label={`Mark ${criterion.name} criterion as required`}
                disabled={isMutating}
                onClick={() => onToggleRequired(criterion)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 ${
                  isRequired ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    isRequired ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Custom Actions: Edit & Delete */}
          {isCustom && (
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => onEdit(criterion)}
                disabled={isMutating}
                aria-label={`Edit ${criterion.name}`}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-secondary rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(criterion)}
                disabled={isMutating}
                aria-label={`Delete ${criterion.name}`}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewCriterionCard;
