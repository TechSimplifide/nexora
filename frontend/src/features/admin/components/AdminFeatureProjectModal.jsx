import { useEffect } from "react";
import { Star, X, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

function AdminFeatureProjectModal({
  isOpen,
  onClose,
  onConfirm,
  project,
  isSubmitting = false,
  error = null,
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
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen || !project) return null;

  const isFeaturing = !project.isFeatured;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feature-project-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border shrink-0 ${
              isFeaturing
                ? "bg-warning-50 text-warning-700 border-warning-200"
                : "bg-surface-secondary text-muted-foreground border-border"
            }`}
          >
            <Star
              className={`h-5 w-5 ${
                isFeaturing ? "fill-warning-600 text-warning-600" : ""
              }`}
              aria-hidden="true"
            />
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

        <div>
          <h3
            id="feature-project-dialog-title"
            className="text-lg font-bold text-foreground"
          >
            {isFeaturing ? "Feature Project?" : "Remove from Featured?"}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            {isFeaturing ? (
              <>
                Featuring{" "}
                <strong className="font-semibold text-foreground">
                  &quot;{project.title || "this project"}&quot;
                </strong>{" "}
                will prominently highlight it in the Featured Projects showcase
                for the college.
              </>
            ) : (
              <>
                Are you sure you want to remove{" "}
                <strong className="font-semibold text-foreground">
                  &quot;{project.title || "this project"}&quot;
                </strong>{" "}
                from Featured Projects? It will remain accessible in the standard
                project archive.
              </>
            )}
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-danger-50 p-3 text-xs text-danger-800 border border-danger-200 leading-relaxed">
            {error}
          </div>
        )}

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
            type="button"
            variant={isFeaturing ? "primary" : "danger"}
            size="sm"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`gap-1.5 text-xs min-w-[140px] font-semibold ${
              isFeaturing ? "bg-primary hover:bg-primary-hover text-white" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Processing...</span>
              </>
            ) : isFeaturing ? (
              <>
                <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                <span>Feature Project</span>
              </>
            ) : (
              <span>Remove Featured</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminFeatureProjectModal;
