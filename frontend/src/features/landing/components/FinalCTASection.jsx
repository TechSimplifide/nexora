import { Link } from "react-router-dom";
import { ArrowRight, Building } from "lucide-react";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";

// Final conversion and call-to-action panel.
function FinalCTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-surface py-20 md:py-28 transition-colors">
      {/* Subtle atmospheric glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-full max-w-4xl opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-primary-500) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto max-w-4xl rounded-3xl border border-border bg-background p-8 sm:p-12 lg:p-14 shadow-nexora-md text-center space-y-6"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
            <Building className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Institutional Workspace</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] text-balance">
            Bring your institution&apos;s project lifecycle into one workspace.
          </h2>

          <p className="text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Give students a structured place to propose and build. Give administrators the visibility and governance to review, preserve, and discover institutional work.
          </p>

          <div className="pt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto gap-2 font-semibold shadow-nexora-sm transition-shadow hover:shadow-nexora-md"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-medium shadow-2xs"
                >
                  Sign In
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTASection;
