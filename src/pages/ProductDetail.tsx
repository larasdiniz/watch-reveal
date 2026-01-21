import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Star, 
  Shield, 
  Truck, 
  RefreshCw, 
  Check, 
  ChevronRight,
  ShoppingCart,
  Heart,
  Share2,
  ZoomIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Watch {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price: number | null;
  rating: number;
  reviews: number;
  image_url: string;
  colors: string[];
  features: string[];
  is_new: boolean;
  is_limited: boolean;
  created_at: string;
  images: {
    main: string;
    details: string[];
    straps: string[];
    gallery: string[];
  };
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [watch, setWatch] = useState<Watch | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Buscar dados do relógio
  useEffect(() => {
    const fetchWatch = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/watches/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            navigate("/modelos");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Watch = await response.json();
        setWatch(data);
        setSelectedColor(data.colors[0] || "");
        
        // Usar a galeria de imagens do banco de dados
        const galleryImages = data.images?.gallery || [data.image_url];
        setSelectedImage(galleryImages[0]);
        
      } catch (error) {
        console.error('Erro ao buscar relógio:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do produto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWatch();
    }
  }, [id, navigate, toast]);

  const handleAddToCart = () => {
    if (!watch) return;

    toast({
      title: "Adicionado ao carrinho",
      description: `${watch.name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleBuyNow = () => {
    if (!watch) return;

    navigate("/comprar", { 
      state: { 
        selectedWatch: watch,
        selectedStrap: { id: "black", name: "Preto", color: "#0F172A" }
      } 
    });
  };

  const formatPrice = (priceInCents: number) => {
    return `R$ ${(priceInCents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Função para compartilhar produto
  const handleShare = () => {
    if (navigator.share && watch) {
      navigator.share({
        title: watch.name,
        text: `Confira ${watch.name} na ChronoElite`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado",
        description: "Link do produto copiado para a área de transferência.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 section-padding">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando detalhes...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 section-padding">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Produto não encontrado</h1>
            <p className="text-muted-foreground mb-6">O relógio que você está procurando não existe.</p>
            <Button variant="outline" onClick={() => navigate("/modelos")}>
              Voltar para Coleção
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Preparar galeria de imagens
  const galleryImages = watch.images?.gallery || [watch.image_url];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link to="/modelos" className="hover:text-foreground transition-colors">Coleção</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-foreground font-medium">{watch.name}</span>
            </nav>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Galeria de Imagens */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="sticky top-32">
                {/* Imagem principal */}
                <div className="relative bg-surface-elevated rounded-3xl overflow-hidden mb-4">
                  <div className="aspect-square flex items-center justify-center p-8">
                    <img
                      src={selectedImage}
                      alt={watch.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {watch.is_new && (
                      <Badge variant="gold" className="rounded-full">
                        Novo
                      </Badge>
                    )}
                    {watch.is_limited && (
                      <Badge variant="outline" className="rounded-full bg-background/80 backdrop-blur-sm">
                        Edição Limitada
                      </Badge>
                    )}
                  </div>
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-background/80 backdrop-blur-sm"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-background/80 backdrop-blur-sm"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-background/80 backdrop-blur-sm"
                      onClick={() => {
                        window.open(selectedImage, '_blank');
                      }}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Miniaturas */}
                {galleryImages.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {galleryImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
                          selectedImage === image ? 'border-gold' : 'border-border hover:border-gold/50'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${watch.name} - Imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Informações do Produto */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-8"
            >
              {/* Cabeçalho */}
              <div>
                <Badge variant="outline" className="mb-3 rounded-full">
                  {watch.category}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {watch.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-medium">{watch.rating}</span>
                    <span className="text-sm text-muted-foreground">({watch.reviews} avaliações)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-green-500 font-medium">Em estoque</span>
                </div>

                {/* Preço */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(watch.price)}
                    </span>
                    {watch.original_price && (
                      <>
                        <span className="text-xl text-muted-foreground line-through">
                          {formatPrice(watch.original_price)}
                        </span>
                        <Badge variant="gold" className="rounded-full">
                          {Math.round((1 - watch.price / watch.original_price) * 100)}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    ou 12x de {formatPrice(Math.ceil(watch.price / 12))} sem juros
                  </p>
                </div>
              </div>

              {/* Cores disponíveis */}
              {watch.colors && watch.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Cores disponíveis</h3>
                  <div className="flex gap-3">
                    {watch.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative`}
                      >
                        <div className={`
                          w-12 h-12 rounded-full border-2 transition-all
                          ${selectedColor === color ? 'border-gold scale-110' : 'border-border group-hover:border-gold/50'}
                        `}>
                          <div 
                            className="w-full h-full rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                        {selectedColor === color && (
                          <Check className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-background" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantidade */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Quantidade</h3>
                <div className="flex items-center gap-4 max-w-xs">
                  <div className="flex items-center border border-border rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-muted-foreground hover:text-foreground"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 min-w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-muted-foreground hover:text-foreground"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {quantity} {quantity === 1 ? 'unidade' : 'unidades'}
                  </span>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-full py-6"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button
                  variant="gold"
                  size="lg"
                  className="flex-1 rounded-full py-6"
                  onClick={handleBuyNow}
                >
                  Comprar Agora
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Benefícios */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                {[
                  { Icon: Truck, label: "Frete Grátis", desc: "Acima de R$ 1.000" },
                  { Icon: RefreshCw, label: "Devolução", desc: "30 dias" },
                  { Icon: Shield, label: "Garantia", desc: "Vitalícia" },
                ].map(({ Icon, label, desc }) => (
                  <div key={label} className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-surface-elevated flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-xs font-medium text-foreground block">{label}</span>
                    <span className="text-xs text-muted-foreground">{desc}</span>
                  </div>
                ))}
              </div>

              {/* Tabs com informações detalhadas */}
              <div className="pt-8">
                <Tabs defaultValue="features">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="features">Características</TabsTrigger>
                    <TabsTrigger value="specs">Especificações</TabsTrigger>
                    <TabsTrigger value="shipping">Entrega</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="features" className="space-y-4">
                    <ul className="space-y-3">
                      {watch.features && watch.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="specs">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Categoria</p>
                        <p className="font-medium">{watch.category}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Material</p>
                        <p className="font-medium">Aço Inoxidável 316L</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cristal</p>
                        <p className="font-medium">Safira anti-reflexo</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Resistência à água</p>
                        <p className="font-medium">100 metros</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="shipping">
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground mb-2">Frete Grátis</p>
                        <p className="text-muted-foreground">
                          Para compras acima de R$ 1.000,00. Entrega em 5-7 dias úteis.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-2">Entrega Expressa</p>
                        <p className="text-muted-foreground">
                          R$ 29,90 • Entrega em 2-3 dias úteis para grandes capitais.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seção de produtos relacionados */}
      <section className="py-20 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto section-padding">
          <h2 className="text-2xl font-bold text-foreground mb-8">Produtos Relacionados</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center text-muted-foreground">
              <p>Outros produtos da mesma categoria...</p>
              <Button 
                variant="outline" 
                className="mt-4 rounded-full"
                onClick={() => navigate("/modelos")}
              >
                Ver Coleção Completa
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;