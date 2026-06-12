'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { type MenuProduct } from '@/data/menuData';
import { productsService, mapProductToMenuProduct } from '@/services/products.service';

export default function BestSellersSection() {
  const [bestSellers, setBestSellers] = useState<MenuProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchBestSellers() {
      try {
        setIsLoading(true);
        // Fetch up to 3 best seller products that are available
        const rawBestSellers = await productsService.getBestSellers(3);
        if (isMounted) {
          const mapped = rawBestSellers.map(mapProductToMenuProduct);
          setBestSellers(mapped);
        }
      } catch (err) {
        console.error('Failed to load best sellers from Firestore:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchBestSellers();
    return () => {
      isMounted = false;
    };
  }, []);
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
        {isLoading ? (
          /* Premium Shimmer Loading Skeleton */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col border border-[#15110D]/10 bg-[#EDE3D0]/50 animate-pulse overflow-hidden"
                style={{ minHeight: '600px' }}
              >
                {/* Image placeholder */}
                <div className="relative aspect-square bg-[#15110D]/5 flex-shrink-0" />
                {/* Content placeholder */}
                <div className="p-8 lg:p-10 xl:p-12 flex flex-col flex-1 gap-4">
                  <div className="flex justify-between items-center">
                    <div className="w-2/3 h-6 bg-[#15110D]/10 rounded" />
                    <div className="w-12 h-6 bg-[#B8956A]/10 rounded" />
                  </div>
                  <div className="w-8 h-px bg-[#15110D]/20" />
                  <div className="w-full h-4 bg-[#15110D]/5 rounded" />
                  <div className="w-5/6 h-4 bg-[#15110D]/5 rounded" />
                  <div className="w-24 h-4 bg-[#15110D]/5 rounded mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : bestSellers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {bestSellers.map((product, i) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group border border-[#15110D]/10 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[#15110D]/5 flex-shrink-0">
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
                      {`₹${product.price.toLocaleString('en-IN')}`}
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
        ) : (
          /* Empty state */
          <div className="text-center py-24 border border-[#15110D]/10 w-full">
            <div className="w-8 h-px bg-[#B8956A]/40 mx-auto mb-6" />
            <p
              className="text-[#15110D]/50 text-xs tracking-[0.2em] uppercase"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              No best sellers featured at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
