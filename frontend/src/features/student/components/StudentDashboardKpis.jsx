import { Link } from "react-router-dom";
import { FolderGit2, Send, Inbox, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function StudentDashboardKpis({ kpis }) {
  const cards = [
    {
      title: "Project Contributions",
      value: kpis?.projectContributions ?? 0,
      description: "Projects you've contributed",
      icon: FolderGit2,
      iconBg: "bg-primary-50 text-primary",
      to: "/app/student/projects",
      actionText: "View projects",
    },
    {
      title: "Access Requests Sent",
      value: kpis?.accessRequestsSent ?? 0,
      description: "Requests you've submitted",
      icon: Send,
      iconBg: "bg-surface-secondary text-foreground-secondary",
      to: "/app/student/access-requests",
      actionText: "View sent requests",
    },
    {
      title: "Access Requests Received",
      value: kpis?.accessRequestsReceived ?? 0,
      description: "Requests for your projects",
      icon: Inbox,
      iconBg: "bg-surface-secondary text-foreground-secondary",
      to: "/app/student/project-requests",
      actionText: "Review requests",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const CardContent = (
          <div
            className={`group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-nexora-sm transition-all h-full ${
              card.to
                ? "cursor-pointer hover:border-border-strong hover:shadow-nexora-md"
                : ""
            }`}
          >
            <div>
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

            {card.to && (
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
                <span>{card.actionText}</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        );

        if (card.to) {
          return (
            <motion.div
              key={card.title}
              variants={cardVariants}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={card.to}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl block h-full"
                aria-label={`${card.title}: ${card.value}. ${card.description}`}
              >
                {CardContent}
              </Link>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={card.title}
            variants={cardVariants}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {CardContent}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default StudentDashboardKpis;
