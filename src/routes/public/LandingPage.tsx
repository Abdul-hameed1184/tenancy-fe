import { EliteListingsSection } from "./sections/EliteListingsSection";
import { FinalCtaSection } from "./sections/FinalCtaSection";
import { HeroSection } from "./sections/HeroSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { RoleEcosystemSection } from "./sections/RoleEcosystemSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { TrustStatsSection } from "./sections/TrustStatsSection";

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <TrustStatsSection />
      <EliteListingsSection />
      <HowItWorksSection />
      <RoleEcosystemSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </div>
  );
}
