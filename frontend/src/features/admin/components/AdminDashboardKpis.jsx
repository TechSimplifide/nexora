import { Link } from "react-router-dom";
import { Users, FolderKanban, Clock, Star, ArrowUpRight } from "lucide-react";

function AdminDashboardKpis({ kpis }) {
  const pendingCount = Number(kpis?.pendingProposals) || 0;
  const hasPending = pendingCount > 0;

  const cards = [
    {
      title: "Total Students",
      value: kpis?.totalStudents ?? 0,
      description: "Enrolled student accounts",
      icon: Users,
      iconBg: "bg-primary-50 text-primary border border-primary/20",
      to: null,
    },
    {
      title: "Total Projects",
      value: kpis?.totalProjects ?? 0,
      description: "Archived college projects",
      icon: FolderKanban,
      iconBg: "bg-surface-secondary text-foreground-secondary border border-border/60",
      to: "/app/admin/projects",
      actionText: "View archive",
    },
    {
      title: "Pending Proposals",
      value: pendingCount,
      description: hasPending
        ? "Action required on submissions"
        : "All submissions reviewed",
      icon: Clock,
      iconBg: hasPending
        ? "bg-warning-50 text-warning-800 border border-warning-200"
        : "bg-surface-secondary text-muted-foreground border border-border/60",
      to: "/app/admin/approvals",
      actionText: hasPending ? "Review approvals" : "View approvals",
      highlight: hasPending,
      badgeText: hasPending ? "Action needed" : null,
    },
    {
      title: "Featured Projects",
      value: kpis?.featuredProjects ?? 0,
      description: "Showcased institutional work",
      icon: Star,
      iconBg: "bg-warning-50 text-warning-700 border border-warning-200",
      to: "/app/admin/projects",
      actionText: "Manage featured",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const CardContent = (
          <div
            className={`group relative flex flex-col justify-between rounded-xl border bg-surface p-4 sm:p-4.5 shadow-nexora-sm transition-all h-full ${
              card.to
                ? "cursor-pointer hover:border-border-strong hover:shadow-nexora-md"
                : "border-border"
            } ${
              card.highlight
                ? "border-warning-300/80 bg-warning-50/15 ring-1 ring-warning-200/50"
                : "border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                    {card.title}
                  </span>
                  {card.badgeText && (
                    <span className="rounded-md bg-warning-100/80 px-1.5 py-0.5 text-[9px] font-bold text-warning-900 border border-warning-200/60 shrink-0">
                      {card.badgeText}
                    </span>
                  )}
                </div>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${card.iconBg}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-2.5">
                <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {card.value}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </div>

            {card.to && (
              <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                <span>{card.actionText}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            )}
          </div>
        );

        if (card.to) {
          return (
            <Link
              key={card.title}
              to={card.to}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
              aria-label={`${card.title}: ${card.value}. ${card.description}`}
            >
              {CardContent}
            </Link>
          );
        }

        return <div key={card.title}>{CardContent}</div>;
      })}
    </div>
  );
}

export default AdminDashboardKpis;
