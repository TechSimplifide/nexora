import { FolderGit2, Send, Inbox } from "lucide-react";

function StudentDashboardKpis({ kpis }) {
  const cards = [
    {
      title: "Project Contributions",
      value: kpis?.projectContributions ?? 0,
      description: "Projects you've contributed",
      icon: FolderGit2,
      iconBg: "bg-primary-50 text-primary",
    },
    {
      title: "Access Requests Sent",
      value: kpis?.accessRequestsSent ?? 0,
      description: "Requests you've submitted",
      icon: Send,
      iconBg: "bg-surface-secondary text-foreground-secondary",
    },
    {
      title: "Access Requests Received",
      value: kpis?.accessRequestsReceived ?? 0,
      description: "Requests for your projects",
      icon: Inbox,
      iconBg: "bg-surface-secondary text-foreground-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-nexora-sm transition-shadow hover:shadow-nexora-md"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.iconBg}`}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {card.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StudentDashboardKpis;
