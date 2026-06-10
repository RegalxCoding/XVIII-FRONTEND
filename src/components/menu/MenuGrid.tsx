'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/menu/ProductCard';
import { type MenuCategory, type MenuProduct } from '@/data/menuData';
import { useCartStore } from '@/store/cart.store';
import { fireCartToast } from '@/components/ui/CartToast';
import { productsService, mapProductToMenuProduct } from '@/services/products.service';

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
  const [allProducts, setAllProducts] = useState<MenuProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useCartStore((s) => s.addToCart);

  // Fetch products from Firebase on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchMenu() {
      try {
        setIsLoading(true);
        setError(null);
        const rawProducts = await productsService.getProducts({ isAvailable: true });
        if (isMounted) {
          const mapped = rawProducts.map(mapProductToMenuProduct);
          setAllProducts(mapped);
        }
      } catch (err: any) {
        console.error('Failed to load menu products from Firestore:', err);
        if (isMounted) {
          setError('Failed to load the menu catalog. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  // Build tab counts dynamically from Firestore data
  const tabs: FilterTab[] = useMemo(() => [
    { id: 'all',     label: 'All',      count: allProducts.length },
    { id: 'coffee',  label: 'Coffee',   count: allProducts.filter(p => p.category === 'coffee').length },
    { id: 'dessert', label: 'Desserts', count: allProducts.filter(p => p.category === 'dessert').length },
  ], [allProducts]);

  // Filtered products
  const products: MenuProduct[] = useMemo(() => {
    if (activeFilter === 'all') return allProducts;
    return allProducts.filter(p => p.category === activeFilter);
  }, [allProducts, activeFilter]);

  // Add to cart handler — connected to Zustand + toast
  const handleAdd = (product: MenuProduct) => {
    addToCart(product);
    fireCartToast(product.name);
  };

  if (isLoading) {
    return (
      <section id="menu-grid" className="py-20 lg:py-28">
        <div className="container-brand">
          {/* Tab skeleton */}
          <div className="mb-16 lg:mb-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-px bg-[#B8956A]/20" />
              <div className="w-28 h-3 bg-[#B8956A]/10 animate-pulse rounded" />
            </div>
            <div className="flex gap-4">
              <div className="w-24 h-10 bg-[#B8956A]/5 border border-[#B8956A]/10 animate-pulse" />
              <div className="w-28 h-10 bg-[#B8956A]/5 border border-[#B8956A]/10 animate-pulse" />
              <div className="w-28 h-10 bg-[#B8956A]/5 border border-[#B8956A]/10 animate-pulse" />
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col bg-[#1a1410]/50 border border-[#B8956A]/10 animate-pulse overflow-hidden"
                style={{ height: '480px' }}
              >
                {/* Image skeleton */}
                <div className="w-full bg-[#15110d]/40 flex-shrink-0" style={{ aspectRatio: '4/5' }} />
                {/* Content skeleton */}
                <div className="flex flex-col flex-1 p-6 lg:p-7 gap-4">
                  <div className="flex justify-between items-center">
                     <div className="w-2/3 h-5 bg-[#EDE3D0]/10 rounded" />
                     <div className="w-12 h-5 bg-[#B8956A]/10 rounded" />
                  </div>
                  <div className="w-6 h-px bg-[#B8956A]/20" />
                  <div className="w-full h-4 bg-[#EDE3D0]/5 rounded" />
                  <div className="w-5/6 h-4 bg-[#EDE3D0]/5 rounded" />
                  <div className="w-20 h-8 mt-auto bg-[#B8956A]/5 border border-[#B8956A]/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu-grid" className="py-32 text-center bg-[#15110D]">
        <div className="container-brand">
          <div className="w-12 h-px bg-[#B8956A]/30 mx-auto mb-8" />
          <p
            className="text-[#EDE3D0]/60 text-sm tracking-[0.2em] uppercase mb-8"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="
              inline-flex items-center gap-2
              border border-[#B8956A] text-[#B8956A]
              px-7 py-3.5 text-xs tracking-[0.2em] uppercase font-medium
              hover:bg-[#B8956A] hover:text-[#15110D]
              transition-all duration-300
            "
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

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
