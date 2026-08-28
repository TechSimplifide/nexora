import { AlertCircle, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";

function StudentDashboardError({ onRetry, message }) {
  return (
    <div className="rounded-2xl border border-danger-100 bg-surface p-8 text-center shadow-nexora-sm sm:p-12">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-50 text-danger-600 mb-4">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>

      <h2 className="text-lg font-bold text-foreground sm:text-xl">
        Unable to load your dashboard
      </h2>

      <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        {message || "We couldn't retrieve your dashboard information right now. Please check your connection and try again."}
      </p>

      <div className="mt-6">
        <Button
          variant="primary"
          size="md"
          onClick={onRetry}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Try Again</span>
        </Button>
      </div>
    </div>
  );
}

export default StudentDashboardError;
