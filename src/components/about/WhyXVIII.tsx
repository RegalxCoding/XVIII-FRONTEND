'use client';

import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

export default function WhyXVIII() {
  return (
    <section
      id="why-xviii"
      className="bg-[#15110D] py-32 lg:py-52 overflow-hidden"
    >
      <div className="container-brand">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-20 lg:mb-28"
        >
          <div className="w-10 h-px bg-[#B8956A]" />
          <span
            className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            The Name
          </span>
        </motion.div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — Large Roman numeral */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="flex flex-col"
          >
            {/* Decorative top rule */}
            <div className="w-full h-px bg-[#B8956A]/20 mb-12" />

            <p
              className="text-[#B8956A]/15 leading-none select-none
                overflow-hidden w-full"
              style={{
                fontFamily: 'Georgia, serif',
                /* Constrained: never wider than the grid column */
                fontSize: 'clamp(5rem, 15vw, 14rem)',
                fontWeight: 700,
                lineHeight: 0.85,
                /* Clip any overflow rather than bleed off-screen */
                whiteSpace: 'nowrap',
                textOverflow: 'clip',
              }}
            >
              XVIII
            </p>

            {/* Decorative bottom rule */}
            <div className="w-full h-px bg-[#B8956A]/20 mt-12" />

            {/* Small caption */}
            <p
              className="text-[#EDE3D0]/20 text-[9px] tracking-[0.4em] uppercase mt-6"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Est. XVIII Brew Co.&nbsp;&nbsp;·&nbsp;&nbsp;Kanpur, India
            </p>
          </motion.div>

          {/* Right — Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: 0.25, ease }}
            className="lg:pt-6"
          >
            {/* Opening question */}
            <p
              className="text-[#EDE3D0] mb-8 leading-tight"
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              }}
            >
              Most people ask what XVIII means.
            </p>

            {/* Divider */}
            <div className="w-12 h-px bg-[#B8956A]/40 mb-8" />

            {/* Body text — short lines, editorial spacing */}
            <div
              className="space-y-5 text-[#EDE3D0]/50 leading-[1.9]"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(0.9rem, 1.3vw, 1.0625rem)',
              }}
            >
              <p>
                It isn&apos;t a secret code.
                <br />
                It isn&apos;t ancient mythology.
                <br />
                It simply represents{' '}
                <span className="text-[#EDE3D0]/80 font-medium">eighteen.</span>
              </p>
              <p>
                Because sometimes great coffee isn&apos;t made in five minutes.
                <br />
                Some recipes deserve eighteen hours.
                <br />
                Some desserts deserve patience.
              </p>
              <p className="text-[#EDE3D0]/70">
                We built our brand around slowing down enough to do things properly.
              </p>
            </div>

            {/* Signature-style footnote */}
            <div className="mt-14 border-l-2 border-[#B8956A]/30 pl-6">
              <p
                className="text-[#B8956A] text-[10px] tracking-[0.3em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Patience is not a delay — it&apos;s a commitment.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
