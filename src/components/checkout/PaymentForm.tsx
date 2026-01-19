import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, QrCode, FileText, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaymentInfo } from "@/types/order";

interface PaymentFormProps {
  value: PaymentInfo;
  onChange: (payment: PaymentInfo) => void;
  total: number;
}

const paymentMethods = [
  { id: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard },
  { id: 'pix', label: 'PIX', icon: QrCode },
  { id: 'boleto', label: 'Boleto Bancário', icon: FileText },
] as const;

export function PaymentForm({ value, onChange, total }: PaymentFormProps) {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [copied, setCopied] = useState(false);

  const formatCardNumber = (num: string) => {
    const clean = num.replace(/\D/g, "");
    const groups = clean.match(/.{1,4}/g);
    return groups ? groups.join(" ") : clean;
  };

  const formatExpiry = (exp: string) => {
    const clean = exp.replace(/\D/g, "");
    if (clean.length >= 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-medium">Pagamento</h3>
      </div>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-3 gap-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onChange({ ...value, method: method.id, status: 'pending' })}
            className={`
              p-4 rounded-xl border text-center transition-all
              ${value.method === method.id
                ? "border-gold bg-gold/10"
                : "border-border hover:border-gold/30"
              }
            `}
          >
            <method.icon className={`w-6 h-6 mx-auto mb-2 ${value.method === method.id ? "text-gold" : "text-muted-foreground"}`} />
            <span className={`text-sm ${value.method === method.id ? "text-foreground" : "text-muted-foreground"}`}>
              {method.label}
            </span>
          </button>
        ))}
      </div>

      {/* Payment Forms */}
      <AnimatePresence mode="wait">
        {value.method === 'credit_card' && (
          <motion.div
            key="credit_card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={formatCardNumber(cardData.number)}
                onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/\D/g, "") })}
                maxLength={19}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Nome no Cartão</Label>
              <Input
                id="cardName"
                placeholder="NOME COMO ESTÁ NO CARTÃO"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                className="bg-background border-border uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Validade</Label>
                <Input
                  id="expiry"
                  placeholder="MM/AA"
                  value={formatExpiry(cardData.expiry)}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value.replace(/\D/g, "") })}
                  maxLength={5}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="000"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "") })}
                  maxLength={4}
                  type="password"
                  className="bg-background border-border"
                />
              </div>
            </div>

            {/* Installments */}
            <div className="space-y-2">
              <Label>Parcelas</Label>
              <select className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground">
                <option value="1">1x de R$ {total.toLocaleString("pt-BR")} (sem juros)</option>
                <option value="2">2x de R$ {(total / 2).toLocaleString("pt-BR")} (sem juros)</option>
                <option value="3">3x de R$ {(total / 3).toLocaleString("pt-BR")} (sem juros)</option>
                <option value="6">6x de R$ {(total / 6).toLocaleString("pt-BR")} (sem juros)</option>
                <option value="10">10x de R$ {(total / 10).toLocaleString("pt-BR")} (sem juros)</option>
                <option value="12">12x de R$ {(total / 12).toLocaleString("pt-BR")} (sem juros)</option>
              </select>
            </div>
          </motion.div>
        )}

        {value.method === 'pix' && (
          <motion.div
            key="pix"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-background rounded-2xl p-6 border border-border text-center">
              {/* Mock QR Code */}
              <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 mb-4">
                <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMSAyMSI+PHBhdGggZD0iTTEgMWgxOXYxOUgxeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0zIDNoM3YzSDN6TTcgM2gxdjFIN3ptMiAwaDJ2Mkg5ek0xMiAzaDN2M2gtM3ptNCAwaDF2MWgtMXptMSAwaDN2M2gtM3pNMyA3aDN2M0gzem00IDBoMXYxSDd6bTIgMGgxdjFIOXptMSAwaDJ2MmgtMnptMyAwaDJ2MmgtMnptMyAwaDN2M2gtM3pNMyAxMWgzdjNIM3ptNCAwaDJ2MmgtMnptMyAwaDJ2MmgtMnptMyAwaDJ2MmgtMnptMyAwaDN2M2gtM3pNMyAxNWgzdjNIM3ptNCAwaDJ2MmgtMnptMyAwaDN2M2gtM3ptNCAwaDN2M2gtM3oiLz48L3N2Zz4=')] bg-contain" />
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Escaneie o QR Code ou copie o código PIX
              </p>

              <div className="flex gap-2">
                <Input
                  value="00020126580014br.gov.bcb.pix..."
                  readOnly
                  className="bg-surface-elevated border-border text-xs"
                />
                <Button variant="outline" size="icon" onClick={handleCopyPix}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                O código PIX expira em <span className="text-gold font-medium">30 minutos</span>
              </p>
            </div>
          </motion.div>
        )}

        {value.method === 'boleto' && (
          <motion.div
            key="boleto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-background rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Boleto Bancário</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    O boleto será gerado após a confirmação do pedido. O prazo de compensação é de até 3 dias úteis.
                  </p>
                  <div className="mt-3 p-3 bg-surface-elevated rounded-lg">
                    <p className="text-xs text-muted-foreground">Vencimento</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
