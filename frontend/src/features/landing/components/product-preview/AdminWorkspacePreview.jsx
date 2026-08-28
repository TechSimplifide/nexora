import {
  Users,
  FolderKanban,
  Clock,
  Star,
} from "lucide-react";
import AdminAiReviewPreview from "./AdminAiReviewPreview";
import AdminChartsPreview from "./AdminChartsPreview";

/**
 * AdminWorkspacePreview
 * Unified, single-view preview of the authentic Administrator Workspace / Institutional Control Center.
 * Integrates KPIs, Proposal Review Pipeline, AI-Assisted Proposal Review panel, and Curriculum analytics.
 */
function AdminWorkspacePreview() {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. 4 Authentic Admin KPI Cards (Matches AdminDashboardKpis.jsx) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Students */}
        <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Students
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary border border-primary/20">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">640</div>
          <p className="text-[10px] text-muted-foreground">Enrolled student accounts</p>
        </div>

        {/* Total Projects */}
        <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Projects
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-secondary text-foreground-secondary border border-border/60">
              <FolderKanban className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">248</div>
          <p className="text-[10px] text-muted-foreground">Archived college projects</p>
        </div>

        {/* Pending Proposals with Action Needed Highlight */}
        <div className="rounded-xl border border-warning-300/80 bg-warning-50/15 ring-1 ring-warning-200/50 p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Pending
              </span>
              <span className="rounded-md bg-warning-100/80 px-1.5 py-0.2 text-[9px] font-bold text-warning-900 border border-warning-200/60">
                Action needed
              </span>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning-50 text-warning-800 border border-warning-200">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">12</div>
          <p className="text-[10px] text-warning-800 font-medium">Submissions awaiting review</p>
        </div>

        {/* Featured Projects */}
        <div className="rounded-xl border border-border bg-surface p-3.5 sm:p-4 shadow-nexora-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Featured
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning-50 text-warning-700 border border-warning-200">
              <Star className="h-3.5 w-3.5 fill-warning-600 text-warning-600" aria-hidden="true" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">16</div>
          <p className="text-[10px] text-muted-foreground">Showcased capstones</p>
        </div>
      </div>

      {/* 2. AI-Assisted Proposal Review Panel (New Core Capability) */}
      <AdminAiReviewPreview />

      {/* 3. Proposal Review Pipeline Overview (Matches AdminProposalOverview.jsx) */}
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-nexora-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Proposal Review Pipeline</h3>
            <p className="text-xs text-muted-foreground">
              Current student project submissions distribution
            </p>
          </div>
          <span className="text-xs font-semibold text-foreground px-2.5 py-0.5 rounded-md bg-surface-secondary border border-border/60">
            <strong className="font-bold">42</strong> Total Submissions
          </span>
        </div>

        {/* Proportional Segmented Color Bar */}
        <div className="space-y-1.5">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-secondary border border-border/60">
            <div
              style={{ width: "62%" }}
              className="bg-success-500 transition-all duration-500"
              title="Approved: 62%"
            />
            <div
              style={{ width: "28%" }}
              className="bg-warning-500 transition-all duration-500"
              title="Pending: 28%"
            />
            <div
              style={{ width: "10%" }}
              className="bg-danger-500 transition-all duration-500"
              title="Rejected: 10%"
            />
          </div>

          {/* Status Breakdown Labels */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
            <span className="flex items-center gap-1 font-medium text-success-700">
              <span className="h-2 w-2 rounded-full bg-success-500" />
              26 Approved (62%)
            </span>
            <span className="flex items-center gap-1 font-medium text-warning-800">
              <span className="h-2 w-2 rounded-full bg-warning-500" />
              12 Pending (28%)
            </span>
            <span className="flex items-center gap-1 font-medium text-danger-700">
              <span className="h-2 w-2 rounded-full bg-danger-500" />
              4 Rejected (10%)
            </span>
          </div>
        </div>
      </div>

      {/* 4. Authentic SVG Analytics Charts (Tech adoption column chart, Domain treemap, Volume trendline) */}
      <AdminChartsPreview />
    </div>
  );
}

export default AdminWorkspacePreview;
