import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroWatch {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

const HeroSection = () => {
  const [heroWatch, setHeroWatch] = useState<HeroWatch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroWatch = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/watches?limit=1');
        if (response.ok) {
          const watches = await response.json();
          if (watches.length > 0) {
            setHeroWatch(watches[0]);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar relógio do herói:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroWatch();
  }, []);

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-background pointer-events-none" />
     
      <div className="relative z-10 text-center section-padding pt-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gold uppercase tracking-[0.3em] text-sm font-medium mb-4"
        >
          ChronoElite
        </motion.p>
       
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-display-xl text-foreground mb-6"
        >
          Icônico. <span className="text-gradient-gold">Atemporal.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="inline-flex items-center backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-3 gap-6"
        >
          <div className="text-left">
            <div className="text-muted-foreground text-sm">
              {heroWatch ? heroWatch.name : "ChronoElite Classic"}
            </div>
            <div className="text-foreground font-medium text-lg">
              R$ {heroWatch ? (heroWatch.price / 100).toFixed(2).replace('.', ',') : "24.900"}
            </div>
          </div>
         
          <div className="h-8 w-px bg-white/20"></div>
         
          <Link to={`/modelos/${heroWatch?.id || 1}`}>
            <Button variant="gold" size="lg" className="rounded-full px-6">
              Comprar
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-5xl px-6 mt-8"
      >
        <motion.img
          src={heroWatch?.image_url || "/assets/watch-hero.png"}
          alt={heroWatch ? heroWatch.name : "ChronoElite Premium Watch"}
          className="w-full h-auto object-contain"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
       
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gold/10 blur-[80px] rounded-full" />
      </motion.div>
    </section>
  );
};

export default HeroSection;