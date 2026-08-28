import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";

function RoleRoute({ allowedRole }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role matches allowed role
  const userRole = user.role?.toUpperCase();
  const targetRole = allowedRole?.toUpperCase();

  if (userRole !== targetRole) {
    // Redirect to the appropriate dashboard for their actual role
    if (userRole === "ADMIN") {
      return <Navigate to="/app/admin/dashboard" replace />;
    }
    return <Navigate to="/app/student/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
