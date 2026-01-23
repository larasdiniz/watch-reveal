import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  Grid,
  List,
  ChevronDown,
  Check,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ADICIONE ESTA LINHA NO TOPO
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Filtros disponíveis
const categories = ["Todos", "Clássico", "Premium", "Esportivo", "Minimalista", "Vintage", "Mergulho", "Alta Relojoaria", "Viagem"];
const priceRanges = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Até R$ 250,00", min: 0, max: 25000 },
  { label: "R$ 250,00 - R$ 400,00", min: 25000, max: 40000 },
  { label: "R$ 400,00 - R$ 600,00", min: 40000, max: 60000 },
  { label: "Acima de R$ 600,00", min: 60000, max: Infinity },
];

interface Watch {
  id: number;
  name: string;
  category: string;
  price: number; // EM CENTAVOS
  originalPrice: number | null; // EM CENTAVOS
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  features: string[];
  isNew: boolean;
  isLimited: boolean;
}

// Interface para os dados que vêm da API
interface ApiWatch {
  id: number;
  name: string;
  category: string;
  price: number; // EM CENTAVOS
  original_price: number | null; // EM CENTAVOS
  rating: string | number;
  reviews: number;
  image_url: string;
  colors: string[];
  features: string[];
  is_new: boolean;
  is_limited: boolean;
}

const ModelsPage = () => {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedPriceRange, setSelectedPriceRange] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  // Função para formatar preço (centavos para reais)
  const formatPrice = (priceInCents: number) => {
    return `R$ ${(priceInCents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatPriceWithoutCents = (priceInCents: number) => {
    return `R$ ${Math.floor(priceInCents / 100).toLocaleString('pt-BR')}`;
  };

  // Buscar dados da API
  useEffect(() => {
    const fetchWatches = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (selectedCategory !== "Todos") {
          params.append('category', selectedCategory);
        }
        
        if (selectedPriceRange !== "Todos") {
          const priceRange = priceRanges.find(range => range.label === selectedPriceRange);
          if (priceRange) {
            params.append('minPrice', priceRange.min.toString());
            params.append('maxPrice', priceRange.max === Infinity ? '1000000' : priceRange.max.toString());
          }
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        params.append('sortBy', sortBy);
        
        // MODIFIQUE ESTA LINHA ↓
        const response = await fetch(`${API_URL}/api/watches?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data: ApiWatch[] = await response.json();
        
        // Converter para o formato que seu componente espera
        const formattedWatches: Watch[] = data.map((watch) => ({
          id: watch.id,
          name: watch.name,
          category: watch.category,
          price: watch.price, // Mantém em centavos
          originalPrice: watch.original_price || null, // Mantém em centavos
          rating: typeof watch.rating === 'string' ? parseFloat(watch.rating) : watch.rating,
          reviews: watch.reviews,
          image: watch.image_url,
          colors: watch.colors || [],
          features: watch.features || [],
          isNew: watch.is_new,
          isLimited: watch.is_limited
        }));
        
        setWatches(formattedWatches);
        
      } catch (error) {
        console.error('Erro ao buscar relógios:', error);
        setWatches([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWatches();
  }, [selectedCategory, selectedPriceRange, searchQuery, sortBy]);

  // Filtrar relógios localmente (apenas para fallback)
  const filteredWatches = watches.filter(watch => {
    if (selectedCategory !== "Todos" && watch.category !== selectedCategory) {
      return false;
    }
   
    const priceRange = priceRanges.find(range => range.label === selectedPriceRange);
    if (priceRange && priceRange.label !== "Todos") {
      if (priceRange.max === Infinity) {
        if (watch.price < priceRange.min) return false;
      } else {
        if (watch.price < priceRange.min || watch.price > priceRange.max) return false;
      }
    }
   
    if (searchQuery && !watch.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
   
    return true;
  });

  // Ordenar relógios
  const sortedWatches = [...filteredWatches].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 section-padding">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando relógios...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
     
      <section className="pt-32 pb-20 section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-background" />
       
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-display-xl text-foreground mb-4">
              Coleção <span className="text-gradient-gold">Exclusiva</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra nossa seleção de relógios de precisão, onde cada peça conta uma história de excelência.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-auto md:flex-1 max-w-lg">
                <Input
                  type="search"
                  placeholder="Buscar modelos por nome ou característica..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border-border"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden rounded-full"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>

                <div className="flex border border-border rounded-full overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-none border-r border-border"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent border border-border rounded-full py-2 pl-4 pr-10 text-sm text-foreground focus:outline-none focus:border-gold"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="price-low">Preço: Menor para maior</option>
                    <option value="price-high">Preço: Maior para menor</option>
                    <option value="rating">Melhor avaliados</option>
                    <option value="newest">Mais recentes</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-6 bg-surface-elevated rounded-2xl md:hidden"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Categorias</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? "gold" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                 
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Faixa de Preço</h3>
                    <div className="flex flex-col gap-2">
                      {priceRanges.map(range => (
                        <button
                          key={range.label}
                          onClick={() => setSelectedPriceRange(range.label)}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <div className={`w-4 h-4 rounded-full border ${selectedPriceRange === range.label ? 'bg-gold border-gold' : 'border-border'}`}>
                            {selectedPriceRange === range.label && (
                              <Check className="w-3 h-3 text-background" />
                            )}
                          </div>
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Categorias</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${selectedCategory === category ? 'bg-gold/10 text-gold' : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category}</span>
                        {selectedCategory === category && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Faixa de Preço</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range.label)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${selectedPriceRange === range.label ? 'bg-gold/10 text-gold' : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{range.label}</span>
                        {selectedPriceRange === range.label && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Destaques</h3>
                <div className="space-y-3">
                  <Badge variant="gold" className="w-full justify-center py-2">
                    Edições Limitadas
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    Lançamentos Recente
                  </Badge>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {sortedWatches.length} {sortedWatches.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Ordenado por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-foreground focus:outline-none"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="price-low">Preço: Menor para maior</option>
                    <option value="price-high">Preço: Maior para menor</option>
                    <option value="rating">Melhor avaliados</option>
                    <option value="newest">Mais recentes</option>
                  </select>
                </div>
              </div>

              {viewMode === "grid" ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedWatches.map((watch, index) => (
                    <motion.div
                      key={watch.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group"
                    >
                      <Link to={`/modelos/${watch.id}`}>
                        <div className="bg-surface-elevated rounded-3xl overflow-hidden border border-border hover:border-gold/30 transition-all duration-300 hover:shadow-2xl">
                          <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-surface-elevated to-surface">
                            <img
                              src={watch.image}
                              alt={watch.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                           
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                              {watch.isNew && (
                                <Badge variant="gold" className="rounded-full">
                                  Novo
                                </Badge>
                              )}
                              {watch.isLimited && (
                                <Badge variant="outline" className="rounded-full bg-background/80 backdrop-blur-sm">
                                  Edição Limitada
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm text-gold font-medium mb-1">
                                  {watch.category}
                                </p>
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                                  {watch.name}
                                </h3>
                              </div>
                             
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{watch.rating}</span>
                                <span className="text-xs text-muted-foreground">({watch.reviews})</span>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {watch.features.join(" • ")}
                            </p>

                            <div className="flex items-center gap-2 mb-4">
                              {watch.colors.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="w-4 h-4 rounded-full border border-border"
                                  style={{ backgroundColor: color }}
                                  title={`Cor ${idx + 1}`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground">
                                {watch.colors.length} cores
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xl font-bold text-foreground">
                                  {formatPrice(watch.price)}
                                </p>
                                {watch.originalPrice && (
                                  <p className="text-sm text-muted-foreground line-through">
                                    {formatPrice(watch.originalPrice)}
                                  </p>
                                )}
                              </div>
                             
                              <Button variant="gold" size="sm" className="rounded-full">
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedWatches.map((watch, index) => (
                    <motion.div
                      key={watch.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link to={`/modelos/${watch.id}`}>
                        <div className="bg-surface-elevated rounded-2xl p-6 border border-border hover:border-gold/30 transition-all duration-300 group">
                          <div className="flex items-center gap-6">
                            <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
                              <img
                                src={watch.image}
                                alt={watch.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              {watch.isNew && (
                                <Badge variant="gold" className="absolute top-2 left-2 rounded-full text-xs">
                                  Novo
                                </Badge>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-sm text-gold font-medium mb-1">
                                    {watch.category}
                                  </p>
                                  <h3 className="text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
                                    {watch.name}
                                  </h3>
                                </div>
                               
                                <div className="flex items-center gap-1 shrink-0">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{watch.rating}</span>
                                  <span className="text-sm text-muted-foreground">({watch.reviews})</span>
                                </div>
                              </div>

                              <p className="text-muted-foreground mb-4">
                                {watch.features.join(" • ")}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    {watch.colors.map((color, idx) => (
                                      <div
                                        key={idx}
                                        className="w-3 h-3 rounded-full border border-border"
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                 
                                  <div>
                                    <p className="text-lg font-bold text-foreground">
                                      {formatPrice(watch.price)}
                                    </p>
                                    {watch.originalPrice && (
                                      <p className="text-sm text-muted-foreground line-through">
                                        {formatPrice(watch.originalPrice)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                               
                                <Button variant="gold" size="sm" className="rounded-full">
                                  Ver Detalhes
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {sortedWatches.length > 0 && (
                <div className="mt-12 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-full">
                      Anterior
                    </Button>
                    {[1, 2, 3, 4, 5].map(page => (
                      <Button
                        key={page}
                        variant={page === 1 ? "gold" : "outline"}
                        size="sm"
                        className="rounded-full w-10 h-10"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full">
                      Próxima
                    </Button>
                  </div>
                </div>
              )}

              {sortedWatches.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto rounded-full bg-surface-elevated flex items-center justify-center mb-6">
                    <Filter className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Nenhum modelo encontrado
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Tente ajustar seus filtros ou termos de busca
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("Todos");
                      setSelectedPriceRange("Todos");
                      setSearchQuery("");
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 section-padding bg-gradient-to-b from-surface-elevated/50 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-display-md text-foreground mb-4">
            Receba <span className="text-gradient-gold">Novidades</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Seja o primeiro a saber sobre novos lançamentos e edições limitadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              className="rounded-full"
            />
            <Button variant="gold" className="rounded-full">
              Inscrever-se
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ModelsPage;



/*

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  Grid,
  List,
  ChevronDown,
  Check,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Filtros disponíveis
const categories = ["Todos", "Clássico", "Premium", "Esportivo", "Minimalista", "Vintage", "Mergulho", "Alta Relojoaria", "Viagem"];
const priceRanges = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Até R$ 250,00", min: 0, max: 25000 },
  { label: "R$ 250,00 - R$ 400,00", min: 25000, max: 40000 },
  { label: "R$ 400,00 - R$ 600,00", min: 40000, max: 60000 },
  { label: "Acima de R$ 600,00", min: 60000, max: Infinity },
];

interface Watch {
  id: number;
  name: string;
  category: string;
  price: number; // EM CENTAVOS
  originalPrice: number | null; // EM CENTAVOS
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  features: string[];
  isNew: boolean;
  isLimited: boolean;
}

// DADOS MOCKADOS - Carregamento instantâneo
const mockWatches: Watch[] = [
  {
    id: 1,
    name: "ChronoElite Classic",
    category: "Clássico",
    price: 24900,
    originalPrice: 29900,
    rating: 4.8,
    reviews: 124,
    image: "/assets/watch-classic.png",
    colors: ["#1E40AF", "#111827", "#7C2D12"],
    features: ["Movimento automático suíço", "Cristal safira", "Resistência 100m"],
    isNew: true,
    isLimited: false
  },
  {
    id: 2,
    name: "ChronoElite Gold Edition",
    category: "Premium",
    price: 49900,
    originalPrice: 59900,
    rating: 4.9,
    reviews: 89,
    image: "/assets/watch-gold.png",
    colors: ["#FBBF24", "#92400E"],
    features: ["Ouro 18K", "Edição limitada", "Caixa de cerâmica"],
    isNew: false,
    isLimited: true
  },
  {
    id: 3,
    name: "ChronoElite Sport",
    category: "Esportivo",
    price: 18900,
    originalPrice: null,
    rating: 4.6,
    reviews: 203,
    image: "/assets/watch-sport.png",
    colors: ["#059669", "#1F2937", "#DC2626"],
    features: ["Cronógrafo", "Resistência 200m", "Pulseira silicone"],
    isNew: true,
    isLimited: false
  },
  {
    id: 4,
    name: "ChronoElite Minimal",
    category: "Minimalista",
    price: 21900,
    originalPrice: null,
    rating: 4.7,
    reviews: 156,
    image: "/assets/watch-minimal.png",
    colors: ["#6B7280", "#111827"],
    features: ["Design limpo", "Quartzo suíço", "Ultra-fino"],
    isNew: false,
    isLimited: false
  },
  {
    id: 5,
    name: "ChronoElite Vintage 1950",
    category: "Vintage",
    price: 32900,
    originalPrice: 38900,
    rating: 4.9,
    reviews: 67,
    image: "/assets/watch-vintage.png",
    colors: ["#7C2D12", "#1F2937"],
    features: ["Design retro", "Manivela manual", "Caixa aço inox"],
    isNew: false,
    isLimited: true
  },
  {
    id: 6,
    name: "ChronoElite Diver 300",
    category: "Mergulho",
    price: 27900,
    originalPrice: 32900,
    rating: 4.8,
    reviews: 98,
    image: "/assets/watch-diver.png",
    colors: ["#0EA5E9", "#1E40AF"],
    features: ["Resistência 300m", "Bisel rotativo", "Lume Super-LumiNova"],
    isNew: true,
    isLimited: false
  },
  {
    id: 7,
    name: "ChronoElite Tourbillon",
    category: "Alta Relojoaria",
    price: 89900,
    originalPrice: 99900,
    rating: 5.0,
    reviews: 45,
    image: "/assets/watch-tourbillon.png",
    colors: ["#FBBF24", "#111827"],
    features: ["Tourbillon visível", "Platina 950", "Movimento manual"],
    isNew: false,
    isLimited: true
  },
  {
    id: 8,
    name: "ChronoElite World Timer",
    category: "Viagem",
    price: 31900,
    originalPrice: null,
    rating: 4.7,
    reviews: 112,
    image: "/assets/watch-worldtimer.png",
    colors: ["#1E40AF", "#111827", "#059669"],
    features: ["24 fusos horários", "Display GMT", "Pulseira alligator"],
    isNew: true,
    isLimited: false
  },
  {
    id: 9,
    name: "ChronoElite Chronograph",
    category: "Esportivo",
    price: 26900,
    originalPrice: 29900,
    rating: 4.6,
    reviews: 178,
    image: "/assets/watch-chronograph.png",
    colors: ["#DC2626", "#1F2937"],
    features: ["Cronógrafo tachymeter", "Caixa carbono", "Resistência choques"],
    isNew: false,
    isLimited: false
  },
  {
    id: 10,
    name: "ChronoElite Moonphase",
    category: "Clássico",
    price: 38900,
    originalPrice: 44900,
    rating: 4.9,
    reviews: 83,
    image: "/assets/watch-moonphase.png",
    colors: ["#6B7280", "#111827"],
    features: ["Fase da lua", "Calendário anual", "Mostro guilloché"],
    isNew: true,
    isLimited: false
  },
  {
    id: 11,
    name: "ChronoElite Skeleton",
    category: "Premium",
    price: 64900,
    originalPrice: 74900,
    rating: 4.8,
    reviews: 56,
    image: "/assets/watch-skeleton.png",
    colors: ["#FBBF24", "#6B7280"],
    features: ["Mostro esqueleto", "Ouro rose 18K", "Reserva 72h"],
    isNew: false,
    isLimited: true
  },
  {
    id: 12,
    name: "ChronoElite Racing",
    category: "Esportivo",
    price: 23900,
    originalPrice: null,
    rating: 4.5,
    reviews: 134,
    image: "/assets/watch-racing.png",
    colors: ["#DC2626", "#1F2937", "#FBBF24"],
    features: ["Bisel medidor", "Cronógrafo flyback", "Pulseira couro perforado"],
    isNew: true,
    isLimited: false
  }
];

const ModelsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedPriceRange, setSelectedPriceRange] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  
  // REMOVIDO: Estados de loading e API call
  // const [watches, setWatches] = useState<Watch[]>([]);
  // const [loading, setLoading] = useState(true);
  
  // Agora usa dados mockados diretamente
  const watches = mockWatches;

  // Função para formatar preço (centavos para reais)
  const formatPrice = (priceInCents: number) => {
    return `R$ ${(priceInCents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Filtrar relógios localmente (agora instantâneo!)
  const filteredWatches = watches.filter(watch => {
    if (selectedCategory !== "Todos" && watch.category !== selectedCategory) {
      return false;
    }
   
    const priceRange = priceRanges.find(range => range.label === selectedPriceRange);
    if (priceRange && priceRange.label !== "Todos") {
      if (priceRange.max === Infinity) {
        if (watch.price < priceRange.min) return false;
      } else {
        if (watch.price < priceRange.min || watch.price > priceRange.max) return false;
      }
    }
   
    if (searchQuery && !watch.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
   
    return true;
  });

  // Ordenar relógios
  const sortedWatches = [...filteredWatches].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // REMOVIDO: Todo o useEffect e fetch de API
  // useEffect(() => {
  //   const fetchWatches = async () => {
  //     // ... código removido ...
  //   };
  //   fetchWatches();
  // }, [selectedCategory, selectedPriceRange, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
     
      <section className="pt-32 pb-20 section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-background" />
       
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-display-xl text-foreground mb-4">
              Coleção <span className="text-gradient-gold">Exclusiva</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra nossa seleção de relógios de precisão, onde cada peça conta uma história de excelência.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-auto md:flex-1 max-w-lg">
                <Input
                  type="search"
                  placeholder="Buscar modelos por nome ou característica..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border-border"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden rounded-full"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>

                <div className="flex border border-border rounded-full overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-none border-r border-border"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent border border-border rounded-full py-2 pl-4 pr-10 text-sm text-foreground focus:outline-none focus:border-gold"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="price-low">Preço: Menor para maior</option>
                    <option value="price-high">Preço: Maior para menor</option>
                    <option value="rating">Melhor avaliados</option>
                    <option value="newest">Mais recentes</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-6 bg-surface-elevated rounded-2xl md:hidden"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Categorias</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? "gold" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                 
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Faixa de Preço</h3>
                    <div className="flex flex-col gap-2">
                      {priceRanges.map(range => (
                        <button
                          key={range.label}
                          onClick={() => setSelectedPriceRange(range.label)}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <div className={`w-4 h-4 rounded-full border ${selectedPriceRange === range.label ? 'bg-gold border-gold' : 'border-border'}`}>
                            {selectedPriceRange === range.label && (
                              <Check className="w-3 h-3 text-background" />
                            )}
                          </div>
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Categorias</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${selectedCategory === category ? 'bg-gold/10 text-gold' : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category}</span>
                        {selectedCategory === category && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Faixa de Preço</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range.label)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${selectedPriceRange === range.label ? 'bg-gold/10 text-gold' : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{range.label}</span>
                        {selectedPriceRange === range.label && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Destaques</h3>
                <div className="space-y-3">
                  <Badge variant="gold" className="w-full justify-center py-2">
                    Edições Limitadas
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    Lançamentos Recentes
                  </Badge>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {sortedWatches.length} {sortedWatches.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Ordenado por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-foreground focus:outline-none"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="price-low">Preço: Menor para maior</option>
                    <option value="price-high">Preço: Maior para menor</option>
                    <option value="rating">Melhor avaliados</option>
                    <option value="newest">Mais recentes</option>
                  </select>
                </div>
              </div>

              {viewMode === "grid" ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedWatches.map((watch, index) => (
                    <motion.div
                      key={watch.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group"
                    >
                      <Link to={`/modelos/${watch.id}`}>
                        <div className="bg-surface-elevated rounded-3xl overflow-hidden border border-border hover:border-gold/30 transition-all duration-300 hover:shadow-2xl">
                          <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-surface-elevated to-surface">
                            <img
                              src={watch.image}
                              alt={watch.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                           
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                              {watch.isNew && (
                                <Badge variant="gold" className="rounded-full">
                                  Novo
                                </Badge>
                              )}
                              {watch.isLimited && (
                                <Badge variant="outline" className="rounded-full bg-background/80 backdrop-blur-sm">
                                  Edição Limitada
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm text-gold font-medium mb-1">
                                  {watch.category}
                                </p>
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                                  {watch.name}
                                </h3>
                              </div>
                             
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{watch.rating}</span>
                                <span className="text-xs text-muted-foreground">({watch.reviews})</span>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {watch.features.join(" • ")}
                            </p>

                            <div className="flex items-center gap-2 mb-4">
                              {watch.colors.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="w-4 h-4 rounded-full border border-border"
                                  style={{ backgroundColor: color }}
                                  title={`Cor ${idx + 1}`}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground">
                                {watch.colors.length} cores
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xl font-bold text-foreground">
                                  {formatPrice(watch.price)}
                                </p>
                                {watch.originalPrice && (
                                  <p className="text-sm text-muted-foreground line-through">
                                    {formatPrice(watch.originalPrice)}
                                  </p>
                                )}
                              </div>
                             
                              <Button variant="gold" size="sm" className="rounded-full">
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedWatches.map((watch, index) => (
                    <motion.div
                      key={watch.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link to={`/modelos/${watch.id}`}>
                        <div className="bg-surface-elevated rounded-2xl p-6 border border-border hover:border-gold/30 transition-all duration-300 group">
                          <div className="flex items-center gap-6">
                            <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
                              <img
                                src={watch.image}
                                alt={watch.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                              {watch.isNew && (
                                <Badge variant="gold" className="absolute top-2 left-2 rounded-full text-xs">
                                  Novo
                                </Badge>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-sm text-gold font-medium mb-1">
                                    {watch.category}
                                  </p>
                                  <h3 className="text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
                                    {watch.name}
                                  </h3>
                                </div>
                               
                                <div className="flex items-center gap-1 shrink-0">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{watch.rating}</span>
                                  <span className="text-sm text-muted-foreground">({watch.reviews})</span>
                                </div>
                              </div>

                              <p className="text-muted-foreground mb-4">
                                {watch.features.join(" • ")}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    {watch.colors.map((color, idx) => (
                                      <div
                                        key={idx}
                                        className="w-3 h-3 rounded-full border border-border"
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                 
                                  <div>
                                    <p className="text-lg font-bold text-foreground">
                                      {formatPrice(watch.price)}
                                    </p>
                                    {watch.originalPrice && (
                                      <p className="text-sm text-muted-foreground line-through">
                                        {formatPrice(watch.originalPrice)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                               
                                <Button variant="gold" size="sm" className="rounded-full">
                                  Ver Detalhes
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {sortedWatches.length > 0 && (
                <div className="mt-12 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-full">
                      Anterior
                    </Button>
                    {[1, 2, 3, 4, 5].map(page => (
                      <Button
                        key={page}
                        variant={page === 1 ? "gold" : "outline"}
                        size="sm"
                        className="rounded-full w-10 h-10"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full">
                      Próxima
                    </Button>
                  </div>
                </div>
              )}

              {sortedWatches.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 mx-auto rounded-full bg-surface-elevated flex items-center justify-center mb-6">
                    <Filter className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Nenhum modelo encontrado
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Tente ajustar seus filtros ou termos de busca
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("Todos");
                      setSelectedPriceRange("Todos");
                      setSearchQuery("");
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 section-padding bg-gradient-to-b from-surface-elevated/50 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-display-md text-foreground mb-4">
            Receba <span className="text-gradient-gold">Novidades</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Seja o primeiro a saber sobre novos lançamentos e edições limitadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              className="rounded-full"
            />
            <Button variant="gold" className="rounded-full">
              Inscrever-se
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ModelsPage;

*/