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
  | 'out_for_delivery'
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

  // ── Delivery verification ──
  paymentStatus?: 'pending' | 'paid' | 'cash_collected';
  assignedDriverId?: string;

  // ── Auto-derived from items[] at order creation — never set manually ──
  containsCoffee?: boolean;
  containsDessert?: boolean;

  // ── Scheduling — only populated when containsDessert is true ──
  isScheduled?: boolean;
  /**
   * Canonical scheduling value (Unix ms, IST).
   * deliveryDate and deliveryTime are display projections of this — derive from it,
   * never set independently.
   */
  scheduledTimestamp?: number;
  /** ISO date "YYYY-MM-DD" (IST) — derived from scheduledTimestamp for display */
  deliveryDate?: string;
  /** Human-readable time "4:00 PM" — derived from scheduledTimestamp for display */
  deliveryTime?: string;

  // ── Mixed-order fulfillment — only present when containsCoffee && containsDessert ──
  coffeeDeliveryMode?: 'immediate' | 'withDessert';
}

// ─────────────────────────────────────────
// Admin Auth (UI-only for now)
// ─────────────────────────────────────────

export interface AdminCredentials {
  username: string;
  password: string;
}
