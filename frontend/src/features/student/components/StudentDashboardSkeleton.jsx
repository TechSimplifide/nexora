function StudentDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-label="Loading dashboard content">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-surface-secondary" />
          <div className="h-4 w-48 rounded-lg bg-surface-secondary/70" />
        </div>
        <div className="h-9 w-44 rounded-xl bg-surface-secondary" />
      </div>

      {/* KPIs Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-nexora-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-32 rounded bg-surface-secondary" />
              <div className="h-9 w-9 rounded-lg bg-surface-secondary" />
            </div>
            <div className="space-y-1.5">
              <div className="h-7 w-16 rounded bg-surface-secondary" />
              <div className="h-3 w-36 rounded bg-surface-secondary/60" />
            </div>
          </div>
        ))}
      </div>

      {/* Proposal Skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-32 rounded bg-surface-secondary" />
        <div className="rounded-xl border border-border bg-surface p-6 space-y-4 shadow-nexora-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-6 w-3/4 rounded bg-surface-secondary" />
              <div className="h-4 w-1/3 rounded bg-surface-secondary/70" />
            </div>
            <div className="h-7 w-24 rounded-full bg-surface-secondary" />
          </div>
        </div>
      </div>

      {/* Discover Projects Skeleton */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="h-5 w-40 rounded bg-surface-secondary" />
          <div className="h-3.5 w-60 rounded bg-surface-secondary/60" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface p-5 space-y-3 shadow-nexora-sm"
            >
              <div className="flex justify-between">
                <div className="h-3 w-20 rounded bg-surface-secondary" />
                <div className="h-4 w-16 rounded bg-surface-secondary" />
              </div>
              <div className="h-5 w-4/5 rounded bg-surface-secondary" />
              <div className="space-y-1.5 pt-1">
                <div className="h-3 w-full rounded bg-surface-secondary/60" />
                <div className="h-3 w-2/3 rounded bg-surface-secondary/60" />
              </div>
              <div className="flex gap-2 pt-3 border-t border-border/50">
                <div className="h-5 w-12 rounded bg-surface-secondary" />
                <div className="h-5 w-14 rounded bg-surface-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardSkeleton;
