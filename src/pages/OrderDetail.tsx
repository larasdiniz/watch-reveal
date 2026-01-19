import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, FileText, ChevronRight, User, LogOut, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { InvoiceView } from "@/components/orders/InvoiceView";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { useState } from "react";

const OrderDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  
  // Get order from navigation state or fetch from context
  const order = location.state?.order || orders[0];
  
  const [showInvoice, setShowInvoice] = useState(false);

  if (!order) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Pedido não encontrado</h1>
          <p className="text-muted-foreground mb-6">O pedido que você está procurando não existe.</p>
          <Button variant="gold" onClick={() => navigate("/")}>
            Voltar para a loja
          </Button>
        </div>
      </main>
    );
  }

  // Demo: Simulate order status progression
  const simulateProgress = () => {
    const statusOrder = ['pending_payment', 'payment_confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);
    if (currentIndex < statusOrder.length - 1) {
      updateOrderStatus(order.id, statusOrder[currentIndex + 1] as any);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="section-padding py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/meus-pedidos" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Meus Pedidos</span>
            </Link>
            
            <div className="text-lg font-semibold tracking-wider">
              CHRONO<span className="text-gold">ELITE</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-gold" />
                  </div>
                  <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pedido #{order.orderNumber}</h1>
                <p className="text-sm text-muted-foreground">
                  Realizado em {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setShowInvoice(!showInvoice)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {showInvoice ? "Ver Rastreio" : "Ver Nota Fiscal"}
                </Button>
                {/* Demo button - remove in production */}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={simulateProgress}
                >
                  Demo: Avançar Status
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {showInvoice ? (
                <InvoiceView order={order} />
              ) : (
                <>
                  {/* Timeline */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-elevated rounded-2xl p-6 border border-border"
                  >
                    <h2 className="text-lg font-semibold text-foreground mb-6">Rastreamento do Pedido</h2>
                    <OrderTimeline tracking={order.tracking} currentStatus={order.status} />
                  </motion.div>

                  {/* Delivery Estimate */}
                  {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gold/10 border border-gold/30 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Previsão de Entrega</p>
                          <p className="text-lg font-semibold text-foreground">
                            {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR", {
                              weekday: "long",
                              day: "2-digit",
                              month: "long",
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface-elevated rounded-2xl p-6 border border-border"
              >
                <h3 className="font-medium text-foreground mb-4">Itens do Pedido</h3>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center p-2">
                        <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">{item.productName}</h4>
                        <p className="text-xs text-muted-foreground">{item.variant} • {item.strapColor}</p>
                        <p className="text-sm font-medium text-gold mt-1">
                          R$ {item.price.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {order.subtotal.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className={order.shipping === 0 ? "text-green-500" : "text-foreground"}>
                      {order.shipping === 0 ? "Grátis" : `R$ ${order.shipping.toLocaleString("pt-BR")}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-bold text-gold">R$ {order.total.toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              </motion.div>

              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface-elevated rounded-2xl p-6 border border-border"
              >
                <h3 className="font-medium text-foreground mb-3">Endereço de Entrega</h3>
                <p className="text-sm text-muted-foreground">
                  {order.address.street}, {order.address.number}
                  {order.address.complement && `, ${order.address.complement}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.address.neighborhood}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.address.city} - {order.address.state}
                </p>
                <p className="text-sm text-muted-foreground">
                  CEP: {order.address.cep}
                </p>
              </motion.div>

              {/* Help */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface-elevated rounded-2xl p-6 border border-border"
              >
                <h3 className="font-medium text-foreground mb-3">Precisa de ajuda?</h3>
                <div className="space-y-2">
                  <Link to="/suporte" className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>Falar com suporte</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link to="/devolucao" className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>Solicitar devolução</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetail;
