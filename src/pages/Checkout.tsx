import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/checkout/AuthModal";
import { AddressForm } from "@/components/checkout/AddressForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";
import { Address, PaymentInfo, CartItem } from "@/types/order";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrders();
  
  // Get cart items from navigation state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<Address>({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [payment, setPayment] = useState<PaymentInfo>({
    method: "credit_card",
    status: "pending",
  });

  // Verificar se há items no state da navegação
  useEffect(() => {
    if (location.state?.items) {
      setCartItems(location.state.items);
    } else {
      // Fallback: buscar primeiro relógio do banco
      const fetchDefaultItem = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/watches?limit=1');
          if (response.ok) {
            const watches = await response.json();
            if (watches.length > 0) {
              const watch = watches[0];
              const defaultItem: CartItem = {
                productId: watch.id.toString(),
                productName: watch.name,
                variant: watch.category,
                strapColor: "Preto",
                price: watch.price,
                quantity: 1,
                imageUrl: watch.image_url,
                features: watch.features || [],
                isLimited: watch.is_limited,
                originalPrice: watch.original_price || null
              };
              setCartItems([defaultItem]);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar item padrão:', error);
        }
      };
      
      fetchDefaultItem();
    }
  }, [location]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 10000 ? 0 : 99;
  const total = subtotal + shipping;

  const isAddressValid = 
    address.cep.length >= 8 &&
    address.street &&
    address.number &&
    address.neighborhood &&
    address.city &&
    address.state;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar a compra.",
        variant: "destructive",
      });
      return;
    }

    if (!isAddressValid) {
      toast({
        title: "Endereço incompleto",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Aqui você implementaria a lógica real de criação do pedido
      // Por enquanto, vamos simular
      const orderNumber = `ORD${Date.now().toString().slice(-8)}`;
      
      toast({
        title: "Pedido realizado com sucesso!",
        description: `Número do pedido: ${orderNumber}`,
      });

      // Navegar para página de pedido (você precisará criar esta rota)
      navigate(`/pedidos/${orderNumber}`, { 
        state: { 
          order: {
            id: orderNumber,
            items: cartItems,
            address,
            payment,
            total,
            date: new Date().toISOString()
          }
        } 
      });
    } catch (error) {
      toast({
        title: "Erro ao processar pedido",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="section-padding py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/comprar" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar</span>
            </Link>
            
            <div className="text-lg font-semibold tracking-wider">
              CHRONO<span className="text-gold">ELITE</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Checkout Seguro
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 section-padding">
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground mb-8"
          >
            Finalizar Compra
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Auth Status */}
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gold/10 border border-gold/30 rounded-2xl p-6"
                >
                  <h3 className="font-medium text-foreground mb-2">Entre ou crie sua conta</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Para finalizar sua compra, você precisa estar logado.
                  </p>
                  <Button variant="gold" onClick={() => setShowAuthModal(true)}>
                    Entrar ou Cadastrar
                  </Button>
                </motion.div>
              )}

              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Logado como {user?.name || 'Usuário'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email || 'Email não disponível'}</p>
                  </div>
                </motion.div>
              )}

              {/* Address Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface-elevated rounded-2xl p-6 border border-border"
              >
                <AddressForm value={address} onChange={setAddress} />
              </motion.div>

              {/* Payment Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface-elevated rounded-2xl p-6 border border-border"
              >
                <PaymentForm value={payment} onChange={setPayment} total={total} />
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <OrderSummary
                    items={cartItems}
                    subtotal={subtotal}
                    shipping={shipping}
                    total={total}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full rounded-full text-lg py-6"
                    onClick={handleCheckout}
                    disabled={isProcessing || !isAuthenticated || !isAddressValid || cartItems.length === 0}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : cartItems.length === 0 ? (
                      "Carrinho Vazio"
                    ) : (
                      "Confirmar Pedido"
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    Ao confirmar, você concorda com nossos{" "}
                    <Link to="/termos" className="text-gold hover:underline">Termos de Uso</Link>
                    {" "}e{" "}
                    <Link to="/privacidade" className="text-gold hover:underline">Política de Privacidade</Link>
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </main>
  );
};

export default Checkout;