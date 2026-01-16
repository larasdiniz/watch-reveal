import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import watchHero from "@/assets/watch-hero.png";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-background pointer-events-none" />
      
      {/* Main content */}
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <span className="text-muted-foreground">ChronoElite Classic</span>
          <span className="text-foreground font-medium">R$ 24.900</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/comprar">
            <Button variant="gold" size="lg" className="rounded-full px-8">
              Comprar
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-5xl px-6 mt-8"
      >
        <motion.img
          src={watchHero}
          alt="ChronoElite Premium Watch"
          className="w-full h-auto object-contain"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Glow effect under watch */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gold/10 blur-[80px] rounded-full" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
