import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MenuProduct } from '@/data/menuData';
import type { DessertSlot } from '@/utils/timeSlots';
import { isSlotStillValid } from '@/utils/timeSlots';

// ─────────────────────────────────────────
// Cart Types
// ─────────────────────────────────────────

export interface CartItem {
  product: MenuProduct;   // full product snapshot (works with Appwrite data too)
  quantity: number;
}

interface CartState {
  items: CartItem[];

  /**
   * One delivery slot for the entire dessert portion of the order.
   * Stored as a DessertSlot (real ISO date + scheduledTimestamp).
   * Never stores "today"/"tomorrow" — only real dates.
   */
  dessertSlot: DessertSlot | null;

  /**
   * Only meaningful when cart contains both coffee and dessert.
   * null = not yet chosen (blocks checkout in mixed orders).
   */
  coffeeDeliveryMode: 'immediate' | 'withDessert' | null;

  // ── Actions ──────────────────────────────
  addToCart: (product: MenuProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDessertSlot: (slot: DessertSlot | null) => void;
  setCoffeeDeliveryMode: (mode: 'immediate' | 'withDessert' | null) => void;

  // ── Selectors ────────────────────────────
  getTotalItems: () => number;
  getSubtotal: () => number;
  /** Returns true if cart contains at least one dessert */
  hasDesserts: () => boolean;
  /** Returns true if cart contains at least one coffee */
  hasCoffee: () => boolean;
  /** Returns true if cart has both coffee and dessert */
  isMixedOrder: () => boolean;
  /** Returns true if dessertSlot is set and not yet expired */
  isSlotValid: () => boolean;
}

// ─────────────────────────────────────────
// Delivery fee constant — update when pricing changes
// ─────────────────────────────────────────

export const DELIVERY_FEE = 40;   // ₹40 flat delivery fee

// ─────────────────────────────────────────
// Cart Store — persisted to localStorage
// ─────────────────────────────────────────

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      dessertSlot: null,
      coffeeDeliveryMode: null,

      // ── Add product (or increment quantity if already in cart) ──
      addToCart: (product: MenuProduct) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id,
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        });
      },

      // ── Remove a product — also clears slot/mode when relevant ──
      removeFromCart: (productId: string) => {
        set((state) => {
          const removed = state.items.find(i => i.product.id === productId);
          const newItems = state.items.filter(i => i.product.id !== productId);

          const stillHasDessert = newItems.some(i => i.product.category === 'dessert');
          const stillHasCoffee = newItems.some(i => i.product.category === 'coffee');

          // If we removed the last dessert: clear the slot and delivery mode
          const clearSlot = removed?.product.category === 'dessert' && !stillHasDessert;
          // If we removed the last coffee from a mixed cart: clear delivery mode
          const clearMode = removed?.product.category === 'coffee' && !stillHasCoffee;

          return {
            items: newItems,
            dessertSlot: clearSlot ? null : state.dessertSlot,
            coffeeDeliveryMode: (clearSlot || clearMode) ? null : state.coffeeDeliveryMode,
          };
        });
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

      // ── Clear entire cart including scheduling state ──
      clearCart: () => set({ items: [], dessertSlot: null, coffeeDeliveryMode: null }),

      // ── Set / update the dessert delivery slot ──
      setDessertSlot: (slot) => set({ dessertSlot: slot }),

      // ── Set / update coffee delivery mode ──
      setCoffeeDeliveryMode: (mode) => set({ coffeeDeliveryMode: mode }),

      // ── Total item count (sum of quantities) ──
      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      // ── Subtotal in ₹ (before delivery) ──
      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        ),

      // ── Category selectors ──
      hasDesserts: () => get().items.some(i => i.product.category === 'dessert'),
      hasCoffee: () => get().items.some(i => i.product.category === 'coffee'),
      isMixedOrder: () => {
        const items = get().items;
        return items.some(i => i.product.category === 'coffee') &&
               items.some(i => i.product.category === 'dessert');
      },

      // ── Slot validity (calls timeSlots utility) ──
      isSlotValid: () => {
        const slot = get().dessertSlot;
        if (!slot) return false;
        return isSlotStillValid(slot);
      },
    }),
    {
      name: 'xviii-cart',                        // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Persist items + scheduling state — selectors are recomputed
      partialize: (state) => ({
        items: state.items,
        dessertSlot: state.dessertSlot,
        coffeeDeliveryMode: state.coffeeDeliveryMode,
      }),
    },
  ),
);
