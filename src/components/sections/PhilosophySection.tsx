'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const words = ['We', 'built', 'The', 'XVIII', 'Brew', 'Co.', 'because', 'we', 'believe', 'every', 'cup', 'should', 'mean', 'something.'];
const goldWords = new Set(['XVIII', 'Brew', 'Co.']);

export default function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  const pillars = [
    {
      num: '01',
      title: 'Craftsmanship',
      text: 'From bean to cup, every step is executed with obsessive precision. No shortcuts. No compromises.',
    },
    {
      num: '02',
      title: 'Integrity',
      text: 'We source honestly, roast transparently, and serve consistently. What you taste reflects who we are.',
    },
    {
      num: '03',
      title: 'Community',
      text: 'Great coffee is meant to be shared. We built this place for conversations, for connection, for you.',
    },
  ];

  return (
    <section
      id="philosophy"
      className="bg-[#15110D] py-32 lg:py-48 overflow-hidden"
    >
      {/* Full-bleed statement */}
      <div ref={ref} className="container-brand mb-28 lg:mb-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-10 flex items-center gap-4"
        >
          <div className="w-10 h-px bg-[#B8956A]" />
          <span
            className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Our Philosophy
          </span>
        </motion.div>

        {/* Word-by-word animated headline */}
        <h2
          className="leading-[1.1] max-w-6xl"
          style={{
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 6.5rem)',
            fontWeight: 700,
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className={`inline-block mr-[0.3em] ${
                goldWords.has(word)
                  ? 'text-[#B8956A]'
                  : 'text-[#EDE3D0]'
              }`}
              style={goldWords.has(word) ? { fontFamily: 'Georgia, serif' } : {}}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.1 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h2>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#B8956A]/15 mb-28 lg:mb-40" />

      {/* Three pillars */}
      <div className="container-brand">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#B8956A]/15">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="px-0 md:px-14 py-14 md:py-0 first:md:pl-0 last:md:pr-0 group"
            >
              <p
                className="text-[#B8956A]/40 text-[10px] tracking-[0.4em] uppercase mb-10"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                {pillar.num}
              </p>
              <h3
                className="text-[#EDE3D0] mb-6 group-hover:text-[#B8956A] transition-colors duration-300"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                }}
              >
                {pillar.title}
              </h3>
              <div className="w-10 h-px bg-[#B8956A]/30 mb-6" />
              <p
                className="text-[#EDE3D0]/45 leading-[1.8]"
                style={{
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                }}
              >
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom gradient rule */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.95 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-28 lg:mt-40 container-brand h-[1px] bg-gradient-to-r from-transparent via-[#B8956A]/30 to-transparent"
      />
    </section>
  );
}
