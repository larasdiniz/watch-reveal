import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import Index from "./pages/Index";
import Comprar from "./pages/Comprar";
import Checkout from "./pages/Checkout";
import MeusPedidos from "./pages/MeusPedidos";
import OrderDetail from "./pages/OrderDetail";
import ModelsPage from "./pages/ModelsPage";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // 30 segundos
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <LoadingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/comprar" element={<Comprar />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/meus-pedidos" element={<MeusPedidos />} />
                  <Route path="/pedidos/:id" element={<OrderDetail />} />
                  <Route path="/modelos" element={<ModelsPage />} />
                  <Route path="/modelos/:id" element={<ProductDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </LoadingProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;