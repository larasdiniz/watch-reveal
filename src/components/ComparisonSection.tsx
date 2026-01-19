import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Watch {
  id: number;
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string;
  features: string[];
  colors: string[];
  is_new: boolean;
  is_limited: boolean;
  rating: number;
  reviews: number;
}

interface ComparisonModel {
  id: number;
  name: string;
  tagline: string;
  price: string;
  formattedPrice: string;
  originalPrice: string | null;
  image: string;
  isHighlighted: boolean;
  features: Array<{
    label: string;
    available: boolean;
  }>;
}

const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [models, setModels] = useState<ComparisonModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparisonModels = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/watches/compare');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const watches: Watch[] = await response.json();
        
        const selectedWatches = watches.slice(0, 2);
        
        const comparisonModels: ComparisonModel[] = selectedWatches.map((watch, index) => {
          const taglines: Record<string, string> = {
            'Clássico': 'O equilíbrio perfeito entre elegância e funcionalidade.',
            'Premium': 'Exclusividade em cada detalhe. Ouro 18K genuíno.',
            'Esportivo': 'Desempenho e resistência para seu estilo ativo.',
            'Minimalista': 'Simplicidade e sofisticação em design puro.',
            'Vintage': 'Tradição e história em cada detalhe.',
            'Mergulho': 'Resistência extrema para aventuras aquáticas.',
            'Alta Relojoaria': 'A arte suprema da relojoaria suíça.',
            'Viagem': 'Explore o mundo com estilo e funcionalidade.',
          };

          const commonFeatures = [
            { label: 'Movimento Suíço Automático', key: 'automático' },
            { label: 'Cristal Safira Anti-Reflexo', key: 'cristal' },
            { label: 'Pulseira de Couro Italiano', key: 'couro' },
            { label: 'Edição Limitada 500 unidades', key: 'limited' },
            { label: 'Resistência à Água 100m', key: 'resistência' },
            { label: 'Cronógrafo Integrado', key: 'cronógrafo' },
          ];

          const modelFeatures = commonFeatures.map(feature => {
            const hasFeature = watch.features?.some(f => 
              f.toLowerCase().includes(feature.key.toLowerCase())
            );
            
            if (feature.key === 'limited') {
              return {
                label: feature.label,
                available: watch.is_limited
              };
            }

            return {
              label: feature.label,
              available: hasFeature || false
            };
          });

          return {
            id: watch.id,
            name: watch.name,
            tagline: taglines[watch.category] || 'Excelência em cada detalhe.',
            price: `R$ ${(watch.price / 100).toFixed(2).replace('.', ',')}`,
            formattedPrice: `R$ ${(watch.price).toLocaleString('pt-BR')}`,
            originalPrice: watch.original_price ? `R$ ${(watch.original_price).toLocaleString('pt-BR')}` : null,
            image: watch.image_url,
            isHighlighted: watch.is_limited || index === 1,
            features: modelFeatures
          };
        });

        setModels(comparisonModels);
      } catch (error) {
        console.error('Erro ao buscar modelos para comparação:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonModels();
  }, []);

  if (loading) {
    return (
      <section className="py-24 section-padding bg-surface-elevated/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando comparação...</p>
        </div>
      </section>
    );
  }

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
          <p className="text-muted-foreground max-w-xl mx-auto">
            Compare nossos modelos mais populares e encontre o perfeito para você.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={model.id}
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
                    {model.name.includes('Gold') || model.name.includes('Tourbillon') 
                      ? 'Edição Premium' 
                      : 'Edição Limitada'
                    }
                  </span>
                </div>
              )}

              <div className="relative h-48 md:h-64 mb-8">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-contain"
                />
                {model.isHighlighted && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
                )}
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  {model.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {model.tagline}
                </p>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-3xl font-bold text-foreground">
                    {model.formattedPrice}
                  </p>
                  {model.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {model.originalPrice}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {model.features.map((feature, idx) => (
                  <div key={`${model.id}-${idx}`} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center
                      ${feature.available ? "bg-gold/20" : "bg-muted"}
                    `}>
                      {feature.available ? (
                        <Check className="w-3 h-3 text-gold" />
                      ) : (
                        <Minus className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    <span className={`text-sm ${feature.available ? "text-foreground" : "text-muted-foreground"}`}>
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>

              <Link to={`/modelos/${model.id}`}>
                <Button 
                  variant={model.isHighlighted ? "gold" : "outline"} 
                  className="w-full rounded-full"
                  size="lg"
                >
                  {model.isHighlighted ? 'Comprar Agora' : 'Ver Detalhes'}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/modelos">
            <Button variant="ghost" className="text-gold hover:text-gold/80">
              Ver todos os modelos →
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;