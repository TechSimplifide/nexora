import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, LayoutDashboard, FileQuestion } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/features/auth/context/AuthContext";

/**
 * Nexora-branded 404 Not Found Page.
 * Responsive, accessible, supporting Light & Dark mode.
 */
function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const isUserAuthenticated = isAuthenticated && Boolean(user);
  const dashboardPath =
    user?.role?.toUpperCase() === "ADMIN"
      ? "/app/admin/dashboard"
      : "/app/student/dashboard";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Top Brand Bar */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-xs px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            aria-label="Nexora Home"
          >
            <Logo size="sm" />
          </Link>
          {isUserAuthenticated && (
            <Link to={dashboardPath}>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                <span>Dashboard</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Center 404 Card */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md text-center">
          {/* Icon Badge */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface shadow-xs">
            <FileQuestion className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>

          {/* 404 Label */}
          <div className="mb-2 inline-flex items-center rounded-full border border-primary/20 bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary">
            404 Error
          </div>

          {/* Heading & Explanation */}
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Page not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            The page you are looking for doesn't exist, has been removed, or is
            temporarily unavailable.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Go Back</span>
            </Button>

            {isUserAuthenticated ? (
              <Link to={dashboardPath}>
                <Button variant="primary" size="md" className="w-full gap-2 sm:w-auto">
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  <span>Go to Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link to="/">
                <Button variant="primary" size="md" className="w-full gap-2 sm:w-auto">
                  <Home className="h-4 w-4" aria-hidden="true" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Nexora. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default NotFoundPage;
