import { motion } from "framer-motion";

const footerLinks = {
  "Loja": ["Comprar ChronoElite", "Acessórios", "Presentes"],
  "Suporte": ["Garantia", "Manutenção", "Contato"],
  "Sobre": ["Nossa História", "Artesãos", "Sustentabilidade"],
};

const Footer = () => {
  return (
    <footer className="bg-surface-elevated/50 border-t border-border">
      {/* Main footer */}
      <div className="section-padding py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="text-xl font-semibold tracking-wider mb-4">
                CHRONO<span className="text-gold">ELITE</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Onde a precisão encontra a elegância desde 1987.
              </p>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-foreground mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-border">
            <div className="flex items-center gap-6">
              {["Instagram", "WhatsApp", "YouTube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2026 ChronoElite. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
