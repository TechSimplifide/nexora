import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FolderKey,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  X,
  Check,
  Loader2,
  FolderKanban,
  Folder,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  getProjects,
  getProjectAccessRequests,
  approveProjectAccessRequest,
  rejectProjectAccessRequest,
} from "@/services/project.service";
import ProjectOwnerAccessRequestCard from "@/features/student/components/ProjectOwnerAccessRequestCard";

function StudentProjectRequestsPage() {
  const { user } = useAuth();
  const [hasOwnedProjects, setHasOwnedProjects] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Rejection Confirmation State
  const [requestToReject, setRequestToReject] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectError, setRejectError] = useState(null);

  // Active Processing IDs
  const [processingId, setProcessingId] = useState(null);

  // Feedback Notification
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  const fetchOwnedProjectsAndRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch college projects (max limit supported is 50)
      const projectsRes = await getProjects({ limit: 50 });
      const allProjects = Array.isArray(projectsRes?.data?.projects)
        ? projectsRes.data.projects
        : Array.isArray(projectsRes?.data)
        ? projectsRes.data
        : [];

      // 2. Identify projects owned by authenticated student
      const currentUserId = user?._id || user?.id;
      const owned = allProjects.filter((p) => {
        const creatorId =
          p.createdBy?._id ||
          p.createdBy?.id ||
          (typeof p.createdBy === "string" ? p.createdBy : null);
        return creatorId && currentUserId && creatorId === currentUserId;
      });

      if (owned.length === 0) {
        setHasOwnedProjects(false);
        setRequests([]);
        setIsLoading(false);
        return;
      }

      setHasOwnedProjects(true);

      // 3. For each owned project, fetch incoming requests
      const requestPromises = owned.map(async (p) => {
        const pId = p._id || p.id;
        try {
          const reqRes = await getProjectAccessRequests(pId);
          const rawList = Array.isArray(reqRes?.data) ? reqRes.data : [];
          return rawList.map((r) => ({
            ...r,
            projectData: {
              _id: pId,
              title: p.title || "Untitled Project",
              domain: p.domain,
              department: p.department,
              academicYear: p.academicYear,
            },
          }));
        } catch {
          return [];
        }
      });

      const settledResults = await Promise.allSettled(requestPromises);
      const combined = [];
      settledResults.forEach((res) => {
        if (res.status === "fulfilled" && Array.isArray(res.value)) {
          combined.push(...res.value);
        }
      });

      // Sort by creation date descending
      combined.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );

      setRequests(combined);
    } catch (err) {
      setError(
        err.message || "Unable to load project requests. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const projectsRes = await getProjects({ limit: 50 });
        const allProjects = Array.isArray(projectsRes?.data?.projects)
          ? projectsRes.data.projects
          : Array.isArray(projectsRes?.data)
          ? projectsRes.data
          : [];

        const currentUserId = user?._id || user?.id;
        const owned = allProjects.filter((p) => {
          const creatorId =
            p.createdBy?._id ||
            p.createdBy?.id ||
            (typeof p.createdBy === "string" ? p.createdBy : null);
          return creatorId && currentUserId && creatorId === currentUserId;
        });

        if (owned.length === 0) {
          if (isMounted) {
            setHasOwnedProjects(false);
            setRequests([]);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setHasOwnedProjects(true);
        }

        const requestPromises = owned.map(async (p) => {
          const pId = p._id || p.id;
          try {
            const reqRes = await getProjectAccessRequests(pId);
            const rawList = Array.isArray(reqRes?.data) ? reqRes.data : [];
            return rawList.map((r) => ({
              ...r,
              projectData: {
                _id: pId,
                title: p.title || "Untitled Project",
                domain: p.domain,
                department: p.department,
                academicYear: p.academicYear,
              },
            }));
          } catch {
            return [];
          }
        });

        const settledResults = await Promise.allSettled(requestPromises);
        const combined = [];
        settledResults.forEach((res) => {
          if (res.status === "fulfilled" && Array.isArray(res.value)) {
            combined.push(...res.value);
          }
        });

        combined.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

        if (isMounted) {
          setRequests(combined);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Unable to load project requests. Please try again."
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
  }, [user]);

  // Status Counts
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

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    if (activeFilter === "all") return requests;
    return requests.filter(
      (req) => (req.status || "pending").toLowerCase() === activeFilter
    );
  }, [requests, activeFilter]);

  // Group Filtered Requests by Project
  const groupedProjects = useMemo(() => {
    const map = new Map();

    filteredRequests.forEach((req) => {
      const pId =
        req.projectData?._id ||
        (typeof req.project === "string" ? req.project : req.project?._id);
      const pTitle = req.projectData?.title || "Untitled Project";
      const domain = req.projectData?.domain;
      const department = req.projectData?.department;

      if (!map.has(pId)) {
        map.set(pId, {
          id: pId,
          title: pTitle,
          domain,
          department,
          requests: [],
        });
      }
      map.get(pId).requests.push(req);
    });

    return Array.from(map.values());
  }, [filteredRequests]);

  // Handle Approve
  const handleApprove = async (request) => {
    setProcessingId(request._id);
    setFeedbackBanner(null);

    try {
      const response = await approveProjectAccessRequest(request._id);
      const updated = response?.data || {};

      setRequests((prev) =>
        prev.map((r) =>
          r._id === request._id
            ? {
                ...r,
                ...updated,
                status: "approved",
                respondedAt: updated.respondedAt || new Date().toISOString(),
              }
            : r
        )
      );

      const requesterName = request.requestedBy?.fullName || "the student";
      setFeedbackBanner({
        type: "success",
        message: `Approved access request for ${requesterName}.`,
      });
    } catch (err) {
      setFeedbackBanner({
        type: "error",
        message: err.message || "Failed to approve access request.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Confirmed Reject
  const handleConfirmReject = async () => {
    if (!requestToReject?._id) return;
    setIsRejecting(true);
    setRejectError(null);

    try {
      const response = await rejectProjectAccessRequest(requestToReject._id);
      const updated = response?.data || {};

      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestToReject._id
            ? {
                ...r,
                ...updated,
                status: "rejected",
                respondedAt: updated.respondedAt || new Date().toISOString(),
              }
            : r
        )
      );

      const requesterName =
        requestToReject.requestedBy?.fullName || "the student";
      setFeedbackBanner({
        type: "success",
        message: `Rejected access request for ${requesterName}.`,
      });
      setRequestToReject(null);
    } catch (err) {
      setRejectError(err.message || "Failed to reject access request.");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Project Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Manage access requests submitted by students for your projects. Review and manage permissions for protected project resources.
        </p>
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
            aria-label="Dismiss message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/80"
        aria-label="Filter project requests by status"
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

      {/* Main Content States */}
      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          {[1, 2].map((group) => (
            <div key={group} className="space-y-3">
              <div className="h-5 w-48 rounded bg-surface-secondary" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((card) => (
                  <div
                    key={card}
                    className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-nexora-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="h-4 w-32 rounded bg-surface-secondary" />
                      <div className="h-5 w-16 rounded bg-surface-secondary" />
                    </div>
                    <div className="h-10 w-full rounded-lg bg-surface-secondary/70" />
                    <div className="pt-3 border-t border-border/60 flex justify-end gap-2">
                      <div className="h-7 w-16 rounded bg-surface-secondary" />
                      <div className="h-7 w-20 rounded bg-surface-secondary" />
                    </div>
                  </div>
                ))}
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
            Unable to load project requests
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={fetchOwnedProjectsAndRequests}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      ) : !hasOwnedProjects ? (
        /* Empty State: No owned projects */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary mb-4">
            <FolderKanban className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            No projects yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Create a project to receive access requests from other students. Once students submit requests for your protected resources, they will appear here.
          </p>
          <div className="mt-6">
            <Link to="/app/student/projects">
              <Button variant="primary" size="md" className="gap-2">
                <span>View Projects Catalog →</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : requests.length === 0 ? (
        /* Empty State: Owned projects exist, but 0 requests */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary mb-4">
            <FolderKey className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            No project requests yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Students can request access to protected resources from your projects. When requests are submitted, you can review, approve, or reject them here.
          </p>
        </div>
      ) : filteredRequests.length === 0 ? (
        /* Empty State: No requests for selected filter */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary text-muted-foreground mb-3">
            <FolderKey className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-foreground capitalize">
            No {activeFilter} requests
          </h2>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            You don&apos;t have any {activeFilter} access requests for your projects.
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
        /* Grouped Requests by Project */
        <div className="space-y-8">
          {groupedProjects.map((group) => (
            <div key={group.id} className="space-y-3.5">
              {/* Project Group Header */}
              <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Folder className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <h2 className="text-base font-bold text-foreground truncate">
                    Project: {group.title}
                  </h2>
                  {group.domain && (
                    <span className="hidden sm:inline-flex rounded-sm bg-surface-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                      {group.domain}
                    </span>
                  )}
                </div>

                <Link
                  to={`/app/student/projects/${group.id}`}
                  className="text-xs font-semibold text-primary hover:underline shrink-0"
                >
                  View Project →
                </Link>
              </div>

              {/* Cards Grid for this project */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.requests.map((request) => (
                  <ProjectOwnerAccessRequestCard
                    key={request._id}
                    request={request}
                    onApprove={handleApprove}
                    onInitiateReject={(req) => {
                      setRejectError(null);
                      setRequestToReject(req);
                    }}
                    isProcessing={processingId === request._id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Rejection */}
      {requestToReject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600 border border-danger-200">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setRequestToReject(null)}
                disabled={isRejecting}
                aria-label="Close dialog"
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3
                id="reject-dialog-title"
                className="text-lg font-bold text-foreground"
              >
                Reject access request?
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                <strong className="font-semibold text-foreground">
                  {requestToReject.requestedBy?.fullName || "Rahul"}
                </strong>{" "}
                will not be able to access this protected resource.
              </p>
            </div>

            {rejectError && (
              <div className="rounded-lg bg-danger-50 p-3 text-xs text-danger-800 border border-danger-200">
                {rejectError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRequestToReject(null)}
                disabled={isRejecting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
                disabled={isRejecting}
                className="gap-1.5 text-xs bg-danger-600 hover:bg-danger-700 text-white"
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <span>Reject Request</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProjectRequestsPage;
