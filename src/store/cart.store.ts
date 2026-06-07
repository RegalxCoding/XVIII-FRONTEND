import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MenuProduct } from '@/data/menuData';

// ─────────────────────────────────────────
// Cart Types
// ─────────────────────────────────────────

export interface CartItem {
  product: MenuProduct;   // full product snapshot (works with Appwrite data too)
  quantity: number;
}

interface CartState {
  items: CartItem[];
  // ── Actions ──────────────────────────────
  addToCart: (product: MenuProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  // ── Selectors ────────────────────────────
  getTotalItems: () => number;
  getSubtotal: () => number;
}

// ─────────────────────────────────────────
// Delivery fee constant — update when Appwrite config is live
// ─────────────────────────────────────────

export const DELIVERY_FEE = 40;   // ₹40 flat delivery fee

// ─────────────────────────────────────────
// Cart Store — persisted to localStorage
// ─────────────────────────────────────────

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // ── Add product (or increment quantity if already in cart) ──
      addToCart: (product: MenuProduct) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id,
          );

          if (existing) {
            // Product already in cart — increase quantity
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          // New product — add with quantity 1
          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        });
      },

      // ── Remove a product entirely ──
      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.product.id !== productId,
          ),
        }));
      },

      // ── Set an explicit quantity (removes item if quantity ≤ 0) ──
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item,
          ),
        }));
      },

      // ── Clear entire cart ──
      clearCart: () => set({ items: [] }),

      // ── Total item count (sum of quantities) ──
      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      // ── Subtotal in ₹ (before delivery) ──
      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        ),
    }),
    {
      name: 'xviii-cart',                        // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the items array — selectors are recomputed
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
