'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease, delay },
  };
}

// ── Reusable steam wisp set ─────────────────────────────────
function SteamWisps() {
  return (
    <>
      <div className="steam-wisp-1 absolute" style={{ left: '35%', bottom: 0, width: '3px', height: '44px', borderRadius: '50%', background: 'linear-gradient(to top, rgba(220,190,150,0.5), transparent)', filter: 'blur(3px)', transformOrigin: 'bottom center' }} />
      <div className="steam-wisp-2 absolute" style={{ left: '50%', bottom: 0, width: '4px', height: '52px', borderRadius: '50%', background: 'linear-gradient(to top, rgba(220,190,150,0.4), transparent)', filter: 'blur(4px)', transformOrigin: 'bottom center' }} />
      <div className="steam-wisp-3 absolute" style={{ left: '43%', bottom: 0, width: '3px', height: '60px', borderRadius: '50%', background: 'linear-gradient(to top, rgba(220,190,150,0.32), transparent)', filter: 'blur(5px)', transformOrigin: 'bottom center' }} />
      <div className="steam-wisp-4 absolute" style={{ left: '58%', bottom: 0, width: '2px', height: '38px', borderRadius: '50%', background: 'linear-gradient(to top, rgba(220,190,150,0.28), transparent)', filter: 'blur(3px)', transformOrigin: 'bottom center' }} />
      <div className="steam-wisp-5 absolute" style={{ left: '28%', bottom: 0, width: '3px', height: '48px', borderRadius: '50%', background: 'linear-gradient(to top, rgba(220,190,150,0.26), transparent)', filter: 'blur(4px)', transformOrigin: 'bottom center' }} />
    </>
  );
}

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // ── Cup parallax (desktop faster, mobile gentler for performance) ──
  const cupYDesktop = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);
  const cupScaleDesktop = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const cupYMobile = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  // ── Steam — fades as hero scrolls offscreen ──
  const steamOpacity = useTransform(scrollYProgress, [0, 0.38, 0.65], [1, 0.5, 0]);
  const steamY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // ── Headline — barely moves (keeps text readable while scrolling) ──
  const headlineY = useTransform(scrollYProgress, [0, 1], ['0%', '7%']);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);

  // ── Floating beans — weightless drift, max ~100° rotation ──
  const b1Y  = useTransform(scrollYProgress, [0,1], ['0%',  '240%']);
  const b1X  = useTransform(scrollYProgress, [0,1], ['0%',   '80%']);
  const b1R  = useTransform(scrollYProgress, [0,1], [8,       82]);
  const b1Op = useTransform(scrollYProgress, [0,0.5,1], [0.72, 0.50, 0.14]);

  const b2Y  = useTransform(scrollYProgress, [0,1], ['0%', '-220%']);
  const b2X  = useTransform(scrollYProgress, [0,1], ['0%', '-120%']);
  const b2R  = useTransform(scrollYProgress, [0,1], [-12,    -76]);
  const b2Op = useTransform(scrollYProgress, [0,0.5,1], [0.55, 0.38, 0.10]);

  const b3Y  = useTransform(scrollYProgress, [0,1], ['0%',  '275%']);
  const b3X  = useTransform(scrollYProgress, [0,1], ['0%', '-100%']);
  const b3R  = useTransform(scrollYProgress, [0,1], [28,      92]);
  const b3Op = useTransform(scrollYProgress, [0,0.5,1], [0.82, 0.62, 0.22]);

  const b4Y  = useTransform(scrollYProgress, [0,1], ['0%', '-295%']);
  const b4X  = useTransform(scrollYProgress, [0,1], ['0%',  '158%']);
  const b4R  = useTransform(scrollYProgress, [0,1], [52,     -88]);
  const b4Op = useTransform(scrollYProgress, [0,0.5,1], [0.62, 0.42, 0.12]);

  const b5Y  = useTransform(scrollYProgress, [0,1], ['0%',  '198%']);
  const b5X  = useTransform(scrollYProgress, [0,1], ['0%',  '108%']);
  const b5R  = useTransform(scrollYProgress, [0,1], [-8,      64]);
  const b5Op = useTransform(scrollYProgress, [0,0.5,1], [0.42, 0.28, 0.08]);

  const b6Y  = useTransform(scrollYProgress, [0,1], ['0%', '-182%']);
  const b6X  = useTransform(scrollYProgress, [0,1], ['0%',  '-90%']);
  const b6R  = useTransform(scrollYProgress, [0,1], [18,      86]);
  const b6Op = useTransform(scrollYProgress, [0,0.5,1], [0.78, 0.56, 0.18]);

  const b7Y  = useTransform(scrollYProgress, [0,1], ['0%',  '258%']);
  const b7X  = useTransform(scrollYProgress, [0,1], ['0%', '-152%']);
  const b7R  = useTransform(scrollYProgress, [0,1], [0,       55]);
  const b7Op = useTransform(scrollYProgress, [0,0.5,1], [0.68, 0.46, 0.14]);

  const b8Y  = useTransform(scrollYProgress, [0,1], ['0%', '-318%']);
  const b8X  = useTransform(scrollYProgress, [0,1], ['0%',  '182%']);
  const b8R  = useTransform(scrollYProgress, [0,1], [-28,    -82]);
  const b8Op = useTransform(scrollYProgress, [0,0.5,1], [0.86, 0.62, 0.22]);

  const b9Y  = useTransform(scrollYProgress, [0,1], ['0%',  '208%']);
  const b9X  = useTransform(scrollYProgress, [0,1], ['0%',  '128%']);
  const b9R  = useTransform(scrollYProgress, [0,1], [44,      92]);
  const b9Op = useTransform(scrollYProgress, [0,0.5,1], [0.52, 0.35, 0.10]);

  const b10Y  = useTransform(scrollYProgress, [0,1], ['0%', '-248%']);
  const b10X  = useTransform(scrollYProgress, [0,1], ['0%', '-112%']);
  const b10R  = useTransform(scrollYProgress, [0,1], [10,     -72]);
  const b10Op = useTransform(scrollYProgress, [0,0.5,1], [0.76, 0.54, 0.18]);

  const b11Y  = useTransform(scrollYProgress, [0,1], ['0%',  '285%']);
  const b11X  = useTransform(scrollYProgress, [0,1], ['0%', '-182%']);
  const b11R  = useTransform(scrollYProgress, [0,1], [-20,     72]);
  const b11Op = useTransform(scrollYProgress, [0,0.5,1], [0.62, 0.42, 0.14]);

  const b12Y  = useTransform(scrollYProgress, [0,1], ['0%', '-152%']);
  const b12X  = useTransform(scrollYProgress, [0,1], ['0%',  '212%']);
  const b12R  = useTransform(scrollYProgress, [0,1], [65,     -88]);
  const b12Op = useTransform(scrollYProgress, [0,0.5,1], [0.72, 0.50, 0.16]);

  const dropShadow = 'drop-shadow(0 0 50px rgba(184,149,106,0.13)) drop-shadow(0 28px 55px rgba(0,0,0,0.6))';

  return (
    /*
     * Section is NOT fixed min-h-screen on mobile —
     * it grows naturally to fit text + in-flow cup.
     * On lg+ it becomes min-h-screen again (desktop layout).
     */
    <section
      id="about-hero"
      ref={containerRef}
      className="relative bg-[#0e0b08] overflow-hidden lg:min-h-screen"
    >
      {/* ────────────────────────────────────────
          LAYER 0 — Absolute base layers
          (all use absolute, sit under content)
      ──────────────────────────────────────── */}

      {/* Dark base */}
      <div className="absolute inset-0 z-0 bg-[#0e0b08]" />

      {/* Warm ambient radial glow */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 130% 80% at 68% 55%, rgba(72,42,16,0.38) 0%, rgba(14,11,8,0.0) 62%)',
        }}
      />

      {/* ────────────────────────────────────────
          BEANS — LAPTOP (1024–1279px)
      ──────────────────────────────────────── */}
      <motion.div
        style={{ y: cupYDesktop, scale: cupScaleDesktop }}
        className="hidden lg:block xl:hidden absolute z-[40] pointer-events-none top-[-5%] right-[-10%] w-[90vw] mix-blend-screen"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about-hero-beans.png"
          alt="Cascading coffee beans"
          className="w-full h-auto object-contain opacity-95"
          style={{ 
            filter: dropShadow,
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 70%)',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 70%)'
          }}
        />
      </motion.div>

      {/* ────────────────────────────────────────
          BEANS — DESKTOP (≥1280px)
      ──────────────────────────────────────── */}
      <motion.div
        style={{ y: cupYDesktop, scale: cupScaleDesktop }}
        className="hidden xl:block absolute z-[40] pointer-events-none top-[-10%] right-[-5%] w-[80vw] mix-blend-screen"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about-hero-beans.png"
          alt="Cascading coffee beans"
          className="w-full h-auto object-contain opacity-95"
          style={{ 
            filter: dropShadow,
            WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 45%, transparent 75%)',
            maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 45%, transparent 75%)'
          }}
        />
      </motion.div>

      {/* ────────────────────────────────────────
          GRADIENT OVERLAYS
          Mobile/Tablet: only protect top area (text reads on dark bg)
          Laptop/Desktop: left-to-right + bottom fade
      ──────────────────────────────────────── */}

      {/* Mobile / Tablet overlay (< lg) */}
      <div
        className="lg:hidden absolute inset-0 z-[6] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(14,11,8,0.12) 0%, rgba(14,11,8,0.0) 55%)',
        }}
      />

      {/* Laptop / Desktop overlay (≥ lg) */}
      <div
        className="hidden lg:block absolute inset-0 z-[6] pointer-events-none"
        style={{
          background: [
            'linear-gradient(to right, rgba(14,11,8,0.97) 0%, rgba(14,11,8,0.74) 36%, rgba(14,11,8,0.2) 58%, rgba(14,11,8,0.04) 100%)',
            'linear-gradient(to bottom, rgba(14,11,8,0.22) 0%, transparent 24%, transparent 58%, rgba(14,11,8,0.99) 100%)',
          ].join(', '),
        }}
      />

      {/* ────────────────────────────────────────
          FLOATING BEANS
          • All 12 rendered but fewer on mobile
            (hidden sm:block / hidden md:block)
          • Max rotation ~100° — weightless drift
      ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-[20]">

        {/* Always visible — small count, well-placed on mobile */}
        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b1Y, x: b1X, rotate: b1R, opacity: b1Op }}
          className="absolute w-8 sm:w-12 lg:w-18 xl:w-20 top-[12%] left-[5%] blur-[2px]" />

        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b3Y, x: b3X, rotate: b3R, opacity: b3Op }}
          className="absolute w-10 sm:w-14 lg:w-20 xl:w-24 top-[8%] right-[4%] blur-[1px]" />

        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b6Y, x: b6X, rotate: b6R, opacity: b6Op }}
          className="absolute w-14 sm:w-18 lg:w-24 xl:w-28 top-[84%] left-[16%] blur-[2px]" />

        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b8Y, x: b8X, rotate: b8R, opacity: b8Op }}
          className="absolute w-5 sm:w-7 lg:w-10 xl:w-12 top-[66%] left-[20%] blur-[3px]" />

        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b10Y, x: b10X, rotate: b10R, opacity: b10Op }}
          className="absolute w-9 sm:w-12 lg:w-18 xl:w-20 top-[90%] left-[64%] blur-[2px]" />

        {/* sm+ (≥640px) */}
        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b2Y, x: b2X, rotate: b2R, opacity: b2Op }}
          className="absolute hidden sm:block w-9 lg:w-14 xl:w-16 top-[58%] left-[3%] blur-[4px]" />

        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b9Y, x: b9X, rotate: b9R, opacity: b9Op }}
          className="absolute hidden sm:block w-12 lg:w-18 xl:w-22 top-[5%] left-[25%] blur-[4px]" />

        {/* md+ (≥768px) */}
        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b5Y, x: b5X, rotate: b5R, opacity: b5Op }}
          className="absolute hidden md:block w-10 lg:w-16 xl:w-18 top-[40%] right-[2%] blur-[5px]" />

        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b11Y, x: b11X, rotate: b11R, opacity: b11Op }}
          className="absolute hidden md:block w-12 lg:w-18 xl:w-20 top-[50%] left-[6%] blur-[5px]" />

        {/* lg+ (≥1024px) desktop-only beans */}
        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b4Y, x: b4X, rotate: b4R, opacity: b4Op }}
          className="absolute hidden lg:block w-8 xl:w-14 top-[76%] right-[10%] blur-[3px]" />

        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b7Y, x: b7X, rotate: b7R, opacity: b7Op }}
          className="absolute hidden lg:block w-9 xl:w-14 top-[26%] left-[74%] blur-[1px]" />

        <motion.img src="/images/bean-cutout.png" alt=""
          style={{ y: b12Y, x: b12X, rotate: b12R, opacity: b12Op }}
          className="absolute hidden lg:block w-11 xl:w-18 top-[36%] left-[82%] blur-[1px]" />
      </div>

      {/* ────────────────────────────────────────
          EDITORIAL GRID LINES
          Fewer on mobile, full set on desktop
      ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-[22]">
        {/* Left column guide — all sizes */}
        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-[#EDE3D0]/[0.04]" />
        {/* Right + horizontal — lg+ only */}
        <div className="absolute right-[25%] top-0 bottom-0 w-px bg-[#EDE3D0]/[0.03] hidden lg:block" />
        <div className="absolute top-[38%] left-0 right-0 h-px bg-[#EDE3D0]/[0.025] hidden lg:block" />
        <div className="absolute left-[25%] top-[38%] -translate-x-1/2 -translate-y-1/2 text-[#EDE3D0]/12 text-[10px] select-none hidden lg:block">+</div>
        <div className="absolute right-[25%] top-[38%] translate-x-1/2 -translate-y-1/2 text-[#EDE3D0]/10 text-[10px] select-none hidden lg:block">+</div>
      </div>

      {/* Bottom warm glow (desktop) */}
      <div
        className="hidden lg:block absolute bottom-0 left-0 right-0 h-[28vh] pointer-events-none z-[24]"
        style={{
          background:
            'radial-gradient(ellipse 55% 100% at 18% 100%, rgba(184,149,106,0.07) 0%, transparent 70%)',
        }}
      />

      {/* ════════════════════════════════════════
          MAIN CONTENT WRAPPER
          ─────────────────────────────────────
          Mobile  : flex-col — text then cup in flow
          Tablet  : flex-col — text then cup in flow (cup right-anchored)
          Laptop+ : lg:min-h-screen flex-col — text at bottom-left
      ════════════════════════════════════════ */}
      <div className="relative z-[30] flex flex-col lg:min-h-screen">

        {/* ── MASSIVE TEXT BLOCK (MATCHING MOCKUP) ── */}
        <motion.div
          style={{ y: headlineY, opacity: headlineOpacity }}
          className={[
            'w-full px-4 sm:px-8 md:px-12 lg:px-20',
            /* Mobile/Tablet: top padding for navbar, bottom space */
            'pt-32 sm:pt-40 pb-12',
            /* Laptop/Desktop: push to center/bottom */
            'lg:mt-auto lg:pb-32',
          ].join(' ')}
        >
          {/* ── HEADING ── */}
          <motion.div
            {...fadeUp(0.35)}
            className="text-[#EDE3D0] leading-[0.85] tracking-tight flex flex-col w-full"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              /* Massive size tiers */
              fontSize: 'clamp(4rem, 15.5vw, 16rem)',
              fontWeight: 700,
            }}
          >
            {/* Top Line */}
            <h1 className="w-full">Every Cup</h1>

            {/* Bottom Section (Paragraph on left, text on right) */}
            <div className="flex flex-col-reverse md:flex-row w-full justify-between items-start mt-4 md:mt-[-2vw]">
              
              {/* Left Column (Eyebrow + Paragraph) */}
              <div className="w-full md:w-[25vw] max-w-[320px] mt-12 md:mt-[10vw] flex flex-col gap-6 md:gap-8 z-[50]">
                {/* Eyebrow */}
                <motion.div
                  {...fadeUp(0.5)}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-px bg-[#B8956A]" />
                  <span
                    className="text-[#B8956A] text-[10px] tracking-[0.42em] uppercase leading-normal"
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    Our Story
                  </span>
                </motion.div>

                {/* Paragraph */}
                <motion.p
                  {...fadeUp(0.65)}
                  className="text-[#EDE3D0]/60 leading-[1.85]"
                  style={{
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)',
                    fontWeight: 400,
                    letterSpacing: 'normal',
                  }}
                >
                  The XVIII Brew Co. wasn&apos;t created to serve coffee quickly.
                  It was created to make every cup worth waiting for.
                  Coffee and desserts prepared with patience, precision and intention.
                </motion.p>
              </div>

              {/* Right Column (Has A Reason) */}
              <div className="flex flex-col md:ml-auto">
                <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>
                  Has A
                </span>
                <span>
                  Reason.
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════════
            BEANS — MOBILE & TABLET (hidden lg+)
        ════════════════════════════════════════ */}
        <motion.div
          style={{ y: cupYMobile }}
          className="lg:hidden absolute z-[40] flex justify-center items-center inset-0 pointer-events-none overflow-hidden mix-blend-screen"
        >
          <div className="relative w-full max-w-[800px] flex justify-center translate-y-[10%]">
            {/* Ambient glow behind beans */}
            <div
              className="absolute inset-0 pointer-events-none scale-125"
              style={{
                background:
                  'radial-gradient(ellipse 70% 65% at 55% 55%, rgba(184,149,106,0.13) 0%, transparent 70%)',
              }}
            />

            {/* ── BEANS IMAGE ── */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about-hero-beans.png"
              alt="Cascading coffee beans"
              className="relative block w-[140vw] max-w-none sm:w-[100vw] object-contain opacity-95"
              style={{ 
                filter: dropShadow,
                WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 75%)',
                maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 75%)'
              }}
            />
          </div>
        </motion.div>

      </div>{/* /content wrapper */}
    </section>
  );
}
