import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Gem, Droplets, Shield, Watch, Zap } from "lucide-react";

interface GalleryCard {
  id: number;
  title: string;
  subtitle: string;
  image: string | null;
  size: "large" | "medium" | "small";
  Icon?: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

const MediaCardGallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [cards, setCards] = useState<GalleryCard[]>([
    {
      id: 1,
      title: "Precisão Suíça",
      subtitle: "Movimento automático de alta precisão com 72h de reserva de marcha.",
      image: "/assets/watch-hero-detail.png", // Alterado para watch-hero-detail
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
      title: "Pulseira Premium",
      subtitle: "Pulseira artesanal cortada à mão em couro Italiano.",
      image: "/assets/watch-hero-strap.png", // Alterado para watch-hero-strap
      size: "medium",
    },
  ]);

  // Se quiser buscar mais detalhes do banco para o relógio principal
  useEffect(() => {
    const fetchWatchDetails = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/watches/1'); // Buscar o relógio principal (ID 1)
        if (response.ok) {
          const watch = await response.json();
          
          // Se o watch tiver imagens no banco, atualize os cards
          if (watch.images) {
            setCards(prev => prev.map(card => {
              // Atualizar a imagem de detalhe se existir no banco
              if (card.id === 1 && watch.images.details && watch.images.details.length > 0) {
                return { ...card, image: watch.images.details[0] };
              }
              // Atualizar a imagem da pulseira se existir no banco
              if (card.id === 4 && watch.images.straps && watch.images.straps.length > 0) {
                return { ...card, image: watch.images.straps[0] };
              }
              // Atualizar a imagem principal se existir no banco
              if (card.id === 5 && watch.images.main) {
                return { ...card, image: watch.images.main };
              }
              return card;
            }));
          }
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do relógio:', error);
      }
    };

    fetchWatchDetails();
  }, []);

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
            Detalhes que <span className="text-gradient-gold">Encantam</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Explore cada nuance do ChronoElite Classic em nossa galeria exclusiva.
          </p>
        </motion.div>

        {/* Grid de cards responsivo - Apple style */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`
                ${card.size === "large" ? "md:col-span-2 md:row-span-2" : ""}
                ${card.size === "medium" ? "md:col-span-2" : ""}
                ${card.size === "small" ? "md:col-span-1" : ""}
                ${card.id === 5 ? "md:col-start-3" : ""} /* Posiciona o card 5 na coluna 3 */
              `}
            >
              <div
                className={`
                  group relative overflow-hidden rounded-3xl h-full
                  ${card.image ? "" : "bg-surface-elevated"}
                  ${card.size === "large" ? "min-h-[400px] md:min-h-[500px]" : ""}
                  ${card.size === "medium" ? "min-h-[280px]" : ""}
                  ${card.size === "small" ? "min-h-[200px]" : ""}
                  transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl
                `}
              >
                {card.image && (
                  <>
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay gradiente para melhor legibilidade do texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  </>
                )}

                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  {/* Ícone para cards sem imagem */}
                  {card.Icon && !card.highlight && (
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                      <card.Icon className="w-6 h-6 text-gold" />
                    </div>
                  )}
                  
                  {/* Estilo especial para o card highlight (100M) */}
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
                  
                  {/* Título normal para cards não-highlight */}
                  {!card.highlight && (
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                      {card.title}
                    </h3>
                  )}
                  
                  {/* Subtítulo */}
                  <p className="text-sm md:text-base text-muted-foreground">
                    {card.subtitle}
                  </p>
                </div>

                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r from-gold/20 via-transparent to-gold/20" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Indicadores para desktop (opcional) */}
        <div className="hidden md:flex justify-center items-center gap-2 mt-8">
          <div className="text-xs text-muted-foreground">
            <Watch className="w-4 h-4 inline mr-2" />
            Explore os detalhes do ChronoElite Classic
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaCardGallery;