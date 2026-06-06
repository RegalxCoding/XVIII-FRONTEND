# The XVIII Brew Co. — Project Documentation

> **Last Updated:** 6 June 2026  
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
| `layout.tsx`            | —              | Root layout. Sets global `<html>` metadata (SEO title, description, Open Graph), loads Cinzel from Google Fonts, applies `suppressHydrationWarning` on `<body>` to prevent browser-extension hydration errors |
| `globals.css`           | —              | Global CSS. Brand design tokens (CSS variables), Tailwind v4 layer setup, `.container-brand` utility, body word/letter-spacing resets, marquee animation, scrollbar styling, selection colours                |
| `page.tsx`              | `/`            | Landing page. Imports and assembles all 8 section components in order: Navbar → Hero → Philosophy → BestSellers → Process → Rewards → MenuPreview → FinalCTA → Footer                                         |
| `menu/page.tsx`         | `/menu`        | Menu listing page scaffold (full data integration pending)                                                                                                                                                    |
| `about/page.tsx`        | `/about`       | Brand story page scaffold                                                                                                                                                                                     |
| `contact/page.tsx`      | `/contact`     | Contact page scaffold                                                                                                                                                                                         |
| `rewards/page.tsx`      | `/rewards`     | Loyalty programme page scaffold                                                                                                                                                                               |
| `login/page.tsx`        | `/login`       | Authentication page scaffold                                                                                                                                                                                  |
| `product/[id]/page.tsx` | `/product/:id` | Dynamic product detail page (server component, reads `params.id`)                                                                                                                                             |

---

### 3.2 Components

#### Layout Components (`src/components/layout/`)

| File         | Purpose                   | Key Features                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Navbar.tsx` | Sticky top navigation bar | - Transparent on load, dark with `backdrop-blur` on scroll<br>- Logo SVG container: **`w-14 h-14` (56 px)** — increased from 40 px for better visibility<br>- Logo (SVG inline) + text lockup on left<br>- Desktop nav links (Home, Menu, About, Rewards, Contact) with underline hover effect<br>- **Order Now** CTA button on right<br>- Mobile: hamburger toggle opens full-screen slide-in overlay menu with staggered Framer Motion animations<br>- Body scroll lock when mobile menu is open |
| `Footer.tsx` | Site-wide footer          | - 4-column grid: Brand, Navigate, Contact, CTA<br>- Social links (Instagram SVG, WhatsApp via lucide `MessageCircle`)<br>- Copyright + brand tagline bar<br>- Responsive: stacks to 1→2→4 columns                                                                                                                                                                                                                                                                                                  |

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

### 3.3 Services

Located in `src/services/`. All services use the Appwrite SDK and pull config from `APPWRITE_CONFIG` in `src/lib/appwrite.ts`. **No IDs are hardcoded.**

| File                  | Purpose                                   | Key Methods                                                                                                                |
| --------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `auth.service.ts`     | All authentication operations             | `register()`, `login()`, `getCurrentUser()`, `logout()`, `isAuthenticated()`, `sendPasswordRecovery()`, `updatePassword()` |
| `products.service.ts` | Menu product data from Appwrite Database  | `getProducts(filters)`, `getProduct(id)`, `getBestSellers(limit)`, `getByCategory(category)`                               |
| `rewards.service.ts`  | Loyalty stamp data from Appwrite Database | `getUserStamps(userId)`, `getAvailableRewards()`                                                                           |

---

### 3.4 Hooks

Located in `src/hooks/`.

| File         | Purpose                                                                           | Returns                                         |
| ------------ | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| `useAuth.ts` | React hook for current auth state. Calls `authService.getCurrentUser()` on mount. | `{ user, isLoading, isAuthenticated, refetch }` |

---

### 3.5 Store

Located in `src/store/`. Uses **Zustand** for global state.

| File            | Purpose                                                                      | State Shape                                                               |
| --------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `auth.store.ts` | Global authentication state. Used across the app to read/write user session. | `{ user, isLoading, isAuthenticated, setUser(), initialize(), logout() }` |

---

### 3.6 Types

Located in `src/types/`. Pure TypeScript interfaces — no runtime code.

| File               | Exports                                                      | Purpose                                     |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------- |
| `user.types.ts`    | `User`, `LoginCredentials`, `RegisterCredentials`            | User profile shape and auth form types      |
| `product.types.ts` | `Product`, `ProductCategory`, `ProductFilters`               | Menu product data shape and filter options  |
| `order.types.ts`   | `Order`, `OrderItem`, `OrderStatus`, `RewardStamp`, `Reward` | Order lifecycle and rewards programme types |

---

### 3.7 Constants

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

### 3.8 Utils

Located in `src/utils/helpers.ts`. Pure utility functions.

| Function        | Signature                                          | Purpose                                                           |
| --------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| `cn()`          | `(...classes) → string`                            | Merges class names conditionally (lightweight `clsx` alternative) |
| `formatPrice()` | `(amount: number) → string`                        | Formats number as Indian Rupee (₹) using `Intl.NumberFormat`      |
| `truncate()`    | `(text, maxLength) → string`                       | Truncates text with `...` at `maxLength` characters               |
| `getFileUrl()`  | `(fileId, bucketId, endpoint, projectId) → string` | Builds Appwrite Storage file preview URL                          |
| `wait()`        | `(ms: number) → Promise`                           | Async delay for animation sequencing                              |

---

### 3.9 Providers

Located in `src/providers/AppProviders.tsx`.

| File               | Purpose                                                                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppProviders.tsx` | Root providers wrapper component. Currently a passthrough. Extend this file to add React Context providers (theme, auth context, toast, etc.) without modifying `layout.tsx`. |

---

### 3.10 Lib

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

### 3.11 Public Assets

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

---

### 3.12 Config Files

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

## 5. Appwrite Integration Guide

### Step 1 — Create Appwrite Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a new project
3. Copy the **Project ID**

### Step 2 — Create Database & Collections

Create one database with these collections:

| Collection | Fields                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------- |
| `users`    | `name`, `email`, `phone`, `role`, `avatarUrl`                                                 |
| `products` | `name`, `description`, `price`, `category`, `imageUrl`, `isAvailable`, `isBestSeller`, `tags` |
| `orders`   | `userId`, `items` (JSON), `totalAmount`, `status`, `addressId`, `notes`                       |
| `rewards`  | `userId`, `stamps`, `totalStampsEarned`, `lastUpdated`                                        |
| `coupons`  | `code`, `type`, `value`, `isActive`, `expiresAt`                                              |

### Step 3 — Fill `.env.local`

```bash
cp .env.example .env.local
# Fill all values
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

| Route           | File                        | Type          | Status      |
| --------------- | --------------------------- | ------------- | ----------- |
| `/`             | `app/page.tsx`              | Static        | ✅ Complete |
| `/menu`         | `app/menu/page.tsx`         | Static        | 🔧 Scaffold |
| `/product/[id]` | `app/product/[id]/page.tsx` | Dynamic (SSR) | 🔧 Scaffold |
| `/about`        | `app/about/page.tsx`        | Static        | 🔧 Scaffold |
| `/contact`      | `app/contact/page.tsx`      | Static        | 🔧 Scaffold |
| `/rewards`      | `app/rewards/page.tsx`      | Static        | 🔧 Scaffold |
| `/login`        | `app/login/page.tsx`        | Static        | 🔧 Scaffold |

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

---

## 10. Changelog

A running log of all significant frontend changes. Most recent first.

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

# XVIII Brew - Database Documentation

## Overview

The project uses Appwrite Database to manage products, users, orders, rewards, and customer information.

The database is designed to support:

- Coffee & Dessert Menu Management
- Customer Accounts
- Order Management
- Loyalty Rewards System
- Admin Dashboard
- Future Payment Integration

---

# 1. Products Collection

## Purpose

Stores all products available in the cafe.

Examples:

- Noir Latte
- Cappuccino
- Cheesecake
- Brownie

## Attributes

### name (Text)

Stores product name.

Example:

```text
Noir Latte
```

### description (Text)

Stores detailed product description.

Used on product pages and menu cards.

### price (Integer)

Stores product price.

Example:

```text
380
```

Integer is used instead of text to allow calculations.

### category (Text)

Groups products into categories.

Examples:

```text
Coffee
Dessert
Cold Brew
```

### image (Text)

Stores image URL or Appwrite Storage file reference.

### available (Boolean)

Controls stock availability.

Example:

```text
true
```

Product can be ordered.

```text
false
```

Product appears as Out of Stock.

### featured (Boolean)

Used for homepage featured products section.

### stampReward (Integer)

Defines how many loyalty stamps are awarded when purchasing the product.

---

# 2. Users Collection

## Purpose

Stores customer profile information.

Created after successful authentication.

## Attributes

### name (Text)

Customer full name.

### phone (Text)

Customer mobile number.

Used for login and order communication.

### email (Text)

Optional customer email.

### appwriteUserId (Text)

Links database user record to Appwrite Authentication account.

Important for identifying users.

### role (Text)

Defines user type.

Values:

```text
customer
admin
```

Used to control access.

Customer:

- Browse menu
- Place orders
- Collect rewards

Admin:

- Manage products
- Manage orders
- View customers
- Manage rewards

### stampCount (Integer)

Tracks collected loyalty stamps.

Example:

```text
5
```

### loyaltyPoints (Integer)

Tracks reward points.

Useful for future reward programs.

### isActive (Boolean)

Indicates whether account is active.

---

# 3. Categories Collection

## Purpose

Stores menu categories.

Avoids hardcoding categories inside frontend.

## Attributes

### name (Text)

Category name.

Examples:

```text
Coffee
Desserts
Cold Brew
```

### image (Text)

Category image.

### active (Boolean)

Controls visibility of category.

---

# 4. Orders Collection

## Purpose

Stores customer orders.

Each order represents one checkout.

## Attributes

### userId (Text)

References the customer who placed the order.

### customerName (Text)

Stores customer name at order time.

Useful even if user later changes profile.

### customerPhone (Text)

Stores contact number for order.

### totalAmount (Integer)

Stores total order value.

Example:

```text
780
```

### status (Text)

Current order status.

Values:

```text
Pending
Preparing
Ready
Delivered
Cancelled
```

### paymentMethod (Text)

Current values:

```text
COD
```

Future:

```text
Razorpay
UPI
Card
```

### address (Text)

Delivery address.

### pincode (Text)

Stores delivery pincode.

Used for:

- Delivery validation
- Order records
- Analytics

### stampEarned (Integer)

Stores stamps earned from this order.

### notes (Text)

Special customer instructions.

Example:

```text
Less sugar
```

---

# 5. Order Items Collection

## Purpose

Stores products belonging to an order.

One order can contain multiple products.

## Attributes

### orderId (Text)

References parent order.

### productId (Text)

References product.

### productName (Text)

Stores product name at purchase time.

Useful if product name changes later.

### quantity (Integer)

Number of items ordered.

### price (Integer)

Price at purchase time.

### subtotal (Integer)

Calculated value.

Example:

```text
quantity × price
```

---

# 6. Addresses Collection

## Purpose

Stores saved customer addresses.

Allows users to reuse addresses.

## Attributes

### userId (Text)

References owner of address.

### fullAddress (Text)

Complete delivery address.

### city (Text)

City name.

### state (Text)

State name.

### pincode (Text)

Delivery pincode.

Used for delivery validation.

### isDefault (Boolean)

Indicates default delivery address.

---

# 7. Rewards Collection

## Purpose

Stores loyalty reward definitions.

Admin can create and modify rewards without code changes.

## Attributes

### title (Text)

Reward name.

Example:

```text
Free Coffee
```

### requiredStamps (Integer)

Number of stamps required.

Example:

```text
5
```

### rewardType (Text)

Type of reward.

Examples:

```text
FREE_PRODUCT
DISCOUNT_PERCENTAGE
DISCOUNT_AMOUNT
```

### value (Integer)

Reward value.

Examples:

```text
10
```

for 10% discount.

```text
100
```

for ₹100 discount.

### active (Boolean)

Controls reward availability.

---

# Future Collections (Optional)

These collections can be added later if required:

- coupons
- serviceable_pincodes
- notifications
- analytics
- reviews

These are not required for Version 1 launch.

---

# Database Flow

Customer
↓
Users
↓
Addresses
↓
Orders
↓
Order Items

Products
↓
Categories

Users
↓
Rewards

Admin
↓
Products
Orders
Customers
Rewards
