import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CraftsmanshipSection from "@/components/CraftsmanshipSection";
import SpecsSection from "@/components/SpecsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CraftsmanshipSection />
      <SpecsSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
