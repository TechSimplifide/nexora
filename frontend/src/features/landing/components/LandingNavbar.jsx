import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/common/Logo";
import { useTheme } from "@/hooks/useTheme";

function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Nexora Home"
        >
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          <a
            href="#product"
            className="text-xs font-medium text-foreground-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            Product
          </a>
          <a
            href="#how-it-works"
            className="text-xs font-medium text-foreground-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            How It Works
          </a>
          <a
            href="#for-colleges"
            className="text-xs font-medium text-foreground-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            For Colleges
          </a>
          <a
            href="#capabilities"
            className="text-xs font-medium text-foreground-secondary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            Projects
          </a>
        </nav>

        {/* Desktop Auth CTAs & Theme Toggle */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isDark ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs font-medium">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="text-xs font-semibold">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground-secondary hover:bg-surface-secondary hover:text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-surface px-4 pb-6 pt-3 md:hidden animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
            <a
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            >
              Product
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            >
              How It Works
            </a>
            <a
              href="#for-colleges"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            >
              For Colleges
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            >
              Projects
            </a>
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
              >
                <span>Theme</span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                  {isDark ? (
                    <>
                      <Sun className="h-3.5 w-3.5" /> Dark
                    </>
                  ) : (
                    <>
                      <Moon className="h-3.5 w-3.5" /> Light
                    </>
                  )}
                </span>
              </button>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full justify-center text-xs">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full justify-center text-xs font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default LandingNavbar;
