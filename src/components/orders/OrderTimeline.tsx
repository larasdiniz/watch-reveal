import { motion } from "framer-motion";
import { 
  Clock, 
  CreditCard, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";
import { OrderStatus, OrderTracking } from "@/types/order";

interface OrderTimelineProps {
  tracking: OrderTracking[];
  currentStatus: OrderStatus;
}

const statusConfig: Record<OrderStatus, { icon: typeof Clock; label: string; color: string }> = {
  pending_payment: { icon: Clock, label: "Aguardando Pagamento", color: "text-yellow-500" },
  payment_confirmed: { icon: CreditCard, label: "Pagamento Confirmado", color: "text-green-500" },
  processing: { icon: Package, label: "Preparando", color: "text-blue-500" },
  shipped: { icon: Truck, label: "Enviado", color: "text-purple-500" },
  out_for_delivery: { icon: MapPin, label: "Saiu para Entrega", color: "text-orange-500" },
  delivered: { icon: CheckCircle2, label: "Entregue", color: "text-green-500" },
  cancelled: { icon: XCircle, label: "Cancelado", color: "text-red-500" },
};

const statusOrder: OrderStatus[] = [
  'pending_payment',
  'payment_confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
];

export function OrderTimeline({ tracking, currentStatus }: OrderTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="relative">
        <div className="flex justify-between">
          {statusOrder.slice(0, 5).map((status, index) => {
            const config = statusConfig[status];
            const Icon = config.icon;
            const isCompleted = currentIndex > index;
            const isCurrent = currentIndex === index;
            const isPending = currentIndex < index;

            return (
              <div key={status} className="flex flex-col items-center relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isCompleted || isCurrent
                      ? "bg-gold text-background"
                      : "bg-surface-elevated text-muted-foreground border border-border"
                    }
                    ${isCancelled ? "bg-red-500/20 text-red-500 border-red-500/50" : ""}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={`
                  text-xs mt-2 text-center max-w-[60px]
                  ${isCurrent ? "text-gold font-medium" : "text-muted-foreground"}
                `}>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-border -z-0">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(currentIndex / 4, 1) * 100}%` }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`h-full ${isCancelled ? "bg-red-500" : "bg-gold"}`}
          />
        </div>
      </div>

      {/* Timeline Details */}
      <div className="mt-8 space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Histórico
        </h4>
        <div className="space-y-4">
          {tracking.slice().reverse().map((item, index) => {
            const config = statusConfig[item.status];
            const Icon = config.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.color} bg-current/10`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{config.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {item.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
