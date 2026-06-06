# The XVIII Brew Co. — Project Documentation

> **Last Updated:** June 2026  
> **Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Appwrite  
> **Author:** XVIII Brew Co. Development Team

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Frontend — Full File Reference](#3-frontend--full-file-reference)
   - [App Directory (Pages & Layout)](#31-app-directory)
   - [Components](#32-components)
   - [Services (Appwrite)](#33-services)
   - [Hooks](#34-hooks)
   - [Store](#35-store)
   - [Types](#36-types)
   - [Constants](#37-constants)
   - [Utils](#38-utils)
   - [Providers](#39-providers)
   - [Lib](#310-lib)
   - [Public Assets](#311-public-assets)
   - [Config Files](#312-config-files)
4. [Design System](#4-design-system)
5. [Appwrite Integration Guide](#5-appwrite-integration-guide)
6. [Environment Variables](#6-environment-variables)
7. [Pages Reference](#7-pages-reference)
8. [Component Props Reference](#8-component-props-reference)
9. [Scripts](#9-scripts)

---

## 1. Project Overview

**The XVIII Brew Co.** is a premium luxury coffee and artisan dessert brand. This repository contains the full frontend web application — a Next.js 15+ app with a fully editorial, mobile-first design system, Appwrite backend integration, and a structured layered architecture.

**Brand personality:** Premium · Sophisticated · Editorial · Artisan · Community  
**Brand tagline:** *Something Has Been Steeping.*

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

| File | Route | Purpose |
|------|-------|---------|
| `layout.tsx` | — | Root layout. Sets global `<html>` metadata (SEO title, description, Open Graph), loads Cinzel from Google Fonts, applies `suppressHydrationWarning` on `<body>` to prevent browser-extension hydration errors |
| `globals.css` | — | Global CSS. Brand design tokens (CSS variables), Tailwind v4 layer setup, `.container-brand` utility, body word/letter-spacing resets, marquee animation, scrollbar styling, selection colours |
| `page.tsx` | `/` | Landing page. Imports and assembles all 8 section components in order: Navbar → Hero → Philosophy → BestSellers → Process → Rewards → MenuPreview → FinalCTA → Footer |
| `menu/page.tsx` | `/menu` | Menu listing page scaffold (full data integration pending) |
| `about/page.tsx` | `/about` | Brand story page scaffold |
| `contact/page.tsx` | `/contact` | Contact page scaffold |
| `rewards/page.tsx` | `/rewards` | Loyalty programme page scaffold |
| `login/page.tsx` | `/login` | Authentication page scaffold |
| `product/[id]/page.tsx` | `/product/:id` | Dynamic product detail page (server component, reads `params.id`) |

---

### 3.2 Components

#### Layout Components (`src/components/layout/`)

| File | Purpose | Key Features |
|------|---------|-------------|
| `Navbar.tsx` | Sticky top navigation bar | - Transparent on load, dark with `backdrop-blur` on scroll<br>- Logo (SVG inline) + text lockup on left<br>- Desktop nav links (Home, Menu, About, Rewards, Contact) with underline hover effect<br>- **Order Now** CTA button on right<br>- Mobile: hamburger toggle opens full-screen slide-in overlay menu with staggered Framer Motion animations<br>- Body scroll lock when mobile menu is open |
| `Footer.tsx` | Site-wide footer | - 4-column grid: Brand, Navigate, Contact, CTA<br>- Social links (Instagram SVG, WhatsApp via lucide `MessageCircle`)<br>- Copyright + brand tagline bar<br>- Responsive: stacks to 1→2→4 columns |

#### Section Components (`src/components/sections/`)

| File | Section ID | Background | Purpose & Design Notes |
|------|-----------|------------|------------------------|
| `HeroSection.tsx` | `#hero` | `#15110D` dark | **Landing hero.** Split 2-column grid. Left: animated typography (staggered `fadeUp` per element), eyebrow label, H1 headline "Crafted Coffee / Extraordinary Desserts", body copy, two CTA buttons, stats bar (18+, 100%, ∞). Right: parallax coffee image with `useScroll`/`useTransform`, dark gradient overlay, floating dessert card (**desktop only**, hidden on mobile with `hidden lg:block`). Bottom marquee ticker with infinite scroll. |
| `PhilosophySection.tsx` | `#philosophy` | `#15110D` dark | **Brand philosophy.** Word-by-word animated headline using `useInView` — each word in "We built The XVIII Brew Co. because we believe every cup should mean something." animates independently with staggered delay. Gold colour on brand name words. Three editorial pillars below (Craftsmanship · Integrity · Community) in a divided grid. |
| `BestSellersSection.tsx` | `#best-sellers` | `#EDE3D0` cream | **Best sellers.** Cream background section. 3-column rectangular editorial product cards. Each card: full `aspect-[4/5]` image with category tag, product name, price, description, and "View Details" link. Hover: image scale + name colour shift. Data sourced from `BEST_SELLERS` constant. |
| `ProcessSection.tsx` | `#process` | `#15110D` dark | **Our process.** 4 steps in alternating magazine layout (image left/text right, then text left/image right). Each step: large muted step number, large headline, horizontal rule divider, description paragraph. Steps: Bean Selection → The Roast → The Brew → Dessert Craft. |
| `RewardsSection.tsx` | `#rewards` | `#15110D` dark | **Loyalty rewards.** Animated digital stamp card (10 stamps, `STAMPS_PER_CARD` from constants). Collected stamps render filled `<Coffee>` icon; empty stamps render a hollow box. Animated progress bar. Three reward tier cards below (Free Coffee at 5, Free Dessert at 8, 20% Off at 10). Join CTA button. |
| `MenuPreviewSection.tsx` | `#menu-preview` | `#EDE3D0` cream | **Menu preview.** 3 large `aspect-[3/4]` image cards with full overlay — each links to the menu filtered by category (coffee, desserts, specials). Text overlaid at bottom of image with gradient background. Hover: image scale + arrow icon appear. Data from `MENU_CATEGORIES` constant. |
| `FinalCTASection.tsx` | `#final-cta` | `#15110D` dark | **Closing CTA.** Two-column layout: left has massive `clamp`-sized headline "Your Next Cup Awaits.", right has body copy + "Order Now" and "Find Us" buttons + brand tagline. Full editorial spacing. |

---

### 3.3 Services

Located in `src/services/`. All services use the Appwrite SDK and pull config from `APPWRITE_CONFIG` in `src/lib/appwrite.ts`. **No IDs are hardcoded.**

| File | Purpose | Key Methods |
|------|---------|-------------|
| `auth.service.ts` | All authentication operations | `register()`, `login()`, `getCurrentUser()`, `logout()`, `isAuthenticated()`, `sendPasswordRecovery()`, `updatePassword()` |
| `products.service.ts` | Menu product data from Appwrite Database | `getProducts(filters)`, `getProduct(id)`, `getBestSellers(limit)`, `getByCategory(category)` |
| `rewards.service.ts` | Loyalty stamp data from Appwrite Database | `getUserStamps(userId)`, `getAvailableRewards()` |

---

### 3.4 Hooks

Located in `src/hooks/`.

| File | Purpose | Returns |
|------|---------|---------|
| `useAuth.ts` | React hook for current auth state. Calls `authService.getCurrentUser()` on mount. | `{ user, isLoading, isAuthenticated, refetch }` |

---

### 3.5 Store

Located in `src/store/`. Uses **Zustand** for global state.

| File | Purpose | State Shape |
|------|---------|-------------|
| `auth.store.ts` | Global authentication state. Used across the app to read/write user session. | `{ user, isLoading, isAuthenticated, setUser(), initialize(), logout() }` |

---

### 3.6 Types

Located in `src/types/`. Pure TypeScript interfaces — no runtime code.

| File | Exports | Purpose |
|------|---------|---------|
| `user.types.ts` | `User`, `LoginCredentials`, `RegisterCredentials` | User profile shape and auth form types |
| `product.types.ts` | `Product`, `ProductCategory`, `ProductFilters` | Menu product data shape and filter options |
| `order.types.ts` | `Order`, `OrderItem`, `OrderStatus`, `RewardStamp`, `Reward` | Order lifecycle and rewards programme types |

---

### 3.7 Constants

Located in `src/constants/index.ts`. Single source of truth for all static brand content. **Change content here, not in components.**

| Export | Type | Contains |
|--------|------|---------|
| `BRAND` | object | Brand name, tagline, headline, email, phone, address, Instagram URL, WhatsApp URL |
| `NAV_LINKS` | array | All navigation link labels and `href` values |
| `STAMPS_PER_CARD` | number | Total stamps per loyalty card (10) |
| `STAMPS_FOR_FREE_DESSERT` | number | Stamps needed for free dessert reward (8) |
| `STAMPS_FOR_DISCOUNT` | number | Stamps needed for discount reward (5) |
| `PROCESS_STEPS` | array | All 4 process steps with step number, title, description, image path, and alt text |
| `BEST_SELLERS` | array | 3 best seller products with id, name, category, description, price, image path |
| `MENU_CATEGORIES` | array | 3 menu categories with id, label, description, image path, and href |

---

### 3.8 Utils

Located in `src/utils/helpers.ts`. Pure utility functions.

| Function | Signature | Purpose |
|----------|-----------|---------|
| `cn()` | `(...classes) → string` | Merges class names conditionally (lightweight `clsx` alternative) |
| `formatPrice()` | `(amount: number) → string` | Formats number as Indian Rupee (₹) using `Intl.NumberFormat` |
| `truncate()` | `(text, maxLength) → string` | Truncates text with `...` at `maxLength` characters |
| `getFileUrl()` | `(fileId, bucketId, endpoint, projectId) → string` | Builds Appwrite Storage file preview URL |
| `wait()` | `(ms: number) → Promise` | Async delay for animation sequencing |

---

### 3.9 Providers

Located in `src/providers/AppProviders.tsx`.

| File | Purpose |
|------|---------|
| `AppProviders.tsx` | Root providers wrapper component. Currently a passthrough. Extend this file to add React Context providers (theme, auth context, toast, etc.) without modifying `layout.tsx`. |

---

### 3.10 Lib

Located in `src/lib/`.

| File | Purpose | Exports |
|------|---------|---------|
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

### 3.11 Public Assets

Located in `frontend/public/images/`. All images are AI-generated editorial photography.

| File | Used In | Description |
|------|---------|-------------|
| `hero-coffee.png` | `HeroSection` (right column) | Premium espresso on dark surface |
| `hero-dessert.png` | Secondary reference | Dark chocolate tart on slate |
| `bestseller-latte.png` | `BestSellersSection` — The Noir Latte | Latte with rosette art, overhead |
| `bestseller-cake.png` | `BestSellersSection` + `HeroSection` floating card | Dark chocolate layer cake |
| `bestseller-coldbrew.png` | `BestSellersSection` — Cold Brew | Cold brew in tall glass with ice |
| `process-beans.png` | `ProcessSection` — Step 01 | Close-up macro of arabica beans |
| `process-roasting.png` | `ProcessSection` — Step 02 | Coffee roasting drum overhead |
| `process-brewing.png` | `ProcessSection` — Step 03 | Pour-over dripper with gooseneck kettle |
| `process-dessert.png` | `ProcessSection` — Step 04 | Chef piping chocolate ganache |
| `menu-coffee.png` | `MenuPreviewSection` — Coffee category | Multiple drinks arranged overhead |
| `menu-desserts.png` | `MenuPreviewSection` — Desserts category | Multiple desserts arranged overhead |
| `menu-specials.png` | `MenuPreviewSection` — Signature Specials | Signature cocktail-style coffee |

---

### 3.12 Config Files

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Tailwind v4 config. Extends brand colours (`brand.primary/secondary/tertiary`), editorial font families (`cinzel`, `helvetica`), `clamp`-based display font sizes, custom spacing values, letter-spacing tokens, and Framer Motion keyframes |
| `next.config.ts` | Next.js config. Adds `cloud.appwrite.io` to `remotePatterns` for `next/image`. Enables `optimizePackageImports` for `framer-motion` and `lucide-react` |
| `.env.example` | Template for all required environment variables (copy → `.env.local`) |
| `.gitignore` | Excludes `node_modules/`, `.next/`, all `.env*` files, `dist/`, `coverage/` |
| `tsconfig.json` | TypeScript config with `@/*` path alias mapping to `./src/*` |

---

## 4. Design System

### Colour Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| Primary | `#15110D` | `--brand-primary` | Dark espresso background, cards |
| Secondary | `#EDE3D0` | `--brand-secondary` | Cream text, light section backgrounds |
| Tertiary | `#B8956A` | `--brand-tertiary` | Gold accent — labels, icons, highlights |
| Primary Light | `#1e1812` | `--brand-primary-light` | Slightly lighter dark for cards |

### Typography

| Font | Variable | Usage |
|------|----------|-------|
| **Cinzel** (Google Fonts) | `--font-cinzel` | Accent serif — brand name in logo, select headings, luxury moments only |
| **Helvetica Neue** / Arial | `--font-helvetica` | All body copy, navigation, large headlines, product content |

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

## 5. Appwrite Integration Guide

### Step 1 — Create Appwrite Project
1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a new project
3. Copy the **Project ID**

### Step 2 — Create Database & Collections

Create one database with these collections:

| Collection | Fields |
|------------|--------|
| `users` | `name`, `email`, `phone`, `role`, `avatarUrl` |
| `products` | `name`, `description`, `price`, `category`, `imageUrl`, `isAvailable`, `isBestSeller`, `tags` |
| `orders` | `userId`, `items` (JSON), `totalAmount`, `status`, `addressId`, `notes` |
| `rewards` | `userId`, `stamps`, `totalStampsEarned`, `lastUpdated` |
| `coupons` | `code`, `type`, `value`, `isActive`, `expiresAt` |

### Step 3 — Fill `.env.local`
```bash
cp .env.example .env.local
# Fill all values
```

---

## 6. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | ✅ | Appwrite API endpoint (e.g. `https://cloud.appwrite.io/v1`) |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | ✅ | Your Appwrite project ID |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | ✅ | Your main database ID |
| `NEXT_PUBLIC_USERS_COLLECTION_ID` | ✅ | Users collection ID |
| `NEXT_PUBLIC_PRODUCTS_COLLECTION_ID` | ✅ | Products collection ID |
| `NEXT_PUBLIC_ORDERS_COLLECTION_ID` | ✅ | Orders collection ID |
| `NEXT_PUBLIC_REWARDS_COLLECTION_ID` | ✅ | Rewards/stamps collection ID |
| `NEXT_PUBLIC_COUPONS_COLLECTION_ID` | ⬜ | Coupons collection ID |
| `NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID` | ⬜ | Storage bucket for product images |

---

## 7. Pages Reference

| Route | File | Type | Status |
|-------|------|------|--------|
| `/` | `app/page.tsx` | Static | ✅ Complete |
| `/menu` | `app/menu/page.tsx` | Static | 🔧 Scaffold |
| `/product/[id]` | `app/product/[id]/page.tsx` | Dynamic (SSR) | 🔧 Scaffold |
| `/about` | `app/about/page.tsx` | Static | 🔧 Scaffold |
| `/contact` | `app/contact/page.tsx` | Static | 🔧 Scaffold |
| `/rewards` | `app/rewards/page.tsx` | Static | 🔧 Scaffold |
| `/login` | `app/login/page.tsx` | Static | 🔧 Scaffold |

> **🔧 Scaffold** = page structure and styling in place, full data/forms not yet connected.

---

## 8. Component Props Reference

### Section components
All section components are **zero-prop** — they import data from `src/constants/index.ts` directly. To change content (product names, descriptions, process steps), edit `constants/index.ts`.

### Navbar
- No props
- Internal state: `isScrolled` (boolean), `isMobileOpen` (boolean)

### Footer
- No props
- Reads `NAV_LINKS` and `BRAND` from constants

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
