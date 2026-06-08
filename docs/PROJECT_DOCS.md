# The XVIII Brew Co. — Project Documentation

> **Last Updated:** 7 June 2026  
> **Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Firebase Auth  
> **Author:** XVIII Brew Co. Development Team

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Frontend — Full File Reference](#3-frontend--full-file-reference)
   - [App Directory (Pages & Layout)](#31-app-directory)
   - [Components](#32-components)
   - [Data Layer](#33-data-layer)
   - [Services (Firebase Auth & Local Mock)](#34-services)
   - [Hooks](#35-hooks)
   - [Store](#36-store)
   - [Types](#37-types)
   - [Constants](#38-constants)
   - [Utils](#39-utils)
   - [Providers](#310-providers)
   - [Lib](#311-lib)
   - [Public Assets](#312-public-assets)
   - [Config Files](#313-config-files)
4. [Design System](#4-design-system)
5. [Firebase Auth Integration Guide](#5-firebase-auth-integration-guide)
6. [Environment Variables](#6-environment-variables)
7. [Pages Reference](#7-pages-reference)
8. [Component Props Reference](#8-component-props-reference)
9. [Scripts](#9-scripts)

---

## 1. Project Overview

**The XVIII Brew Co.** is a premium luxury coffee and artisan dessert brand. This repository contains the full frontend web application — a Next.js 15+ app with a fully editorial, mobile-first design system, Appwrite backend integration, and a structured layered architecture.

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

| File                    | Route          | Purpose                                                                                                                                                                                                       |
| ----------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout.tsx`            | —              | Root layout. Sets global `<html>` metadata, loads Cinzel from Google Fonts, wraps `<body>` in `AppProviders` (mounts CartToast globally)                                                                      |
| `globals.css`           | —              | Global CSS. Brand design tokens (CSS variables), Tailwind v4 layer setup, `.container-brand` utility, body word/letter-spacing resets, marquee animation, scrollbar styling, selection colours                |
| `page.tsx`              | `/`            | Landing page. Imports and assembles all 8 section components in order: Navbar → Hero → Philosophy → BestSellers → Process → Rewards → MenuPreview → FinalCTA → Footer                                         |
| `menu/page.tsx`         | `/menu`        | **Complete** menu catalogue page. Server component shell — composes `MenuHero` + `MenuGrid`. SEO metadata included. Appwrite fetch point marked in comments.                                                  |
| `cart/page.tsx`         | `/cart`        | **Complete** cart page. Client component (reads Zustand). Two-column desktop layout: items list + sticky `OrderSummary`. Empty-state with Browse Menu CTA.                                                    |
| `about/page.tsx`        | `/about`       | Brand story page scaffold                                                                                                                                                                                     |
| `contact/page.tsx`      | `/contact`     | Contact page scaffold                                                                                                                                                                                         |
| `rewards/page.tsx`      | `/rewards`     | Loyalty programme page scaffold                                                                                                                                                                               |
| `login/page.tsx`        | `/login`       | Authentication page scaffold                                                                                                                                                                                  |
| `product/[id]/page.tsx` | `/product/:id` | Dynamic product detail page (server component, reads `params.id`)                                                                                                                                             |

---

### 3.2 Components

#### Layout Components (`src/components/layout/`)

| File         | Purpose                   | Key Features                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Navbar.tsx` | Sticky top navigation bar | - Transparent on load, dark with `backdrop-blur` on scroll<br>- Logo SVG `w-14 h-14` (56 px)<br>- Desktop nav links with underline hover effect<br>- **🛒 Cart indicator** — `ShoppingBag` icon with animated gold count badge sourced from `useCartStore`. Updates instantly when items are added/removed. Visible on desktop and mobile.<br>- **Order Now** CTA on right (desktop)<br>- Mobile: full-screen slide-in overlay with Cart shortcut link and live count badge<br>- Body scroll lock when mobile menu is open |
| `Footer.tsx` | Site-wide footer          | - 4-column grid: Brand, Navigate, Contact, CTA<br>- Social links (Instagram SVG, WhatsApp via lucide `MessageCircle`)<br>- Copyright + brand tagline bar<br>- Responsive: stacks to 1→2→4 columns                                                                                                                                                                                                                                                                                                  |

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

### 3.3 Data Layer

Located in `src/data/`. Pure TypeScript data — **no Appwrite SDK calls here**. Swap exports for Appwrite fetch functions when going live.

| File            | Purpose                             | Exports                                                                                  |
| --------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| `menuData.ts`   | Dummy menu product data + type defs | `MenuCategory`, `MenuProduct` interface, `MENU_PRODUCTS` array (8 products: 4 coffee + 4 dessert) |

> **Firebase handoff:** Swap components or pages to load data directly from Firebase Firestore/Realtime Database if database-backed operations are added later.

---

### 3.4 Services

Located in `src/services/`. All services use the Appwrite SDK and pull config from `APPWRITE_CONFIG` in `src/lib/appwrite.ts`. **No IDs are hardcoded.**

| File                  | Purpose                                   | Key Methods                                                                                                                |
| --------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `auth.service.ts`     | All authentication operations             | `register()`, `login()`, `getCurrentUser()`, `logout()`, `isAuthenticated()`, `sendPasswordRecovery()`, `updatePassword()` |
| `products.service.ts` | Menu product data from Appwrite Database  | `getProducts(filters)`, `getProduct(id)`, `getBestSellers(limit)`, `getByCategory(category)`                               |
| `rewards.service.ts`  | Loyalty stamp data from Appwrite Database | `getUserStamps(userId)`, `getAvailableRewards()`                                                                           |

---

### 3.5 Hooks

Located in `src/hooks/`.

| File         | Purpose                                                                           | Returns                                         |
| ------------ | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| `useAuth.ts` | React hook for current auth state. Calls `authService.getCurrentUser()` on mount. | `{ user, isLoading, isAuthenticated, refetch }` |

---

### 3.6 Store

Located in `src/store/`. Uses **Zustand** for global state.

| File             | Purpose                                                                                          | State Shape                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `auth.store.ts`  | Global authentication state. Used across the app to read/write user session.                     | `{ user, isLoading, isAuthenticated, setUser(), initialize(), logout() }`                                                           |
| `cart.store.ts`  | **Cart state** — persisted to `localStorage` via Zustand `persist` middleware (key: `xviii-cart`). | `{ items: CartItem[], addToCart(), removeFromCart(), updateQuantity(), clearCart(), getTotalItems(), getSubtotal() }` |

**`CartItem` shape:**
```typescript
{ product: MenuProduct, quantity: number }
```

**`DELIVERY_FEE`** constant exported from `cart.store.ts` — flat ₹40. Update here when pricing changes.

> **Appwrite handoff:** `addToCart` currently stores a `MenuProduct` snapshot. When connecting Appwrite, the `product` field in `CartItem` can store the Appwrite document directly since it shares the same schema (`name`, `description`, `price`, `image`, `category`, `available`, `featured`, `stampReward`).

---

### 3.7 Types

Located in `src/types/`. Pure TypeScript interfaces — no runtime code.

| File               | Exports                                                      | Purpose                                     |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------- |
| `user.types.ts`    | `User`, `LoginCredentials`, `RegisterCredentials`            | User profile shape and auth form types      |
| `product.types.ts` | `Product`, `ProductCategory`, `ProductFilters`               | Menu product data shape and filter options  |
| `order.types.ts`   | `Order`, `OrderItem`, `OrderStatus`, `RewardStamp`, `Reward` | Order lifecycle and rewards programme types |

---

### 3.8 Constants

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

### 3.9 Utils

Located in `src/utils/helpers.ts`. Pure utility functions.

| Function        | Signature                                          | Purpose                                                           |
| --------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| `cn()`          | `(...classes) → string`                            | Merges class names conditionally (lightweight `clsx` alternative) |
| `formatPrice()` | `(amount: number) → string`                        | Formats number as Indian Rupee (₹) using `Intl.NumberFormat`      |
| `truncate()`    | `(text, maxLength) → string`                       | Truncates text with `...` at `maxLength` characters               |
| `getFileUrl()`  | `(fileId, bucketId, endpoint, projectId) → string` | Builds Appwrite Storage file preview URL                          |
| `wait()`        | `(ms: number) → Promise`                           | Async delay for animation sequencing                              |

---

### 3.10 Providers

Located in `src/providers/AppProviders.tsx`.

| File               | Purpose                                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppProviders.tsx` | Root providers wrapper. Mounts `<CartToast />` globally so the add-to-cart notification is available on every page. Add further React Context providers (auth context, theme, etc.) inside this wrapper without modifying `layout.tsx`. |

---

### 3.11 Lib

Located in `src/lib/`.

| File          | Purpose                                                                                                                      | Exports                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `appwrite.ts` | Appwrite SDK client singleton. Initialises `Client`, `Account`, `Databases`, `Storage`. Reads all config from `process.env`. | `account`, `databases`, `storage`, `APPWRITE_CONFIG`, `ID`, `Query`, `client (default)` |

**`APPWRITE_CONFIG` structure:**

```typescript
{
  databaseId: string,
  collections: {
    users, products, orders, rewards, coupons
  },
  storage: {
    bucketId: string
  }
}
```

---

### 3.12 Public Assets

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

### 3.13 Config Files

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

| Variable                                   | Required | Description                                            |
| ------------------------------------------ | -------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | ✅       | API key for your Firebase project                      |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | ✅       | Firebase authentication domain URL                     |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | ✅       | Firebase project ID                                    |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | ⬜       | Cloud Storage bucket name                              |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ⬜       | Messaging Sender ID                                    |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | ✅       | App ID for your Firebase Web App                       |

---

# XVIII Brew - Database Documentation (Canceled)

> **Status:** Canceled. The project does not use Appwrite for backend as a service. Product data and loyalty rewards are managed client-side via mock data layers to maintain frontend integrity.
