'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/menu/ProductCard';
import { MENU_PRODUCTS, type MenuCategory, type MenuProduct } from '@/data/menuData';
import { useCartStore } from '@/store/cart.store';
import { fireCartToast } from '@/components/ui/CartToast';

// ─────────────────────────────────────────
// Filter Tab definition
// ─────────────────────────────────────────

type FilterOption = 'all' | MenuCategory;

interface FilterTab {
  id: FilterOption;
  label: string;
  count: number;
}

// ─────────────────────────────────────────
// MenuGrid — client component with filter state
// ─────────────────────────────────────────

export default function MenuGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const addToCart = useCartStore((s) => s.addToCart);

  // Build tab counts from current data (will reflect Appwrite data once connected)
  const tabs: FilterTab[] = useMemo(() => [
    { id: 'all',     label: 'All',      count: MENU_PRODUCTS.filter(p => p.available).length },
    { id: 'coffee',  label: 'Coffee',   count: MENU_PRODUCTS.filter(p => p.category === 'coffee'  && p.available).length },
    { id: 'dessert', label: 'Desserts', count: MENU_PRODUCTS.filter(p => p.category === 'dessert' && p.available).length },
  ], []);

  // Filtered products
  const products: MenuProduct[] = useMemo(() => {
    const available = MENU_PRODUCTS.filter(p => p.available);
    if (activeFilter === 'all') return available;
    return available.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  // Add to cart handler — connected to Zustand + toast
  const handleAdd = (product: MenuProduct) => {
    addToCart(product);
    fireCartToast(product.name);
  };

  return (
    <section id="menu-grid" className="py-20 lg:py-28">
      <div className="container-brand">

        {/* ── Category Filter Tabs ── */}
        <div className="mb-16 lg:mb-20">

          {/* Editorial label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-px bg-[#B8956A]" />
            <span
              className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Browse Collection
            </span>
          </div>

          {/* Filter tabs */}
          <div
            className="flex items-center gap-0 border border-[#B8956A]/15 w-fit"
            role="tablist"
            aria-label="Menu category filter"
          >
            {tabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`filter-tab-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`
                    relative px-7 py-3.5 flex items-center gap-3
                    text-[10px] tracking-[0.2em] uppercase font-medium
                    transition-all duration-300
                    border-r border-[#B8956A]/15 last:border-r-0
                    ${isActive
                      ? 'bg-[#B8956A] text-[#15110D]'
                      : 'text-[#EDE3D0]/50 hover:text-[#EDE3D0] hover:bg-[#B8956A]/8'
                    }
                  `}
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {tab.label}
                  {/* Count badge */}
                  <span
                    className={`
                      text-[9px] font-bold leading-none
                      ${isActive ? 'text-[#15110D]/60' : 'text-[#B8956A]/60'}
                    `}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Product Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
                {products.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    onAdd={handleAdd}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-32">
                <div className="w-12 h-px bg-[#B8956A]/30 mx-auto mb-8" />
                <p
                  className="text-[#EDE3D0]/30 text-sm tracking-[0.2em] uppercase"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Nothing here yet.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom rule ── */}
        <div className="mt-20 pt-8 border-t border-[#B8956A]/10 flex items-center justify-between">
          <p
            className="text-[#EDE3D0]/20 text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            {products.length} item{products.length !== 1 ? 's' : ''} shown
          </p>
          <span
            className="text-[#B8956A]/30 text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            ✦
          </span>
          <p
            className="text-[#EDE3D0]/20 text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            The XVIII Brew Co.
          </p>
        </div>

      </div>
    </section>
  );
}
