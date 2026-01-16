import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import watchHero from "@/assets/watch-hero.png";
import { Button } from "@/components/ui/button";

const models = [
  {
    name: "ChronoElite Classic",
    tagline: "O equilíbrio perfeito entre elegância e funcionalidade.",
    price: "R$ 24.900",
    image: watchHero,
    features: [
      { label: "Movimento Suíço Automático", available: true },
      { label: "Cristal Safira Anti-Reflexo", available: true },
      { label: "Pulseira de Couro Italiano", available: true },
      { label: "Edição Limitada 500 unidades", available: false },
    ],
  },
  {
    name: "ChronoElite Gold",
    tagline: "Exclusividade em cada detalhe. Ouro 18K genuíno.",
    price: "R$ 48.900",
    image: watchHero,
    isHighlighted: true,
    features: [
      { label: "Movimento Suíço Automático", available: true },
      { label: "Cristal Safira Anti-Reflexo", available: true },
      { label: "Pulseira de Couro Italiano", available: true },
      { label: "Edição Limitada 500 unidades", available: true },
    ],
  },
];

const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-24 section-padding bg-surface-elevated/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-display-md text-foreground mb-4">
            Escolha o <span className="text-gradient-gold">Seu</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`
                relative rounded-3xl overflow-hidden p-8 md:p-10
                ${model.isHighlighted 
                  ? "bg-gradient-to-b from-gold/10 to-background border border-gold/30" 
                  : "bg-background border border-border"
                }
              `}
            >
              {model.isHighlighted && (
                <div className="absolute top-6 right-6">
                  <span className="bg-gold text-background text-xs font-medium px-3 py-1 rounded-full">
                    Edição Limitada
                  </span>
                </div>
              )}

              {/* Product image */}
              <div className="relative h-48 md:h-64 mb-8">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  {model.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {model.tagline}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {model.price}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {model.features.map((feature) => (
                  <div key={feature.label} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center
                      ${feature.available ? "bg-gold/20" : "bg-muted"}
                    `}>
                      {feature.available ? (
                        <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={feature.available ? "text-foreground" : "text-muted-foreground"}>
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                variant={model.isHighlighted ? "gold" : "outline"} 
                className="w-full rounded-full"
                size="lg"
              >
                Comprar
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
