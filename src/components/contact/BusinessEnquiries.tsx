'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import BulkOrderModal from './BulkOrderModal';

const ease = [0.22, 1, 0.36, 1] as const;

const uses = [
  'Office events',
  'Birthdays',
  'College fests',
  'Corporate gatherings',
  'Private celebrations',
  'Multiple dessert boxes',
];

export default function BusinessEnquiries() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        id="contact-business"
        className="relative bg-[#0e0b08] py-24 lg:py-40 overflow-hidden"
      >
        {/* Warm background glow — top right */}
        <div
          className="absolute top-0 right-0 w-[55vw] h-[55vw] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top right, rgba(184,149,106,0.07) 0%, transparent 60%)',
          }}
        />

        {/* Vertical accent line — left */}
        <div className="absolute left-0 top-[10%] bottom-[10%] w-[3px] bg-gradient-to-b from-transparent via-[#B8956A]/35 to-transparent hidden lg:block" />

        <div className="container-brand relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — text */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-10"
              >
                <div className="w-10 h-px bg-[#B8956A]" />
                <span
                  className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Business Enquiries
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 1, delay: 0.1, ease }}
                className="text-[#EDE3D0] leading-[0.92] tracking-tight mb-8"
                style={{
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                  fontWeight: 700,
                }}
              >
                Planning{' '}
                <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>
                  Something
                </span>
                <br />
                Bigger?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.8, delay: 0.2, ease }}
                className="text-[#EDE3D0]/45 leading-[1.9] max-w-sm mb-10"
                style={{
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                }}
              >
                Whether you&apos;re organizing an office event, birthday, college fest,
                corporate gathering, private celebration, or need multiple dessert boxes —
                our team can customize bulk orders for you.
              </motion.p>

              <motion.button
                id="contact-bulk-order-btn"
                type="button"
                onClick={() => setModalOpen(true)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.7, delay: 0.32, ease }}
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-3
                  bg-[#B8956A] text-[#0e0b08]
                  px-10 py-4 text-xs tracking-[0.3em] uppercase font-bold
                  hover:bg-[#EDE3D0] transition-colors duration-300 group cursor-pointer"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', border: 'none' }}
              >
                Request Bulk Order
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </div>

            {/* Right — use-case pills */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.9, delay: 0.15, ease }}
              className="lg:pl-8"
            >
              {/* Top rule */}
              <div className="w-full h-px bg-[#B8956A]/20 mb-10" />

              <div className="flex flex-wrap gap-3">
                {uses.map((use, i) => (
                  <motion.span
                    key={use}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease }}
                    className="px-5 py-2.5 border border-[#B8956A]/20 text-[#EDE3D0]/55 text-xs tracking-[0.2em] uppercase"
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {use}
                  </motion.span>
                ))}
              </div>

              {/* Bottom annotation */}
              <div className="mt-12 flex items-start gap-4">
                <div className="w-5 h-px bg-[#B8956A]/40 mt-3 shrink-0" />
                <p
                  className="text-[#EDE3D0]/28 text-[11px] tracking-[0.25em] uppercase leading-relaxed"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  All bulk orders are handled personally by our team
                </p>
              </div>

              <div className="w-full h-px bg-[#B8956A]/20 mt-10" />
            </motion.div>

          </div>
        </div>
      </section>

      <BulkOrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
