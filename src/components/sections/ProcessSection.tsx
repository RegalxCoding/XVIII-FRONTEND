'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { PROCESS_STEPS } from '@/constants';

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="bg-[#15110D] py-28 lg:py-40 overflow-hidden"
    >
      <div className="container-brand">

        {/* Header */}
        <div className="mb-20 lg:mb-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-10 h-px bg-[#B8956A]" />
            <span
              className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Our Process
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#EDE3D0] leading-tight"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 5rem)',
              fontWeight: 700,
            }}
          >
            How We
            <br />
            <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>Make It Right.</span>
          </motion.h2>
        </div>

        {/* Process steps — alternating layout inspired by editorial magazine */}
        <div className="flex flex-col gap-0">
          {PROCESS_STEPS.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`
                  grid grid-cols-1 lg:grid-cols-2 border-t border-[#B8956A]/15
                  ${i === PROCESS_STEPS.length - 1 ? 'border-b border-[#B8956A]/15' : ''}
                `}
              >
                {/* Image block */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-8%' }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative aspect-[16/10] lg:aspect-auto lg:min-h-[520px] overflow-hidden bg-[#1e1812] ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-[#15110D]/20" />
                </motion.div>

                {/* Text block */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-8%' }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={`
                    flex flex-col justify-center
                    px-8 py-16 lg:px-20 lg:py-20
                    ${isEven ? 'lg:order-2' : 'lg:order-1'}
                  `}
                >
                  {/* Step number */}
                  <p
                    className="text-[#B8956A]/30 mb-8"
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 'clamp(4rem, 8vw, 7rem)',
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {step.step}
                  </p>

                  {/* Title — editorial large */}
                  <h3
                    className="text-[#EDE3D0] mb-6 leading-tight"
                    style={{
                      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                      fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                      fontWeight: 700,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Horizontal rule */}
                  <div className="w-16 h-px bg-[#B8956A]/40 mb-6" />

                  {/* Description */}
                  <p
                    className="text-[#EDE3D0]/50 leading-relaxed max-w-md"
                    style={{
                      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                      fontSize: 'clamp(0.9rem, 1.3vw, 1.0625rem)',
                    }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
