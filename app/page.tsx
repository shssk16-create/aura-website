import LandingNav from "@/components/landing/Nav";
import LandingHero from "@/components/landing/Hero";
import AgentsGrid from "@/components/landing/AgentsGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import LandingFooter from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <LandingNav />
      <LandingHero />
      <AgentsGrid />
      <HowItWorks />
      <Pricing />
      <LandingFooter />
    </main>
  );
}
