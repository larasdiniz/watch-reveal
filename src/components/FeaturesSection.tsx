import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import watchDetail from "@/assets/watch-detail.png";

const features = [
  {
    title: "Movimento Suíço",
    description: "Calibre automático de alta precisão com 72 horas de reserva de marcha.",
  },
  {
    title: "Cristal Safira",
    description: "Proteção anti-reflexo com dureza de 9 na escala Mohs.",
  },
  {
    title: "Resistente à Água",
    description: "Certificado até 100 metros de profundidade.",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-screen py-32 section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="aspect-square relative">
              <img
                src={watchDetail}
                alt="Watch Detail"
                className="w-full h-full object-cover rounded-3xl"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl shadow-[0_0_100px_rgba(184,134,11,0.15)]" />
            </div>
          </motion.div>

          {/* Right - Features */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-display-md text-foreground mb-4">
                Precisão <span className="text-gradient-gold">Artesanal</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Cada detalhe meticulosamente elaborado por mestres relojoeiros.
              </p>
            </motion.div>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
                  className="group"
                >
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors duration-300">
                      <span className="text-gold font-semibold">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
