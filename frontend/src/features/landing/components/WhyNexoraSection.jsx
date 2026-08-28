import { ShieldCheck, Lock, FileCheck2, Archive } from "lucide-react";

function WhyNexoraSection() {
  const guarantees = [
    {
      title: "Multi-Tenant Isolation",
      description:
        "Each college operates within its own private workspace. Student submissions, faculty reviews, and projects remain strictly isolated.",
      icon: Lock,
    },
    {
      title: "Role-Based Access Control",
      description:
        "Distinct authentication and permission boundaries for students and administrators ensure authorized faculty review and secure management.",
      icon: ShieldCheck,
    },
    {
      title: "In-App Document Security",
      description:
        "Supporting research PDFs and technical specifications open securely inside the application interface without exposing raw external URLs.",
      icon: FileCheck2,
    },
    {
      title: "Permanent Academic Archive",
      description:
        "Eliminate lost drive folders and scattered emails. Past academic capstones remain indexed and searchable for accreditation and future cohorts.",
      icon: Archive,
    },
  ];

  return (
    <section className="border-t border-border bg-surface py-16 md:py-28 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Institutional Trust
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for institutional governance and data integrity.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Nexora delivers the security and structure required for academic repositories and accreditation audits.
          </p>
        </div>

        {/* 4 Architectural Guarantees Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 shadow-nexora-sm transition-all hover:border-border-strong hover:shadow-nexora-md"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20 mb-5">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyNexoraSection;
