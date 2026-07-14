'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutCTA() {
  return (
    <section
      id="about-cta"
      className="bg-[#15110D] overflow-hidden"
    >
      {/* Top border */}
      <div className="w-full h-px bg-[#B8956A]/20" />

      <div className="container-brand py-36 lg:py-56">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-12 items-end">

          {/* Left — large statement */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6 }}
              className="text-[#B8956A] text-[10px] tracking-[0.5em] uppercase mb-10"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              The XVIII Brew Co.
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="text-[#EDE3D0] leading-[0.9] tracking-tight"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(3.5rem, 8vw, 8.5rem)',
                fontWeight: 700,
              }}
            >
              Ready for{' '}
              <br />
              <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>
                your first
              </span>
              <br />
              cup?
            </motion.h2>
          </div>

          {/* Right — body + buttons */}
          <div className="lg:pb-4">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="text-[#EDE3D0]/45 leading-[1.9] mb-12 max-w-md"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              }}
            >
              Every cup is an invitation.
              <br />
              Come for the coffee. Stay for the intention.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-16"
            >
              {/* Primary CTA */}
              <Link
                href="/menu"
                id="about-cta-explore-menu"
                className="inline-flex items-center gap-3 bg-[#B8956A] text-[#15110D] px-10 py-4 text-xs tracking-[0.3em] uppercase font-bold hover:bg-[#EDE3D0] transition-all duration-300 group"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Explore Menu
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>

              {/* Secondary CTA */}
              <Link
                href="/menu"
                id="about-cta-order-now"
                className="inline-flex items-center gap-3 border border-[#EDE3D0]/15 text-[#EDE3D0]/55 px-10 py-4 text-xs tracking-[0.3em] uppercase font-medium hover:border-[#B8956A]/40 hover:text-[#EDE3D0] transition-all duration-300"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Order Now
              </Link>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="border-t border-[#B8956A]/15 pt-8"
            >
              <p
                className="text-[#EDE3D0]/20 text-sm tracking-[0.3em] uppercase"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Something Has Been Steeping.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
