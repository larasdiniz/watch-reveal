import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const specs = [
  { label: "Diâmetro da Caixa", value: "42mm" },
  { label: "Espessura", value: "11.5mm" },
  { label: "Material da Caixa", value: "Aço 316L + Ouro 18K" },
  { label: "Cristal", value: "Safira Anti-Reflexo" },
  { label: "Reserva de Marcha", value: "72 Horas" },
  { label: "Resistência à Água", value: "100 Metros" },
];

const SpecsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-display-md text-foreground mb-4">
            Especificações <span className="text-gradient-gold">Técnicas</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Engenharia de precisão em cada componente.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
          {specs.map((spec, index) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group p-8 bg-surface-elevated/50 hover:bg-surface-elevated transition-colors duration-300"
            >
              <div className="text-sm text-muted-foreground uppercase tracking-wider mb-3">
                {spec.label}
              </div>
              <div className="text-2xl font-semibold text-foreground group-hover:text-gold transition-colors duration-300">
                {spec.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
