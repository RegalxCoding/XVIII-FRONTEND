// ─────────────────────────────────────────
// Dessert Scheduling Config
// Single source of truth — change here, not in components.
// Future: these values can be moved to a Firestore settings document
// without rewriting utility logic (functions accept them as parameters).
// ─────────────────────────────────────────

export const BUSINESS_HOURS = {
  open: 8,   // 8 AM opening — update here when hours change
  close: 22, // 10 PM closing
} as const;

/** Hour interval between each available delivery slot */
export const DELIVERY_SLOT_INTERVAL_HOURS = 1;

/** Minimum hours in advance required for same-day dessert orders */
export const DESSERT_MIN_ADVANCE_HOURS = 6;

/** IANA timezone for all scheduling calculations — never use browser default */
export const BUSINESS_TIMEZONE = 'Asia/Kolkata';

// ─────────────────────────────────────────
// Delivery Verification Config
// OTP security parameters — change here, not in API routes.
// ─────────────────────────────────────────

/** Number of digits in the delivery OTP */
export const OTP_LENGTH = 6;

/** Minutes before an OTP expires */
export const OTP_EXPIRY_MINUTES = 5;

/** Maximum wrong OTP attempts before lockout */
export const OTP_MAX_ATTEMPTS = 3;

/** Seconds between OTP resend requests */
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

/** Maximum distance (meters) driver must be from customer to send OTP */
export const DELIVERY_PROXIMITY_METERS = 9999999; // Bypassed for testing from Nagar

// ─────────────────────────────────────────
// Brand Constants
// ─────────────────────────────────────────

export const BRAND = {
  name: 'The XVIII Brew Co.',
  shortName: 'XVIII',
  tagline: 'Something Has Been Steeping.',
  heroHeadline: 'Crafted Coffee. Extraordinary Desserts.',
  philosophyStatement: 'We built The XVIII Brew Co. because we believe every cup should mean something.',
  email: 'hello@xviiibrewco.com',
  phone: '+91 00000 00000',
  address: 'XVIII Brew Co., Kanpur, India',
  instagram: 'https://instagram.com/xviiibrewco',
  whatsapp: 'https://wa.me/910000000000',
} as const;

// ─────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/about' },
  { label: 'Rewards', href: '/rewards' },
  { label: 'Contact', href: '/contact' },
] as const;

// ─────────────────────────────────────────
// Rewards
// ─────────────────────────────────────────

export const STAMPS_PER_CARD = 10;
export const STAMPS_FOR_FREE_DESSERT = 8;
export const STAMPS_FOR_DISCOUNT = 5;

// ─────────────────────────────────────────
// Process Steps
// ─────────────────────────────────────────

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Bean Selection.',
    description:
      'We source single-origin beans from the world\'s finest growing regions. Each lot is cupped, scored, and selected with obsessive precision.',
    image: '/images/process-beans.png',
    alt: 'Premium coffee bean selection',
  },
  {
    step: '02',
    title: 'The Roast.',
    description:
      'Our roasters work in small batches, dialing each profile to preserve the bean\'s natural complexity. No shortcuts. No compromises.',
    image: '/images/process-roasting.png',
    alt: 'Artisan coffee roasting',
  },
  {
    step: '03',
    title: 'The Brew.',
    description:
      'Every extraction is calibrated to the gram, the second, the degree. Consistency that borders on ritual. Excellence that becomes habit.',
    image: '/images/process-brewing.png',
    alt: 'Precision pour-over brewing',
  },
  {
    step: '04',
    title: 'The Aftertaste.',
    description:
      'They won\'t talk about it, because it is either bitter, flat, or forgettable. Ours lingers. Complex, clean, and entirely intentional — the final note that makes the cup worth remembering.',
    image: '/images/process-aftertaste.png',
    alt: 'The lingering aftertaste of a perfectly crafted cup',
  },
  {
    step: '05',
    title: 'Dessert Craft.',
    description:
      'Our pastry kitchen runs parallel to our bar. Same philosophy — every element considered, every texture intentional, every bite a statement.',
    image: '/images/process-dessert.png',
    alt: 'Artisan dessert crafting',
  },
] as const;

// ─────────────────────────────────────────
// Best Sellers
// ─────────────────────────────────────────

export const BEST_SELLERS = [
  {
    id: '1',
    name: 'The Noir Latte',
    category: 'Coffee',
    description: 'Double shot espresso, micro-foam, single-origin Ethiopian Yirgacheffe.',
    price: '₹380',
    image: '/images/bestseller-latte.png',
  },
  {
    id: '2',
    name: 'Dark Roast Cold Brew',
    category: 'Coffee',
    description: 'Steeped 18 hours. Served over hand-carved ice. Clean, bold, deliberate.',
    price: '₹320',
    image: '/images/bestseller-coldbrew.png',
  },
  {
    id: '3',
    name: 'XVIII Chocolate Tart',
    category: 'Dessert',
    description: 'Dark valrhona ganache, hazelnut praline base, edible gold leaf.',
    price: '₹420',
    image: '/images/bestseller-cake.png',
  },
] as const;

// ─────────────────────────────────────────
// Menu Categories
// ─────────────────────────────────────────

export const MENU_CATEGORIES = [
  {
    id: 'coffee',
    label: 'Coffee',
    description: 'Espresso, pour-over, cold brew — each cup a deliberate act.',
    image: '/images/menu-coffee.png',
    href: '/menu?category=coffee',
  },
  {
    id: 'desserts',
    label: 'Desserts',
    description: 'Artisan pastries crafted daily. No compromises.',
    image: '/images/menu-desserts.png',
    href: '/menu?category=desserts',
  },
  {
    id: 'specials',
    label: 'Signature Specials',
    description: 'Our chef\'s table — seasonal, exclusive, extraordinary.',
    image: '/images/menu-specials.png',
    href: '/menu?category=specials',
  },
] as const;
