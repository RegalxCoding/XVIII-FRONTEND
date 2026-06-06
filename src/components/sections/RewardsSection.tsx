'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coffee, Star, Gift, Tag } from 'lucide-react';
import { STAMPS_PER_CARD } from '@/constants';

const stamps = Array.from({ length: STAMPS_PER_CARD }, (_, i) => i);

const rewards = [
  {
    icon: Coffee,
    title: 'Free Coffee',
    desc: 'Earn 5 stamps',
    stamps: 5,
    tag: 'Popular',
  },
  {
    icon: Gift,
    title: 'Free Dessert',
    desc: 'Earn 8 stamps',
    stamps: 8,
    tag: 'Fan Favourite',
  },
  {
    icon: Tag,
    title: '20% Off',
    desc: 'Earn 10 stamps',
    stamps: 10,
    tag: 'Best Value',
  },
];

export default function RewardsSection() {
  // Demo: 3 stamps collected
  const collectedStamps = 3;

  return (
    <section
      id="rewards"
      className="bg-[#15110D] py-28 lg:py-40 overflow-hidden"
    >
      <div className="container-brand">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div>
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
                Loyalty Rewards
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
              Every Visit
              <br />
              <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>Counts.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#EDE3D0]/45 max-w-xs leading-relaxed"
            style={{
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              fontSize: '0.9375rem',
            }}
          >
            Collect a stamp with every order. Ten stamps unlocks a reward.
            Simple, honest, rewarding.
          </motion.p>
        </div>

        {/* ─── Stamp Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 lg:mb-20"
        >
          <div className="border border-[#B8956A]/25 bg-[#1a140f] p-8 lg:p-12">
            {/* Card header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-8 border-b border-[#B8956A]/15">
              <div>
                <p
                  className="text-[#B8956A] text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Loyalty Card
                </p>
                <h3
                  className="text-[#EDE3D0]"
                  style={{ fontFamily: 'Georgia, serif', fontSize: '1.375rem' }}
                >
                  The XVIII Brew Co.
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Star size={14} className="text-[#B8956A]" fill="#B8956A" />
                <span
                  className="text-[#EDE3D0]/50 text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {collectedStamps}/{STAMPS_PER_CARD} Stamps
                </span>
              </div>
            </div>

            {/* Stamp grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-10">
              {stamps.map((i) => {
                const isCollected = i < collectedStamps;
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={`
                      aspect-square flex items-center justify-center border transition-all duration-300
                      ${isCollected
                        ? 'bg-[#B8956A] border-[#B8956A]'
                        : 'border-[#B8956A]/20 bg-transparent'
                      }
                    `}
                  >
                    {isCollected ? (
                      <Coffee size={16} className="text-[#15110D]" />
                    ) : (
                      <div className="w-2 h-2 border border-[#B8956A]/30" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="h-px bg-[#B8956A]/10 mb-3">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(collectedStamps / STAMPS_PER_CARD) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-[#B8956A]"
              />
            </div>
            <p
              className="text-[#EDE3D0]/30 text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              {STAMPS_PER_CARD - collectedStamps} more stamps to unlock your next reward
            </p>
          </div>
        </motion.div>

        {/* ─── Reward tiers ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#B8956A]/15">
          {rewards.map((reward, i) => (
            <motion.div
              key={reward.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-10 border-b md:border-b-0 md:border-r border-[#B8956A]/15 last:border-r-0 group hover:bg-[#1a140f] transition-colors duration-300"
            >
              {/* Tag */}
              <div className="absolute top-4 right-4 bg-[#B8956A]/10 border border-[#B8956A]/20 px-2 py-1">
                <span
                  className="text-[#B8956A] text-[8px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {reward.tag}
                </span>
              </div>

              <reward.icon size={24} className="text-[#B8956A] mb-8" strokeWidth={1.5} />
              <h3
                className="text-[#EDE3D0] mb-2"
                style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem' }}
              >
                {reward.title}
              </h3>
              <p
                className="text-[#B8956A] text-sm mb-6"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', letterSpacing: '0.05em' }}
              >
                {reward.desc}
              </p>

              {/* Stamp indicators */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: reward.stamps }, (_, j) => (
                  <div key={j} className="w-5 h-5 border border-[#B8956A]/30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#B8956A]/40" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/rewards"
            id="rewards-section-cta"
            className="
              inline-flex items-center gap-3
              bg-[#B8956A] text-[#15110D]
              px-10 py-4 text-xs tracking-[0.25em] uppercase font-bold
              hover:bg-[#EDE3D0] transition-colors duration-300
            "
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Join The Rewards Programme
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
