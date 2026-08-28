import { MotionConfig } from "motion/react";
import LandingNavbar from "./components/LandingNavbar";
import HeroSection from "./components/HeroSection";
import ProductPreview from "./components/ProductPreview";
import CapabilitiesSection from "./components/CapabilitiesSection";
import MultiCollegeSection from "./components/MultiCollegeSection";
import HowItWorksSection from "./components/HowItWorksSection";
import WhyNexoraSection from "./components/WhyNexoraSection";
import FinalCTASection from "./components/FinalCTASection";
import LandingFooter from "./components/LandingFooter";

function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <LandingNavbar />
        <main>
          <HeroSection />
          <ProductPreview />
          <CapabilitiesSection />
          <MultiCollegeSection />
          <HowItWorksSection />
          <WhyNexoraSection />
          <FinalCTASection />
        </main>
        <LandingFooter />
      </div>
    </MotionConfig>
  );
}

export default LandingPage;
