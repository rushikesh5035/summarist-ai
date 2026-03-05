import CTA from "@/components/landing/CTA";
import FAQ from "@/components/landing/FAQ";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import UseCases from "@/components/landing/UseCases";

export default function Home() {
  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      <HeroSection />
      <Features />
      <Stats />
      <HowItWorks />
      <UseCases />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
