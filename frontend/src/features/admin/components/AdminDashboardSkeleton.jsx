function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="h-7 w-64 rounded bg-surface-secondary" />
          <div className="h-4 w-96 rounded bg-surface-secondary/70" />
        </div>
        <div className="h-8 w-36 rounded-xl bg-surface-secondary/60 shrink-0" />
      </div>

      {/* 2. KPIs Skeleton */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface p-4 sm:p-4.5 space-y-3 shadow-nexora-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-surface-secondary" />
              <div className="h-8 w-8 rounded-lg bg-surface-secondary" />
            </div>
            <div className="space-y-1.5">
              <div className="h-7 w-14 rounded bg-surface-secondary" />
              <div className="h-3 w-28 rounded bg-surface-secondary/70" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Analytics Charts Skeleton */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-nexora-sm">
          <div className="space-y-1.5">
            <div className="h-4.5 w-44 rounded bg-surface-secondary" />
            <div className="h-3 w-56 rounded bg-surface-secondary/70" />
          </div>
          <div className="h-44 rounded-lg bg-surface-secondary/40" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-nexora-sm">
          <div className="space-y-1.5">
            <div className="h-4.5 w-44 rounded bg-surface-secondary" />
            <div className="h-3 w-56 rounded bg-surface-secondary/70" />
          </div>
          <div className="h-44 rounded-lg bg-surface-secondary/40" />
        </div>
      </div>

      {/* 4. Insights Section Skeleton */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 space-y-3.5 shadow-nexora-sm">
          <div className="space-y-1.5">
            <div className="h-4.5 w-40 rounded bg-surface-secondary" />
            <div className="h-3 w-52 rounded bg-surface-secondary/70" />
          </div>
          <div className="space-y-2.5 pt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-3 w-24 rounded bg-surface-secondary" />
                  <div className="h-3 w-14 rounded bg-surface-secondary" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-secondary/60" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 space-y-3.5 shadow-nexora-sm">
          <div className="space-y-1.5">
            <div className="h-4.5 w-40 rounded bg-surface-secondary" />
            <div className="h-3 w-52 rounded bg-surface-secondary/70" />
          </div>
          <div className="space-y-2.5 pt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-3 w-24 rounded bg-surface-secondary" />
                  <div className="h-3 w-14 rounded bg-surface-secondary" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-secondary/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardSkeleton;
