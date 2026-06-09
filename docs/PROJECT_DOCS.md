# The XVIII Brew Co. — Project Documentation

> **Last Updated:** 8 June 2026  
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
| `cart/page.tsx`         | `/cart`        | Cart page. Two-column desktop layout: item list + sticky `OrderSummary`. Reads from Zustand cart store. Empty-state with Browse Menu CTA.                           |
| `about/page.tsx`        | `/about`       | Brand story page (scaffold)                                                                                                                                         |
| `contact/page.tsx`      | `/contact`     | Contact page (scaffold)                                                                                                                                             |
| `rewards/page.tsx`      | `/rewards`     | Loyalty programme page (scaffold)                                                                                                                                   |
| `login/page.tsx`        | `/login`       | Customer login page (scaffold). Cart checkout redirects here when user is not logged in.                                                                            |
| `product/[id]/page.tsx` | `/product/:id` | Dynamic product detail page. Reads `params.id` from the URL.                                                                                                        |

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
| `Navbar.tsx` | Sticky top navigation bar | Transparent on load → dark with backdrop-blur on scroll. 56 px logo SVG. Desktop nav links. Cart icon with animated gold count badge (reads `useCartStore`). Mobile: full-screen slide-in overlay with live cart count. Body scroll locked when open.     |
| `Footer.tsx` | Site-wide footer          | 4-column grid: Brand · Navigate · Contact · CTA. Social links (Instagram, WhatsApp). Copyright bar. Responsive — stacks from 1 → 2 → 4 columns.                                                                                                          |

#### Menu Components (`src/components/menu/`)

| File              | Purpose                         | Key Features                                                                                                                                                                                                                       |
| ----------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MenuHero.tsx`    | Hero section for `/menu` page   | Animated editorial hero. Ghost `XVIII` parallax typography. Stats row (items, categories). Uses same framer-motion `fadeUp` pattern as landing hero. Eyebrow label + large H1 headline.                                            |
| `ProductCard.tsx` | Reusable individual product card | Fixed `4:5` aspect-ratio image container with `object-fit: cover` — images never stretch or overflow regardless of source dimensions. Category badge, featured dot, name + price row, description, minimal `+ Add` button. Accepts `onAdd` callback prop. |
| `MenuGrid.tsx`    | Filterable product grid         | Client component. Owns `activeFilter` state. Tabs: All / Coffee / Desserts with live item counts. `AnimatePresence` fade transition between filter states. Calls `useCartStore.addToCart()` + `fireCartToast()` on add.             |

#### Cart Components (`src/components/cart/`)

| File              | Purpose                          | Key Features                                                                                                                                                                                                                          |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CartItemRow.tsx` | Single cart item row             | Fixed `4:5` image thumbnail (`object-fit: cover`). Product name, category label, description (line-clamped). Quantity stepper (`−` / count / `+`) wired to `updateQuantity`. `×` remove button wired to `removeFromCart`. Live line total. AnimatePresence exit animation. |
| `OrderSummary.tsx`| Sticky order summary sidebar     | Sticky on desktop (`lg:sticky lg:top-32`). Shows Subtotal (with item count), Delivery Fee (₹40 flat), Total. Smart checkout button: routes to `/login` if unauthenticated, `/checkout` if logged in. Disabled + muted when cart empty. Reads `useAuthStore` for auth state. |

#### UI Components (`src/components/ui/`)

| File            | Purpose                       | Key Features                                                                                                                                                                                                   |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CartToast.tsx` | "Added to Cart" popup notification | Lightweight event-bus pattern (`fireCartToast(productName)` callable from anywhere). Framer Motion `AnimatePresence` stack. Auto-dismisses after 2.8 s. Brand aesthetic: `#1e1812` bg, gold border, check icon. Fixed bottom-right. |

#### Section Components (`src/components/sections/`)

| File                     | Section ID      | Background      | Purpose & Design Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------ | --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HeroSection.tsx`        | `#hero`         | `#15110D` dark  | **Landing hero.** Split 2-column grid. Left: animated typography (staggered `fadeUp` per element), eyebrow label, H1 headline "Crafted Coffee / Extraordinary Desserts", body copy, two CTA buttons, stats bar (18+, 100%, ∞). Right: parallax coffee image with `useScroll`/`useTransform`, dark gradient overlay, floating dessert card (**desktop only**, hidden on mobile with `hidden lg:block`). Bottom marquee ticker with infinite scroll. **Desktop top padding `lg:pt-36`** (144 px) ensures hero content never overlaps the fixed navbar. |
| `PhilosophySection.tsx`  | `#philosophy`   | `#15110D` dark  | **Brand philosophy.** Word-by-word animated headline using `useInView` — each word in "We built The XVIII Brew Co. because we believe every cup should mean something." animates independently with staggered delay. Gold colour on brand name words. Three editorial pillars below (Craftsmanship · Integrity · Community) in a divided grid.                                                                                                                                                                                                       |
| `BestSellersSection.tsx` | `#best-sellers` | `#EDE3D0` cream | **Best sellers.** Cream background section. 3-column rectangular editorial product cards. Each card: full `aspect-[4/5]` image with category tag, product name, price, description, and "View Details" link. Hover: image scale + name colour shift. Data sourced from `BEST_SELLERS` constant.                                                                                                                                                                                                                                                      |
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

| File                  | Purpose                   | Key Features                                                                                                                                                                                                              |
| --------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OrdersTable.tsx`     | Filterable orders table   | **Filter bar:** All / Pending / Confirmed / Preparing / Ready / Delivered / Cancelled. **Search:** by order ID, customer name, or phone. Clicking any row opens `OrderDetailDrawer`. Responsive — desktop shows all columns, mobile shows a compact card. |
| `OrderDetailDrawer.tsx`| Slide-in order detail panel | Shows full order info: customer name, phone, address, all items with quantities and prices, subtotal, delivery charge, total. Has a **Change Status** dropdown so admin can update the order status. Updates propagate back to the table in real-time (local state only for now). |
| `StatusBadge.tsx`     | Coloured status pill      | Renders a pill badge for any `AdminOrderStatus` value. Each status has a fixed colour: Pending=orange, Confirmed=blue, Preparing=purple, Ready=teal, Delivered=green, Cancelled=red. Accepts a `size` prop (`sm` or `md`). |

#### Products (`src/components/admin/products/`)

| File                   | Purpose                      | Key Features                                                                                                                                                                                                                          |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProductsTable.tsx`    | Full CRUD products table     | **Filter tabs:** All / Coffee / Desserts. **Search** by product name. **Add Product** button opens the add modal. Each row shows: thumbnail image, name + featured badge + description, category pill, price, availability toggle, edit + delete action buttons. |
| `ProductFormModal.tsx` | Add / Edit product modal     | A full-screen modal (dark glassmorphism card). Fields: Name, Description, Price (₹), Category (Coffee / Dessert), Image URL, Is Available, Is Featured. Works in both **add mode** (empty form) and **edit mode** (pre-filled with existing product data). Validates that name and price are filled before saving. |
| `AvailabilityToggle.tsx`| On/Off toggle switch        | A styled toggle switch with a `checked` boolean and `onChange` callback. When on, the track is gold (`#B8956A`). When off, it's a dim dark colour. Shows "Available" / "Out of Stock" label next to the switch.                         |
| `DeleteConfirmModal.tsx`| Delete confirmation dialog  | A small modal that asks "Are you sure you want to delete [product name]?". Has a Cancel button and a red Confirm Delete button. Prevents accidental deletions.                                                                         |

> **Note:** All admin component state changes (status updates, edits, deletes, adds) are **local React state only**. They reset on page refresh. Wire these to Appwrite SDK calls when the backend is ready.

---

### 3.4 Data Layer

Located in `src/data/`. Pure TypeScript data — **no Appwrite SDK calls here**. Swap these exports for Appwrite fetch functions when going live.

| File               | Purpose                                  | Exports                                                                                            |
| ------------------ | ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `menuData.ts`      | Dummy menu product data + type defs      | `MenuCategory`, `MenuProduct` interface, `MENU_PRODUCTS` array (8 products: 4 coffee + 4 dessert)  |
| `adminMockData.ts` | Dummy admin data for products and orders | `MOCK_ADMIN_PRODUCTS` (8 products), `MOCK_ADMIN_ORDERS` (10 orders). Typed with `AdminProduct` and `AdminOrder` from `admin.types.ts`. |

> **Appwrite handoff:** Replace `MENU_PRODUCTS` export in `menuData.ts` with a `databases.listDocuments()` call. Pass results as props to `MenuGrid`. No UI changes required.

---

### 3.5 Services

Located in `src/services/`. Authentication uses the Firebase Web SDK. Product and Reward services utilize mock local fallbacks.

| File                  | Purpose                                    | Key Methods                                                                                                                 |
| --------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `auth.service.ts`     | Firebase Phone Authentication operations   | `sendOtp(phoneNumber, recaptchaVerifier)`, `confirmOtp(confirmationResult, code)`, `getCurrentUser()`, `logout()`, `isAuthenticated()`, `onAuthStateChange()` |
| `products.service.ts` | Menu product data from mock data fallback  | `getProducts(filters)`, `getProduct(id)`                                                                                    |
| `rewards.service.ts`  | Loyalty stamp data from mock data fallback | `getUserStamps(userId)`, `getAvailableRewards()`                                                                            |

---

### 3.6 Hooks

Located in `src/hooks/`.

| File         | Purpose                                                                           | Returns                                         |
| ------------ | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| `useAuth.ts` | React hook for current auth state. Calls `authService.getCurrentUser()` on mount. | `{ user, isLoading, isAuthenticated, refetch }` |

---

### 3.7 Store

Located in `src/store/`. Uses **Zustand** for global state.

| File             | Purpose                                                                                            | State Shape                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `auth.store.ts`  | Global authentication state. Used across the app to read/write user session.                       | `{ user, isLoading, isAuthenticated, setUser(), initialize(), logout() }`                                                           |
| `cart.store.ts`  | Cart state — persisted to `localStorage` via Zustand `persist` middleware (key: `xviii-cart`).     | `{ items: CartItem[], addToCart(), removeFromCart(), updateQuantity(), clearCart(), getTotalItems(), getSubtotal() }` |

**`CartItem` shape:**
```typescript
{ product: MenuProduct, quantity: number }
```

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
  notes?, createdAt
}
```

---

### 3.9 Constants

Located in `src/constants/index.ts`. Single source of truth for all static brand content. **Change content here, not in components.**

| Export                    | Type   | Contains                                                                                                                 |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| `BRAND`                   | object | Brand name, tagline, headline, email, phone, address (`XVIII Brew Co., Kanpur, India`), Instagram URL, WhatsApp URL      |
| `NAV_LINKS`               | array  | All navigation link labels and `href` values                                                                             |
| `STAMPS_PER_CARD`         | number | Total stamps per loyalty card (10)                                                                                       |
| `STAMPS_FOR_FREE_DESSERT` | number | Stamps needed for free dessert reward (8)                                                                                |
| `STAMPS_FOR_DISCOUNT`     | number | Stamps needed for discount reward (5)                                                                                    |
| `PROCESS_STEPS`           | array  | All **5** process steps: `01` Bean Selection · `02` The Roast · `03` The Brew · `04` The Aftertaste · `05` Dessert Craft |
| `BEST_SELLERS`            | array  | 3 best seller products with id, name, category, description, price, image path                                           |
| `MENU_CATEGORIES`         | array  | 3 menu categories with id, label, description, image path, and href                                                      |

---

### 3.10 Utils

Located in `src/utils/helpers.ts`. Pure utility functions.

| Function        | Signature                                          | Purpose                                                           |
| --------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| `cn()`          | `(...classes) → string`                            | Merges class names conditionally (lightweight `clsx` alternative) |
| `formatPrice()` | `(amount: number) → string`                        | Formats number as Indian Rupee (₹) using `Intl.NumberFormat`      |
| `truncate()`    | `(text, maxLength) → string`                       | Truncates text with `...` at `maxLength` characters               |
| `getFileUrl()`  | `(fileId, bucketId, endpoint, projectId) → string` | Builds Appwrite Storage file preview URL                          |
| `wait()`        | `(ms: number) → Promise`                           | Async delay for animation sequencing                              |

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
| `firebase.ts` | Firebase client SDK singleton config. Handles environment variables setup and locale setup for Phone Verification. | `auth`, `app`, `default app` |

---

### 3.13 Public Assets

Located in `frontend/public/images/`. All images are AI-generated editorial photography.

| File                      | Used In                                            | Description                                                    |
| ------------------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| `hero-coffee.png`         | `HeroSection` (right column)                       | Premium espresso on dark surface                               |
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
| `NEXT_PUBLIC_REWARDS_COLLECTION_ID`      | ✅       | Rewards/stamps collection ID                                |
| `NEXT_PUBLIC_COUPONS_COLLECTION_ID`      | ⬜       | Coupons collection ID                                       |
| `NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID` | ⬜       | Storage bucket for product images                           |

---

## 7. Pages Reference

| Route           | File                        | Type          | Status           | Notes                                                                    |
| --------------- | --------------------------- | ------------- | ---------------- | ------------------------------------------------------------------------ |
| `/`             | `app/page.tsx`              | Static        | ✅ Complete      | Full landing page with all 8 sections                                    |
| `/menu`         | `app/menu/page.tsx`         | Static        | ✅ Complete      | Hero + filterable product grid. Dummy data. Ready for Appwrite handoff.  |
| `/cart`         | `app/cart/page.tsx`         | Client        | ✅ Complete      | Zustand cart, quantity controls, order summary, empty state              |
| `/product/[id]` | `app/product/[id]/page.tsx` | Dynamic (SSR) | 🔧 Scaffold      | —                                                                        |
| `/about`        | `app/about/page.tsx`        | Static        | 🔧 Scaffold      | —                                                                        |
| `/contact`      | `app/contact/page.tsx`      | Static        | 🔧 Scaffold      | —                                                                        |
| `/rewards`      | `app/rewards/page.tsx`      | Static        | 🔧 Scaffold      | —                                                                        |
| `/login`        | `app/login/page.tsx`        | Static        | 🔧 Scaffold      | Cart checkout redirects here when unauthenticated                        |
| `/checkout`     | _(not yet created)_         | Client        | ⬜ Not started   | Checkout button routes here when user is authenticated                   |

> **✅ Complete** = fully functional with dummy data, ready for Appwrite integration.  
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
- Reads `useCartStore` for items + subtotal
- Reads `useAuthStore` for authentication state
- Routing: `/login` (unauthenticated) · `/checkout` (authenticated)

---

## 9. Scripts

```bash
# Run in: XVIII-PROJECT/frontend/

npm run dev       # Start dev server at localhost:3000
npm run build     # Production build (verify before deploy)
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

> **Note:** This doc is the single source of truth for the frontend architecture. Update it whenever new files, components, or pages are added.

---

## 10. Changelog

A running log of all significant frontend changes. Most recent first.

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
