'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { BEST_SELLERS } from '@/constants';

export default function BestSellersSection() {
  return (
    <section
      id="best-sellers"
      className="bg-[#EDE3D0] py-32 lg:py-48"
    >
      <div className="container-brand">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-24 lg:mb-28">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-10 h-px bg-[#B8956A]" />
              <span
                className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Best Sellers
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#15110D] leading-tight"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                fontWeight: 700,
              }}
            >
              What They
              <br />
              <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>Come Back For.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/menu"
              className="
                inline-flex items-center gap-2
                border border-[#15110D]/30 text-[#15110D]/70
                px-7 py-3.5 text-xs tracking-[0.2em] uppercase font-medium
                hover:bg-[#15110D] hover:text-[#EDE3D0] hover:border-[#15110D]
                transition-all duration-300
              "
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Full Menu
              <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Product cards grid — consistent gap between cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {BEST_SELLERS.map((product, i) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group border border-[#15110D]/10 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#15110D]/5 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Category tag */}
                <div className="absolute top-5 left-5 bg-[#15110D] px-3 py-2">
                  <span
                    className="text-[#B8956A] text-[9px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Content — generous internal padding */}
              <div className="p-8 lg:p-10 xl:p-12 bg-[#EDE3D0] border-t border-[#15110D]/10 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-6 mb-5">
                  <h3
                    className="text-[#15110D] group-hover:text-[#B8956A] transition-colors duration-300 leading-snug"
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                    }}
                  >
                    {product.name}
                  </h3>
                  <span
                    className="text-[#B8956A] font-bold shrink-0 mt-1"
                    style={{
                      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                      fontSize: '1.125rem',
                    }}
                  >
                    {product.price}
                  </span>
                </div>

                {/* Thin rule */}
                <div className="w-8 h-px bg-[#15110D]/20 mb-5" />

                <p
                  className="text-[#15110D]/50 leading-[1.8] mb-8 flex-1"
                  style={{
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    fontSize: '0.9rem',
                  }}
                >
                  {product.description}
                </p>
                <Link
                  href={`/product/${product.id}`}
                  id={`bestseller-cta-${product.id}`}
                  className="
                    inline-flex items-center gap-2 self-start
                    text-[#15110D] text-[10px] tracking-[0.25em] uppercase font-bold
                    border-b border-[#15110D]/30 pb-0.5
                    hover:text-[#B8956A] hover:border-[#B8956A] transition-colors duration-300
                    group/link
                  "
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  View Details
                  <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
