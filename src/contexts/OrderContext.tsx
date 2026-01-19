import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Order, OrderStatus, Address, PaymentInfo, CartItem } from "@/types/order";

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (
    items: CartItem[],
    address: Address,
    payment: PaymentInfo,
    userId: string
  ) => Promise<Order>;
  getOrder: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Generate order number
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CE${year}${random}`;
};

// Generate invoice number
const generateInvoiceNumber = () => {
  const random = Math.floor(Math.random() * 900000000) + 100000000;
  return `NF-${random}`;
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = useCallback(
    async (
      items: CartItem[],
      address: Address,
      payment: PaymentInfo,
      userId: string
    ): Promise<Order> => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = subtotal >= 10000 ? 0 : 99;

      const order: Order = {
        id: `ord_${Date.now()}`,
        orderNumber: generateOrderNumber(),
        userId,
        items: items.map((item) => ({
          ...item,
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        })),
        subtotal,
        shipping,
        discount: 0,
        total: subtotal + shipping,
        address,
        payment: {
          ...payment,
          status: payment.method === 'pix' ? 'pending' : 'processing',
        },
        status: 'pending_payment',
        tracking: [
          {
            status: 'pending_payment',
            date: new Date(),
            description: 'Pedido criado. Aguardando confirmação do pagamento.',
          },
        ],
        invoiceNumber: generateInvoiceNumber(),
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };

      setOrders((prev) => [order, ...prev]);
      setCurrentOrder(order);
      return order;
    },
    []
  );

  const getOrder = useCallback(
    (orderId: string) => {
      return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    },
    [orders]
  );

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const statusDescriptions: Record<OrderStatus, string> = {
            pending_payment: 'Aguardando confirmação do pagamento.',
            payment_confirmed: 'Pagamento confirmado! Preparando seu pedido.',
            processing: 'Seu pedido está sendo preparado.',
            shipped: 'Pedido enviado! Em trânsito para o destino.',
            out_for_delivery: 'Pedido saiu para entrega.',
            delivered: 'Pedido entregue com sucesso!',
            cancelled: 'Pedido cancelado.',
          };

          return {
            ...order,
            status,
            updatedAt: new Date(),
            tracking: [
              ...order.tracking,
              {
                status,
                date: new Date(),
                description: statusDescriptions[status],
              },
            ],
          };
        }
        return order;
      })
    );
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        createOrder,
        getOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
