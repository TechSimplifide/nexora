import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Bell,
  CheckCheck,
  AlertCircle,
  RotateCcw,
  X,
  Check,
  Loader2,
  Trash2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/services/notification.service";
import NotificationCard from "@/features/student/components/NotificationCard";

function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Deletion Confirmation Modal State
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Feedback Notification Banner
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyNotifications();
      setNotifications(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(
        err.message || "Unable to load notifications. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await getMyNotifications();
        if (isMounted) {
          setNotifications(
            Array.isArray(response?.data) ? response.data : []
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Unable to load notifications. Please try again."
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

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Handle Mark Single As Read
  const handleMarkAsRead = async (item) => {
    if (item.isRead) return;

    try {
      await markNotificationAsRead(item._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n))
      );
      window.dispatchEvent(new CustomEvent("nexora:notifications-updated"));
    } catch {
      // Gracefully handle or ignore single click errors
    }
  };

  // Handle Mark All As Read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || isMarkingAll) return;
    setIsMarkingAll(true);

    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setFeedbackBanner({
        type: "success",
        message: "All notifications marked as read.",
      });
      window.dispatchEvent(new CustomEvent("nexora:notifications-updated"));
    } catch (err) {
      setFeedbackBanner({
        type: "error",
        message: err.message || "Failed to mark notifications as read.",
      });
    } finally {
      setIsMarkingAll(false);
    }
  };

  // Handle Confirmed Delete
  const handleConfirmDelete = async () => {
    if (!notificationToDelete?._id) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteNotification(notificationToDelete._id);
      setNotifications((prev) =>
        prev.filter((n) => n._id !== notificationToDelete._id)
      );
      setFeedbackBanner({
        type: "success",
        message: "Notification deleted successfully.",
      });
      setNotificationToDelete(null);
      window.dispatchEvent(new CustomEvent("nexora:notifications-updated"));
    } catch (err) {
      setDeleteError(
        err.message || "Failed to delete notification. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Mark All Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Admin Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            System alerts, student proposal submissions, and institutional activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="gap-1.5 text-xs self-start sm:self-auto shrink-0"
          >
            {isMarkingAll ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Marking...</span>
              </>
            ) : (
              <>
                <CheckCheck className="h-4 w-4" aria-hidden="true" />
                <span>Mark all as read</span>
              </>
            )}
          </Button>
        )}
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
        <div className="space-y-3.5 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface p-4 space-y-3 shadow-nexora-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-surface-secondary" />
                  <div className="h-4 w-48 rounded bg-surface-secondary" />
                </div>
                <div className="h-3 w-16 rounded bg-surface-secondary" />
              </div>
              <div className="h-3 w-3/4 rounded bg-surface-secondary/70 ml-12" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-danger-100 bg-surface p-8 text-center shadow-nexora-sm sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-50 text-danger-600 mb-3">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Unable to load notifications
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={fetchNotifications}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary mb-4 border border-primary/20">
            <Bell className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            No notifications yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            You&apos;re all caught up. New student proposals and institutional updates will appear here.
          </p>
        </div>
      ) : (
        /* Notifications List */
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard
              key={n._id}
              notification={n}
              isAdmin={true}
              onMarkAsRead={handleMarkAsRead}
              onInitiateDelete={(item) => {
                setDeleteError(null);
                setNotificationToDelete(item);
              }}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {notificationToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-admin-notification-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-nexora-lg space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600 border border-danger-200">
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <button
                type="button"
                onClick={() => setNotificationToDelete(null)}
                disabled={isDeleting}
                aria-label="Close dialog"
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3
                id="delete-admin-notification-dialog-title"
                className="text-lg font-bold text-foreground"
              >
                Delete notification?
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Are you sure you want to delete this notification? This action cannot be undone.
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
                onClick={() => setNotificationToDelete(null)}
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
                  <span>Delete</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotificationsPage;
