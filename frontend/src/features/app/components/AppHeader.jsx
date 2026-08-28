import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Menu,
  Bell,
  CheckCheck,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import {
  getUnreadNotificationCount,
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notification.service";
import NotificationCard from "@/components/common/NotificationCard";

const routeTitleMap = {
  "/app/student/dashboard": "Dashboard",
  "/app/student/projects": "Projects",
  "/app/student/projects/new": "Upload Project",
  "/app/student/featured-projects": "Featured Projects",
  "/app/student/proposals": "My Proposals",
  "/app/student/access-requests": "Access Requests",
  "/app/student/project-requests": "Project Requests",
  "/app/student/recommendations": "Recommendations",
  "/app/student/notifications": "Notifications",
  "/app/student/profile": "Profile",
  "/app/admin/dashboard": "Dashboard",
  "/app/admin/projects": "Projects",
  "/app/admin/featured-projects": "Featured Projects",
  "/app/admin/approvals": "Project Approvals",
  "/app/admin/ai-review": "AI Proposal Review",
  "/app/admin/review-criteria": "Review Criteria",
  "/app/admin/notifications": "Notifications",
  "/app/admin/profile": "Profile",
};

function AppHeader({ onToggleMobileSidebar }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // Notification Dropdown State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const notificationMenuRef = useRef(null);

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const notificationsLink = isAdmin
    ? "/app/admin/notifications"
    : "/app/student/notifications";

  let currentTitle = routeTitleMap[location.pathname];
  if (!currentTitle) {
    if (location.pathname.endsWith("/edit")) {
      currentTitle = "Edit Project";
    } else if (location.pathname.startsWith("/app/student/projects/")) {
      currentTitle = "Project Details";
    } else if (location.pathname.startsWith("/app/admin/projects/")) {
      currentTitle = "Project Details";
    } else {
      currentTitle = "Workspace";
    }
  }

  // Fetch unread count on mount, route changes, & custom sync event
  useEffect(() => {
    let isMounted = true;

    async function loadCount() {
      try {
        const res = await getUnreadNotificationCount();
        if (isMounted) {
          setUnreadCount(Number(res?.data?.count) || 0);
        }
      } catch {
        // Silently ignore badge count failure
      }
    }

    loadCount();

    const handleNotificationUpdate = () => {
      loadCount();
    };

    window.addEventListener("nexora:notifications-updated", handleNotificationUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("nexora:notifications-updated", handleNotificationUpdate);
    };
  }, [location.pathname]);

  // Fetch recent notifications when opening dropdown
  const loadRecentNotifications = useCallback(async () => {
    setIsLoadingNotifications(true);
    setNotificationError(null);
    try {
      const res = await getMyNotifications();
      const list = Array.isArray(res?.data) ? res.data : [];
      setNotifications(list);
      const unread = list.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      setNotificationError(
        err.message || "Unable to load recent notifications."
      );
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  const handleToggleNotifications = () => {
    const nextState = !isNotificationOpen;
    setIsNotificationOpen(nextState);

    if (nextState) {
      loadRecentNotifications();
    }
  };

  const handleMarkOneAsRead = async (item) => {
    if (item.isRead) return;

    try {
      await markNotificationAsRead(item._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new CustomEvent("nexora:notifications-updated"));
    } catch {
      // ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      window.dispatchEvent(new CustomEvent("nexora:notifications-updated"));
    } catch {
      // ignore
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const recentList = notifications.slice(0, 5);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open sidebar navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-secondary hover:text-foreground lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-base font-semibold text-foreground sm:text-lg">
          {currentTitle}
        </h1>
      </div>

      {/* Right: Actions Center (Theme Toggle & Notifications) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isDark ? (
            <Sun className="h-4.5 w-4.5 transition-transform hover:rotate-45 duration-200" />
          ) : (
            <Moon className="h-4.5 w-4.5 transition-transform hover:-rotate-12 duration-200" />
          )}
        </button>

        {/* Notifications Dropdown Container */}
        <div className="relative" ref={notificationMenuRef}>
          <button
            type="button"
            onClick={handleToggleNotifications}
            aria-expanded={isNotificationOpen}
            aria-haspopup="true"
            aria-label={`View notifications, ${unreadCount} unread`}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-xs">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Preview Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-surface shadow-nexora-lg z-30 overflow-hidden animate-in fade-in duration-150">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-surface">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Dropdown Body */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                {isLoadingNotifications ? (
                  <div className="space-y-2 p-2 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-border bg-surface p-3 space-y-2"
                      >
                        <div className="h-3.5 w-36 rounded bg-surface-secondary" />
                        <div className="h-3 w-full rounded bg-surface-secondary/70" />
                      </div>
                    ))}
                  </div>
                ) : notificationError ? (
                  <div className="p-4 text-center space-y-2">
                    <AlertCircle className="mx-auto h-5 w-5 text-danger-600" />
                    <p className="text-xs text-muted-foreground">
                      {notificationError}
                    </p>
                    <button
                      type="button"
                      onClick={loadRecentNotifications}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                ) : recentList.length === 0 ? (
                  <div className="p-6 text-center space-y-1.5">
                    <Bell className="mx-auto h-6 w-6 text-muted-foreground/60" />
                    <p className="text-xs font-semibold text-foreground">
                      No notifications yet
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      You&apos;re all caught up. New project updates and access requests will appear here.
                    </p>
                  </div>
                ) : (
                  recentList.map((item) => (
                    <NotificationCard
                      key={item._id}
                      notification={item}
                      compact={true}
                      onMarkAsRead={handleMarkOneAsRead}
                      onInitiateDelete={(toDelete) => {
                        // Remove from preview
                        setNotifications((prev) =>
                          prev.filter((n) => n._id !== toDelete._id)
                        );
                      }}
                    />
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="border-t border-border/80 p-2.5 bg-surface-secondary/30 text-center">
                <Link
                  to={notificationsLink}
                  onClick={() => setIsNotificationOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>View all notifications</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
