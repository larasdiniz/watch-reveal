import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Zap, Target, Wrench } from "lucide-react";

const FeatureStory = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);

  const features = [
    { Icon: Zap, title: "Movimento Automático", desc: "Recarrega com o movimento do pulso" },
    { Icon: Target, title: "Alta Precisão", desc: "Certificado COSC de cronômetro" },
    { Icon: Wrench, title: "Manutenção Simplificada", desc: "Revisão a cada 5 anos" },
  ];

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        style={{ scale: imageScale, opacity: imageOpacity }}
      >
        <img
          src="/assets/watch-detail.png" // Imagem estática
          alt="Watch Detail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
      </motion.div>

      <div className="relative z-10 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-gold uppercase tracking-[0.3em] text-sm font-medium mb-6 block"
            >
              Desempenho
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-display-lg text-foreground mb-8"
            >
              Precisão <br />
              <span className="text-gradient-gold">Reinventada.</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground leading-relaxed mb-10"
            >
              O calibre automático foi desenvolvido por mestres relojoeiros suíços, 
              combinando tradição secular com tecnologia de ponta para entregar 
              uma precisão de ±2 segundos por dia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                    <feature.Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-medium mb-1 group-hover:text-gold transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureStory;