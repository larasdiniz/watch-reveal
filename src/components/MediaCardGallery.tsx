import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Gem, Droplets } from "lucide-react";
import watchDetail from "@/assets/watch-detail.png";
import watchStrap from "@/assets/watch-strap.png";

const cards = [
  {
    id: 1,
    title: "Precisão Suíça",
    subtitle: "Movimento automático de alta precisão com 72h de reserva de marcha.",
    image: watchDetail,
    size: "large",
  },
  {
    id: 2,
    title: "Cristal Safira",
    subtitle: "Proteção anti-reflexo com dureza 9 na escala Mohs.",
    image: null,
    size: "small",
    Icon: Gem,
  },
  {
    id: 3,
    title: "100M",
    subtitle: "Resistência à água certificada.",
    image: null,
    size: "small",
    Icon: Droplets,
    highlight: true,
  },
  {
    id: 4,
    title: "Couro Italiano",
    subtitle: "Pulseira artesanal cortada à mão em Florença.",
    image: watchStrap,
    size: "medium",
  },
];

const MediaCardGallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-20 section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-display-md text-foreground mb-4">
            Feito para <span className="text-gradient-gold">Durar</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Cada componente meticulosamente selecionado por mestres relojoeiros.
          </p>
        </motion.div>

        {/* Horizontal scrolling cards - Apple style */}
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`
                flex-shrink-0 snap-center
                ${card.size === "large" ? "w-80 md:w-auto md:col-span-2 md:row-span-2" : ""}
                ${card.size === "medium" ? "w-80 md:w-auto md:col-span-2" : ""}
                ${card.size === "small" ? "w-64 md:w-auto md:col-span-1" : ""}
              `}
            >
              <div
                className={`
                  group relative overflow-hidden rounded-3xl h-full
                  ${card.image ? "" : "bg-surface-elevated"}
                  ${card.size === "large" ? "min-h-[400px] md:min-h-[500px]" : ""}
                  ${card.size === "medium" ? "min-h-[280px]" : ""}
                  ${card.size === "small" ? "min-h-[200px] md:min-h-[240px]" : ""}
                  transition-transform duration-500 hover:scale-[1.02]
                `}
              >
                {card.image && (
                  <>
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  </>
                )}

                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  {card.Icon && !card.highlight && (
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                      <card.Icon className="w-6 h-6 text-gold" />
                    </div>
                  )}
                  
                  {card.highlight && (
                    <div className="mb-2">
                      {card.Icon && (
                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                          <card.Icon className="w-6 h-6 text-gold" />
                        </div>
                      )}
                      <div className="text-5xl md:text-6xl font-bold text-gradient-gold">
                        {card.title}
                      </div>
                    </div>
                  )}
                  
                  {!card.highlight && (
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                      {card.title}
                    </h3>
                  )}
                  
                  <p className="text-sm md:text-base text-muted-foreground">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaCardGallery;
