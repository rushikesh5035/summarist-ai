import Features from "@/components/landing/Features";
import HeroSection from "@/components/landing/HeroSection";
import Stats from "@/components/landing/Stats";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <HeroSection />
      <Features />
      <Stats />
    </div>
  );
}
