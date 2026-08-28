import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  KeyRound,
  AlertCircle,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Check,
  Loader2,
  FolderKanban,
} from "lucide-react";
import Button from "@/components/ui/Button";
import {
  getMyProjectAccessRequests,
  cancelProjectAccessRequest,
} from "@/services/project.service";
import ProjectAccessRequestCard from "@/features/student/components/ProjectAccessRequestCard";

const resourceLabelMap = {
  github: "GitHub Repository",
  deployedLink: "Live Application Demo",
  supportingDocument: "Supporting Document",
};

function StudentAccessRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Cancellation Modal State
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [successBanner, setSuccessBanner] = useState(null);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyProjectAccessRequests();
      setRequests(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(
        err.message || "Something went wrong while loading your access requests."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await getMyProjectAccessRequests();
        if (isMounted) {
          setRequests(Array.isArray(response?.data) ? response.data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message ||
              "Something went wrong while loading your access requests."
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
    const total = requests.length;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    requests.forEach((req) => {
      const status = (req.status || "pending").toLowerCase();
      if (status === "approved") approved += 1;
      else if (status === "rejected") rejected += 1;
      else pending += 1;
    });

    return { total, pending, approved, rejected };
  }, [requests]);

  // Filtered List
  const filteredRequests = useMemo(() => {
    if (activeFilter === "all") return requests;
    return requests.filter(
      (req) => (req.status || "pending").toLowerCase() === activeFilter
    );
  }, [requests, activeFilter]);

  // Modal Cancel Flow
  const handleInitiateCancel = (request) => {
    setCancelError(null);
    setRequestToCancel(request);
  };

  const handleConfirmCancel = async () => {
    if (!requestToCancel?._id) return;
    setIsCancelling(true);
    setCancelError(null);

    try {
      await cancelProjectAccessRequest(requestToCancel._id);
      setRequests((prev) => prev.filter((r) => r._id !== requestToCancel._id));
      const resLabel =
        resourceLabelMap[requestToCancel.resourceType] || "Resource";
      const projTitle = requestToCancel.project?.title || "project";
      setSuccessBanner(
        `Cancelled your access request for "${resLabel}" on "${projTitle}".`
      );
      setRequestToCancel(null);
    } catch (err) {
      setCancelError(
        err.message || "Failed to cancel access request. Please try again."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const resourceNameForModal = requestToCancel
    ? resourceLabelMap[requestToCancel.resourceType] || "Resource"
    : "Resource";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Access Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Track your requests for access to protected project resources.
        </p>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="flex items-center justify-between rounded-xl bg-success-50 p-4 border border-success-200 text-xs text-success-800 shadow-xs">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success-700 shrink-0" aria-hidden="true" />
            <span className="font-medium">{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="p-1 text-success-700 hover:text-success-900 rounded-md transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/80"
        aria-label="Filter access requests by status"
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
                <div className="h-4 w-32 rounded bg-surface-secondary" />
                <div className="h-5 w-16 rounded bg-surface-secondary" />
              </div>
              <div className="h-10 w-full rounded-lg bg-surface-secondary/70" />
              <div className="h-4 w-5/6 rounded bg-surface-secondary/60" />
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
            Unable to load access requests
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={fetchRequests}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      ) : requests.length === 0 ? (
        /* Global Empty State */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary mb-4">
            <KeyRound className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            No access requests yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            When you request access to a protected project resource, your requests will appear here.
          </p>
          <div className="mt-6">
            <Link to="/app/student/projects">
              <Button variant="primary" size="md" className="gap-2">
                <FolderKanban className="h-4 w-4" aria-hidden="true" />
                <span>Explore Projects →</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : filteredRequests.length === 0 ? (
        /* Filter-specific Empty State */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary text-muted-foreground mb-3">
            <KeyRound className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-foreground capitalize">
            No {activeFilter} requests
          </h2>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            You don&apos;t have any {activeFilter} access requests.
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter("all")}
              className="text-xs"
            >
              View All Requests
            </Button>
          </div>
        </div>
      ) : (
        /* Requests Grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((request) => (
            <ProjectAccessRequestCard
              key={request._id}
              request={request}
              onInitiateCancel={handleInitiateCancel}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal for Cancellation */}
      {requestToCancel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600 border border-danger-200">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setRequestToCancel(null)}
                disabled={isCancelling}
                aria-label="Close dialog"
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h2
                id="cancel-dialog-title"
                className="text-lg font-bold text-foreground"
              >
                Cancel access request?
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Are you sure you want to cancel your request for{" "}
                <strong className="font-semibold text-foreground">
                  {resourceNameForModal}
                </strong>{" "}
                access to this project?
              </p>
            </div>

            {cancelError && (
              <div className="rounded-lg bg-danger-50 p-3 text-xs text-danger-800 border border-danger-200">
                {cancelError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRequestToCancel(null)}
                disabled={isCancelling}
                className="text-xs"
              >
                Keep Request
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="gap-1.5 text-xs bg-danger-600 hover:bg-danger-700 text-white"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Cancel Request</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAccessRequestsPage;
