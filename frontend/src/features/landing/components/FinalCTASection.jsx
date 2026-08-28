import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

function FinalCTASection() {
  return (
    <section className="border-t border-border bg-background py-20 md:py-32 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Build a better project archive for your college.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Bring proposals, projects, approvals, and institutional knowledge into one structured, intelligent workspace.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto gap-2 font-semibold shadow-nexora-sm">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTASection;
