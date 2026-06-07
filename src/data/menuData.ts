// ─────────────────────────────────────────
// Menu Data — Dummy Products
// Replace this with Appwrite SDK calls later.
// ─────────────────────────────────────────

export type MenuCategory = 'coffee' | 'dessert';

export interface MenuProduct {
  id: string;
  name: string;
  description: string;
  price: number;          // stored as number, rendered as ₹ price
  image: string;          // relative public path or Appwrite URL
  category: MenuCategory;
  available: boolean;
  featured: boolean;
  stampReward: number;    // stamps earned per order
}

// ─────────────────────────────────────────
// DUMMY DATA — swap for Appwrite fetch later
// ─────────────────────────────────────────

export const MENU_PRODUCTS: MenuProduct[] = [
  // ── Coffee ──────────────────────────────
  {
    id: 'coffee-001',
    name: 'Noir Latte',
    description: 'Double-shot espresso, velvety micro-foam, single-origin Ethiopian Yirgacheffe. Dark, precise, intentional.',
    price: 380,
    image: '/images/menu-noir-latte.png',
    category: 'coffee',
    available: true,
    featured: true,
    stampReward: 1,
  },
  {
    id: 'coffee-002',
    name: 'Cappuccino',
    description: 'Classic equal-thirds construction — espresso, steamed milk, dry foam. No embellishments. Just craft.',
    price: 320,
    image: '/images/menu-cappuccino.png',
    category: 'coffee',
    available: true,
    featured: false,
    stampReward: 1,
  },
  {
    id: 'coffee-003',
    name: 'Signature Cold Brew',
    description: 'Steeped for 18 hours. Served over hand-carved ice. Clean, bold, and entirely deliberate.',
    price: 340,
    image: '/images/menu-cold-brew.png',
    category: 'coffee',
    available: true,
    featured: true,
    stampReward: 1,
  },
  {
    id: 'coffee-004',
    name: 'Mocha Reserve',
    description: 'Rich Valrhona dark chocolate, double-shot espresso, silken steamed milk. A controlled indulgence.',
    price: 420,
    image: '/images/menu-mocha-reserve.png',
    category: 'coffee',
    available: true,
    featured: false,
    stampReward: 1,
  },

  // ── Desserts ─────────────────────────────
  {
    id: 'dessert-001',
    name: 'Belgian Brownie',
    description: 'Dense, fudge-centred, 72% Callebaut chocolate with a glossy ganache crust. Restrained excess.',
    price: 280,
    image: '/images/menu-belgian-brownie.png',
    category: 'dessert',
    available: true,
    featured: false,
    stampReward: 1,
  },
  {
    id: 'dessert-002',
    name: 'Blueberry Cheesecake',
    description: 'New York-style cream cheese base, wild blueberry compote, Graham cracker crust. Silken perfection.',
    price: 360,
    image: '/images/menu-cheesecake.png',
    category: 'dessert',
    available: true,
    featured: true,
    stampReward: 1,
  },
  {
    id: 'dessert-003',
    name: 'Chocolate Truffle Tart',
    description: 'Dark valrhona ganache, hazelnut praline shell, edible gold leaf. Our most deliberate creation.',
    price: 420,
    image: '/images/menu-truffle-tart.png',
    category: 'dessert',
    available: true,
    featured: true,
    stampReward: 1,
  },
  {
    id: 'dessert-004',
    name: 'Classic Tiramisu',
    description: 'House-pulled espresso-soaked ladyfingers, mascarpone cream, unsweetened cocoa. The original.',
    price: 320,
    image: '/images/menu-tiramisu.png',
    category: 'dessert',
    available: true,
    featured: false,
    stampReward: 1,
  },
];
