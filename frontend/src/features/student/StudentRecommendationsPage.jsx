import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  AlertCircle,
  RotateCcw,
  X,
  Check,
  Loader2,
  BrainCircuit,
} from "lucide-react";
import Button from "@/components/ui/Button";
import {
  getStudentRecommendations,
  deleteStudentRecommendation,
} from "@/services/recommendation.service";
import ProjectRecommendationCard from "@/features/student/components/ProjectRecommendationCard";

function StudentRecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Deletion Confirmation State
  const [recommendationToDelete, setRecommendationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Feedback Notification Banner
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getStudentRecommendations();
      setRecommendations(
        Array.isArray(response?.data) ? response.data : []
      );
    } catch (err) {
      setError(
        err.message || "Unable to load recommendations. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await getStudentRecommendations();
        if (isMounted) {
          setRecommendations(
            Array.isArray(response?.data) ? response.data : []
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Unable to load recommendations. Please try again."
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


  // Handle Confirmed Deletion
  const handleConfirmDelete = async () => {
    if (!recommendationToDelete?._id) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteStudentRecommendation(recommendationToDelete._id);
      setRecommendations((prev) =>
        prev.filter((r) => r._id !== recommendationToDelete._id)
      );
      setFeedbackBanner({
        type: "success",
        message: "Project recommendation deleted successfully.",
      });
      setRecommendationToDelete(null);
    } catch (err) {
      setDeleteError(
        err.message || "Failed to delete recommendation. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Primary Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Project Recommendations
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              <Sparkles className="h-3 w-3 fill-primary" aria-hidden="true" />
              AI-Powered
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Get AI-powered project ideas based on your skills, interests, and project requirements.
          </p>
        </div>

        <Link
          to="/app/student/recommendations/new"
          className="self-start sm:self-auto shrink-0"
        >
          <Button
            type="button"
            variant="primary"
            size="md"
            className="gap-2 font-semibold shadow-nexora-sm"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Get Recommendation</span>
          </Button>
        </Link>
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
        <div className="space-y-5 animate-pulse">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-nexora-sm"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-28 rounded bg-surface-secondary" />
                  <div className="h-6 w-3/4 rounded bg-surface-secondary" />
                </div>
                <div className="h-6 w-6 rounded bg-surface-secondary" />
              </div>
              <div className="h-16 w-full rounded-xl bg-surface-secondary/70" />
              <div className="h-5 w-48 rounded bg-surface-secondary/60" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-danger-100 bg-surface p-8 text-center shadow-nexora-sm sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-50 text-danger-600 mb-3">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Unable to load recommendations
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={fetchRecommendations}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      ) : recommendations.length === 0 ? (
        /* Empty State: No recommendations generated yet */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary mb-4 border border-primary/20">
            <BrainCircuit className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            No project recommendations yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Tell Nexora about your skills and project preferences to get a project idea tailored to you.
          </p>
          <div className="mt-6">
            <Link to="/app/student/recommendations/new">
              <Button
                type="button"
                variant="primary"
                size="md"
                className="gap-2 font-semibold"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Get Recommendation</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Recommendations List */
        <div className="space-y-6">
          {recommendations.map((rec) => (
            <ProjectRecommendationCard
              key={rec._id}
              recommendation={rec}
              onInitiateDelete={(item) => {
                setDeleteError(null);
                setRecommendationToDelete(item);
              }}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {recommendationToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-recommendation-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600 border border-danger-200">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setRecommendationToDelete(null)}
                disabled={isDeleting}
                aria-label="Close dialog"
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3
                id="delete-recommendation-dialog-title"
                className="text-lg font-bold text-foreground"
              >
                Delete recommendation?
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                This recommendation for{" "}
                <strong className="font-semibold text-foreground">
                  &quot;{recommendationToDelete.title || "this project idea"}&quot;
                </strong>{" "}
                will be permanently removed from your list.
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
                onClick={() => setRecommendationToDelete(null)}
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
                  <span>Delete Recommendation</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentRecommendationsPage;
