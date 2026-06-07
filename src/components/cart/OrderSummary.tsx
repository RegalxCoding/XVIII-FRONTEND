'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useCartStore, DELIVERY_FEE } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';

// ─────────────────────────────────────────
// OrderSummary — sticky sidebar on desktop
// ─────────────────────────────────────────

export default function OrderSummary() {
  const router = useRouter();
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const items = useCartStore((s) => s.items);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const subtotal = getSubtotal();
  const total = subtotal + DELIVERY_FEE;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const isEmpty = items.length === 0;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/checkout');
    }
  };

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
        disabled={isEmpty}
        className={`
          w-full flex items-center justify-center gap-3
          py-4 text-xs tracking-[0.25em] uppercase font-bold
          transition-all duration-300 group
          ${isEmpty
            ? 'bg-[#EDE3D0]/8 text-[#EDE3D0]/20 cursor-not-allowed'
            : 'bg-[#B8956A] text-[#15110D] hover:bg-[#EDE3D0] active:scale-[0.98]'
          }
        `}
        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        aria-label={
          isEmpty
            ? 'Cart is empty'
            : isAuthenticated
              ? 'Proceed to checkout'
              : 'Login to checkout'
        }
      >
        {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
        {!isEmpty && (
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
        )}
      </button>

      {/* Login note — shown when not authenticated and cart has items */}
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
    </aside>
  );
}
