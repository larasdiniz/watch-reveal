import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const iconCards = [
  {
    icon: "🚚",
    title: "Frete Grátis",
    description: "Entrega expressa para todo o Brasil em até 3 dias úteis.",
  },
  {
    icon: "🔄",
    title: "30 Dias",
    description: "Devolução gratuita se não ficar 100% satisfeito.",
  },
  {
    icon: "🛡️",
    title: "Garantia Vitalícia",
    description: "Cobertura completa contra defeitos de fabricação.",
  },
];

const IconCardsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-16 section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          {iconCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-surface-elevated rounded-3xl p-8 text-center group hover:bg-surface-elevated/80 transition-colors"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IconCardsSection;
