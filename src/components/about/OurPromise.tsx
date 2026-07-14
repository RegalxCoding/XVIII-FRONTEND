'use client';

import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

export default function OurPromise() {
  return (
    <section
      id="our-promise"
      className="relative bg-[#15110D] py-32 lg:py-52 overflow-hidden"
    >
      {/* Background texture — very subtle warm radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(184,149,106,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Vertical editorial lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[20%] top-0 bottom-0 w-px bg-[#EDE3D0]/[0.025]" />
        <div className="absolute right-[20%] top-0 bottom-0 w-px bg-[#EDE3D0]/[0.025]" />
      </div>

      <div className="container-brand relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <div className="w-10 h-px bg-[#B8956A]/50" />
            <span
              className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Our Promise
            </span>
            <div className="w-10 h-px bg-[#B8956A]/50" />
          </motion.div>

          {/* Large heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="text-[#EDE3D0] leading-[0.92] tracking-tight mb-16 lg:mb-20"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(4rem, 10vw, 10rem)',
              fontWeight: 700,
            }}
          >
            No{' '}
            <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>
              shortcuts.
            </span>
          </motion.h2>

          {/* Body text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="max-w-2xl mx-auto"
          >
            {/* Top divider */}
            <div className="w-16 h-px bg-[#B8956A]/30 mx-auto mb-10" />

            <p
              className="text-[#EDE3D0]/50 leading-[1.9] mb-6"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              }}
            >
              We&apos;re not trying to become the biggest café.
            </p>
            <p
              className="text-[#EDE3D0]/70 leading-[1.9] mb-10"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                fontWeight: 500,
              }}
            >
              We&apos;re trying to become someone&apos;s favourite one.
            </p>
            <p
              className="text-[#EDE3D0]/40 leading-[1.9]"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(0.9rem, 1.3vw, 1.0625rem)',
              }}
            >
              Whether it&apos;s your first coffee or your fiftieth dessert, we want every
              order to feel intentional.
            </p>

            {/* Bottom decorative element */}
            <div className="flex items-center justify-center gap-3 mt-16">
              <div className="w-20 h-px bg-[#B8956A]/20" />
              <span className="text-[#B8956A]/40 text-xs" style={{ fontFamily: 'Georgia, serif' }}>
                ✦
              </span>
              <div className="w-20 h-px bg-[#B8956A]/20" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
