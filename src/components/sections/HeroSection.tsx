'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUpProps(delay: number) {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease, delay },
  };
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen bg-[#15110D] overflow-hidden flex flex-col justify-between pt-32 pb-20 lg:pt-36 lg:pb-24 px-6 lg:px-16"
    >
      {/* ─── Grid Lines & Crosshairs ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-[#EDE3D0]/[0.05]" />
        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-[#EDE3D0]/[0.03]" />
        <div className="absolute left-[75%] top-0 bottom-0 w-px bg-[#EDE3D0]/[0.05]" />
        <div className="absolute top-[33%] left-0 right-0 h-px bg-[#EDE3D0]/[0.03]" />
        <div className="absolute top-[66%] left-0 right-0 h-px bg-[#EDE3D0]/[0.03]" />

        <div className="absolute left-[25%] top-[33%] -translate-x-1/2 -translate-y-1/2 text-[#EDE3D0]/20 text-xs font-light select-none">+</div>
        <div className="absolute left-[75%] top-[33%] -translate-x-1/2 -translate-y-1/2 text-[#EDE3D0]/20 text-xs font-light select-none">+</div>
        <div className="absolute left-[50%] top-[15%] -translate-x-1/2 -translate-y-1/2 text-[#EDE3D0]/20 text-xs font-light select-none">+</div>
        <div className="absolute left-[25%] top-[66%] -translate-x-1/2 -translate-y-1/2 text-[#EDE3D0]/20 text-xs font-light select-none">+</div>
        <div className="absolute left-[75%] top-[66%] -translate-x-1/2 -translate-y-1/2 text-[#EDE3D0]/20 text-xs font-light select-none">+</div>
        <div className="absolute left-[90%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-[#EDE3D0]/20 text-xs font-light select-none">+</div>
      </div>

      {/* ─── LAYER 1 (z-10): Headline — sits BEHIND the product image ─── */}
      <div className="relative z-10 w-full max-w-6xl mt-8">
        <motion.div {...fadeUpProps(0.2)} className="flex items-center gap-4 mb-5">
          <div className="w-8 h-px bg-[#B8956A]" />
          <span
            className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Something Has Been Steeping
          </span>
        </motion.div>

        <motion.h1
          {...fadeUpProps(0.35)}
          className="text-[#EDE3D0] leading-[0.92] tracking-tight"
          style={{
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: 'clamp(3rem, 10vw, 9rem)',
            fontWeight: 700,
          }}
        >
          Crafted Coffee.<br />
          Extraordinary<br className="hidden lg:block" />{' '}
          Desserts.
        </motion.h1>
      </div>

      {/* ─── LAYER 2 (z-20): Product image ─── */}
      {/* Desktop: overlaps headline from the right for depth effect */}
      {/* Mobile: positioned below headline, smaller, partially overlapping bottom text */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="
          absolute pointer-events-none z-20
          top-[58%] left-[50%] -translate-x-1/2 -translate-y-1/2
          w-[65vw] h-[45vh]
          lg:top-[50%] lg:left-[62%] lg:w-[42vw] lg:h-[85vh]
        "
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-coffee-cutout.png"
          alt="Premium espresso crafted with intention at The XVIII Brew Co."
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 0 60px rgba(184, 149, 106, 0.12)) drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
          }}
        />
      </motion.div>

      {/* Warm ambient glow behind the cup */}
      <div
        className="absolute top-[55%] left-[50%] lg:top-[48%] lg:left-[62%] -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full pointer-events-none z-[5]"
        style={{
          background: 'radial-gradient(circle, rgba(184, 149, 106, 0.07) 0%, transparent 60%)',
        }}
      />

      {/* ─── LAYER 3 (z-30): Bottom content — sits IN FRONT of the image ─── */}
      <div className="relative z-30 w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-12 mt-auto">

        {/* Bottom Left */}
        <div className="max-w-sm relative">
          <div className="absolute -top-16 lg:-top-20 left-4 w-px h-12 lg:h-16 bg-[#EDE3D0]/15 hidden lg:block" />
          <div className="absolute -top-16 lg:-top-20 left-4 w-1.5 h-1.5 rounded-full bg-[#B8956A]/40 -translate-x-[2px] hidden lg:block" />

          <motion.p
            {...fadeUpProps(0.65)}
            className="text-[#EDE3D0]/55 mb-6 lg:mb-8 leading-relaxed"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)',
            }}
          >
            Precision-brewed, single-origin coffee. Pastries crafted with obsessive intention.
            Every element considered. Every visit a statement.
          </motion.p>

          <motion.div {...fadeUpProps(0.8)} className="flex gap-4">
            <Link
              href="/menu"
              className="inline-block bg-[#B8956A] text-[#15110D] px-7 py-3.5 text-xs tracking-[0.15em] uppercase font-bold hover:bg-[#EDE3D0] transition-colors duration-300"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Explore Menu
            </Link>
            <Link
              href="/about"
              className="inline-block border border-[#EDE3D0]/15 text-[#EDE3D0]/60 px-7 py-3.5 text-xs tracking-[0.15em] uppercase font-medium hover:border-[#B8956A]/50 hover:text-[#EDE3D0] transition-all duration-300"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Our Story
            </Link>
          </motion.div>
        </div>

        {/* Bottom Right — Stats */}
        <motion.div
          {...fadeUpProps(0.95)}
          className="max-w-xs relative"
        >
          <div className="absolute -top-16 lg:-top-20 right-8 w-px h-12 lg:h-16 bg-[#EDE3D0]/15 hidden lg:block" />
          <div className="absolute -top-16 lg:-top-20 right-8 w-1.5 h-1.5 rounded-full bg-[#B8956A]/40 -translate-x-[2px] hidden lg:block" />

          <div className="grid grid-cols-3 gap-6 lg:gap-10">
            {[
              { num: '18+', label: 'Origin Regions' },
              { num: '100%', label: 'Small Batch' },
              { num: '∞', label: 'Standards' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col lg:items-end">
                <p
                  className="text-[#EDE3D0] font-bold mb-1"
                  style={{
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                  }}
                >
                  {stat.num}
                </p>
                <p
                  className="text-[#EDE3D0]/35 text-[9px] tracking-[0.2em] uppercase"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom marquee ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#B8956A]/10 overflow-hidden bg-[#15110D]/80 py-3 z-30">
        <div className="marquee-track">
          {Array(8).fill(null).map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 pr-12"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              <span className="text-[#EDE3D0]/20 text-[10px] tracking-[0.35em] uppercase whitespace-nowrap">
                Crafted Coffee
              </span>
              <span className="text-[#B8956A]/50 text-[8px]">✦</span>
              <span className="text-[#EDE3D0]/20 text-[10px] tracking-[0.35em] uppercase whitespace-nowrap">
                Extraordinary Desserts
              </span>
              <span className="text-[#B8956A]/50 text-[8px]">✦</span>
              <span className="text-[#EDE3D0]/20 text-[10px] tracking-[0.35em] uppercase whitespace-nowrap">
                Something Has Been Steeping
              </span>
              <span className="text-[#B8956A]/50 text-[8px]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
