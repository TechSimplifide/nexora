import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";

function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
          {/* Brand & Mission Column */}
          <div className="md:col-span-6 space-y-3">
            <Link
              to="/"
              className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label="Nexora Home"
            >
              <Logo size="md" />
            </Link>
            <p className="max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
              An intelligent multi-college platform for project proposals, archives, access, and discovery.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 md:col-span-6">
            {/* Platform */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Platform
              </p>
              <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
                <li>
                  <a
                    href="#platform"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    Archive
                  </a>
                </li>
                <li>
                  <a
                    href="#capabilities"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    Proposals
                  </a>
                </li>
                <li>
                  <a
                    href="#platform"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    Discovery
                  </a>
                </li>
                <li>
                  <a
                    href="#capabilities"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    Recommendations
                  </a>
                </li>
              </ul>
            </div>

            {/* Access */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Access
              </p>
              <ul className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link
                    to="/login"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register/student"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    Student Registration
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register/college"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    College Registration
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/80 pt-6 text-center text-xs text-muted-foreground">
          <p>© 2026 Nexora</p>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
