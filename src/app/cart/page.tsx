'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Calendar, Clock, AlertCircle, Coffee, Cake } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartItemRow from '@/components/cart/CartItemRow';
import OrderSummary from '@/components/cart/OrderSummary';
import DessertSlotModal from '@/components/menu/DessertSlotModal';
import { useCartStore } from '@/store/cart.store';
import { useSlotValidation } from '@/hooks/useSlotValidation';
import { getRelativeDateLabel } from '@/utils/timeSlots';
import type { DessertSlot } from '@/utils/timeSlots';

const ease = [0.22, 1, 0.36, 1] as const;

// ─────────────────────────────────────────
// CartPage — full client component
// ─────────────────────────────────────────

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const dessertSlot = useCartStore((s) => s.dessertSlot);
  const setDessertSlot = useCartStore((s) => s.setDessertSlot);
  const coffeeDeliveryMode = useCartStore((s) => s.coffeeDeliveryMode);
  const setCoffeeDeliveryMode = useCartStore((s) => s.setCoffeeDeliveryMode);
  const hasDesserts = useCartStore((s) => s.hasDesserts);
  const hasCoffee = useCartStore((s) => s.hasCoffee);
  const isMixedOrder = useCartStore((s) => s.isMixedOrder);

  const isEmpty = items.length === 0;

  // Detect expired slot on mount — clears it and returns wasExpired flag
  const { wasExpired } = useSlotValidation();

  // Edit slot modal state
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSlotEdit = (_product: import('@/data/menuData').MenuProduct | null, slot: DessertSlot) => {
    setDessertSlot(slot);
    setShowEditModal(false);
  };

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

          {/* ── Expired Slot Banner ── */}
          <AnimatePresence>
            {wasExpired && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease }}
                className="flex items-start gap-4 p-5 mb-8"
                style={{
                  background: 'rgba(251,146,60,0.08)',
                  border: '1px solid rgba(251,146,60,0.25)',
                }}
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#fb923c' }} />
                <div className="flex-1">
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
                  >
                    Your delivery slot has expired.
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(237,227,208,0.5)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    Please select a new delivery time for your desserts before proceeding.
                  </p>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex-shrink-0 px-4 py-2 text-xs tracking-[0.15em] uppercase font-bold transition-colors"
                  style={{
                    background: 'rgba(251,146,60,0.15)',
                    border: '1px solid rgba(251,146,60,0.3)',
                    color: '#fb923c',
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  }}
                >
                  Select New Slot
                </button>
              </motion.div>
            )}
          </AnimatePresence>

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

                  {/* ── Dessert Delivery Slot Banner ── */}
                  {hasDesserts() && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease }}
                      className="mt-8 p-5"
                      style={{
                        background: dessertSlot
                          ? 'rgba(184,149,106,0.08)'
                          : 'rgba(255,255,255,0.02)',
                        border: dessertSlot
                          ? '1px solid rgba(184,149,106,0.25)'
                          : '1px solid rgba(251,146,60,0.2)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Calendar
                            size={16}
                            className="flex-shrink-0 mt-0.5"
                            style={{ color: dessertSlot ? '#B8956A' : '#fb923c' }}
                          />
                          <div>
                            <p
                              className="text-[10px] tracking-[0.2em] uppercase mb-1"
                              style={{
                                color: 'rgba(237,227,208,0.35)',
                                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                              }}
                            >
                              Dessert Delivery
                            </p>
                            {dessertSlot ? (
                              <p
                                className="text-sm font-medium"
                                style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
                              >
                                {getRelativeDateLabel(dessertSlot.isoDate)}
                                <span className="text-[#B8956A] mx-2">·</span>
                                {dessertSlot.time}
                              </p>
                            ) : (
                              <p
                                className="text-sm"
                                style={{ color: 'rgba(251,146,60,0.8)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                              >
                                No delivery slot selected
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          id="edit-slot-btn"
                          onClick={() => setShowEditModal(true)}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-[0.15em] uppercase transition-all duration-200"
                          style={{
                            border: '1px solid rgba(184,149,106,0.25)',
                            color: '#B8956A',
                            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(184,149,106,0.1)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <Clock size={11} />
                          {dessertSlot ? 'Edit Slot' : 'Select Slot'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Mixed Order: Coffee Delivery Mode ── */}
                  {isMixedOrder() && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease, delay: 0.05 }}
                      className="mt-4 p-5"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(184,149,106,0.15)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Coffee size={15} style={{ color: '#B8956A' }} />
                        <p
                          className="text-[10px] tracking-[0.2em] uppercase"
                          style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                        >
                          When should we deliver your coffee?
                        </p>
                      </div>

                      <div className="space-y-2">
                        {/* Option 1: Immediate */}
                        <button
                          id="coffee-mode-immediate"
                          onClick={() => setCoffeeDeliveryMode('immediate')}
                          className="w-full flex items-start gap-4 p-4 text-left transition-all duration-200"
                          style={{
                            background: coffeeDeliveryMode === 'immediate'
                              ? 'rgba(184,149,106,0.12)'
                              : 'rgba(255,255,255,0.02)',
                            border: coffeeDeliveryMode === 'immediate'
                              ? '1px solid rgba(184,149,106,0.4)'
                              : '1px solid rgba(184,149,106,0.1)',
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                            style={{
                              border: coffeeDeliveryMode === 'immediate'
                                ? '2px solid #B8956A'
                                : '2px solid rgba(184,149,106,0.3)',
                              background: coffeeDeliveryMode === 'immediate' ? '#B8956A' : 'transparent',
                            }}
                          >
                            {coffeeDeliveryMode === 'immediate' && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#15110D]" />
                            )}
                          </div>
                          <div>
                            <p
                              className="text-sm font-medium mb-1"
                              style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
                            >
                              ☕ Deliver coffee immediately
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                            >
                              Coffee arrives as soon as it's ready. Dessert follows your scheduled slot.
                            </p>
                          </div>
                        </button>

                        {/* Option 2: With dessert */}
                        <button
                          id="coffee-mode-with-dessert"
                          onClick={() => setCoffeeDeliveryMode('withDessert')}
                          className="w-full flex items-start gap-4 p-4 text-left transition-all duration-200"
                          style={{
                            background: coffeeDeliveryMode === 'withDessert'
                              ? 'rgba(184,149,106,0.12)'
                              : 'rgba(255,255,255,0.02)',
                            border: coffeeDeliveryMode === 'withDessert'
                              ? '1px solid rgba(184,149,106,0.4)'
                              : '1px solid rgba(184,149,106,0.1)',
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                            style={{
                              border: coffeeDeliveryMode === 'withDessert'
                                ? '2px solid #B8956A'
                                : '2px solid rgba(184,149,106,0.3)',
                              background: coffeeDeliveryMode === 'withDessert' ? '#B8956A' : 'transparent',
                            }}
                          >
                            {coffeeDeliveryMode === 'withDessert' && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#15110D]" />
                            )}
                          </div>
                          <div>
                            <p
                              className="text-sm font-medium mb-1"
                              style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
                            >
                              🍰 Deliver with my dessert
                              {dessertSlot && (
                                <span
                                  className="ml-2 text-xs font-normal"
                                  style={{ color: '#B8956A' }}
                                >
                                  ({getRelativeDateLabel(dessertSlot.isoDate)} · {dessertSlot.time})
                                </span>
                              )}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                            >
                              Everything arrives together at your scheduled dessert slot.
                            </p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}

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

      {/* ── Edit Slot Modal ── */}
      {showEditModal && (
        <DessertSlotModal
          product={null}
          onConfirm={handleSlotEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </main>
  );
}
