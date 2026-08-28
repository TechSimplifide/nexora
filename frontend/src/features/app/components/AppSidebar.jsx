import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  FileText,
  KeyRound,
  FolderKey,
  Sparkles,
  Bell,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import nexoraLogo from "@/assets/logos/nexora-logo.png";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useProfileImage } from "@/hooks/useProfileImage";

const studentNavItems = [
  { name: "Dashboard", href: "/app/student/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/app/student/projects", icon: FolderKanban },
  { name: "Featured Projects", href: "/app/student/featured-projects", icon: Star },
  { name: "My Proposals", href: "/app/student/proposals", icon: FileText },
  { name: "Access Requests", href: "/app/student/access-requests", icon: KeyRound },
  { name: "Project Requests", href: "/app/student/project-requests", icon: FolderKey },
  { name: "Recommendations", href: "/app/student/recommendations", icon: Sparkles },
  { name: "Notifications", href: "/app/student/notifications", icon: Bell },
];

const adminNavItems = [
  { name: "Dashboard", href: "/app/admin/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/app/admin/projects", icon: FolderKanban },
  { name: "Featured Projects", href: "/app/admin/featured-projects", icon: Star },
  { name: "Project Approvals", href: "/app/admin/approvals", icon: ClipboardCheck },
  { name: "Notifications", href: "/app/admin/notifications", icon: Bell },
];

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function AppSidebar({
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
}) {
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const navItems = isAdmin ? adminNavItems : studentNavItems;
  const profileHref = isAdmin ? "/app/admin/profile" : "/app/student/profile";

  const userId = user?._id || user?.id || user?.role || "user";
  const { profileImage } = useProfileImage(userId);

  const isIconOnly = isCollapsed && !isMobile;

  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-surface transition-[width] duration-200 ease-in-out select-none ${
        isIconOnly ? "w-[72px]" : "w-64"
      }`}
    >
      {/* 1. Sidebar Header: Single Horizontal Row */}
      <div
        className={`flex h-16 items-center justify-between border-b border-border shrink-0 ${
          isIconOnly ? "px-1.5" : "px-4"
        }`}
      >
        <Link
          to="/app"
          onClick={onClose}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md min-w-0"
          aria-label="Nexora Home"
          title={isIconOnly ? "Nexora" : undefined}
        >
          <img
            src={nexoraLogo}
            alt="Nexora"
            className="h-9 w-9 object-contain rounded-lg shadow-xs shrink-0"
          />
          {!isIconOnly && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold tracking-tight text-foreground text-base leading-none truncate">
                Nexora
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5 truncate">
                {isAdmin ? "Admin Portal" : "Student Portal"}
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse / Expand Button */}
        {!isMobile && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Mobile Close Button */}
        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-secondary hover:text-foreground lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 2. Navigation Links Area (Scrolls only if content genuinely exceeds available height) */}
      <nav
        className="flex-1 space-y-1.5 overflow-y-auto px-2.5 py-4 scrollbar-none"
        aria-label="Main Navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center rounded-xl transition-colors ${
                  isIconOnly
                    ? "justify-center h-10 w-full px-0"
                    : "gap-3 px-3 py-2.5 text-sm font-medium"
                } ${
                  isActive
                    ? "bg-primary-50 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-surface-secondary hover:text-foreground"
                }`
              }
              aria-label={item.name}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              {!isIconOnly && <span className="truncate">{item.name}</span>}

              {/* Accessible Floating Tooltip in Collapsed Mode */}
              {isIconOnly && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-nexora-md opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 3. User Identity at Bottom-Left (Clickable to Profile) */}
      <div className="border-t border-border p-2.5 shrink-0">
        {!isIconOnly ? (
          /* Expanded Mode: Full identity block */
          <Link
            to={profileHref}
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-secondary text-foreground group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`View ${user?.fullName || "User"} Profile`}
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary border border-primary/20 shrink-0 overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={user?.fullName || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{getInitials(user?.fullName)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                {user?.fullName || "User"}
              </p>
              <span className="inline-block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                {isAdmin ? "Admin" : "Student"}
              </span>
            </div>
          </Link>
        ) : (
          /* Collapsed Mode: Avatar Icon with Tooltip */
          <div className="flex justify-center py-1">
            <Link
              to={profileHref}
              onClick={onClose}
              className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary border border-primary/20 hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
              aria-label={`${user?.fullName || "User"} Profile`}
            >
              <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={user?.fullName || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user?.fullName)}</span>
                )}
              </div>

              {/* Accessible Floating Tooltip */}
              <div
                role="tooltip"
                className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-nexora-md opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {user?.fullName || "Profile"}
              </div>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

export default AppSidebar;
