import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MenuHero from '@/components/menu/MenuHero';
import MenuGrid from '@/components/menu/MenuGrid';

// ─────────────────────────────────────────
// SEO Metadata
// ─────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Menu | The XVIII Brew Co.',
  description:
    'Explore our curated collection of specialty coffees and handcrafted desserts. Single-origin brews, precision-crafted beverages, and artisan confections.',
  alternates: {
    canonical: '/menu',
  },
  openGraph: {
    title: 'Menu | The XVIII Brew Co.',
    description:
      'Explore our curated collection of specialty coffees and handcrafted desserts.',
    type: 'website',
    locale: 'en_IN',
  },
};

// ─────────────────────────────────────────
// Menu Page — Server Component shell
// ─────────────────────────────────────────
// NOTE: Data fetching from Appwrite will happen here in the future.
//       Pass `products` as a prop to MenuGrid to connect live data.

export default function MenuPage() {
  return (
    <main className="bg-[#15110D] min-h-screen">
      <Navbar />

      {/* Hero */}
      <MenuHero />

      {/* Product Grid with Category Filter */}
      <MenuGrid />

      <Footer />
    </main>
  );
}
