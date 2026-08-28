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
            <p className="max-w-sm text-xs text-muted-foreground leading-relaxed">
              The multi-tenant final year project management, approval, and archive platform for colleges.
            </p>
          </div>

          {/* Navigation & Access Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-6">
            {/* Platform Navigation */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Platform
              </p>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <a
                    href="#product"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    Product Overview
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#for-colleges"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    For Colleges
                  </a>
                </li>
                <li>
                  <a
                    href="#capabilities"
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                  >
                    Capabilities
                  </a>
                </li>
              </ul>
            </div>

            {/* Access Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Access
              </p>
              <ul className="mt-3 space-y-2 text-xs">
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
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-border/80 pt-6 text-center text-xs text-muted-foreground">
          <p>© 2026 Nexora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
