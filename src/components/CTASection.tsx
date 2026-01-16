import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import watchHero from "@/assets/watch-hero.png";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 section-padding relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />
      
      {/* Floating watch background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <img 
          src={watchHero} 
          alt="" 
          className="w-full max-w-4xl h-auto blur-sm"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-display-lg text-foreground mb-6"
        >
          O Tempo é <span className="text-gradient-gold">Precioso.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
        >
          Faça parte de um seleto grupo de colecionadores que valorizam 
          a verdadeira arte da relojoaria suíça.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="gold" size="lg" className="rounded-full px-10">
            Comprar Agora
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-10">
            Agendar Visita
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            Frete Grátis
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            Garantia Vitalícia
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            30 Dias para Devolução
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
