'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MENU_CATEGORIES } from '@/constants';

export default function MenuPreviewSection() {
  return (
    <section
      id="menu-preview"
      className="bg-[#EDE3D0] py-28 lg:py-40"
    >
      <div className="container-brand">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-10 h-px bg-[#B8956A]" />
              <span
                className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                The Menu
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
              Three Ways
              <br />
              <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>To Experience Us.</span>
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
              id="menu-preview-view-all"
              className="
                inline-flex items-center gap-2
                border border-[#15110D]/30 text-[#15110D]/70
                px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium
                hover:bg-[#15110D] hover:text-[#EDE3D0] hover:border-[#15110D]
                transition-all duration-300
              "
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              View All
              <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Category cards — large image-based */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-0 border border-[#15110D]/10">
          {MENU_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group border-r border-[#15110D]/10 last:border-r-0"
            >
              <Link href={cat.href} id={`menu-category-${cat.id}`} className="block">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#15110D]/5">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15110D]/80 via-[#15110D]/20 to-transparent" />

                  {/* Arrow indicator */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-[#15110D]/60 border border-[#B8956A]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight size={16} className="text-[#B8956A]" />
                  </div>

                  {/* Text overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p
                      className="text-[#B8956A] text-[9px] tracking-[0.35em] uppercase mb-2"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3
                      className="text-[#EDE3D0] mb-3 transition-colors duration-300 group-hover:text-[#B8956A]"
                      style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                      }}
                    >
                      {cat.label}
                    </h3>
                    <p
                      className="text-[#EDE3D0]/55 text-sm leading-relaxed"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
