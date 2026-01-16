const Footer = () => {
  return (
    <footer className="py-12 section-padding border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-lg font-semibold tracking-wider">
            CHRONO<span className="text-gold">ELITE</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              WhatsApp
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Email
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 ChronoElite. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
