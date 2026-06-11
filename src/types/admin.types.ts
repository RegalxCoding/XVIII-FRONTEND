// ─────────────────────────────────────────
// Admin-Specific Types
// ─────────────────────────────────────────

export type AdminProductCategory = 'coffee' | 'dessert';

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: AdminProductCategory;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export type AdminOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash_on_delivery' | 'online' | 'card';

export interface AdminOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: AdminOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: AdminOrderStatus;
  notes?: string;
  createdAt: string;
  userId?: string | null;
  location?: { lat: number; lng: number } | null;
}

// ─────────────────────────────────────────
// Admin Auth (UI-only for now)
// ─────────────────────────────────────────

export interface AdminCredentials {
  username: string;
  password: string;
}
