/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Layouts & Guard Components (Synchronous for fast route shell evaluation)
import PublicLayout from "@/layouts/PublicLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";
import ProtectedRoute from "@/app/router/ProtectedRoute";
import RoleRoute from "@/app/router/RoleRoute";
import AppIndexRedirect from "@/app/router/AppIndexRedirect";

// Lazy-Loaded Page Components
const LandingPage = lazy(() => import("@/features/landing/LandingPage"));
const LoginPage = lazy(() => import("@/features/auth/login/LoginPage"));
const RegistrationChoicePage = lazy(
  () => import("@/features/auth/registration/RegistrationChoicePage")
);
const StudentRegistrationPage = lazy(
  () => import("@/features/auth/registration/StudentRegistrationPage")
);
const CollegeRegistrationPage = lazy(
  () => import("@/features/auth/registration/CollegeRegistrationPage")
);
const EmailVerificationPage = lazy(
  () => import("@/features/auth/verification/EmailVerificationPage")
);

// Lazy-Loaded Student Pages
const StudentDashboardPage = lazy(
  () => import("@/features/student/StudentDashboardPage")
);
const StudentProjectsPage = lazy(
  () => import("@/features/student/StudentProjectsPage")
);
const StudentCreateProjectPage = lazy(
  () => import("@/features/student/StudentCreateProjectPage")
);
const StudentEditProjectPage = lazy(
  () => import("@/features/student/StudentEditProjectPage")
);
const StudentProjectDetailPage = lazy(
  () => import("@/features/student/StudentProjectDetailPage")
);
const StudentFeaturedProjectsPage = lazy(
  () => import("@/features/student/StudentFeaturedProjectsPage")
);
const StudentProposalsPage = lazy(
  () => import("@/features/student/StudentProposalsPage")
);
const StudentAccessRequestsPage = lazy(
  () => import("@/features/student/StudentAccessRequestsPage")
);
const StudentProjectRequestsPage = lazy(
  () => import("@/features/student/StudentProjectRequestsPage")
);
const StudentRecommendationsPage = lazy(
  () => import("@/features/student/StudentRecommendationsPage")
);
const StudentNotificationsPage = lazy(
  () => import("@/features/student/StudentNotificationsPage")
);
const StudentProfilePage = lazy(
  () => import("@/features/student/StudentProfilePage")
);

// Lazy-Loaded Admin Pages
const AdminDashboardPage = lazy(
  () => import("@/features/admin/AdminDashboardPage")
);
const AdminProjectsPage = lazy(
  () => import("@/features/admin/AdminProjectsPage")
);
const AdminProjectDetailPage = lazy(
  () => import("@/features/admin/AdminProjectDetailPage")
);
const AdminFeaturedProjectsPage = lazy(
  () => import("@/features/admin/AdminFeaturedProjectsPage")
);
const AdminApprovalsPage = lazy(
  () => import("@/features/admin/AdminApprovalsPage")
);
const AdminAIReviewPage = lazy(
  () => import("@/features/admin/AdminAIReviewPage")
);
const AdminReviewCriteriaPage = lazy(
  () => import("@/features/admin/AdminReviewCriteriaPage")
);
const AdminNotificationsPage = lazy(
  () => import("@/features/admin/AdminNotificationsPage")
);
const AdminProfilePage = lazy(
  () => import("@/features/admin/AdminProfilePage")
);

// Lazy-Loaded 404 Not Found Page
const NotFoundPage = lazy(() => import("@/components/common/NotFoundPage"));

/**
 * Clean, accessible route suspense fallback matching the Nexora design system.
 */
function PageLoadingFallback() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          Loading page...
        </p>
      </div>
    </div>
  );
}

/**
 * Helper to wrap lazy route components in a Suspense boundary with fallback.
 */
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoadingFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: withSuspense(LandingPage),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: withSuspense(LoginPage),
      },
      {
        path: "/register",
        element: withSuspense(RegistrationChoicePage),
      },
      {
        path: "/register/student",
        element: withSuspense(StudentRegistrationPage),
      },
      {
        path: "/register/college",
        element: withSuspense(CollegeRegistrationPage),
      },
      {
        path: "/verify-email/:token",
        element: withSuspense(EmailVerificationPage),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <AppIndexRedirect />,
          },
          {
            element: <RoleRoute allowedRole="STUDENT" />,
            children: [
              {
                path: "student/dashboard",
                element: withSuspense(StudentDashboardPage),
              },
              {
                path: "student/projects",
                element: withSuspense(StudentProjectsPage),
              },
              {
                path: "student/projects/new",
                element: withSuspense(StudentCreateProjectPage),
              },
              {
                path: "student/projects/:id",
                element: withSuspense(StudentProjectDetailPage),
              },
              {
                path: "student/projects/:id/edit",
                element: withSuspense(StudentEditProjectPage),
              },
              {
                path: "student/featured-projects",
                element: withSuspense(StudentFeaturedProjectsPage),
              },
              {
                path: "student/proposals",
                element: withSuspense(StudentProposalsPage),
              },
              {
                path: "student/access-requests",
                element: withSuspense(StudentAccessRequestsPage),
              },
              {
                path: "student/project-requests",
                element: withSuspense(StudentProjectRequestsPage),
              },
              {
                path: "student/recommendations",
                element: withSuspense(StudentRecommendationsPage),
              },
              {
                path: "student/notifications",
                element: withSuspense(StudentNotificationsPage),
              },
              {
                path: "student/profile",
                element: withSuspense(StudentProfilePage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRole="ADMIN" />,
            children: [
              {
                path: "admin/dashboard",
                element: withSuspense(AdminDashboardPage),
              },
              {
                path: "admin/projects",
                element: withSuspense(AdminProjectsPage),
              },
              {
                path: "admin/projects/:id",
                element: withSuspense(AdminProjectDetailPage),
              },
              {
                path: "admin/featured-projects",
                element: withSuspense(AdminFeaturedProjectsPage),
              },
              {
                path: "admin/approvals",
                element: withSuspense(AdminApprovalsPage),
              },
              {
                path: "admin/ai-review",
                element: withSuspense(AdminAIReviewPage),
              },
              {
                path: "admin/review-criteria",
                element: withSuspense(AdminReviewCriteriaPage),
              },
              {
                path: "admin/notifications",
                element: withSuspense(AdminNotificationsPage),
              },
              {
                path: "admin/profile",
                element: withSuspense(AdminProfilePage),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    // Catch-all route for any unmapped URLs
    path: "*",
    element: withSuspense(NotFoundPage),
  },
]);
