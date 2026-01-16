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

// Dados dos relógios
const watchModels = [
  {
    id: 1,
    name: "ChronoElite Classic",
    category: "Clássico",
    price: 24900,
    originalPrice: 29900,
    rating: 4.9,
    reviews: 128,
    image: "/api/placeholder/400/400",
    colors: ["#0F172A", "#92400E", "#1E40AF"],
    features: ["Automático", "Aço 316L", "Cristal Safira"],
    isNew: true,
    isLimited: false,
  },
  {
    id: 2,
    name: "ChronoElite Gold",
    category: "Premium",
    price: 48900,
    originalPrice: null,
    rating: 5.0,
    reviews: 64,
    image: "/api/placeholder/400/400",
    colors: ["#B45309", "#78350F", "#F59E0B"],
    features: ["Ouro 18K", "Edição Limitada", "Automático"],
    isNew: false,
    isLimited: true,
  },
  {
    id: 3,
    name: "ChronoElite Sport",
    category: "Esportivo",
    price: 32900,
    originalPrice: 37900,
    rating: 4.7,
    reviews: 89,
    image: "/api/placeholder/400/400",
    colors: ["#047857", "#1E3A8A", "#0F172A"],
    features: ["100m Resistência", "Cronógrafo", "Cerâmica"],
    isNew: true,
    isLimited: false,
  },
  {
    id: 4,
    name: "ChronoElite Minimal",
    category: "Minimalista",
    price: 21900,
    originalPrice: 26900,
    rating: 4.8,
    reviews: 156,
    image: "/api/placeholder/400/400",
    colors: ["#374151", "#111827", "#6B7280"],
    features: ["Quartz Suíço", "Ultra-fino", "Couro Italiano"],
    isNew: false,
    isLimited: false,
  },
  {
    id: 5,
    name: "ChronoElite Heritage",
    category: "Vintage",
    price: 41900,
    originalPrice: null,
    rating: 4.9,
    reviews: 42,
    image: "/api/placeholder/400/400",
    colors: ["#78350F", "#92400E", "#F59E0B"],
    features: ["Edição 1987", "Manufatura", "Números Romanos"],
    isNew: false,
    isLimited: true,
  },
  {
    id: 6,
    name: "ChronoElite Dive",
    category: "Mergulho",
    price: 38900,
    originalPrice: 43900,
    rating: 4.6,
    reviews: 73,
    image: "/api/placeholder/400/400",
    colors: ["#0F766E", "#1E40AF", "#0F172A"],
    features: ["300m Resistência", "Luminova", "Bisel Giratório"],
    isNew: true,
    isLimited: false,
  },
  {
    id: 7,
    name: "ChronoElite Tourbillon",
    category: "Alta Relojoaria",
    price: 189000,
    originalPrice: null,
    rating: 5.0,
    reviews: 12,
    image: "/api/placeholder/400/400",
    colors: ["#F59E0B", "#78350F", "#92400E"],
    features: ["Tourbillon", "Platina", "Manufatura Completa"],
    isNew: false,
    isLimited: true,
  },
  {
    id: 8,
    name: "ChronoElite GMT",
    category: "Viagem",
    price: 35900,
    originalPrice: 39900,
    rating: 4.7,
    reviews: 58,
    image: "/api/placeholder/400/400",
    colors: ["#1E40AF", "#0F172A", "#374151"],
    features: ["GMT Function", "24h Display", "2 Fusos Horários"],
    isNew: true,
    isLimited: false,
  },
];

// Filtros disponíveis
const categories = ["Todos", "Clássico", "Premium", "Esportivo", "Minimalista", "Vintage", "Mergulho", "Alta Relojoaria", "Viagem"];
const priceRanges = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Até R$ 25.000", min: 0, max: 25000 },
  { label: "R$ 25.000 - R$ 40.000", min: 25000, max: 40000 },
  { label: "R$ 40.000 - R$ 60.000", min: 40000, max: 60000 },
  { label: "Acima de R$ 60.000", min: 60000, max: Infinity },
];

const ModelsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedPriceRange, setSelectedPriceRange] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  // Filtrar relógios
  const filteredWatches = watchModels.filter(watch => {
    // Filtro por categoria
    if (selectedCategory !== "Todos" && watch.category !== selectedCategory) {
      return false;
    }
    
    // Filtro por preço
    const priceRange = priceRanges.find(range => range.label === selectedPriceRange);
    if (priceRange && (watch.price < priceRange.min || watch.price > priceRange.max)) {
      return false;
    }
    
    // Filtro por busca
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero da página de modelos */}
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

          {/* Barra de busca e filtros */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Barra de busca */}
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

              {/* Controles de visualização */}
              <div className="flex items-center gap-4">
                {/* Botão filtros mobile */}
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden rounded-full"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>

                {/* Modos de visualização */}
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

                {/* Ordenação */}
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

            {/* Filtros expandidos (mobile) */}
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

          {/* Filtros desktop */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {/* Coluna de filtros */}
            <div className="lg:col-span-1 space-y-8">
              {/* Categorias */}
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

              {/* Faixa de preço */}
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

              {/* Badges de destaque */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Destaques</h3>
                <div className="space-y-3">
                  <Badge variant="gold" className="w-full justify-center py-2">
                    Edições Limitadas
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    Lançamentos Recentes
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    Mais Vendidos
                  </Badge>
                </div>
              </div>
            </div>

            {/* Grade de produtos */}
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

              {/* Grid de produtos */}
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
                          {/* Imagem */}
                          <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-surface-elevated to-surface">
                            <img
                              src={watch.image}
                              alt={watch.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            {/* Badges */}
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

                          {/* Conteúdo */}
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

                            {/* Cores disponíveis */}
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

                            {/* Preço */}
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xl font-bold text-foreground">
                                  R$ {watch.price.toLocaleString('pt-BR')}
                                </p>
                                {watch.originalPrice && (
                                  <p className="text-sm text-muted-foreground line-through">
                                    R$ {watch.originalPrice.toLocaleString('pt-BR')}
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
                /* List View */
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
                            {/* Imagem */}
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

                            {/* Detalhes */}
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
                                      R$ {watch.price.toLocaleString('pt-BR')}
                                    </p>
                                    {watch.originalPrice && (
                                      <p className="text-sm text-muted-foreground line-through">
                                        R$ {watch.originalPrice.toLocaleString('pt-BR')}
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

              {/* Paginação */}
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

              {/* Sem resultados */}
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

      {/* Banner de newsletter */}
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