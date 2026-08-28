import { Building } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";

function StudentDashboardHeader() {
  const { user } = useAuth();
  const collegeName =
    user?.college?.name ||
    (typeof user?.college === "string" ? user.college : null);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome back, {user?.fullName || "Student"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your projects.
        </p>
      </div>

      {collegeName && (
        <div className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground shadow-xs sm:self-auto">
          <Building className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
          <span className="truncate max-w-[220px]">{collegeName}</span>
        </div>
      )}
    </div>
  );
}

export default StudentDashboardHeader;
