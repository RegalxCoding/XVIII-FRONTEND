'use client';

import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

export default function FounderNote() {
  return (
    <section
      id="founder-note"
      className="bg-[#15110D] py-32 lg:py-52 overflow-hidden"
    >
      {/* Top rule */}
      <div className="w-full h-px bg-[#B8956A]/15" />

      <div className="container-brand pt-20 lg:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — image / visual panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease }}
            className="relative"
          >
            {/* Image frame */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#1e1812]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/process-brewing.png"
                alt="The craft of coffee — preparation in the making"
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ filter: 'saturate(0.7) brightness(0.85)' }}
              />
              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(21,17,13,0.2) 0%, rgba(21,17,13,0.05) 50%, rgba(184,149,106,0.06) 100%)',
                }}
              />
              {/* Bottom fade */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{
                  background:
                    'linear-gradient(to top, rgba(21,17,13,0.7) 0%, transparent 100%)',
                }}
              />
            </div>

            {/* Decorative offset border */}
            <div
              className="absolute -bottom-4 -right-4 w-full h-full border border-[#B8956A]/20 pointer-events-none"
              style={{ zIndex: -1 }}
            />

            {/* Floating label */}
            <div className="absolute bottom-8 left-8">
              <p
                className="text-[#B8956A] text-[9px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                XVIII Brew Co.
              </p>
            </div>
          </motion.div>

          {/* Right — quote and signature */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: 0.15, ease }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-px bg-[#B8956A]" />
              <span
                className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Founder&apos;s Note
              </span>
            </div>

            {/* Opening quote mark */}
            <p
              className="text-[#B8956A]/20 leading-none mb-4 select-none"
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(5rem, 10vw, 9rem)',
                lineHeight: 0.7,
              }}
            >
              &ldquo;
            </p>

            {/* Quote */}
            <blockquote
              className="text-[#EDE3D0] leading-[1.6] mb-10"
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.4rem, 2.5vw, 2.125rem)',
                fontStyle: 'italic',
              }}
            >
              The world moves fast.
              <br />
              We don&apos;t.
            </blockquote>

            <p
              className="text-[#EDE3D0]/50 leading-[1.9] mb-14 max-w-md"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(0.9rem, 1.3vw, 1.0625rem)',
              }}
            >
              Every recipe is given the time it deserves because good things are
              rarely rushed. We started this brand to prove that a slower approach
              to coffee and desserts isn&apos;t old-fashioned — it&apos;s the only way
              worth doing it.
            </p>

            {/* Signature divider */}
            <div className="w-12 h-px bg-[#B8956A]/40 mb-8" />

            {/* Signed */}
            <div>
              <p
                className="text-[#EDE3D0] mb-1 tracking-wide"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                  fontStyle: 'italic',
                }}
              >
                — Founder
              </p>
              <p
                className="text-[#EDE3D0]/30 text-[10px] tracking-[0.3em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                The XVIII Brew Co.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
