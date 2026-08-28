import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";

function AppIndexRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <p className="text-xs text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (user?.role?.toUpperCase() === "ADMIN") {
    return <Navigate to="/app/admin/dashboard" replace />;
  }

  return <Navigate to="/app/student/dashboard" replace />;
}

export default AppIndexRedirect;
