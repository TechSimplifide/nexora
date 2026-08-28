import { useEffect, useState, useCallback } from "react";
import { Building, AlertCircle, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getAdminDashboardAnalytics } from "@/services/dashboard.service";
import AdminDashboardKpis from "@/features/admin/components/AdminDashboardKpis";
import AdminProjectsByAcademicYearChart from "@/features/admin/components/AdminProjectsByAcademicYearChart";
import AdminProposalOverview from "@/features/admin/components/AdminProposalOverview";
import AdminPopularTechnologies from "@/features/admin/components/AdminPopularTechnologies";
import AdminTrendingDomains from "@/features/admin/components/AdminTrendingDomains";
import AdminDashboardSkeleton from "@/features/admin/components/AdminDashboardSkeleton";

function AdminDashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const collegeName =
    user?.college?.name ||
    (typeof user?.college === "string" ? user.college : null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAdminDashboardAnalytics();
      setAnalytics(response?.data || null);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load dashboard analytics. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await getAdminDashboardAnalytics();
        if (isMounted) {
          setAnalytics(response?.data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message ||
              "Unable to load dashboard analytics. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="rounded-2xl border border-danger-100 bg-surface p-8 text-center shadow-nexora-sm sm:p-12 space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-50 text-danger-600">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Unable to load dashboard analytics
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {error}
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={fetchAnalytics}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Lean Page Header (Matches Nexora SaaS Pattern) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.fullName || "Administrator"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Monitor student submissions, approvals, and your college project archive.
          </p>
        </div>

        {collegeName && (
          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground shadow-2xs sm:self-auto shrink-0">
            <Building className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[220px]">{collegeName}</span>
          </div>
        )}
      </div>

      {/* 2. KPI Summary Cards */}
      <section aria-labelledby="kpi-summary-heading">
        <h2 id="kpi-summary-heading" className="sr-only">
          KPI Metrics Summary
        </h2>
        <AdminDashboardKpis kpis={analytics?.kpis} />
      </section>

      {/* 3. Analytics: Projects By Academic Year & Proposal Overview */}
      <section
        aria-labelledby="analytics-charts-heading"
        className="grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        <h2 id="analytics-charts-heading" className="sr-only">
          Academic Year & Proposal Analytics
        </h2>
        <AdminProjectsByAcademicYearChart
          data={analytics?.projectsByAcademicYear}
        />
        <AdminProposalOverview data={analytics?.proposalOverview} />
      </section>

      {/* 4. Project Insights: Popular Technologies & Trending Domains */}
      <section
        aria-labelledby="project-insights-heading"
        className="grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        <h2 id="project-insights-heading" className="sr-only">
          Technology & Domain Insights
        </h2>
        <AdminPopularTechnologies data={analytics?.popularTechnologies} />
        <AdminTrendingDomains data={analytics?.trendingDomains} />
      </section>
    </div>
  );
}

export default AdminDashboardPage;
