import { motion } from "framer-motion";
import { FileText, Download, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";

interface InvoiceViewProps {
  order: Order;
}

export function InvoiceView({ order }: InvoiceViewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log("Download invoice:", order.invoiceNumber);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `Nota Fiscal ${order.invoiceNumber}`,
        text: `Nota fiscal do pedido ${order.orderNumber}`,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-elevated rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gold/10 to-transparent p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Nota Fiscal Eletrônica</h3>
              <p className="text-sm text-muted-foreground">{order.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrint} className="rounded-full">
              <Printer className="w-4 h-4" />
            </Button>
            <Button variant="gold" size="icon" onClick={handleDownload} className="rounded-full">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-6 space-y-6 print:bg-white print:text-black">
        {/* Company Info */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-bold text-gold">CHRONOELITE</h4>
            <p className="text-sm text-muted-foreground">CNPJ: 00.000.000/0001-00</p>
            <p className="text-sm text-muted-foreground">Av. Paulista, 1000 - São Paulo, SP</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Data de Emissão</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(order.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-background rounded-xl p-4">
          <h5 className="text-sm font-medium text-muted-foreground mb-2">Destinatário</h5>
          <p className="text-sm text-foreground font-medium">Cliente ID: {order.userId}</p>
          <p className="text-sm text-muted-foreground">
            {order.address.street}, {order.address.number}
            {order.address.complement && `, ${order.address.complement}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.address.neighborhood} - {order.address.city}/{order.address.state}
          </p>
          <p className="text-sm text-muted-foreground">CEP: {order.address.cep}</p>
        </div>

        {/* Items Table */}
        <div>
          <h5 className="text-sm font-medium text-muted-foreground mb-3">Produtos</h5>
          <div className="bg-background rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground font-medium">Produto</th>
                  <th className="text-center p-3 text-muted-foreground font-medium">Qtd</th>
                  <th className="text-right p-3 text-muted-foreground font-medium">Unit.</th>
                  <th className="text-right p-3 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="p-3">
                      <p className="font-medium text-foreground">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.variant} • {item.strapColor}</p>
                    </td>
                    <td className="p-3 text-center text-foreground">{item.quantity}</td>
                    <td className="p-3 text-right text-foreground">
                      R$ {item.price.toLocaleString("pt-BR")}
                    </td>
                    <td className="p-3 text-right font-medium text-foreground">
                      R$ {(item.price * item.quantity).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-background rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">R$ {order.subtotal.toLocaleString("pt-BR")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Frete</span>
            <span className="text-foreground">
              {order.shipping === 0 ? "Grátis" : `R$ ${order.shipping.toLocaleString("pt-BR")}`}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Desconto</span>
              <span className="text-green-500">-R$ {order.discount.toLocaleString("pt-BR")}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-medium text-foreground">Total</span>
            <span className="text-lg font-bold text-gold">R$ {order.total.toLocaleString("pt-BR")}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="flex items-center justify-between text-sm bg-gold/10 rounded-xl p-4">
          <div>
            <p className="text-muted-foreground">Forma de Pagamento</p>
            <p className="font-medium text-foreground">
              {order.payment.method === 'credit_card' && 'Cartão de Crédito'}
              {order.payment.method === 'pix' && 'PIX'}
              {order.payment.method === 'boleto' && 'Boleto Bancário'}
              {order.payment.cardLast4 && ` •••• ${order.payment.cardLast4}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Status</p>
            <p className={`font-medium ${order.payment.status === 'confirmed' ? 'text-green-500' : 'text-yellow-500'}`}>
              {order.payment.status === 'confirmed' ? 'Pago' : 'Pendente'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>Esta nota fiscal foi gerada eletronicamente e é válida como comprovante de compra.</p>
          <p className="mt-1">Pedido #{order.orderNumber} • {order.invoiceNumber}</p>
        </div>
      </div>
    </motion.div>
  );
}
