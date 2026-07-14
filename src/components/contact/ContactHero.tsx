'use client';

import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

export default function ContactHero() {
  return (
    <section
      id="contact-hero"
      className="relative bg-[#0e0b08] overflow-hidden pt-40 pb-28 lg:pt-52 lg:pb-40"
    >
      {/* Warm ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(184,149,106,0.07) 0%, transparent 65%)',
        }}
      />

      {/* Editorial grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-[#EDE3D0]/[0.04]" />
        <div className="absolute left-[75%] top-0 bottom-0 w-px bg-[#EDE3D0]/[0.03] hidden lg:block" />
      </div>

      <div className="container-brand relative z-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex items-center gap-4 mb-8 sm:mb-10"
        >
          <div className="w-8 sm:w-10 h-px bg-[#B8956A]" />
          <span
            className="text-[#B8956A] text-[9px] sm:text-[10px] tracking-[0.42em] uppercase"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Get In Touch
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease }}
          className="text-[#EDE3D0] leading-[0.9] tracking-tight mb-10 sm:mb-12"
          style={{
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: 'clamp(4rem, 10vw, 10rem)',
            fontWeight: 700,
          }}
        >
          Let&apos;s{' '}
          <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>
            Talk.
          </span>
        </motion.h1>

        {/* Paragraph — editorial short lines */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="max-w-md"
        >
          <p
            className="text-[#EDE3D0]/45 leading-[2]"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(0.875rem, 1.2vw, 1.0625rem)',
            }}
          >
            Questions?
            <br />
            Planning a large event?
            <br />
            Need catering?
            <br />
            Want to share feedback?
          </p>
          <p
            className="text-[#EDE3D0]/65 mt-5 leading-relaxed"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(0.875rem, 1.2vw, 1.0625rem)',
            }}
          >
            We&apos;re always happy to hear from you.
          </p>
        </motion.div>

        {/* Bottom rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.6, ease }}
          className="mt-16 h-px bg-gradient-to-r from-[#B8956A]/35 via-[#B8956A]/10 to-transparent origin-left"
        />
      </div>
    </section>
  );
}
