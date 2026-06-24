'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { useCartStore, DELIVERY_FEE } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { userService } from '@/services/user.service';
import { getRelativeDateLabel } from '@/utils/timeSlots';
import EmailCaptureModal from '@/components/checkout/EmailCaptureModal';

// ─────────────────────────────────────────
// OrderSummary — sticky sidebar on desktop
// ─────────────────────────────────────────

export default function OrderSummary() {
  const router = useRouter();
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const items = useCartStore((s) => s.items);
  const dessertSlot = useCartStore((s) => s.dessertSlot);
  const coffeeDeliveryMode = useCartStore((s) => s.coffeeDeliveryMode);
  const hasDesserts = useCartStore((s) => s.hasDesserts);
  const isMixedOrder = useCartStore((s) => s.isMixedOrder);
  const isSlotValid = useCartStore((s) => s.isSlotValid);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const subtotal = getSubtotal();
  const total = subtotal + DELIVERY_FEE;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const isEmpty = items.length === 0;

  // ── Checkout gate logic ──
  const needsSlot = hasDesserts() && (!dessertSlot || !isSlotValid());
  const needsCoffeeMode = isMixedOrder() && !coffeeDeliveryMode;
  const canCheckout = !isEmpty && !needsSlot && !needsCoffeeMode;

  const handleCheckout = async () => {
    if (!canCheckout) return;

    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    setIsCheckingAuth(true);
    try {
      // Check fresh profile
      const profile = await userService.getUserProfile(user.$id || user.uid);
      if (profile && profile.email) {
        // Has email, proceed directly
        router.push('/checkout');
      } else {
        // No email found
        setShowEmailModal(true);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      router.push('/checkout');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleEmailContinue = async (email: string) => {
    if (!user) return;
    try {
      await userService.updateUserEmail(user.$id || user.uid, email);
      setUser({ ...user, email });
      setShowEmailModal(false);
      router.push('/checkout');
    } catch (error) {
      console.error('Failed to save email:', error);
      throw error;
    }
  };

  const handleEmailSkip = () => {
    setShowEmailModal(false);
    router.push('/checkout');
  };

  // Helper text for blocked states
  const blockingReason = needsSlot
    ? 'Select a delivery slot for your dessert'
    : needsCoffeeMode
      ? 'Choose when to deliver your coffee'
      : null;

  return (
    <aside
      id="order-summary"
      className="
        lg:sticky lg:top-32
        bg-[#1a1410] border border-[#B8956A]/15
        p-8 lg:p-10
        self-start
      "
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-6 h-px bg-[#B8956A]" />
        <h2
          className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          Order Summary
        </h2>
      </div>

      {/* Line items */}
      <div className="space-y-4 mb-6">

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span
            className="text-[#EDE3D0]/60 text-sm"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Subtotal
            <span className="text-[#EDE3D0]/30 text-[10px] ml-1">
              ({itemCount} item{itemCount !== 1 ? 's' : ''})
            </span>
          </span>
          <span
            className="text-[#EDE3D0] font-medium text-sm"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Delivery */}
        <div className="flex items-center justify-between">
          <span
            className="text-[#EDE3D0]/60 text-sm"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Delivery
          </span>
          <span
            className={`text-sm font-medium ${isEmpty ? 'text-[#EDE3D0]/30' : 'text-[#EDE3D0]'}`}
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            {isEmpty ? '—' : `₹${DELIVERY_FEE}`}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#B8956A]/15 mb-6" />

      {/* ── Dessert scheduling summary (shown in sidebar) ── */}
      {hasDesserts() && dessertSlot && isSlotValid() && (
        <div
          className="mb-6 p-3 flex items-start gap-3"
          style={{ background: 'rgba(184,149,106,0.06)', border: '1px solid rgba(184,149,106,0.15)' }}
        >
          <Calendar size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#B8956A' }} />
          <div>
            <p
              className="text-[9px] tracking-[0.2em] uppercase mb-1"
              style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Dessert Delivery
            </p>
            <p
              className="text-xs"
              style={{ color: 'rgba(237,227,208,0.7)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              {getRelativeDateLabel(dessertSlot.isoDate)} · {dessertSlot.time}
            </p>
            {coffeeDeliveryMode && (
              <p
                className="text-[10px] mt-1"
                style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Coffee: {coffeeDeliveryMode === 'immediate' ? '☕ Immediate' : '🍰 With dessert'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Total */}
      <div className="flex items-end justify-between mb-10">
        <span
          className="text-[#EDE3D0]/80 text-sm tracking-[0.05em]"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          Total
        </span>
        <span
          className="text-[#B8956A] font-bold"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
          }}
        >
          ₹{isEmpty ? '0' : total.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Checkout CTA */}
      <button
        id="checkout-btn"
        onClick={handleCheckout}
        disabled={!canCheckout}
        className={`
          w-full flex items-center justify-center gap-3
          py-4 text-xs tracking-[0.25em] uppercase font-bold
          transition-all duration-300 group
          ${canCheckout
            ? 'bg-[#B8956A] text-[#15110D] hover:bg-[#EDE3D0] active:scale-[0.98]'
            : 'bg-[#EDE3D0]/8 text-[#EDE3D0]/20 cursor-not-allowed'
          }
        `}
        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        aria-label={
          isEmpty
            ? 'Cart is empty'
            : !canCheckout
              ? blockingReason ?? 'Complete required steps'
              : isAuthenticated
                ? 'Proceed to checkout'
                : 'Login to checkout'
        }
      >
        Proceed to Checkout
        {canCheckout && (
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </button>

      {/* Blocking reason helper text */}
      {!isEmpty && blockingReason && (
        <div className="mt-4 flex items-start gap-2">
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(251,146,60,0.6)' }} />
          <p
            className="text-[10px] leading-relaxed"
            style={{ color: 'rgba(251,146,60,0.7)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            {blockingReason}
          </p>
        </div>
      )}

      {/* Login note */}
      {!isAuthenticated && !isEmpty && (
        <p
          className="text-center text-[#EDE3D0]/30 text-[10px] tracking-[0.15em] mt-4"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          Please login to complete your order.
        </p>
      )}

      {/* Editorial note */}
      <div className="mt-8 pt-6 border-t border-[#B8956A]/10">
        <p
          className="text-[#EDE3D0]/20 text-[9px] tracking-[0.25em] uppercase leading-relaxed"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          Every item chosen with intention. Every order fulfilled with care.
        </p>
      </div>

      {/* ── Email Capture Modal ── */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onContinue={handleEmailContinue}
        onSkip={handleEmailSkip}
      />
    </aside>
  );
}
