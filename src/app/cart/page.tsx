'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartItemRow from '@/components/cart/CartItemRow';
import OrderSummary from '@/components/cart/OrderSummary';
import { useCartStore } from '@/store/cart.store';

const ease = [0.22, 1, 0.36, 1] as const;

// ─────────────────────────────────────────
// CartPage — full client component
// (Zustand requires client context)
// ─────────────────────────────────────────

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const isEmpty = items.length === 0;

  return (
    <main className="bg-[#15110D] min-h-screen">
      <Navbar />

      {/* ── Page Header ── */}
      <section
        id="cart-header"
        className="relative bg-[#15110D] overflow-hidden"
        style={{ paddingTop: '8rem', paddingBottom: '4rem' }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[#B8956A]/20" />

        {/* Ghost background text */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
          aria-hidden="true"
        >
          <span
            className="text-[#EDE3D0]/[0.02] font-bold leading-none"
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(10rem, 16vw, 20rem)' }}
          >
            Cart
          </span>
        </div>

        <div className="container-brand relative z-10">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-10 h-px bg-[#B8956A]" />
            <span
              className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Your Selection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="text-[#EDE3D0] leading-[0.92] tracking-tight mb-6"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              fontWeight: 700,
            }}
          >
            Your Selection
            <span className="text-[#B8956A]" style={{ fontFamily: 'Georgia, serif' }}>.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.25 }}
            className="text-[#EDE3D0]/45 max-w-sm leading-relaxed"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            }}
          >
            Every item chosen with intention.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#B8956A]/10" />
      </section>

      {/* ── Cart Body ── */}
      <section id="cart-body" className="py-16 lg:py-24">
        <div className="container-brand">

          <AnimatePresence mode="wait">

            {/* ── Empty State ── */}
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                {/* Icon */}
                <div className="w-20 h-20 flex items-center justify-center border border-[#B8956A]/20 mb-10">
                  <ShoppingBag size={28} strokeWidth={1} className="text-[#B8956A]/40" />
                </div>

                <div className="w-12 h-px bg-[#B8956A]/25 mb-8" />

                <h2
                  className="text-[#EDE3D0]/60 mb-4"
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  }}
                >
                  No items selected yet.
                </h2>
                <p
                  className="text-[#EDE3D0]/35 max-w-xs leading-relaxed mb-12"
                  style={{
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    fontSize: '0.9rem',
                  }}
                >
                  Explore our menu and discover your next favourite brew.
                </p>

                <Link
                  href="/menu"
                  id="empty-cart-browse-btn"
                  className="
                    inline-flex items-center gap-3
                    bg-[#B8956A] text-[#15110D]
                    px-8 py-4 text-xs tracking-[0.25em] uppercase font-bold
                    hover:bg-[#EDE3D0] transition-all duration-300 group
                  "
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Browse Menu
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>

            ) : (

              /* ── Cart Content ── */
              <motion.div
                key="filled"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
                className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start"
              >

                {/* ── Left: Cart Items ── */}
                <div>
                  {/* Items header */}
                  <div className="flex items-center justify-between pb-6 border-b border-[#B8956A]/15 mb-2">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-px bg-[#B8956A]" />
                      <span
                        className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      >
                        {items.length} Item{items.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Clear cart */}
                    <button
                      id="clear-cart-btn"
                      onClick={clearCart}
                      className="
                        text-[#EDE3D0]/30 text-[10px] tracking-[0.2em] uppercase
                        hover:text-[#B8956A] transition-colors duration-300
                        border-b border-transparent hover:border-[#B8956A]/40
                      "
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Item list */}
                  <AnimatePresence initial={false}>
                    {items.map((item, i) => (
                      <CartItemRow key={item.product.id} item={item} index={i} />
                    ))}
                  </AnimatePresence>

                  {/* Continue shopping */}
                  <div className="mt-10">
                    <Link
                      href="/menu"
                      id="continue-shopping-link"
                      className="
                        inline-flex items-center gap-2
                        text-[#EDE3D0]/40 text-[10px] tracking-[0.25em] uppercase
                        hover:text-[#B8956A] transition-colors duration-300
                        border-b border-transparent hover:border-[#B8956A]/40
                      "
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      ← Continue Browsing
                    </Link>
                  </div>
                </div>

                {/* ── Right: Order Summary ── */}
                <OrderSummary />

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      <Footer />
    </main>
  );
}
