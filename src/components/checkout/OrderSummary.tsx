import { Package, Truck, Tag } from "lucide-react";
import { CartItem } from "@/types/order";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
}

export function OrderSummary({ items, subtotal, shipping, discount = 0, total }: OrderSummaryProps) {
  return (
    <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-gold" />
        Resumo do Pedido
      </h3>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center p-2">
              <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">{item.productName}</h4>
              <p className="text-xs text-muted-foreground">{item.variant} • {item.strapColor}</p>
              <p className="text-sm font-medium text-foreground mt-1">
                R$ {item.price.toLocaleString("pt-BR")}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">x{item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">R$ {subtotal.toLocaleString("pt-BR")}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Truck className="w-4 h-4" />
            Frete
          </span>
          <span className={shipping === 0 ? "text-green-500" : "text-foreground"}>
            {shipping === 0 ? "Grátis" : `R$ ${shipping.toLocaleString("pt-BR")}`}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Desconto
            </span>
            <span className="text-green-500">-R$ {discount.toLocaleString("pt-BR")}</span>
          </div>
        )}

        <div className="flex justify-between pt-3 border-t border-border">
          <span className="font-medium text-foreground">Total</span>
          <div className="text-right">
            <span className="text-xl font-bold text-foreground">
              R$ {total.toLocaleString("pt-BR")}
            </span>
            <p className="text-xs text-muted-foreground">
              ou 12x de R$ {Math.round(total / 12).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
