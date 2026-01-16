import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 section-padding py-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-lg font-semibold tracking-wider">
          CHRONO<span className="text-gold">ELITE</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {["Coleção", "Sobre", "Contato"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 uppercase tracking-wider"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="glass-surface px-4 py-2 rounded-full">
          <span className="text-xs uppercase tracking-wider text-gold">
            Reservar
          </span>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
