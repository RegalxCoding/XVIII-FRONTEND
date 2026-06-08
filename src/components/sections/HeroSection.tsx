'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUpProps(delay: number) {
  return {
    initial: { opacity: 0, y: 50 },
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
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen bg-[#15110D] overflow-hidden"
    >
      {/* Horizontal rule — editorial accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#B8956A]/20 z-10" />

      <div className="container-brand min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* ─── Left: Typography Column ─── */}
        <div className="flex flex-col justify-center pt-32 pb-20 lg:pt-36 lg:pb-20 lg:pr-16 order-2 lg:order-1">

          {/* Eyebrow */}
          <motion.div
            {...fadeUpProps(0.2)}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-10 h-px bg-[#B8956A]" />
            <span
              className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Something Has Been Steeping
            </span>
          </motion.div>

          {/* Main headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              {...fadeUpProps(0.35)}
              className="text-[#EDE3D0] leading-[0.95] tracking-tight"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(3.2rem, 7vw, 7rem)',
                fontWeight: 700,
              }}
            >
              Crafted
              <br />
              <span className="text-[#B8956A]" style={{ fontFamily: 'Georgia, serif' }}>
                Coffee.
              </span>
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-12">
            <motion.h1
              {...fadeUpProps(0.5)}
              className="text-[#EDE3D0] leading-[0.95] tracking-tight"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(3.2rem, 7vw, 7rem)',
                fontWeight: 700,
              }}
            >
              Extraordinary
              <br />
              Desserts.
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            {...fadeUpProps(0.65)}
            className="text-[#EDE3D0]/55 max-w-sm mb-12 leading-relaxed"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            }}
          >
            Precision-brewed, single-origin coffee. Pastries crafted with obsessive intention.
            Every element considered. Every visit a statement.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUpProps(0.8)}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              href="/menu"
              id="hero-order-cta"
              className="
                inline-flex items-center gap-3
                bg-[#B8956A] text-[#15110D]
                px-8 py-4 text-xs tracking-[0.25em] uppercase font-bold
                hover:bg-[#EDE3D0] transition-all duration-300 group
              "
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Explore Menu
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/about"
              id="hero-about-link"
              className="
                inline-flex items-center gap-3
                border border-[#EDE3D0]/20 text-[#EDE3D0]/70
                px-8 py-4 text-xs tracking-[0.25em] uppercase font-medium
                hover:border-[#B8956A]/60 hover:text-[#EDE3D0] transition-all duration-300
              "
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Our Story
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            {...fadeUpProps(0.95)}
            className="mt-20 pt-8 border-t border-[#B8956A]/15 grid grid-cols-3 gap-8"
          >
            {[
              { num: '18+', label: 'Origin Regions' },
              { num: '100%', label: 'Small Batch' },
              { num: '∞', label: 'Standards' },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-[#B8956A] font-bold mb-1"
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  }}
                >
                  {stat.num}
                </p>
                <p
                  className="text-[#EDE3D0]/40 text-[10px] tracking-[0.25em] uppercase"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─── Right: Image Column ─── */}
        <div className="relative order-1 lg:order-2 h-[70vw] sm:h-[60vw] lg:h-auto">
          {/* Main hero image — parallax */}
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-0 lg:top-0 lg:bottom-[-10%]"
          >
            <Image
              src="/images/hero-coffee.png"
              alt="Premium espresso crafted with intention at The XVIII Brew Co."
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Dark gradient overlay to blend image borders */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#15110D] via-transparent to-[#15110D] opacity-60 lg:opacity-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#15110D] via-[#15110D]/30 to-transparent opacity-90 lg:opacity-100" />
          </motion.div>

          {/* Floating dessert image card — desktop only, hidden on mobile to prevent overlap */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.8, ease: 'easeOut' }}
            className="hidden lg:block absolute bottom-16 -left-12 w-52 z-20"
          >
            <div className="relative aspect-square overflow-hidden border border-[#B8956A]/25 bg-[#1e1812]">
              <Image
                src="/images/bestseller-cake.png"
                alt="Artisan chocolate tart from The XVIII Brew Co."
                fill
                sizes="208px"
                className="object-cover"
              />
            </div>
            <div className="bg-[#15110D] border border-[#B8956A]/20 px-4 py-3">
              <p
                className="text-[#B8956A] text-[9px] tracking-[0.3em] uppercase mb-0.5"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Signature
              </p>
              <p
                className="text-[#EDE3D0] text-xs font-medium"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                XVIII Chocolate Tart
              </p>
            </div>
          </motion.div>

          {/* Vertical editorial text */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block">
            <p
              className="text-[#EDE3D0]/15 text-[10px] tracking-[0.5em] uppercase"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
              }}
            >
              The XVIII Brew Co. — Est. 2024
            </p>
          </div>
        </div>
      </div>

      {/* Bottom marquee ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#B8956A]/15 overflow-hidden bg-[#15110D]/80 py-3">
        <div className="marquee-track">
          {Array(8).fill(null).map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 pr-12"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              <span className="text-[#EDE3D0]/25 text-[10px] tracking-[0.35em] uppercase whitespace-nowrap">
                Crafted Coffee
              </span>
              <span className="text-[#B8956A] text-[8px]">✦</span>
              <span className="text-[#EDE3D0]/25 text-[10px] tracking-[0.35em] uppercase whitespace-nowrap">
                Extraordinary Desserts
              </span>
              <span className="text-[#B8956A] text-[8px]">✦</span>
              <span className="text-[#EDE3D0]/25 text-[10px] tracking-[0.35em] uppercase whitespace-nowrap">
                Something Has Been Steeping
              </span>
              <span className="text-[#B8956A] text-[8px]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
