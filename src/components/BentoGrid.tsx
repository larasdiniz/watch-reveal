import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const bentoItems = [
  {
    id: 1,
    content: (
      <div className="flex flex-col justify-between h-full">
        <div className="text-6xl md:text-7xl font-bold text-gradient-gold">42mm</div>
        <p className="text-muted-foreground text-sm mt-4">Diâmetro perfeito para qualquer pulso</p>
      </div>
    ),
    className: "col-span-1 row-span-1",
  },
  {
    id: 2,
    content: (
      <div className="flex flex-col justify-between h-full">
        <div className="text-6xl md:text-7xl font-bold text-foreground">72h</div>
        <p className="text-muted-foreground text-sm mt-4">Reserva de marcha automática</p>
      </div>
    ),
    className: "col-span-1 row-span-1",
  },
  {
    id: 3,
    content: (
      <div className="flex flex-col justify-center items-center h-full text-center">
        <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gold/40 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gold" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Ouro 18K</h3>
        <p className="text-muted-foreground text-sm">Detalhes banhados em ouro genuíno</p>
      </div>
    ),
    className: "col-span-2 row-span-1 md:col-span-1",
  },
  {
    id: 4,
    content: (
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Aço 316L
          </h3>
          <p className="text-muted-foreground">
            O mesmo aço cirúrgico usado em equipamentos médicos de alta precisão. 
            Resistente a corrosão e hipoalergênico.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-6">
          <div className="h-1 flex-1 bg-gradient-to-r from-gold to-gold/20 rounded-full" />
          <span className="text-gold text-sm font-medium">Premium</span>
        </div>
      </div>
    ),
    className: "col-span-2 row-span-1",
  },
  {
    id: 5,
    content: (
      <div className="flex flex-col justify-center h-full">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {["Preto", "Marrom", "Azul"].map((cor) => (
            <div key={cor} className="text-center">
              <div 
                className={`w-10 h-10 mx-auto rounded-full mb-2 border border-border
                  ${cor === "Preto" ? "bg-neutral-900" : ""}
                  ${cor === "Marrom" ? "bg-amber-900" : ""}
                  ${cor === "Azul" ? "bg-blue-900" : ""}
                `}
              />
              <span className="text-xs text-muted-foreground">{cor}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Pulseiras intercambiáveis disponíveis em 3 cores
        </p>
      </div>
    ),
    className: "col-span-2 md:col-span-1 row-span-1",
  },
];

const BentoGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-24 section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-display-md text-foreground mb-4">
            Especificações <span className="text-gradient-gold">Técnicas</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Engenharia de precisão em cada componente.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {bentoItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`
                ${item.className}
                bg-surface-elevated rounded-3xl p-6 md:p-8
                min-h-[180px] md:min-h-[220px]
                transition-all duration-300 hover:bg-surface-elevated/80
                border border-transparent hover:border-gold/20
              `}
            >
              {item.content}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
