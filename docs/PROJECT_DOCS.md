# The XVIII Brew Co. — Project Documentation

> **Last Updated:** 16 June 2026  
> **Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Firebase Auth  
> **Author:** XVIII Brew Co. Development Team

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Frontend — Full File Reference](#3-frontend--full-file-reference)
   - [App Directory (Pages & Layout)](#31-app-directory)
   - [Components](#32-components)
   - [Admin Panel Components](#33-admin-panel-components)
   - [Data Layer](#34-data-layer)
   - [Services](#35-services)
   - [Hooks](#36-hooks)
   - [Store](#37-store)
   - [Types](#38-types)
   - [Constants](#39-constants)
   - [Utils](#310-utils)
   - [Providers](#311-providers)
   - [Lib](#312-lib)
   - [Public Assets](#313-public-assets)
   - [Config Files](#314-config-files)
4. [Design System](#4-design-system)
5. [Firebase Auth Integration Guide](#5-firebase-auth-integration-guide)
6. [Environment Variables](#6-environment-variables)
7. [Pages Reference](#7-pages-reference)
8. [Component Props Reference](#8-component-props-reference)
9. [Scripts](#9-scripts)
10. [Changelog](#10-changelog)

---

## 1. Project Overview

**The XVIII Brew Co.** is a premium luxury coffee and artisan dessert brand. This repository contains the full frontend web application — a Next.js 15+ app with a fully editorial, mobile-first design system, Firebase Phone Authentication, and a structured layered architecture.

**Brand personality:** Premium · Sophisticated · Editorial · Artisan · Community  
**Brand tagline:** _Something Has Been Steeping._

---

## 2. Repository Structure

```
XVIII-PROJECT/
├── frontend/               ← Next.js web application (primary focus)
├── backend/                ← Backend services (reserved for future use)
└── docs/
    └── PROJECT_DOCS.md     ← This file
```

---

## 3. Frontend — Full File Reference

### 3.1 App Directory

The `src/app/` directory uses the Next.js 15 App Router. Every `page.tsx` is a server component by default.

#### Customer-Facing Pages

| File                    | Route          | Purpose                                                                                                                                                             |
| ----------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout.tsx`            | —              | Root layout. Sets global `<html>` metadata, loads Cinzel from Google Fonts, wraps `<body>` in `AppProviders` (mounts CartToast globally)                            |
| `globals.css`           | —              | Global CSS. Brand design tokens, Tailwind v4 setup, `.container-brand` utility, scrollbar styling, marquee animation, and selection colours                          |
| `page.tsx`              | `/`            | Landing page. Assembles all 8 section components: Navbar → Hero → Philosophy → BestSellers → Process → Rewards → MenuPreview → FinalCTA → Footer                    |
| `menu/page.tsx`         | `/menu`        | Full menu catalogue page. Composes `MenuHero` + `MenuGrid`. Ready for Appwrite integration.                                                                         |
| `cart/page.tsx`         | `/cart`        | Cart page. Two-column desktop layout: item list + sticky `OrderSummary`. Reads from Zustand cart store. Empty-state with Browse Menu CTA. **Scheduling:** Shows dessert delivery slot banner with Edit Slot button; mixed-order coffee delivery mode picker; expired-slot expiry banner. |
| `about/page.tsx`        | `/about`       | Brand story page (scaffold)                                                                                                                                         |
| `contact/page.tsx`      | `/contact`     | Contact page (scaffold)                                                                                                                                             |
| `rewards/page.tsx`      | `/rewards`     | Loyalty programme page (scaffold)                                                                                                                                   |
| `login/page.tsx`        | `/login`       | Customer login page (scaffold). Cart checkout redirects here when user is not logged in.                                                                            |
| `api/email/receipt/route.ts`| `/api/email/receipt`| **Server-Side API.** Secure endpoint utilizing the `resend` SDK to dispatch HTML email receipts securely without exposing API keys to the browser.                          |
| `product/[id]/page.tsx` | `/product/:id` | Dynamic product detail page. Reads `params.id` from the URL.                                                                                                        |
| `orders/[id]/page.tsx`  | `/orders/:id`  | **Order tracking page.** Premium real-time order journey view. Server component that extracts `params.id` and renders `OrderTracker`. Navbar + Footer + ambient background glow orbs. Metadata: "Track Order \| The XVIII Brew Co." |

#### Backend API Routes (Delivery & OTP)

All driver app operations are secured via Next.js backend API routes to prevent drivers from writing to Firestore directly.

| File                    | Route                            | Purpose                                                                                                                                                             |
| ----------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api/delivery/initialize/route.ts`| `/api/delivery/initialize` | Called when an order is created. Pre-generates the OTP and saves its SHA-256 hash to Firestore. The plain OTP is never saved.                                      |
| `api/delivery/send-otp/route.ts`  | `/api/delivery/send-otp`   | Called by driver app. Verifies GPS proximity (≤ 150m) to customer. Generates a new OTP, updates the hash, and triggers the SMS to the customer's phone.             |
| `api/delivery/verify-otp/route.ts`| `/api/delivery/verify-otp` | Validates the 6-digit OTP entered by the driver. Compares the hash. On success, marks order as 'delivered' in Firestore. Tracks failed attempts (max 3).            |
| `api/delivery/resend-otp/route.ts`| `/api/delivery/resend-otp` | Enforces a 60-second cooldown, generates a new OTP, sends the SMS, and resets the attempt counter.                                                                  |
| `api/delivery/collect-cash/route.ts`| `/api/delivery/collect-cash` | For COD orders, updates the `paymentStatus` to `cash_collected`.                                                                                                    |
| `api/delivery/status/route.ts`    | `/api/delivery/status`     | Returns sanitized delivery state (e.g. attempts left, cooldowns) to the driver app without exposing the OTP hash.                                                   |

#### Admin Pages

| File                          | Route            | Purpose                                                                                                              |
| ----------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| `admin-login/page.tsx`        | `/admin-login`   | Admin login page. Username + password form. Simulates auth (900 ms delay) then redirects to `/admin`. No real auth yet — replace with Appwrite when ready. |
| `admin/layout.tsx`            | `/admin/*`       | Shared layout for all admin pages. Renders `AdminSidebar` on the left and `{children}` in the main content area.    |
| `admin/page.tsx`              | `/admin`         | Admin dashboard homepage. Shows stat cards, quick action links, and a 5-row recent orders preview.                  |
| `admin/products/page.tsx`     | `/admin/products`| Products management page. Wraps the `ProductsTable` component with mock product data.                               |
| `admin/orders/page.tsx`       | `/admin/orders`  | Orders management page. Wraps the `OrdersTable` component with mock order data.                                     |

---

### 3.2 Components

#### Layout Components (`src/components/layout/`)

| File         | Purpose                   | Key Features                                                                                                                                                                                                                                              |
| ------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Navbar.tsx` | Sticky top navigation bar | Transparent on load → dark with backdrop-blur on scroll (desktop only for performance). Responsive logo SVG (40px mobile / 56px desktop). Cart icon with animated gold count badge. Mobile: full-screen slide-in overlay with single integrated toggle button. Body scroll locked when open. |
| `Footer.tsx` | Site-wide footer          | 4-column grid: Brand · Navigate · Contact · CTA. Social links (Instagram, WhatsApp). Copyright bar. Responsive — stacks from 1 → 2 → 4 columns.                                                                                                          |

#### Menu Components (`src/components/menu/`)

| File                  | Purpose                          | Key Features                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MenuHero.tsx`        | Hero section for `/menu` page    | Animated editorial hero. Ghost `XVIII` parallax typography. Stats row (items, categories). Uses same framer-motion `fadeUp` pattern as landing hero. Eyebrow label + large H1 headline.                                            |
| `ProductCard.tsx`     | Reusable individual product card | Fixed `1:1 (square)` aspect-ratio image container with `object-fit: cover` — images never stretch or overflow regardless of source dimensions. Category badge, featured dot, name + price row, description, minimal `+ Add` button. Accepts `onAdd` callback prop. |
| `MenuGrid.tsx`        | Filterable product grid          | Client component. Owns `activeFilter` state. Tabs: All / Coffee / Desserts with live item counts. `AnimatePresence` fade transition between filter states. **Coffee:** calls `addToCart()` + `fireCartToast()` directly. **Dessert:** intercepts click → opens `DessertSlotModal` → slot saved → then adds to cart. Coffee flow completely unchanged. |
| `DessertSlotModal.tsx`| Dessert delivery slot picker modal | Full-screen dark glassmorphism modal. **Date row:** Today / Tomorrow buttons (Today auto-disabled if no 6h-advance slots remain). **Time grid:** All business-hour slots; same-day slots that violate the 6h rule are greyed-out and un-clickable. **Confirmation summary** appears when both date and time are selected. Works in two modes: add-product mode (product passed) and edit-slot mode (product = null, just updates the existing slot). Calls `buildDessertSlot()` from `timeSlots.ts` to produce a `DessertSlot` object before calling `onConfirm`. |

#### Cart Components (`src/components/cart/`)

| File              | Purpose                          | Key Features                                                                                                                                                                                                                          |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CartItemRow.tsx` | Single cart item row             | Fixed `1:1 (square)` image thumbnail (`object-fit: cover`). Product name, category label, description (line-clamped). Quantity stepper (`−` / count / `+`) wired to `updateQuantity`. `×` remove button wired to `removeFromCart`. Live line total. AnimatePresence exit animation. |
| `OrderSummary.tsx`| Sticky order summary sidebar     | Sticky on desktop (`lg:sticky lg:top-32`). Shows Subtotal (with item count), Delivery Fee (₹40 flat), Total. **Checkout gate:** Button is disabled if requirements aren't met. **Interception:** On click, checks authentication and fetches the Firebase user profile. If `email` is missing, dynamically triggers `EmailCaptureModal` before routing to `/checkout`. |
| `EmailCaptureModal.tsx`| Pre-checkout email capture | *(Located in `checkout/`)* Full-screen dark glassmorphism modal with Framer Motion animations. Collects email from phone-only users so they can receive digital receipts. Saves to Firestore via `userService`. |

#### Order Tracking Components (`src/components/orders/`)

| File                        | Purpose                        | Key Features                                                                                                                                                                                                                                              |
| --------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OrderTracker.tsx`          | Order tracking orchestrator    | **Client component.** Manages real-time Firestore `onSnapshot` listener for a single order (by custom brand ID). Handles four states: loading (skeleton), not-found (search icon + CTA), cancelled (❌ notice + order details for reference), and active tracking (timeline + details card). Two-column desktop layout (`lg:grid-cols-5`): timeline 3 cols, details 2 cols. Single column stacked on mobile. |
| `OrderProgressTimeline.tsx` | Vertical premium timeline      | 5-step journey: Order Received → Order Confirmed → Crafting Your Order → Ready / Out For Delivery → Delivered. **Completed:** gold icon with check + glow shadow. **Active:** Framer Motion pulsing node + animated ring + "Current" badge with blinking dot. **Upcoming:** dimmed at 25% opacity with dashed connector. Staggered entry animation via `variants` + `staggerChildren`. |
| `OrderStatusCard.tsx`       | Order details card             | Dark glassmorphism card (`#1e1812`). Sections: order header (ID + date), items list (quantity badges), price breakdown (subtotal/delivery/total with gold accent), delivery address, payment method. **Scheduling:** shows "📅 Scheduled Delivery" with `formatScheduledTime()` when `isScheduled`, else "Estimated Delivery: 25–35 mins". Mixed-order coffee fulfillment pill (☕ Immediate / 🍰 Bundled). |

#### UI Components (`src/components/ui/`)

| File            | Purpose                       | Key Features                                                                                                                                                                                                   |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CartToast.tsx` | "Added to Cart" popup notification | Lightweight event-bus pattern (`fireCartToast(productName)` callable from anywhere). Framer Motion `AnimatePresence` stack. Auto-dismisses after 2.8 s. Brand aesthetic: `#1e1812` bg, gold border, check icon. Fixed bottom-right. |

#### Section Components (`src/components/sections/`)

| File                     | Section ID      | Background      | Purpose & Design Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------ | --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HeroSection.tsx`        | `#hero`         | `#15110D` dark  | **Landing hero.** Cinematic 3-layer depth effect layout. Back layer (z-10): animated typography (H1 headline). Middle layer (z-20): parallax transparent cutout coffee image that physically overlaps the headline. Front layer (z-30): bottom description, CTAs, stats bar (18+, 100%, ∞). Mobile responsive: Image scales down and repositions below text. Features parallax scroll translation and scaling. Bottom marquee ticker with infinite scroll. |
| `PhilosophySection.tsx`  | `#philosophy`   | `#15110D` dark  | **Brand philosophy.** Word-by-word animated headline using `useInView` — each word in "We built The XVIII Brew Co. because we believe every cup should mean something." animates independently with staggered delay. Gold colour on brand name words. Three editorial pillars below (Craftsmanship · Integrity · Community) in a divided grid.                                                                                                                                                                                                       |
| `BestSellersSection.tsx` | `#best-sellers` | `#EDE3D0` cream | **Best sellers.** Cream background section. 3-column rectangular editorial product cards. Each card: full `aspect-square` image with category tag, product name, price, description, and "View Details" link. Hover: image scale + name colour shift. Data sourced from `BEST_SELLERS` constant.                                                                                                                                                                                                                                                      |
| `ProcessSection.tsx`     | `#process`      | `#15110D` dark  | **Our process.** **5 steps** in alternating magazine layout. Each step: large muted step number, large headline, horizontal rule divider, description. Steps: `01` Bean Selection → `02` The Roast → `03` The Brew → `04` **The Aftertaste** → `05` Dessert Craft.                                                                                                                                                                                                                                                                                   |
| `RewardsSection.tsx`     | `#rewards`      | `#15110D` dark  | **Loyalty rewards.** Animated digital stamp card (10 stamps, `STAMPS_PER_CARD` from constants). Collected stamps render filled `<Coffee>` icon; empty stamps render a hollow box. Animated progress bar. Three reward tier cards below (Free Coffee at 5, Free Dessert at 8, 20% Off at 10). Join CTA button.                                                                                                                                                                                                                                        |
| `MenuPreviewSection.tsx` | `#menu-preview` | `#EDE3D0` cream | **Menu preview.** 3 large `aspect-[3/4]` image cards with full overlay — each links to the menu filtered by category (coffee, desserts, specials). Text overlaid at bottom of image with gradient background. Hover: image scale + arrow icon appear. Data from `MENU_CATEGORIES` constant.                                                                                                                                                                                                                                                          |
| `FinalCTASection.tsx`    | `#final-cta`    | `#15110D` dark  | **Closing CTA.** Two-column layout: left has massive `clamp`-sized headline "Your Next Cup Awaits.", right has body copy + "Order Now" and "Find Us" buttons + brand tagline. Full editorial spacing.                                                                                                                                                                                                                                                                                                                                                |

---

### 3.3 Admin Panel Components

All admin components live under `src/components/admin/`. They use the brand's dark design system (`#15110D`, `#1a140e`, gold `#B8956A`, cream `#EDE3D0`) and are fully responsive (desktop sidebar + mobile drawer).

#### Layout (`src/components/admin/layout/`)

| File              | Purpose                  | Key Features                                                                                                                                                                                                              |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AdminSidebar.tsx`| Left sidebar navigation  | **Desktop:** Fixed 260 px sidebar with brand logo, notification pill, nav links (Dashboard / Products / Orders), and a Logout button that navigates to `/admin-login`. **Mobile:** Sticky top bar + slide-in drawer overlay with the same links. Closes automatically on route change. Body scroll is locked while the mobile drawer is open. |
| `AdminHeader.tsx` | Sticky page-level header | Shows the current page title and subtitle. Right side shows a notification bell (with a gold dot badge reserved for future use) and an admin avatar chip (`A` initial, "Admin", "XVIII Brew Co."). Displays today's date when no subtitle is passed. |

#### Dashboard (`src/components/admin/dashboard/`)

| File                   | Purpose               | Key Features                                                                                                                                                           |
| ---------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DashboardOverview.tsx`| 4-stat card grid      | Calculates and displays: **Total Products** (with available count), **Total Orders** (with today's count), **Pending Orders** (with urgency note), **Delivered** (with fulfillment %). Passes data to `StatCard`. |
| `StatCard.tsx`         | Individual stat card   | Displays a large number value, label, icon, and optional trend/description text. Hover effect: card lifts up 2 px and border glows in the card's accent colour. A radial gradient glow appears in the top-right corner. |

#### Orders (`src/components/admin/orders/`)

| File                   | Purpose                    | Key Features                                                                                                                                                                                                              |
| ---------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OrdersTable.tsx`      | Filterable orders table    | **Status filter row:** All / Pending / Confirmed / Preparing / Ready / Delivered / Cancelled. **Scheduling filter row:** All Schedules / 📅 Today's Desserts / 📅 Tomorrow's Desserts / ☕ Immediate Coffee / 🍰 Coffee+Dessert. **Search:** by order ID, customer name, or phone. When a scheduling filter is active, results are sorted by `scheduledTimestamp` ascending (earliest slot first). Desktop Date column shows a secondary `📅 Tomorrow · 4:00 PM` line for scheduled orders. Mobile card shows an inline `📅` badge. Clicking any row opens `OrderDetailDrawer`. |
| `OrderDetailDrawer.tsx`| Slide-in order detail panel | Shows full order info: customer name, phone, address, all items with quantities and prices, subtotal, delivery charge, total, Change Status dropdown. **New — Delivery Schedule section** (rendered only when `order.isScheduled` is true): shows Dessert Delivery date + time (formatted from `scheduledTimestamp` via `formatScheduledTime()`); 🟡 Scheduled badge; Coffee Fulfillment row with 🟢 Immediate or 🍰 Bundled pill. |
| `StatusBadge.tsx`      | Coloured status pill       | Renders a pill badge for any `AdminOrderStatus` value. Each status has a fixed colour: Pending=orange, Confirmed=blue, Preparing=purple, Ready=teal, Delivered=green, Cancelled=red. Accepts a `size` prop (`sm` or `md`). |

#### Products (`src/components/admin/products/`)

| File                   | Purpose                      | Key Features                                                                                                                                                                                                                          |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProductsTable.tsx`    | Full CRUD products table     | **Filter tabs:** All / Coffee / Desserts. **Search** by product name. **Add Product** button opens the add modal. Each row shows: thumbnail image, name + featured badge + description, category pill, price, availability toggle, edit + delete action buttons. |
| `ProductFormModal.tsx` | Add / Edit product modal     | A full-screen modal (dark glassmorphism card). Fields: Name, Description, Price (₹), Category (Coffee / Dessert), Image URL, Is Available, Is Featured. Works in both **add mode** (empty form) and **edit mode** (pre-filled with existing product data). Validates that name and price are filled before saving. |
| `AvailabilityToggle.tsx`| On/Off toggle switch        | A styled toggle switch with a `checked` boolean and `onChange` callback. When on, the track is gold (`#B8956A`). When off, it's a dim dark colour. Shows "Available" / "Out of Stock" label next to the switch.                         |
| `DeleteConfirmModal.tsx`| Delete confirmation dialog  | A small modal that asks "Are you sure you want to delete [product name]?". Has a Cancel button and a red Confirm Delete button. Prevents accidental deletions.                                                                         |

> **Note:** Admin orders and auth state changes are **local React state only** and reset on page refresh. Admin products CRUD is fully integrated with **Firebase Firestore & Storage** database.

---

### 3.4 Data Layer

Located in `src/data/`. Pure TypeScript data — **no Appwrite SDK calls here**. Swap these exports for Appwrite fetch functions when going live.

| File               | Purpose                                  | Exports                                                                                            |
| ------------------ | ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `menuData.ts`      | Dummy menu product data + type defs      | `MenuCategory`, `MenuProduct` interface, `MENU_PRODUCTS` array (8 products: 4 coffee + 4 dessert)  |
| `adminMockData.ts` | Dummy admin data for products and orders | `MOCK_ADMIN_PRODUCTS` (8 products), `MOCK_ADMIN_ORDERS` (10 orders). Typed with `AdminProduct` and `AdminOrder` from `admin.types.ts`. |

| `adminMockData.ts` | Dummy admin data for orders              | `MOCK_ADMIN_ORDERS` (10 orders). Typed with `AdminOrder` from `admin.types.ts`. |

---

### 3.5 Services

Located in `src/services/`.

| File                        | Purpose                                          | Key Methods                                                                                                                 |
| --------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `auth.service.ts`           | Firebase Phone Authentication operations         | `sendOtp(phoneNumber, recaptchaVerifier)`, `confirmOtp(confirmationResult, code)`, `getCurrentUser()`, `logout()`, `isAuthenticated()`, `onAuthStateChange()` |
| `user.service.ts`           | Firebase Firestore user profile management       | `getUserProfile(userId)`, `updateUserEmail(userId, email)`                                                                  |
| `admin-products.service.ts` | Admin catalogue management (Firestore + Storage) | `getAll()`, `create(data, imageFile?)`, `update(id, data, imageFile?)`, `remove(id)`, `toggleAvailability(id, val)`, `uploadImage(file)` |
| `products.service.ts`       | Menu product data from Firebase Firestore        | `getProducts(filters)`, `getProduct(id)`, `getBestSellers(limit)`, `getByCategory(category)`                                |
| `rewards.service.ts`        | Loyalty stamp data from mock data fallback       | `getUserStamps(userId)`, `getAvailableRewards()`                                                                            |
| `orders.service.ts`         | Customer and Admin orders management (Firestore) | `create(orderData)`, `getById(id)`, `getByUserId(userId)`, `getAll()`, `updateStatus(id, status)`, `subscribeAll(callback)`, `subscribeByUserId(userId, callback)` |

---

### 3.6 Hooks

Located in `src/hooks/`.

| File                    | Purpose                                                                           | Returns                                         |
| ----------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| `useAuth.ts`            | React hook for current auth state. Calls `authService.getCurrentUser()` on mount. | `{ user, isLoading, isAuthenticated, refetch }` |
| `useSlotValidation.ts`  | Runs **once on mount** on Cart and Checkout pages. Checks whether the persisted `dessertSlot` is still valid (≥ 6h in future). If expired: clears the slot and `coffeeDeliveryMode` from the cart store. | `{ wasExpired: boolean }` — used by the page to conditionally render an expiry banner. |

---

### 3.7 Store

Located in `src/store/`. Uses **Zustand** for global state.

| File             | Purpose                                                                                            | State Shape                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `auth.store.ts`  | Global authentication state. Used across the app to read/write user session.                       | `{ user, isLoading, isAuthenticated, setUser(), initialize(), logout() }`                                                           |
| `cart.store.ts`  | Cart state — persisted to `localStorage` via Zustand `persist` middleware (key: `xviii-cart`).     | `{ items, dessertSlot, coffeeDeliveryMode, addToCart(), removeFromCart(), updateQuantity(), clearCart(), setDessertSlot(), setCoffeeDeliveryMode(), getTotalItems(), getSubtotal(), hasDesserts(), hasCoffee(), isMixedOrder(), isSlotValid() }` |
| `order.store.ts` | Order history state — persisted to `localStorage` (key: `xviii-orders`). Supports pre-generated ID sync. | `{ orders: Order[], placeOrder(orderData, pregeneratedId?), updateOrderStatus(), getOrderById() }`                 |

**`CartItem` shape:**
```typescript
{ product: MenuProduct, quantity: number }
```

**`DessertSlot` shape** (from `src/utils/timeSlots.ts`):
```typescript
{
  scheduledTimestamp: number;  // Unix ms — CANONICAL value; derive display from this
  isoDate: string;             // "YYYY-MM-DD" in IST — display only
  time: string;                // "4:00 PM" — display only
}
```

**Scheduling state in `cart.store.ts`:**
- `dessertSlot: DessertSlot | null` — one slot for the entire order's dessert portion (not per-item)
- `coffeeDeliveryMode: 'immediate' | 'withDessert' | null` — only meaningful in mixed orders
- `clearCart()` resets both alongside `items`
- `removeFromCart()` auto-clears `dessertSlot` when last dessert is removed; auto-clears `coffeeDeliveryMode` when last coffee is removed

**`DELIVERY_FEE`** constant exported from `cart.store.ts` — flat ₹40. Update here when pricing changes.

> **Appwrite handoff:** `addToCart` currently stores a `MenuProduct` snapshot. When connecting Appwrite, the `product` field in `CartItem` can store the Appwrite document directly since it shares the same schema (`name`, `description`, `price`, `image`, `category`, `available`, `featured`, `stampReward`).

---

### 3.8 Types

Located in `src/types/`. Pure TypeScript interfaces — no runtime code.

| File               | Exports                                                                                                          | Purpose                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `user.types.ts`    | `User`, `LoginCredentials`, `RegisterCredentials`                                                                | Customer profile shape and auth form types                           |
| `product.types.ts` | `Product`, `ProductCategory`, `ProductFilters`                                                                   | Menu product data shape and filter options                           |
| `order.types.ts`   | `Order`, `OrderItem`, `OrderStatus`, `RewardStamp`, `Reward`                                                     | Customer order lifecycle and rewards programme types                 |
| `admin.types.ts`   | `AdminProduct`, `AdminProductCategory`, `AdminOrder`, `AdminOrderItem`, `AdminOrderStatus`, `PaymentMethod`, `AdminCredentials` | All types used exclusively in the admin panel. Separate from the customer-facing types. |
| `delivery.types.ts`| `DeliveryVerification`, `DeliveryVerificationStatus`, `VerificationLogEntry` | Types for the OTP verification flow. Includes the Firestore doc shape (storing only hashes, never plain OTPs) and the sanitized status returned to the driver app. |
| `order-tracking.types.ts` | `TrackingStep`, `TrackingState`, `TRACKING_STEPS`, `getStepState()` | Customer-facing order journey types. Maps `AdminOrderStatus` to friendly labels/descriptions/icons. `getStepState()` determines if a step is completed, active, or upcoming. |

**Key `admin.types.ts` shapes:**

```typescript
// A product as seen by the admin
interface AdminProduct {
  id, name, description, price,
  category: 'coffee' | 'dessert',
  imageUrl, isAvailable, isFeatured, createdAt
}

// An order as seen by the admin
interface AdminOrder {
  id, customerName, customerPhone, customerAddress,
  items: AdminOrderItem[],   // productId, productName, quantity, price
  subtotal, deliveryCharge, totalAmount,
  paymentMethod: 'cash_on_delivery' | 'online' | 'card',
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled',
  notes?, createdAt, userId?, location?,

  // ── Auto-derived at order creation time (never set manually) ──
  containsCoffee?: boolean;   // items.some(i => i.category === 'coffee')
  containsDessert?: boolean;  // items.some(i => i.category === 'dessert')

  // ── Scheduling (only populated when containsDessert is true) ──
  isScheduled?: boolean;
  scheduledTimestamp?: number;  // Unix ms — CANONICAL. Derive date/time display from this.
  deliveryDate?: string;        // "YYYY-MM-DD" IST — derived from scheduledTimestamp
  deliveryTime?: string;        // "4:00 PM" — derived from scheduledTimestamp

  // ── Mixed-order fulfillment (only when containsCoffee && containsDessert) ──
  coffeeDeliveryMode?: 'immediate' | 'withDessert';
}
```

> **Consistency guarantee:** `deliveryDate` and `deliveryTime` are always derived from `scheduledTimestamp` via `buildDessertSlot()`. They are stored for display convenience; `scheduledTimestamp` is always the authoritative value.

---

### 3.9 Constants

Located in `src/constants/index.ts`. Single source of truth for all static brand content. **Change content here, not in components.**

| Export                      | Type   | Contains                                                                                                                 |
| --------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| `BRAND`                     | object | Brand name, tagline, headline, email, phone, address (`XVIII Brew Co., Kanpur, India`), Instagram URL, WhatsApp URL      |
| `NAV_LINKS`                 | array  | All navigation link labels and `href` values                                                                             |
| `STAMPS_PER_CARD`           | number | Total stamps per loyalty card (10)                                                                                       |
| `STAMPS_FOR_FREE_DESSERT`   | number | Stamps needed for free dessert reward (8)                                                                                |
| `STAMPS_FOR_DISCOUNT`       | number | Stamps needed for discount reward (5)                                                                                    |
| `PROCESS_STEPS`             | array  | All **5** process steps: `01` Bean Selection · `02` The Roast · `03` The Brew · `04` The Aftertaste · `05` Dessert Craft |
| `BEST_SELLERS`              | array  | 3 best seller products with id, name, category, description, price, image path                                           |
| `MENU_CATEGORIES`           | array  | 3 menu categories with id, label, description, image path, and href                                                      |
| `BUSINESS_HOURS`            | object | `{ open: 8, close: 22 }` — dessert delivery window. **Update here when hours change.**                                  |
| `DELIVERY_SLOT_INTERVAL_HOURS` | number | Hours between each slot option (default: `1`). Change to `0.5` for 30-min slots.                                   |
| `DESSERT_MIN_ADVANCE_HOURS` | number | Minimum advance notice required for same-day dessert orders (default: `6`)                                               |
| `BUSINESS_TIMEZONE`         | string | IANA timezone for all scheduling math (`'Asia/Kolkata'`). Never relies on browser defaults.                              |

---

### 3.10 Utils

#### `src/utils/helpers.ts` — General utilities

| Function        | Signature                                          | Purpose                                                           |
| --------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| `cn()`          | `(...classes) → string`                            | Merges class names conditionally (lightweight `clsx` alternative) |
| `formatPrice()` | `(amount: number) → string`                        | Formats number as Indian Rupee (₹) using `Intl.NumberFormat`      |
| `truncate()`    | `(text, maxLength) → string`                       | Truncates text with `...` at `maxLength` characters               |
| `getFileUrl()`  | `(fileId, bucketId, endpoint, projectId) → string` | Builds Appwrite Storage file preview URL                          |
| `wait()`        | `(ms: number) → Promise`                           | Async delay for animation sequencing                              |

#### `src/utils/timeSlots.ts` — Dessert scheduling utilities (IST-aware)

All scheduling math lives here. **Never hardcodes** hours or timezone — reads from `constants/index.ts`. Functions accept config as parameters so future migration to Firestore settings only requires changing the import site.

| Export                   | Signature / Returns                      | Purpose                                                                                                        |
| ------------------------ | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `DessertSlot` (type)     | `{ scheduledTimestamp, isoDate, time }`  | The canonical slot shape used in the cart store and Firestore orders                                           |
| `nowInIST()`             | `→ Date`                                 | Returns the current moment (no timezone conversion needed — used as a base for IST component extraction)       |
| `getTodayISO()`          | `→ string`                               | Today's date as `"YYYY-MM-DD"` in IST                                                                         |
| `getTomorrowISO()`       | `→ string`                               | Tomorrow's date as `"YYYY-MM-DD"` in IST                                                                      |
| `getAllSlots()`           | `→ string[]`                             | All business-hour slot labels from open to close at `DELIVERY_SLOT_INTERVAL_HOURS` spacing                     |
| `getAvailableSlotsForDate(isoDate)` | `→ SlotOption[]`            | Returns slots with `{ label, isDisabled, disabledReason? }`. Today: enforces 6h advance rule. Tomorrow: all enabled. |
| `getAvailableDates()`    | `→ DateAvailability`                     | Returns `{ todayISO, tomorrowISO, todayDisabled, todayDisabledReason }`. `todayDisabled` = true if zero valid slots remain today. |
| `buildDessertSlot(isoDate, timeLabel)` | `→ DessertSlot`            | **Computes `scheduledTimestamp` first**, then derives `isoDate` and `time` from it — making inconsistency structurally impossible. |
| `isSlotStillValid(slot)` | `→ boolean`                              | Returns `true` if slot is ≥ `DESSERT_MIN_ADVANCE_HOURS` in the future from now. Used for expiry detection.     |
| `formatScheduledTime(ts)`| `→ string`                               | Full datetime string in IST: `"17 June 2026, 4:00 PM"`                                                        |
| `formatScheduledDate(ts)`| `→ string`                               | Short date: `"17 June"`                                                                                        |
| `formatScheduledTimeOnly(ts)` | `→ string`                          | Time only: `"4:00 PM"`                                                                                         |
| `getRelativeDateLabel(isoDate)` | `→ string`                        | Returns `"Today"` or `"Tomorrow"` for known dates; falls back to formatted date string                          |

---

### 3.11 Providers

Located in `src/providers/AppProviders.tsx`.

| File               | Purpose                                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppProviders.tsx` | Root providers wrapper. Mounts `<CartToast />` globally so the add-to-cart notification is available on every page. Add further React Context providers (auth context, theme, etc.) inside this wrapper without modifying `layout.tsx`. |

---

### 3.12 Lib

Located in `src/lib/`.

| File          | Purpose                                                                                                            | Exports                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `firebase.ts` | Firebase client SDK singleton config. Handles config, authentication, Firestore Database, and Storage.             | `auth`, `db`, `storage`, `app`, `default app` |
| `otp.ts`      | Secure OTP utilities for the Next.js backend. Generates 6-digit codes, performs SHA-256 hashing, and calculates Haversine GPS distances for delivery proximity checks. | `generateOtp`, `hashOtp`, `verifyOtp`, `isExpired`, `haversineDistance`, `isWithinProximity` |
| `sms.ts`      | Pluggable interface for dispatching SMS messages. Currently logs OTPs to the console for development. Ready to be swapped with Twilio/MSG91 for production. | `SmsService`, `ConsoleSmsService`, `sendDeliveryOtp` |

---

### 3.13 Public Assets

Located in `frontend/public/images/`. All images are AI-generated editorial photography.

| File                      | Used In                                            | Description                                                    |
| ------------------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| `hero-coffee-cutout.png`  | `HeroSection` (middle layer)                       | Premium matte black coffee cup cutout on transparent background |
| `hero-dessert.png`        | Secondary reference                                | Dark chocolate tart on slate                                   |
| `bestseller-latte.png`    | `BestSellersSection` — The Noir Latte              | Latte with rosette art, overhead                               |
| `bestseller-cake.png`     | `BestSellersSection` + `HeroSection` floating card | Dark chocolate layer cake                                      |
| `bestseller-coldbrew.png` | `BestSellersSection` — Cold Brew                   | Cold brew in tall glass with ice                               |
| `process-beans.png`       | `ProcessSection` — Step 01                         | Close-up macro of arabica beans                                |
| `process-roasting.png`    | `ProcessSection` — Step 02                         | Coffee roasting drum overhead                                  |
| `process-brewing.png`     | `ProcessSection` — Step 03                         | Pour-over dripper with gooseneck kettle                        |
| `process-aftertaste.png`  | `ProcessSection` — Step 04                         | Moody close-up espresso cup with golden crema and rising steam |
| `process-dessert.png`     | `ProcessSection` — Step 05                         | Chef piping chocolate ganache                                  |
| `menu-coffee.png`         | `MenuPreviewSection` — Coffee category             | Multiple drinks arranged overhead                              |
| `menu-desserts.png`       | `MenuPreviewSection` — Desserts category           | Multiple desserts arranged overhead                            |
| `menu-specials.png`       | `MenuPreviewSection` — Signature Specials          | Signature cocktail-style coffee                                |
| `menu-noir-latte.png`     | `ProductCard` — Noir Latte                         | Noir latte with micro-foam art, moody dark background          |
| `menu-cappuccino.png`     | `ProductCard` — Cappuccino                         | Classic cappuccino rosette, warm bokeh                         |
| `menu-cold-brew.png`      | `ProductCard` — Signature Cold Brew                | Cold brew in tall glass, hand-carved ice, condensation         |
| `menu-mocha-reserve.png`  | `ProductCard` — Mocha Reserve                      | Rich mocha with chocolate drizzle and dark crema               |
| `menu-belgian-brownie.png`| `ProductCard` — Belgian Brownie                    | Dense fudge brownie with glossy ganache top                    |
| `menu-cheesecake.png`     | `ProductCard` — Blueberry Cheesecake               | New York cheesecake with wild blueberry compote                |
| `menu-truffle-tart.png`   | `ProductCard` — Chocolate Truffle Tart             | Dark valrhona tart with edible gold leaf                       |
| `menu-tiramisu.png`       | `ProductCard` — Classic Tiramisu                   | Layered tiramisu in glass, dusted cocoa                        |

---

### 3.14 Config Files

| File                 | Purpose                                                                                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tailwind.config.ts` | Tailwind v4 config. Extends brand colours (`brand.primary/secondary/tertiary`), editorial font families (`cinzel`, `helvetica`), `clamp`-based display font sizes, custom spacing values, letter-spacing tokens, and Framer Motion keyframes |
| `next.config.ts`     | Next.js config. Adds `cloud.appwrite.io` to `remotePatterns` for `next/image`. Enables `optimizePackageImports` for `framer-motion` and `lucide-react`                                                                                       |
| `.env.example`       | Template for all required environment variables (copy → `.env.local`)                                                                                                                                                                        |
| `.gitignore`         | Excludes `node_modules/`, `.next/`, all `.env*` files, `dist/`, `coverage/`                                                                                                                                                                  |
| `tsconfig.json`      | TypeScript config with `@/*` path alias mapping to `./src/*`                                                                                                                                                                                 |

---

## 4. Design System

### Colour Palette

| Token         | Hex       | CSS Variable            | Usage                                   |
| ------------- | --------- | ----------------------- | --------------------------------------- |
| Primary       | `#15110D` | `--brand-primary`       | Dark espresso background, cards         |
| Secondary     | `#EDE3D0` | `--brand-secondary`     | Cream text, light section backgrounds   |
| Tertiary      | `#B8956A` | `--brand-tertiary`      | Gold accent — labels, icons, highlights |
| Primary Light | `#1e1812` | `--brand-primary-light` | Slightly lighter dark for cards         |

### Typography

| Font                       | Variable           | Usage                                                                   |
| -------------------------- | ------------------ | ----------------------------------------------------------------------- |
| **Cinzel** (Google Fonts)  | `--font-cinzel`    | Accent serif — brand name in logo, select headings, luxury moments only |
| **Helvetica Neue** / Arial | `--font-helvetica` | All body copy, navigation, large headlines, product content             |

> **Rule:** Use Cinzel sparingly for maximum impact. Helvetica carries the bulk of content.

### Container

```css
.container-brand
  mobile:  max-width 100%,  padding 24px
  sm:      max-width 100%,  padding 32px
  lg:      max-width 1600px, padding 40px, centered
  2xl:     max-width 1800px, padding 64px, centered
```

---

## 5. Firebase Auth Integration Guide

This project utilizes **Firebase Phone Authentication** for secure user login.

### Step 1 — Set up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Register a new Web App in your project.
3. Enable **Phone Authentication** in the Firebase Auth settings (Build > Authentication > Sign-in method).
4. Add your domain name (e.g. `localhost`) to the Authorized Domains section.

### Step 2 — Fill `.env.local`

Create a `.env.local` in your root directory and copy the Web SDK configurations from your Firebase console:

```bash
cp .env.example .env.local
# Fill all values with your Web SDK credentials
```

---

## 6. Environment Variables

| Variable                                 | Required | Description                                                 |
| ---------------------------------------- | -------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT`          | ✅       | Appwrite API endpoint (e.g. `https://cloud.appwrite.io/v1`) |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID`        | ✅       | Your Appwrite project ID                                    |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID`       | ✅       | Your main database ID                                       |
| `NEXT_PUBLIC_USERS_COLLECTION_ID`        | ✅       | Users collection ID                                         |
| `NEXT_PUBLIC_PRODUCTS_COLLECTION_ID`     | ✅       | Products collection ID                                      |
| `NEXT_PUBLIC_ORDERS_COLLECTION_ID`       | ✅       | Orders collection ID                                        |
| `NEXT_PUBLIC_FIREBASE_API_KEY`           | ✅       | Firebase client API key (required for phone auth)           |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`       | ✅       | Firebase Auth domain                                        |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`        | ✅       | Firestore database access                                   |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`    | ✅       | Firebase Storage access (for product images)                |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅     | FCM sender ID                                               |
| `NEXT_PUBLIC_FIREBASE_APP_ID`            | ✅       | Firebase web app ID                                         |
| `RESEND_API_KEY`                         | ✅       | Resend API key for sending email receipts                   |
| `NEXT_PUBLIC_REWARDS_COLLECTION_ID`      | ✅       | Rewards/stamps collection ID                                |
| `NEXT_PUBLIC_COUPONS_COLLECTION_ID`      | ⬜       | Coupons collection ID                                       |
| `NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID` | ⬜       | Storage bucket for product images                           |

---

## 7. Pages Reference

| Route           | File                        | Type          | Status           | Notes                                                                    |
| --------------- | --------------------------- | ------------- | ---------------- | ------------------------------------------------------------------------ |
| `/`             | `app/page.tsx`              | Static        | ✅ Complete      | Full landing page with all 8 sections                                    |
| `/menu`         | `app/menu/page.tsx`         | Static        | ✅ Complete      | Hero + filterable product grid, integrated with Firebase Firestore.      |
| `/cart`         | `app/cart/page.tsx`         | Client        | ✅ Complete      | Zustand cart, quantity controls, scheduling panels, mixed-order coffee mode picker, checkout gate |
| `/product/[id]` | `app/product/[id]/page.tsx` | Dynamic (SSR) | 🔧 Scaffold      | —                                                                        |
| `/about`        | `app/about/page.tsx`        | Static        | 🔧 Scaffold      | —                                                                        |
| `/contact`      | `app/contact/page.tsx`      | Static        | 🔧 Scaffold      | —                                                                        |
| `/rewards`      | `app/rewards/page.tsx`      | Static        | 🔧 Scaffold      | —                                                                        |
| `/login`        | `app/login/page.tsx`        | Static        | 🔧 Scaffold      | Cart checkout redirects here when unauthenticated                        |
| `/checkout`     | `app/checkout/page.tsx`     | Client        | ✅ Complete      | Delivery form, live location, scheduling summary panel, pre-submit confirmation modal, places order in Firestore with all scheduling fields. |
| `/order-success`| `app/order-success/page.tsx`| Client        | ✅ Complete      | Success confirmation, displays order ID + estimated time (day-aware: "Dessert by Tomorrow, 4:00 PM"). |
| `/dashboard`    | `app/dashboard/page.tsx`    | Client        | ✅ Complete      | Real-time order history from Firestore. Estimated Arrival reads `deliveryDate`+`deliveryTime` for scheduled orders. |

> **✅ Complete** = fully functional, integrated with Firebase Firestore.  
> **🔧 Scaffold** = page structure in place, data/forms not yet connected.  
> **⬜ Not started** = route planned but file not yet created.

---

## 8. Component Props Reference

### Section components

All section components are **zero-prop** — they import data from `src/constants/index.ts` directly. To change content (product names, descriptions, process steps), edit `constants/index.ts`.

### Navbar

- No props
- Internal state: `isScrolled` (boolean), `isMobileOpen` (boolean)
- Reads `useCartStore` for live cart count badge

### Footer

- No props
- Reads `NAV_LINKS` and `BRAND` from constants

### ProductCard

| Prop      | Type                              | Required | Description                                        |
| --------- | --------------------------------- | -------- | -------------------------------------------------- |
| `product` | `MenuProduct`                     | ✅       | Product data object (from `menuData.ts` or Appwrite) |
| `index`   | `number`                          | ✅       | Used for staggered animation delay                 |
| `onAdd`   | `(product: MenuProduct) => void`  | ⬜       | Callback fired when Add button is clicked          |

### CartItemRow

| Prop    | Type        | Required | Description                          |
| ------- | ----------- | -------- | ------------------------------------ |
| `item`  | `CartItem`  | ✅       | Cart item (`{ product, quantity }`)  |
| `index` | `number`    | ✅       | Used for staggered animation delay   |

### OrderSummary

- No props
- Reads `useCartStore` for items, subtotal, `dessertSlot`, `coffeeDeliveryMode`, and derived selectors
- Reads `useAuthStore` for authentication state
- **Checkout gate:** Disabled if `hasDesserts() && !isSlotValid()` or `isMixedOrder() && !coffeeDeliveryMode`
- Shows mini scheduling summary when slot is confirmed

### DessertSlotModal

| Prop        | Type                                           | Required | Description                                         |
| ----------- | ---------------------------------------------- | -------- | --------------------------------------------------- |
| `product`   | `MenuProduct \| null`                           | ✅       | The dessert being added. `null` = edit-slot-only mode |
| `onConfirm` | `(product, slot: DessertSlot) => void`          | ✅       | Called when user confirms; receives the built slot  |
| `onClose`   | `() => void`                                   | ✅       | Called when modal is dismissed without confirming   |

---

## 11. Dessert Scheduling System

This section documents the full design of the dessert time-slot scheduling feature. Read this before modifying any scheduling logic.

### Overview

- **Coffee** orders are always fulfilled immediately. No scheduling changes to coffee flow.
- **Dessert** orders require a delivery date + time slot (up to 2 days out).
- **Mixed** orders (coffee + dessert) additionally require the user to choose whether coffee is delivered immediately or bundled with the dessert.

### Canonical Data Rule

> **`scheduledTimestamp` (Unix ms) is always the canonical value.** `deliveryDate` (`YYYY-MM-DD`) and `deliveryTime` (`4:00 PM`) are always derived from it using `buildDessertSlot()` and stored alongside for display convenience only. Never compute a timestamp from a display string.

### Slot Selection Rules

| Rule | Detail |
|------|--------|
| **Min advance** | Slot must be ≥ `DESSERT_MIN_ADVANCE_HOURS` (6 h) from now in IST |
| **Window** | Only slots within `BUSINESS_HOURS.open–close` (8 AM–10 PM) are offered |
| **Today** | Only slots satisfying the 6 h rule are enabled; others shown greyed with reason |
| **Tomorrow** | All slots enabled |
| **Today disabled** | If no valid today slots remain, the Today button itself is disabled |
| **Slot interval** | Controlled by `DELIVERY_SLOT_INTERVAL_HOURS` constant (default: 1 h) |
| **Timezone** | All math uses `BUSINESS_TIMEZONE = 'Asia/Kolkata'` — never relies on browser locale |

### Expiry Detection

When the user navigates to `/cart` or `/checkout`, `useSlotValidation` runs once on mount:
- Reads `dessertSlot.scheduledTimestamp` from the persisted cart store.
- If `scheduledTimestamp < Date.now() + MIN_ADVANCE_MS` → slot is expired.
- Expired slot and `coffeeDeliveryMode` are cleared from the store.
- The page receives `{ wasExpired: true }` and shows an orange expiry banner.

### Firestore Order Fields

```typescript
// Only written when containsDessert === true
{
  containsCoffee: boolean,         // auto-derived from items
  containsDessert: boolean,        // auto-derived from items
  isScheduled: true,
  scheduledTimestamp: 1750152600000,  // canonical Unix ms (IST)
  deliveryDate: "2026-06-17",         // derived display — do NOT parse back to timestamp
  deliveryTime: "4:00 PM",            // derived display
  coffeeDeliveryMode: "immediate" | "withDessert" | undefined
}
```

### Display Strings

| Context | Format | Example |
|---|---|---|
| Cart slot banner | `getRelativeDateLabel() + " · " + time` | `Tomorrow · 4:00 PM` |
| Estimated Arrival (dashboard) | `"Dessert by " + relativeLabel + ", " + time` | `Dessert by Tomorrow, 4:00 PM` |
| Admin drawer | `formatScheduledTime(ts)` | `17 June 2026, 4:00 PM` |
| Admin orders table secondary line | `relativeLabel + " · " + time` | `Tomorrow · 4:00 PM` |

### To Change Business Hours / Slot Config

> **Only edit `src/constants/index.ts`.** All scheduling logic reads from there — no other files need changes.

```typescript
// src/constants/index.ts
export const BUSINESS_HOURS = { open: 8, close: 22 };        // 8 AM – 10 PM
export const DELIVERY_SLOT_INTERVAL_HOURS = 1;                // 1-hour slots
export const DESSERT_MIN_ADVANCE_HOURS = 6;                   // 6h same-day advance
export const BUSINESS_TIMEZONE = 'Asia/Kolkata';              // IST
```

---

## 12. Scripts

```bash
# Run in: XVIII-PROJECT/frontend/

npm run dev       # Start dev server at localhost:3000
npm run build     # Production build (verify before deploy)
npm run start     # Start production server
npm run lint      # Run ESLint
npx tsx scripts/seed-products.ts # Seed initial mock products to Firestore
```

---

> **Note:** This doc is the single source of truth for the frontend architecture. Update it whenever new files, components, or pages are added.

---

## 13. Changelog

A running log of all significant frontend changes. Most recent first.

---

### 24 June 2026

#### Customer Order Tracking Page

Premium real-time order tracking experience at `/orders/:id`. Starbucks Reserve-inspired vertical timeline with Framer Motion animations and Firestore real-time subscription.

**New files:**
- [`order-tracking.types.ts`](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/types/order-tracking.types.ts) — `TrackingStep` and `TrackingState` types. `TRACKING_STEPS` constant mapping `AdminOrderStatus` to customer-friendly labels, descriptions, and emoji icons. `getStepState()` utility to determine completed/active/upcoming states.
- [`OrderTracker.tsx`](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/orders/OrderTracker.tsx) — Client orchestrator component. Sets up real-time Firestore `onSnapshot` listener for a single order. Manages loading skeleton, not-found, cancelled, and active tracking states. Two-column responsive layout.
- [`OrderProgressTimeline.tsx`](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/orders/OrderProgressTimeline.tsx) — Vertical 5-step timeline with gold completed steps (check icon + glow), animated active step (pulse + ring animation + "Current" badge), and dimmed upcoming steps. Staggered entry animation.
- [`OrderStatusCard.tsx`](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/orders/OrderStatusCard.tsx) — Dark glassmorphism order details card. Shows order ID, items with quantity badges, price breakdown, delivery address, payment method. Conditional scheduling section (scheduled vs estimated delivery). Mixed-order coffee fulfillment mode pill.
- [`orders/[id]/page.tsx`](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/app/orders/[id]/page.tsx) — Server component page route. Extracts `params.id`, renders Navbar + OrderTracker + Footer with ambient background glow orbs.

**No existing files modified.** All new code — `orders.service.ts`, checkout flow, admin panel, and database schema remain untouched.

---

### 16 June 2026

#### Dessert Time Slot & Coffee Delivery Enhancement

**New files:**
- [`src/utils/timeSlots.ts`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/utils/timeSlots.ts) — IST-aware scheduling utilities: slot generation, `buildDessertSlot()`, `isSlotStillValid()`, `getRelativeDateLabel()`, formatters. Single source of scheduling math.
- [`src/hooks/useSlotValidation.ts`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/hooks/useSlotValidation.ts) — Mount hook that detects and clears expired slots on Cart/Checkout pages. Returns `{ wasExpired }`.
- [`src/components/menu/DessertSlotModal.tsx`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/components/menu/DessertSlotModal.tsx) — Full-screen date/time picker modal. Enforces 6h advance rule inline. Works in add-product and edit-slot modes.

**Modified files:**
- [`src/constants/index.ts`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/constants/index.ts) — Added `BUSINESS_HOURS`, `DELIVERY_SLOT_INTERVAL_HOURS`, `DESSERT_MIN_ADVANCE_HOURS`, `BUSINESS_TIMEZONE`.
- [`src/types/admin.types.ts`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/types/admin.types.ts) — Extended `AdminOrder` with `containsCoffee`, `containsDessert`, `isScheduled`, `scheduledTimestamp`, `deliveryDate`, `deliveryTime`, `coffeeDeliveryMode`.
- [`src/store/cart.store.ts`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/store/cart.store.ts) — Added `dessertSlot`, `coffeeDeliveryMode`, `setDessertSlot()`, `setCoffeeDeliveryMode()`, `hasDesserts()`, `hasCoffee()`, `isMixedOrder()`, `isSlotValid()`. `clearCart()` and `removeFromCart()` auto-clear scheduling fields when appropriate.
- [`src/components/menu/MenuGrid.tsx`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/components/menu/MenuGrid.tsx) — Dessert add-button now opens `DessertSlotModal` before adding to cart. Coffee add-button unchanged.
- [`src/app/cart/page.tsx`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/app/cart/page.tsx) — Added: expiry banner, dessert slot panel with Edit Slot button, mixed-order coffee delivery mode picker (Immediate / With Dessert).
- [`src/components/cart/OrderSummary.tsx`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/components/cart/OrderSummary.tsx) — Checkout gate: button disabled until slot + coffee mode are resolved. Mini scheduling summary in sidebar.
- [`src/app/checkout/page.tsx`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/app/checkout/page.tsx) — Added Delivery Schedule panel, pre-submit confirmation modal showing full order + schedule. Firestore payload now includes all scheduling fields with `scheduledTimestamp` as canonical.
- [`src/app/order-success/page.tsx`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/app/order-success/page.tsx) — `estimatedTime` derived from `deliveryDate`+`deliveryTime` when `isScheduled`: `"Dessert by Tomorrow, 4:00 PM"`.
- [`src/app/dashboard/page.tsx`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/app/dashboard/page.tsx) — `estimatedTime` in order cards now derived from Firestore scheduling fields instead of hardcoded `'25–35 minutes'`.
- [`src/components/admin/orders/OrderDetailDrawer.tsx`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/components/admin/orders/OrderDetailDrawer.tsx) — New **Delivery Schedule** section (shown only when `isScheduled`): dessert date/time, 🟡 Scheduled badge, Coffee Fulfillment row with Immediate/Bundled pill.
- [`src/components/admin/orders/OrdersTable.tsx`](file:///c:/Users/LOQ/Desktop/XVIII-PROJECT/frontend/src/components/admin/orders/OrdersTable.tsx) — New scheduling filter row (Today's Desserts / Tomorrow's Desserts / Immediate Coffee / Coffee+Dessert). Scheduling-filtered results sorted by `scheduledTimestamp` ascending. Row indicators show slot info inline.

#### Order Flow Backend — Firebase Firestore Orders Integration
- Created [orders.service.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/services/orders.service.ts) handling Firestore CRUD operations, user filtering, and real-time dashboard listeners.
- Connected checkout page (`app/checkout/page.tsx`) to publish new orders to Firestore, supporting guest/authenticated checkouts.
- Updated customer dashboard (`app/dashboard/page.tsx`) to subscribe to their order history in real-time.
- Connected admin dashboard metrics (`app/admin/page.tsx`) to compute live statistics (Pending, Delivered, Total Orders) dynamically using Firestore data.
- Refactored `OrdersTable.tsx` to subscribe to all store orders in real-time, syncing status updates directly to Firestore.
- Updated `AdminOrder` types to contain `userId` and detected delivery `location` coordinates.
- Fixed `LoginForm.tsx` ReCAPTCHA verification issues under local development.

---

### 10 June 2026

#### Customer Frontend Backend — Firebase Firestore Products Integration

**Modified files:**
- [products.service.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/services/products.service.ts) — Re-implemented data retrieval methods to fetch products from the Firebase Firestore database, using memory-based filtering for performance and composite index safety.
- [MenuGrid.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/menu/MenuGrid.tsx) — Swapped local mock array fallback for live Firestore fetching. Added shimmer loader skeleton and retry trigger states.
- [BestSellersSection.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/sections/BestSellersSection.tsx) — Connected best-selling products component to dynamic database collection with editorial loading skeleton state.
- [LoginForm.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/auth/LoginForm.tsx) — Changed recaptcha-container styling from `hidden` to `absolute opacity-0 pointer-events-none` to prevent Firebase `auth/invalid-app-credential` errors, and refactored ReCAPTCHA verifier initialization to React hooks to resolve duplicate render failures.
- [PROJECT_DOCS.md](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/docs/PROJECT_DOCS.md) — Updated service tables and recorded development transitions in logs.

---

### 9 June 2026

#### Admin Products Backend — Firestore & Storage Integration

**New files:**
- [admin-products.service.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/services/admin-products.service.ts) — Admin CRUD operations service integrated with Firebase Firestore and Storage.
- [seed-products.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/scripts/seed-products.ts) — Seed script to populate initial mock products into the Firestore database.

**Modified files:**
- [firebase.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/lib/firebase.ts) — Added Firestore and Storage instance initializations and exports.
- [ProductFormModal.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/products/ProductFormModal.tsx) — Added state to preserve selected image `File` object and modified `onSave` signature.
- [ProductsTable.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/products/ProductsTable.tsx) — Wired table operations (fetch, save, toggle, delete) to `adminProductsService` and added loaders/overlays.
- [page.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/app/admin/products/page.tsx) — Simplified layout, removing MOCK_ADMIN_PRODUCTS import.
- [next.config.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/next.config.ts) — Whitelisted `firebasestorage.googleapis.com` remote pattern.
- [.env.example](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/.env.example) — Added comments regarding Firebase Storage/Firestore setup.

---

### 8 June 2026

#### Admin Panel — Full Implementation & Frontend UI

**New files:**
- [admin-login/page.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/app/admin-login/page.tsx) — Admin login page with credentials form (simulated 900 ms delay authentication).
- [admin/layout.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/app/admin/layout.tsx) — Shared layout for all admin dashboard routes (renders sidebar and header).
- [admin/page.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/app/admin/page.tsx) — Main dashboard stats panel (Total Products, Total Orders, Pending Orders, Delivered orders).
- [admin/products/page.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/app/admin/products/page.tsx) — Products management view.
- [admin/orders/page.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/app/admin/orders/page.tsx) — Orders list view.
- [AdminSidebar.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/layout/AdminSidebar.tsx) — Navigation drawer for desktop (fixed) and mobile (overlay drawer).
- [AdminHeader.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/layout/AdminHeader.tsx) — Dashboard top header displaying current route info, notifications status, and admin details.
- [DashboardOverview.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/dashboard/DashboardOverview.tsx) — Dashboard metric cards calculation and display logic.
- [StatCard.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/dashboard/StatCard.tsx) — Interactive KPI card component.
- [OrdersTable.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/orders/OrdersTable.tsx) — Responsive order grid with status filter and text search.
- [OrderDetailDrawer.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/orders/OrderDetailDrawer.tsx) — Slide-out drawer with detailed checkout information and order status controls.
- [StatusBadge.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/orders/StatusBadge.tsx) — Multi-colored indicators for order fulfillment states.
- [ProductsTable.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/products/ProductsTable.tsx) — Core product list showing metadata, status toggles, and edit/delete actions.
- [ProductFormModal.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/products/ProductFormModal.tsx) — Context-aware form modal to add and edit menu offerings.
- [AvailabilityToggle.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/products/AvailabilityToggle.tsx) — Active availability toggle control switch.
- [DeleteConfirmModal.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/admin/products/DeleteConfirmModal.tsx) — Simple delete verification modal wrapper.
- [adminMockData.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/data/adminMockData.ts) — 10 dummy order lists and 8 product data points formatted to match database schemas.
- [admin.types.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/types/admin.types.ts) — Type definitions for products, order items, and payment modes in admin scope.

**Modified files:**
- [PROJECT_DOCS.md](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/docs/PROJECT_DOCS.md) — Added file descriptions for all admin views and dashboard components, and updated types.

#### Authentication — Firebase Phone Auth Integration

**New files:**
- [firebase.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/lib/firebase.ts) — Firebase client initialization singleton.
- [LoginForm.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/auth/LoginForm.tsx) — Fully designed, premium mobile login UI utilizing Firebase Phone Auth (ReCaptcha setup and OTP dispatch flows).

**Modified files:**
- [PROJECT_DOCS.md](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/docs/PROJECT_DOCS.md) — Replaced Appwrite Database guide sections with Firebase integration references, and marked Appwrite database operations as canceled (switching to local mock storage models for frontend continuity).
- [login/page.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/app/login/page.tsx) — Renders `LoginForm` in a styled frame, handling post-auth route redirections.
- [auth.service.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/services/auth.service.ts) — Re-implemented authentication calls using Firebase Web Auth SDK.
- [auth.store.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/store/auth.store.ts) — Integrated Zustand auth storage directly with Firebase subscriber states.
- [useAuth.ts](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/hooks/useAuth.ts) — Custom hook to query active Firebase auth profiles.
- [Navbar.tsx](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/src/components/layout/Navbar.tsx) — Dynamic sign-in/sign-out buttons integrated into desktop headers and mobile side drawers.
- [.env.example](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/.env.example) — Added necessary Firebase credential properties (`apiKey`, `authDomain`, etc.).

#### Brand Marketing & Visuals — Typewriter and README Animations

**New files:**
- `public/images/readme-banner.svg` — Dynamic vector graphic header containing coffee branding motifs.
- `public/images/readme-terminal.svg` — Interactive command-line simulation layout for the documentation banner.

**Modified files:**
- [README.md](file:///c:/Users/ROHIT/Desktop/XVII/XVIII-FRONTEND/README.md) — Complete revamp of project description landing, showcasing interactive animations with Typewriter text.

---

### 7 June 2026

#### Cart System — Full Implementation

**New files:**
- `src/store/cart.store.ts` — Zustand store with `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`. Persisted to `localStorage` (key: `xviii-cart`). Exports `DELIVERY_FEE = 40`.
- `src/components/ui/CartToast.tsx` — Lightweight "Added to Cart" toast using an event-bus (`fireCartToast(name)`). Framer Motion AnimatePresence. Auto-dismisses at 2.8 s.
- `src/components/cart/CartItemRow.tsx` — Per-item row: fixed 4:5 image, quantity stepper, remove button, live line total.
- `src/components/cart/OrderSummary.tsx` — Sticky sidebar: Subtotal + ₹40 Delivery + Total. Smart checkout routing (`/login` or `/checkout`).
- `src/app/cart/page.tsx` — Full `/cart` page. Two-column desktop layout (items list + sticky summary). Empty state with Browse Menu CTA.

**Modified files:**
- `src/providers/AppProviders.tsx` — Now mounts `<CartToast />` globally.
- `src/app/layout.tsx` — Wraps `{children}` in `<AppProviders>`.
- `src/components/layout/Navbar.tsx` — Added `ShoppingBag` icon with animated gold count badge reading from `useCartStore`.
- `src/components/menu/MenuGrid.tsx` — `handleAdd` now calls `addToCart` + `fireCartToast`.

#### Menu Page — Full Implementation

**New files:**
- `src/data/menuData.ts` — `MenuProduct` type + 8 dummy products (4 coffee, 4 dessert). Maps to Appwrite Products collection schema.
- `src/components/menu/MenuHero.tsx` — Animated editorial hero section for `/menu`. Ghost `XVIII` parallax text. Stats row.
- `src/components/menu/ProductCard.tsx` — Reusable product card. Fixed 4:5 image with `object-fit: cover`. Accepts `onAdd` callback.
- `src/components/menu/MenuGrid.tsx` — Filterable product grid (All / Coffee / Desserts). AnimatePresence filter transitions.

**New images** added to `public/images/`:
`menu-noir-latte.png` · `menu-cappuccino.png` · `menu-cold-brew.png` · `menu-mocha-reserve.png` · `menu-belgian-brownie.png` · `menu-cheesecake.png` · `menu-truffle-tart.png` · `menu-tiramisu.png`

**Modified files:**
- `src/app/menu/page.tsx` — Replaced placeholder with full composed page (`MenuHero` + `MenuGrid`).

---

### 6 June 2026

#### Hero Heading Overlap Fix

- **File:** `src/components/sections/HeroSection.tsx`
- **Problem:** The hero left column had `lg:py-0` which removed all top padding on desktop. With the fixed navbar (~104 px tall after the logo size increase), the hero heading overlapped the navbar on large screens.
- **Fix:** Changed `lg:py-0` → `lg:pt-36 lg:pb-20`. The 144 px top padding clears the navbar with comfortable editorial breathing room. Mobile (`pt-32`) unchanged.

#### New Process Step — The Aftertaste (Step 04)

- **File:** `src/constants/index.ts`
- Inserted a new step between The Brew and Dessert Craft in `PROCESS_STEPS`:
  - **04 — The Aftertaste.** _"They won't talk about it, because it is either bitter, flat, or forgettable. Ours lingers. Complex, clean, and entirely intentional — the final note that makes the cup worth remembering."_
  - **05 — Dessert Craft.** (renumbered from 04)
- New image `public/images/process-aftertaste.png` added (AI-generated moody espresso close-up).
- `ProcessSection` now renders 5 alternating editorial panels. No component code changes required — data-driven via the `PROCESS_STEPS` constant.

#### Navbar Logo Size Increase

- **File:** `src/components/layout/Navbar.tsx`
- SVG logo container changed from `w-10 h-10` (40 px) → `w-14 h-14` (56 px) for better visibility.

#### Brand Address — Kanpur

- **File:** `src/constants/index.ts`
- `BRAND.address` changed from `'XVIII Brew Co., Your City, India'` → `'XVIII Brew Co., Kanpur, India'`.
- Automatically reflected in Footer contact column and any other consumer of `BRAND.address`.

# XVIII Brew - Database Documentation (Canceled)

> **Status:** Canceled. The project does not use Appwrite for backend as a service. Product data and loyalty rewards are managed client-side via mock data layers to maintain frontend integrity.
