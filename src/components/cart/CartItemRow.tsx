'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import type { CartItem } from '@/store/cart.store';
import { useCartStore } from '@/store/cart.store';

// ─────────────────────────────────────────
// CartItemRow Component
// ─────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem;
  index: number;
}

export default function CartItemRow({ item, index }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCartStore();
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      id={`cart-item-${product.id}`}
      className="
        group
        grid grid-cols-[auto_1fr] gap-5 lg:gap-8
        py-8 border-b border-[#B8956A]/10
        last:border-b-0
      "
    >
      {/* ── Product Image ── */}
      {/* Fixed container — object-fit: cover, 1:1 ratio, never breaks */}
      <div
        className="relative overflow-hidden flex-shrink-0 bg-[#1a1410]"
        style={{ width: '100px', aspectRatio: '1 / 1' }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="100px"
          className="object-cover"
        />
      </div>

      {/* ── Product Details ── */}
      <div className="flex flex-col min-w-0">

        {/* Top row: Name + Remove */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3
            className="text-[#EDE3D0] leading-snug"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
            }}
          >
            {product.name}
          </h3>
          <button
            id={`remove-btn-${product.id}`}
            onClick={() => removeFromCart(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="
              shrink-0 w-7 h-7 flex items-center justify-center
              border border-[#EDE3D0]/10 text-[#EDE3D0]/25
              hover:border-[#B8956A]/40 hover:text-[#B8956A]
              transition-all duration-300
            "
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>

        {/* Category label */}
        <span
          className="text-[#B8956A] text-[9px] tracking-[0.3em] uppercase mb-3"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          {product.category === 'coffee' ? 'Coffee' : 'Dessert'}
        </span>

        {/* Description */}
        <p
          className="text-[#EDE3D0]/35 leading-relaxed mb-5 line-clamp-2"
          style={{
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: '0.78rem',
          }}
        >
          {product.description}
        </p>

        {/* Bottom row: Quantity controls + Line total */}
        <div className="flex items-center justify-between gap-4 mt-auto">

          {/* Quantity stepper */}
          <div className="flex items-center border border-[#B8956A]/20">
            <button
              id={`qty-dec-${product.id}`}
              onClick={() => updateQuantity(product.id, quantity - 1)}
              aria-label="Decrease quantity"
              className="
                w-8 h-8 flex items-center justify-center
                text-[#EDE3D0]/50 hover:text-[#EDE3D0] hover:bg-[#B8956A]/10
                transition-all duration-200
                border-r border-[#B8956A]/20
              "
            >
              <Minus size={11} strokeWidth={2} />
            </button>

            <span
              className="w-10 text-center text-[#EDE3D0] text-sm font-medium"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              {quantity}
            </span>

            <button
              id={`qty-inc-${product.id}`}
              onClick={() => updateQuantity(product.id, quantity + 1)}
              aria-label="Increase quantity"
              className="
                w-8 h-8 flex items-center justify-center
                text-[#EDE3D0]/50 hover:text-[#EDE3D0] hover:bg-[#B8956A]/10
                transition-all duration-200
                border-l border-[#B8956A]/20
              "
            >
              <Plus size={11} strokeWidth={2} />
            </button>
          </div>

          {/* Line total */}
          <span
            className="text-[#B8956A] font-semibold"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: '0.95rem',
            }}
          >
            ₹{lineTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
