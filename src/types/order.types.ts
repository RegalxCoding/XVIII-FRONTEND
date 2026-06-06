// ─────────────────────────────────────────
// Order Types
// ─────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  $id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  addressId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────
// Rewards Types
// ─────────────────────────────────────────

export interface RewardStamp {
  $id: string;
  userId: string;
  stamps: number;
  totalStampsEarned: number;
  lastUpdated: string;
}

export interface Reward {
  $id: string;
  title: string;
  description: string;
  stampsRequired: number;
  type: 'free_item' | 'discount' | 'special';
  value: number;
  isActive: boolean;
}
