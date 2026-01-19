import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MediaCardGallery from "@/components/MediaCardGallery";
import FeatureStory from "@/components/FeatureStory";
import BentoGrid from "@/components/BentoGrid";
import ComparisonSection from "@/components/ComparisonSection";
import IconCardsSection from "@/components/IconCardsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useLoading } from "@/contexts/LoadingContext";

const Index = () => {
  const { isLoading } = useLoading();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

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