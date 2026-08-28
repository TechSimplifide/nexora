import { useNavigate } from "react-router-dom";
import {
  Bell,
  KeyRound,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { formatDate } from "@/utils/date";

function getNotificationTypeConfig(type, isAdmin = false) {
  const normalized = String(type || "").toUpperCase();

  if (isAdmin) {
    if (normalized.includes("PROPOSAL")) {
      return {
        icon: FileText,
        iconColor: "text-primary bg-primary-50 border-primary/20",
        route: "/app/admin/approvals",
        routeLabel: "Review Pending Approvals",
      };
    }

    if (normalized.includes("PROJECT")) {
      return {
        icon: FileText,
        iconColor: "text-primary bg-primary-50 border-primary/20",
        route: "/app/admin/projects",
        routeLabel: "View Projects",
      };
    }

    return {
      icon: Bell,
      iconColor: "text-primary bg-primary-50 border-primary/20",
      route: null,
      routeLabel: null,
    };
  }

  // Student mappings
  if (normalized.includes("ACCESS_REQUEST_APPROVED")) {
    return {
      icon: CheckCircle2,
      iconColor: "text-success-700 bg-success-50 border-success-200",
      route: "/app/student/access-requests",
      routeLabel: "View Access Requests",
    };
  }

  if (normalized.includes("ACCESS_REQUEST_REJECTED")) {
    return {
      icon: XCircle,
      iconColor: "text-danger-700 bg-danger-50 border-danger-200",
      route: "/app/student/access-requests",
      routeLabel: "View Access Requests",
    };
  }

  if (
    normalized.includes("ACCESS_REQUEST_RECEIVED") ||
    normalized.includes("INCOMING_ACCESS")
  ) {
    return {
      icon: KeyRound,
      iconColor: "text-primary bg-primary-50 border-primary/20",
      route: "/app/student/project-requests",
      routeLabel: "Review Project Requests",
    };
  }

  if (normalized.includes("ACCESS_REQUEST")) {
    return {
      icon: KeyRound,
      iconColor: "text-primary bg-primary-50 border-primary/20",
      route: "/app/student/access-requests",
      routeLabel: "View Access Requests",
    };
  }

  if (normalized.includes("PROPOSAL_APPROVED")) {
    return {
      icon: CheckCircle2,
      iconColor: "text-success-700 bg-success-50 border-success-200",
      route: "/app/student/proposals",
      routeLabel: "View Proposals",
    };
  }

  if (normalized.includes("PROPOSAL_REJECTED")) {
    return {
      icon: AlertCircle,
      iconColor: "text-danger-700 bg-danger-50 border-danger-200",
      route: "/app/student/proposals",
      routeLabel: "View & Resubmit Proposal",
    };
  }

  if (normalized.includes("PROPOSAL")) {
    return {
      icon: FileText,
      iconColor: "text-primary bg-primary-50 border-primary/20",
      route: "/app/student/proposals",
      routeLabel: "View Proposals",
    };
  }

  return {
    icon: Bell,
    iconColor: "text-primary bg-primary-50 border-primary/20",
    route: null,
    routeLabel: null,
  };
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onInitiateDelete,
  compact = false,
  isAdmin: propIsAdmin,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRead = Boolean(notification.isRead);

  const isAdmin =
    typeof propIsAdmin === "boolean"
      ? propIsAdmin
      : user?.role?.toUpperCase() === "ADMIN";

  const typeConfig = getNotificationTypeConfig(notification.type, isAdmin);
  const TypeIcon = typeConfig.icon;

  const handleClick = (e) => {
    // If clicking directly on delete button, do not navigate
    if (e.target.closest("button[data-delete-btn]")) return;

    if (!isRead && onMarkAsRead) {
      onMarkAsRead(notification);
    }

    if (typeConfig.route) {
      navigate(typeConfig.route);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex items-start justify-between gap-3.5 rounded-xl border p-4 transition-all ${
        isRead
          ? "border-border bg-surface hover:border-border-strong"
          : "border-primary/30 bg-primary-50/20 shadow-nexora-sm hover:border-primary/50"
      } ${typeConfig.route ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Icon & Unread Indicator */}
        <div className="relative shrink-0 mt-0.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${typeConfig.iconColor}`}
          >
            <TypeIcon className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          {!isRead && (
            <span
              className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-surface"
              title="Unread"
            />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm tracking-tight leading-snug ${
                isRead
                  ? "font-semibold text-foreground"
                  : "font-bold text-foreground"
              }`}
            >
              {notification.title || "Notification"}
            </h4>

            {notification.createdAt && (
              <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                {formatDate(notification.createdAt)}
              </span>
            )}
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {notification.message}
          </p>

          {!compact && typeConfig.route && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline">
                <span>{typeConfig.routeLabel}</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Action Button */}
      <div className="shrink-0 pl-1">
        <button
          type="button"
          data-delete-btn
          onClick={(e) => {
            e.stopPropagation();
            onInitiateDelete(notification);
          }}
          aria-label={`Delete notification: ${
            notification.title || "notification"
          }`}
          className="rounded-lg p-1.5 text-muted-foreground opacity-60 hover:opacity-100 hover:bg-danger-50 hover:text-danger-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default NotificationCard;
