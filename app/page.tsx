import BgGradient from "@/components/common/BgGradient";
import CTASection from "@/components/home/CTASection";
import DemoSection from "@/components/home/DemoSection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorkSection from "@/components/home/HowItWorkSection";
import PricingSection from "@/components/home/PricingSection";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <HowItWorkSection />
        <PricingSection />
        <CTASection />
      </div>
    </div>
  );
}
