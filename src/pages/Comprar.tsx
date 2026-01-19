import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight, Shield, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/order";

interface Watch {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  features: string[];
  is_limited: boolean;
  original_price: number | null;
  rating: number;
  reviews: number;
}

interface StrapColor {
  id: string;
  name: string;
  color: string;
}

const strapColors: StrapColor[] = [
  { id: "black", name: "Preto", color: "bg-neutral-900" },
  { id: "brown", name: "Marrom", color: "bg-amber-900" },
  { id: "blue", name: "Azul", color: "bg-blue-900" },
];

const Comprar = () => {
  const navigate = useNavigate();
  const [watches, setWatches] = useState<Watch[]>([]);
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const [selectedStrap, setSelectedStrap] = useState<StrapColor>(strapColors[0]);
  const [loading, setLoading] = useState(true);

  // Buscar relógios do banco
  useEffect(() => {
    const fetchWatches = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/watches');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Watch[] = await response.json();
        setWatches(data);
        
        // Selecionar o primeiro relógio por padrão
        if (data.length > 0) {
          setSelectedWatch(data[0]);
        }
      } catch (error) {
        console.error('Erro ao buscar relógios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatches();
  }, []);

  const handleCheckout = () => {
    if (!selectedWatch) return;

    const cartItem: CartItem = {
      productId: selectedWatch.id.toString(),
      productName: selectedWatch.name,
      variant: selectedWatch.category,
      strapColor: selectedStrap.name,
      price: selectedWatch.price,
      quantity: 1,
      imageUrl: selectedWatch.image_url,
      features: selectedWatch.features || [],
      isLimited: selectedWatch.is_limited,
      originalPrice: selectedWatch.original_price || null
    };
    
    navigate("/checkout", { state: { items: [cartItem] } });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
        </div>
      </main>
    );
  }

  if (!selectedWatch) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Nenhum relógio disponível</p>
          <Link to="/">
            <Button variant="outline" className="mt-4">Voltar para início</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="section-padding py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar</span>
            </Link>
            
            <div className="text-lg font-semibold tracking-wider">
              CHRONO<span className="text-gold">ELITE</span>
            </div>
            
            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="sticky top-32">
                <div className="aspect-square bg-surface-elevated rounded-3xl flex items-center justify-center p-8 lg:p-16">
                  <motion.img
                    key={selectedWatch.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={selectedWatch.image_url}
                    alt={selectedWatch.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Thumbnail strip com cores */}
                <div className="flex gap-3 mt-4 justify-center">
                  {strapColors.map((strap) => (
                    <button
                      key={strap.id}
                      onClick={() => setSelectedStrap(strap)}
                      className={`
                        w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all
                        ${selectedStrap.id === strap.id 
                          ? "border-gold" 
                          : "border-border hover:border-gold/50"
                        }
                      `}
                    >
                      <div className={`w-12 h-12 rounded-full ${strap.color}`} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-8"
            >
              {/* Model Selection */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-2">
                  {selectedWatch.name}
                </h1>
                <p className="text-muted-foreground mb-6">Categoria: {selectedWatch.category}</p>
                
                <div className="space-y-3">
                  {watches.map((watch) => (
                    <button
                      key={watch.id}
                      onClick={() => setSelectedWatch(watch)}
                      className={`
                        w-full p-4 rounded-2xl border text-left transition-all
                        ${selectedWatch.id === watch.id 
                          ? "border-gold bg-gold/5" 
                          : "border-border hover:border-gold/30"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{watch.name}</span>
                            {watch.is_limited && (
                              <span className="text-xs bg-gold text-background px-2 py-0.5 rounded-full">
                                Edição Limitada
                              </span>
                            )}
                            {watch.rating > 0 && (
                              <span className="text-xs bg-surface-elevated px-2 py-0.5 rounded-full border">
                                ⭐ {watch.rating} ({watch.reviews})
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{watch.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-foreground">
                            R$ {watch.price.toLocaleString('pt-BR')}
                          </span>
                          {watch.original_price && (
                            <span className="text-sm text-muted-foreground line-through">
                              R$ {watch.original_price.toLocaleString('pt-BR')}
                            </span>
                          )}
                          <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${selectedWatch.id === watch.id ? "border-gold bg-gold" : "border-border"}
                          `}>
                            {selectedWatch.id === watch.id && (
                              <Check className="w-3 h-3 text-background" />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Strap Selection */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Cor da Pulseira
                </h3>
                <div className="flex gap-3">
                  {strapColors.map((strap) => (
                    <button
                      key={strap.id}
                      onClick={() => setSelectedStrap(strap)}
                      className="group"
                    >
                      <div className={`
                        w-12 h-12 rounded-full ${strap.color} border-2 transition-all
                        ${selectedStrap.id === strap.id 
                          ? "border-gold scale-110" 
                          : "border-transparent group-hover:border-gold/30"
                        }
                      `} />
                      <span className={`
                        text-xs mt-2 block text-center
                        ${selectedStrap.id === strap.id ? "text-foreground" : "text-muted-foreground"}
                      `}>
                        {strap.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Características
                </h3>
                <ul className="space-y-3">
                  {selectedWatch.features && selectedWatch.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-gold" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & CTA */}
              <div className="pt-6 border-t border-border">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-sm text-muted-foreground">Total</span>
                    <div className="text-3xl font-bold text-foreground">
                      R$ {selectedWatch.price.toLocaleString('pt-BR')}
                    </div>
                    {selectedWatch.original_price && (
                      <div className="text-sm text-muted-foreground line-through">
                        R$ {selectedWatch.original_price.toLocaleString('pt-BR')}
                      </div>
                    )}
                    <span className="text-sm text-muted-foreground">
                      ou 12x de R$ {Math.round(selectedWatch.price / 12).toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>

                <Button 
                  variant="gold" 
                  size="lg" 
                  className="w-full rounded-full text-lg py-6"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Pagamento seguro com criptografia SSL
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                {[
                  { Icon: Truck, label: "Frete Grátis" },
                  { Icon: RefreshCw, label: "30 Dias Devolução" },
                  { Icon: Shield, label: "Garantia Vitalícia" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-surface-elevated flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Comprar;