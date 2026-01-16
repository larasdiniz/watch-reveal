import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import watchStrap from "@/assets/watch-strap.png";

const CraftsmanshipSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-screen py-32 relative overflow-hidden">
      {/* Full-width image background */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full h-full"
        >
          <img
            src={watchStrap}
            alt="Watch Craftsmanship"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center section-padding">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gold uppercase tracking-[0.3em] text-sm font-medium mb-6 block"
          >
            Materiais Premium
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-display-lg text-foreground mb-8"
          >
            Couro Italiano <br />
            <span className="text-gradient-gold">Genuíno</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-muted-foreground text-xl leading-relaxed mb-10"
          >
            Cada pulseira é cortada à mão nas oficinas de Florença, 
            usando técnicas centenárias que garantem durabilidade e 
            conforto incomparáveis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-8"
          >
            {[
              { value: "100%", label: "Couro Natural" },
              { value: "18K", label: "Fivela Banhada" },
              { value: "2 Anos", label: "Garantia" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-semibold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipSection;
