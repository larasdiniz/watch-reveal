import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-gold uppercase tracking-[0.3em] text-sm font-medium mb-6 block"
        >
          Edição Limitada
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-display-lg text-foreground mb-8"
        >
          Apenas <span className="text-gradient-gold">500 Unidades</span> <br />
          No Mundo
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto"
        >
          Reserve o seu agora e faça parte de um seleto grupo de colecionadores 
          que valorizam a verdadeira arte da relojoaria.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="gold" size="lg">
            Reservar Agora
          </Button>
          <Button variant="outline" size="lg">
            Agendar Visita
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-muted-foreground text-sm"
        >
          A partir de <span className="text-foreground font-semibold">R$ 24.900</span> 
          <span className="mx-2">·</span> 
          Frete Grátis 
          <span className="mx-2">·</span> 
          Garantia Vitalícia
        </motion.p>
      </div>
    </section>
  );
};

export default CTASection;
