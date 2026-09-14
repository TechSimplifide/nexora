import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/features/app/components/AppSidebar";
import AppHeader from "@/features/app/components/AppHeader";

function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("nexora-sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("nexora-sidebar-collapsed", String(next));
      } catch {
        // Ignore localStorage error
      }
      return next;
    });
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar (Fixed viewport height, persistent collapse width) */}
      <div className="hidden lg:flex lg:shrink-0 h-full">
        <AppSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* Mobile Sidebar (Drawer Overlay - always full width) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Sidebar */}
          <div className="relative z-50 flex w-64 flex-1">
            <AppSidebar
              onClose={() => setIsMobileSidebarOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Main Content Column (Viewport-height constrained with dedicated internal scrolling) */}
      <div className="flex flex-1 flex-col h-full min-w-0 min-h-0 overflow-hidden">
        <AppHeader
          onToggleMobileSidebar={() =>
            setIsMobileSidebarOpen(!isMobileSidebarOpen)
          }
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
