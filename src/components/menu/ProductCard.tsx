'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { MenuProduct } from '@/data/menuData';

// ─────────────────────────────────────────
// ProductCard Props
// ─────────────────────────────────────────

interface ProductCardProps {
  product: MenuProduct;
  index: number;
  onAdd?: (product: MenuProduct) => void; // wire to cart / Appwrite later
}

// ─────────────────────────────────────────
// ProductCard Component
// ─────────────────────────────────────────

export default function ProductCard({ product, index, onAdd }: ProductCardProps) {
  const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6%' }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.08, // stagger within the row
        ease: [0.22, 1, 0.36, 1],
      }}
      id={`product-card-${product.id}`}
      className="group flex flex-col bg-[#1a1410] border border-[#B8956A]/12 hover:border-[#B8956A]/35 transition-all duration-500"
    >
      {/* ── Image container ── */}
      {/* Fixed 4:5 ratio + object-fit: cover ensures layout never breaks */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: '4 / 5' }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Dark gradient overlay — bottom fade for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#15110D]/60 via-transparent to-transparent pointer-events-none" />

        {/* Category badge — top left */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="bg-[#15110D]/90 border border-[#B8956A]/30 px-3 py-1.5">
            <span
              className="text-[#B8956A] text-[9px] tracking-[0.3em] uppercase"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              {product.category === 'coffee' ? 'Coffee' : 'Dessert'}
            </span>
          </div>
        </div>

        {/* Featured dot — top right */}
        {product.featured && (
          <div className="absolute top-4 right-4">
            <div className="w-2 h-2 rounded-full bg-[#B8956A]" aria-label="Featured item" />
          </div>
        )}
      </div>

      {/* ── Card content ── */}
      <div className="flex flex-col flex-1 p-6 lg:p-7">

        {/* Name + Price row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3
            className="text-[#EDE3D0] group-hover:text-[#B8956A] transition-colors duration-300 leading-snug"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            }}
          >
            {product.name}
          </h3>
          <span
            className="text-[#B8956A] font-semibold shrink-0 leading-snug"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: '0.9rem',
            }}
          >
            {formattedPrice}
          </span>
        </div>

        {/* Thin editorial rule */}
        <div className="w-6 h-px bg-[#B8956A]/30 mb-4" />

        {/* Description */}
        <p
          className="text-[#EDE3D0]/45 leading-relaxed flex-1 mb-6"
          style={{
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: '0.8rem',
          }}
        >
          {product.description}
        </p>

        {/* Add button */}
        <button
          id={`add-btn-${product.id}`}
          onClick={() => onAdd?.(product)}
          disabled={!product.available}
          aria-label={`Add ${product.name} to order`}
          className={`
            self-start
            inline-flex items-center gap-2.5
            border px-5 py-2.5
            text-[10px] tracking-[0.25em] uppercase font-medium
            transition-all duration-300
            ${product.available
              ? 'border-[#B8956A]/40 text-[#EDE3D0]/70 hover:border-[#B8956A] hover:text-[#B8956A] hover:bg-[#B8956A]/8 active:scale-95'
              : 'border-[#EDE3D0]/10 text-[#EDE3D0]/25 cursor-not-allowed'
            }
          `}
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          <Plus size={11} strokeWidth={2} />
          Add
        </button>
      </div>
    </motion.article>
  );
}
