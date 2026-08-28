import { Link } from "react-router-dom";
import { GraduationCap, Building2, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/common/Logo";

function RegistrationChoicePage() {
  return (
    <div className="w-full max-w-4xl px-4 py-8 sm:px-6">
      {/* Brand & Page Header */}
      <div className="mb-8 text-center sm:mb-10">
        <Link
          to="/"
          className="inline-flex items-center transition-opacity hover:opacity-90 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Logo size="lg" textClassName="text-xl" />
        </Link>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Create your Nexora account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Choose how you&apos;ll use Nexora to get started.
        </p>
      </div>

      {/* Selection Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Student Selection Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm transition-colors hover:border-border-strong sm:p-8">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Student</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Submit projects, explore previous work, and manage your project journey within your
              college workspace.
            </p>
          </div>
          <div className="mt-8 border-t border-border pt-4">
            <Link to="/register/student" className="block w-full">
              <Button variant="primary" size="md" className="w-full justify-center">
                Continue as Student
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* College Admin Selection Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-nexora-sm transition-colors hover:border-border-strong sm:p-8">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground">College Admin</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Create and manage your college workspace, review projects, and oversee student
              submissions.
            </p>
          </div>
          <div className="mt-8 border-t border-border pt-4">
            <Link to="/register/college" className="block w-full">
              <Button variant="outline" size="md" className="w-full justify-center">
                Continue as College Admin
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Login Link Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

export default RegistrationChoicePage;
