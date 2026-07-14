'use client';

import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1] as const;

const beliefs = [
  {
    num: '01',
    title: 'Quality Over Speed',
    description:
      'Every drink is prepared carefully instead of rushing orders. We believe a great cup is never an accident — it is a deliberate act of craft.',
    icon: '◈',
  },
  {
    num: '02',
    title: 'Fresh Desserts',
    description:
      'Our desserts are made fresh instead of sitting on shelves all day. If it isn\'t worth serving today, it isn\'t worth serving at all.',
    icon: '◇',
  },
  {
    num: '03',
    title: 'Made With Intention',
    description:
      'Every ingredient, every recipe and every customer matters. Nothing here is accidental. Everything is chosen, considered and cared for.',
    icon: '◉',
  },
];

export default function WhatWeBelieve() {
  return (
    <section
      id="what-we-believe"
      className="bg-[#15110D] py-32 lg:py-48 overflow-hidden"
    >
      {/* Top gold rule */}
      <div className="w-full h-px bg-[#B8956A]/15 mb-20 lg:mb-28" />

      <div className="container-brand">
        {/* Section header */}
        <div className="mb-20 lg:mb-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-10 h-px bg-[#B8956A]" />
            <span
              className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Our Values
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="text-[#EDE3D0] leading-tight max-w-3xl"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)',
              fontWeight: 700,
            }}
          >
            What We{' '}
            <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>
              Believe.
            </span>
          </motion.h2>
        </div>

        {/* Three elegant cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {beliefs.map((belief, i) => (
            <motion.div
              key={belief.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, delay: i * 0.15, ease }}
              className="group relative"
            >
              {/* Card */}
              <div
                className="relative h-full p-10 lg:p-12 border border-[#B8956A]/12 bg-[#1e1812]/60 overflow-hidden transition-all duration-500 group-hover:border-[#B8956A]/30"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at top left, rgba(184,149,106,0.05) 0%, transparent 70%)',
                  }}
                />

                {/* Step number */}
                <p
                  className="text-[#B8956A]/25 text-[10px] tracking-[0.4em] uppercase mb-10"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {belief.num}
                </p>

                {/* Icon */}
                <p
                  className="text-[#B8956A]/40 mb-8 transition-colors duration-300 group-hover:text-[#B8956A]/70"
                  style={{ fontSize: '1.5rem', fontFamily: 'Georgia, serif' }}
                >
                  {belief.icon}
                </p>

                {/* Title */}
                <h3
                  className="text-[#EDE3D0] mb-5 leading-tight transition-colors duration-300 group-hover:text-[#B8956A]"
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 'clamp(1.25rem, 2.2vw, 1.625rem)',
                  }}
                >
                  {belief.title}
                </h3>

                {/* Gold rule */}
                <div className="w-8 h-px bg-[#B8956A]/30 mb-6 transition-all duration-300 group-hover:w-16 group-hover:bg-[#B8956A]/60" />

                {/* Body */}
                <p
                  className="text-[#EDE3D0]/40 leading-[1.85]"
                  style={{
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(0.875rem, 1.15vw, 0.9375rem)',
                  }}
                >
                  {belief.description}
                </p>

                {/* Bottom border accent — animates on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#B8956A]/0 via-[#B8956A]/40 to-[#B8956A]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom gradient rule */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.95 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 1.2, ease }}
        className="mt-28 lg:mt-40 container-brand h-px bg-gradient-to-r from-transparent via-[#B8956A]/25 to-transparent"
      />
    </section>
  );
}
