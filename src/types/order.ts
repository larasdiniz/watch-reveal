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
  // Novos campos do banco
  features?: string[];
  isLimited?: boolean;
  originalPrice?: number | null;
  category?: string;
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
  // Novos campos para dados do banco
  features?: string[];
  isLimited?: boolean;
  originalPrice?: number | null;
}

// Tipo para dados do relógio do banco (se precisar)
export interface Watch {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews: number;
  image_url: string;
  features: string[];
  colors: string[];
  is_new: boolean;
  is_limited: boolean;
  created_at: string;
}

export interface ApiWatch {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price: number | null;
  rating: number | string;
  reviews: number;
  image_url: string;
  colors: string[];
  features: string[];
  is_new: boolean;
  is_limited: boolean;
}