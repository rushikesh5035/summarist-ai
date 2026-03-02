import Features from "@/components/landing/Features";
import HeroSection from "@/components/landing/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <HeroSection />
      <Features />
    </div>
  );
}
