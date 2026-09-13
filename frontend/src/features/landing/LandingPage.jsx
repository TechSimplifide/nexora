import { MotionConfig } from "motion/react";
import LandingNavbar from "./components/LandingNavbar";
import HeroSection from "./components/HeroSection";
import ProductValueSection from "./components/ProductValueSection";
import WorkspacesSection from "./components/WorkspacesSection";
import AiSection from "./components/AiSection";
import MultiCollegeSection from "./components/MultiCollegeSection";
import GovernanceSection from "./components/GovernanceSection";
import FinalCTASection from "./components/FinalCTASection";
import LandingFooter from "./components/LandingFooter";

function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <LandingNavbar />
        <main>
          {/* Section 1: Hero */}
          <HeroSection />

          {/* Section 2: Platform Mental Model */}
          <ProductValueSection />

          {/* Section 3: Two Purpose-Built Workspaces */}
          <WorkspacesSection />

          {/* Section 5: AI Intelligence */}
          <AiSection />

          {/* Section 6: Multi-College / Multi-Tenant */}
          <MultiCollegeSection />

          {/* Section 7: Institutional Governance */}
          <GovernanceSection />

          {/* Section 8: Final CTA */}
          <FinalCTASection />
        </main>
        {/* Section 9: Footer */}
        <LandingFooter />
      </div>
    </MotionConfig>
  );
}

export default LandingPage;

