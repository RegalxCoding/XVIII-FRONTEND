'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

// ─────────────────────────────────────────
// Menu Hero Section
// ─────────────────────────────────────────

export default function MenuHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Subtle parallax on the decorative elements
  const decorY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

  return (
    <section
      id="menu-hero"
      ref={containerRef}
      className="relative bg-[#15110D] overflow-hidden"
      style={{ paddingTop: '8rem', paddingBottom: '6rem' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#B8956A]/20" />

      {/* Decorative background number — editorial depth */}
      <motion.div
        style={{ y: decorY }}
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
        aria-hidden="true"
      >
        <span
          className="text-[#EDE3D0]/[0.025] font-bold leading-none"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(12rem, 18vw, 22rem)',
          }}
        >
          XVIII
        </span>
      </motion.div>

      {/* Decorative vertical line — left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px hidden lg:block"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(184,149,106,0.15), transparent)' }}
      />

      <div className="container-brand relative z-10">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-10 h-px bg-[#B8956A]" />
          <span
            className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Curated Collection
          </span>
        </motion.div>

        {/* Main headline */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="text-[#EDE3D0] leading-[0.92] tracking-tight"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(3.5rem, 9vw, 9.5rem)',
              fontWeight: 700,
            }}
          >
            Menu
            <span
              className="text-[#B8956A]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              .
            </span>
          </motion.h1>
        </div>

        {/* Description + divider row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <p
            className="text-[#EDE3D0]/50 max-w-sm leading-relaxed"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            }}
          >
            Explore our curated collection of specialty coffees and handcrafted desserts.
          </p>

          {/* Horizontal rule + stats row */}
          <div className="flex items-center gap-10">
            {[
              { num: '8', label: 'Items' },
              { num: '2',  label: 'Categories' },
              { num: '∞', label: 'Standards' },
            ].map((stat) => (
              <div key={stat.label} className="text-right">
                <p
                  className="text-[#B8956A] font-bold leading-none mb-1"
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  }}
                >
                  {stat.num}
                </p>
                <p
                  className="text-[#EDE3D0]/30 text-[9px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#B8956A]/10" />
    </section>
  );
}
