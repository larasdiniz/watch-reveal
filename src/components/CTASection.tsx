import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface WatchData {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [featuredWatch, setFeaturedWatch] = useState<WatchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedWatch = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/watches/featured');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const watch = await response.json();
        setFeaturedWatch(watch);
      } catch (error) {
        console.error('Erro ao buscar relógio em destaque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedWatch();
  }, []);

  if (loading) {
    return (
      <section className="py-32 section-padding relative overflow-hidden bg-background">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-32 section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />
      
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <img 
          src={featuredWatch?.image_url || "/assets/watch-hero.png"} 
          alt="" 
          className="w-full max-w-4xl h-auto blur-sm"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-display-lg text-foreground mb-6"
        >
          O Tempo é <span className="text-gradient-gold">Precioso.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
        >
          Faça parte de um seleto grupo de colecionadores que valorizam 
          a verdadeira arte da relojoaria suíça.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to={`/modelos/${featuredWatch?.id || 1}`}>
            <Button variant="gold" size="lg" className="rounded-full px-10">
              Comprar Agora
            </Button>
          </Link>
          <Link to="/modelos">
            <Button variant="outline" size="lg" className="rounded-full px-10">
              Ver Coleção
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            Frete Grátis
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            Garantia Vitalícia
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            30 Dias para Devolução
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;