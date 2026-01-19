import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, User, LogOut, ShoppingBag, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { OrderStatus } from "@/types/order";

const statusConfig: Record<OrderStatus, { icon: typeof Clock; label: string; color: string; bgColor: string }> = {
  pending_payment: { icon: Clock, label: "Aguardando Pagamento", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  payment_confirmed: { icon: CheckCircle2, label: "Pagamento Confirmado", color: "text-green-500", bgColor: "bg-green-500/10" },
  processing: { icon: Package, label: "Preparando", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  shipped: { icon: Truck, label: "Enviado", color: "text-purple-500", bgColor: "bg-purple-500/10" },
  out_for_delivery: { icon: Truck, label: "Saiu para Entrega", color: "text-orange-500", bgColor: "bg-orange-500/10" },
  delivered: { icon: CheckCircle2, label: "Entregue", color: "text-green-500", bgColor: "bg-green-500/10" },
  cancelled: { icon: XCircle, label: "Cancelado", color: "text-red-500", bgColor: "bg-red-500/10" },
};

const MeusPedidos = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { orders } = useOrders();

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Faça login para ver seus pedidos</h1>
          <p className="text-muted-foreground mb-6">
            Acesse sua conta para acompanhar seus pedidos e visualizar notas fiscais.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Voltar à loja
            </Button>
            <Button variant="gold" onClick={() => navigate("/comprar")}>
              Fazer Login
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="section-padding py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Loja</span>
            </Link>
            
            <div className="text-lg font-semibold tracking-wider">
              CHRONO<span className="text-gold">ELITE</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-gold" />
                </div>
                <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
              </div>
              <button 
                onClick={() => { logout(); navigate("/"); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 section-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground">Meus Pedidos</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe o status de suas compras
            </p>
          </motion.div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Nenhum pedido ainda</h2>
              <p className="text-muted-foreground mb-6">
                Quando você fizer sua primeira compra, ela aparecerá aqui.
              </p>
              <Button variant="gold" onClick={() => navigate("/comprar")}>
                Começar a Comprar
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const statusInfo = statusConfig[order.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(`/pedidos/${order.id}`, { state: { order } })}
                    className="bg-surface-elevated rounded-2xl p-6 border border-border hover:border-gold/30 transition-all cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                          <img 
                            src={order.items[0]?.imageUrl} 
                            alt={order.items[0]?.productName} 
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-foreground">#{order.orderNumber}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3 inline mr-1" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.items.map(i => i.productName).join(", ")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gold">
                            R$ {order.total.toLocaleString("pt-BR")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center">
                          <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>Confirmado</span>
                          <span>Preparando</span>
                          <span>Enviado</span>
                          <span>Entregue</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${
                                order.status === 'pending_payment' ? 10 :
                                order.status === 'payment_confirmed' ? 25 :
                                order.status === 'processing' ? 50 :
                                order.status === 'shipped' ? 75 :
                                order.status === 'out_for_delivery' ? 90 :
                                100
                              }%` 
                            }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="h-full bg-gold rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MeusPedidos;
