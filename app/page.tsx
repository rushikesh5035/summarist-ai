import Features from "@/components/landing/Features";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import UseCases from "@/components/landing/UseCases";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <HeroSection />
      <Features />
      <Stats />
      <HowItWorks />
      <UseCases />
    </div>
  );
}
