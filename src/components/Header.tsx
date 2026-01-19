import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="section-padding py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-lg font-semibold tracking-wider">
            CHRONO<span className="text-gold">ELITE</span>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {["Visão Geral", "Especificações", "Modelos"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-muted-foreground">
              A partir de <span className="text-foreground font-medium">R$ 24.900</span>
            </span>
            <Link to="/comprar">
              <Button variant="gold" size="sm" className="rounded-full">
                Comprar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
