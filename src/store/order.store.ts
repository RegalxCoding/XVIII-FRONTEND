import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from './cart.store';

// ─────────────────────────────────────────
// Order Types
// ─────────────────────────────────────────

export type OrderStatus = 'Preparing ☕' | 'Out for Delivery 🚚' | 'Delivered ✅';

export interface OrderLocation {
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: {
    fullName: string;
    phone: string;
    fullAddress: string;
    landmark?: string;
    city: string;
    pincode?: string;
  };
  location: OrderLocation | null;
  status: OrderStatus;
  date: string;
  paymentMethod: 'Cash on Delivery';
  estimatedTime: string;
}

interface OrderState {
  orders: Order[];
  // ── Actions ──────────────────────────────
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'date' | 'paymentMethod'>, pregeneratedId?: string) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  // ── Selectors ────────────────────────────
  getOrderById: (id: string) => Order | undefined;
}

// ─────────────────────────────────────────
// Order Store — persisted to localStorage
// ─────────────────────────────────────────

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      // ── Place a new order ──
      placeOrder: (orderData, pregeneratedId) => {
        const id = pregeneratedId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        const newOrder: Order = {
          ...orderData,
          id,
          status: 'Preparing ☕',
          date: new Date().toISOString(),
          paymentMethod: 'Cash on Delivery',
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return id;
      },

      // ── Update order status (for admin or testing) ──
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },

      // ── Get specific order ──
      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },
    }),
    {
      name: 'xviii-orders', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
