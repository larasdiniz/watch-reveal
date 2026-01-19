// Types for the order system - prepared for backend integration

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: Date;
}

export interface Address {
  id?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variant: string;
  strapColor: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface PaymentInfo {
  method: 'credit_card' | 'pix' | 'boleto';
  status: 'pending' | 'processing' | 'confirmed' | 'failed' | 'refunded';
  cardLast4?: string;
  cardBrand?: string;
  pixCode?: string;
  pixQrCode?: string;
  boletoUrl?: string;
  boletoCode?: string;
  boletoExpiration?: Date;
  paidAt?: Date;
}

export type OrderStatus = 
  | 'pending_payment'
  | 'payment_confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTracking {
  status: OrderStatus;
  date: Date;
  description: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  address: Address;
  payment: PaymentInfo;
  status: OrderStatus;
  tracking: OrderTracking[];
  invoiceUrl?: string;
  invoiceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
}

export interface CartItem {
  productId: string;
  productName: string;
  variant: string;
  strapColor: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
