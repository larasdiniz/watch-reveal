import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MediaCardGallery from "@/components/MediaCardGallery";
import FeatureStory from "@/components/FeatureStory";
import BentoGrid from "@/components/BentoGrid";
import ComparisonSection from "@/components/ComparisonSection";
import IconCardsSection from "@/components/IconCardsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <Header />
      <HeroSection />
      <MediaCardGallery />
      <FeatureStory />
      <BentoGrid />
      <ComparisonSection />
      <IconCardsSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
