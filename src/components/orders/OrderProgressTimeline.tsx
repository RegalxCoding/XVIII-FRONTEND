'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { AdminOrderStatus } from '@/types/admin.types';
import { TRACKING_STEPS, getStepState } from '@/types/order-tracking.types';

interface OrderProgressTimelineProps {
  currentStatus: AdminOrderStatus;
}

export default function OrderProgressTimeline({ currentStatus }: OrderProgressTimelineProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.1 },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Section Label */}
      <p
        className="text-[#B8956A] text-[10px] tracking-[0.3em] uppercase font-semibold mb-8"
        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
      >
        Order Journey
      </p>

      <div className="relative flex flex-col gap-0">
        {TRACKING_STEPS.map((step, index) => {
          const state = getStepState(step.status, currentStatus);
          const isLast = index === TRACKING_STEPS.length - 1;

          return (
            <motion.div
              key={step.status}
              variants={stepVariants}
              className="relative flex items-start gap-4 lg:gap-6"
            >
              {/* ── Node + Connector Column ── */}
              <div className="relative flex flex-col items-center shrink-0">
                {/* The node */}
                <div className="relative">
                  {/* Active pulse ring */}
                  {state === 'active' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#B8956A]"
                      animate={{
                        scale: [1, 1.6, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* Completed glow */}
                  {state === 'completed' && (
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: '0 0 16px rgba(184, 149, 106, 0.35)',
                      }}
                    />
                  )}

                  {/* Node circle */}
                  <motion.div
                    className={`
                      relative z-10 w-11 h-11 lg:w-12 lg:h-12 rounded-full
                      flex items-center justify-center text-lg
                      border-2 transition-colors duration-500
                      ${state === 'completed'
                        ? 'bg-[#B8956A] border-[#B8956A] text-[#15110D]'
                        : state === 'active'
                          ? 'bg-[#1e1812] border-[#B8956A] text-[#B8956A]'
                          : 'bg-[#1e1812] border-[#EDE3D0]/15 text-[#EDE3D0]/25'
                      }
                    `}
                    animate={state === 'active' ? {
                      scale: [1, 1.08, 1],
                    } : {}}
                    transition={state === 'active' ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    } : {}}
                  >
                    {state === 'completed' ? (
                      <Check size={18} strokeWidth={2.5} />
                    ) : (
                      <span className="text-base">{step.icon}</span>
                    )}
                  </motion.div>
                </div>

                {/* Vertical connector line */}
                {!isLast && (
                  <div className="relative w-px h-16 lg:h-20 my-1">
                    {/* Background line */}
                    <div
                      className={`
                        absolute inset-0 w-px
                        ${state === 'upcoming'
                          ? 'border-l border-dashed border-[#EDE3D0]/10'
                          : ''
                        }
                      `}
                      style={
                        state !== 'upcoming'
                          ? {
                              background: state === 'completed'
                                ? 'linear-gradient(to bottom, #B8956A, #B8956A)'
                                : 'linear-gradient(to bottom, #B8956A, rgba(184, 149, 106, 0.2))',
                            }
                          : undefined
                      }
                    />
                    {/* Animated fill for active step connector */}
                    {state === 'active' && (
                      <motion.div
                        className="absolute top-0 left-0 w-px bg-gradient-to-b from-[#B8956A] to-transparent"
                        initial={{ height: '0%' }}
                        animate={{ height: '60%' }}
                        transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* ── Content Column ── */}
              <div className="pt-2 pb-6 min-w-0">
                <h3
                  className={`
                    text-sm lg:text-base font-semibold tracking-wide transition-colors duration-500
                    ${state === 'completed'
                      ? 'text-[#B8956A]'
                      : state === 'active'
                        ? 'text-[#EDE3D0]'
                        : 'text-[#EDE3D0]/30'
                    }
                  `}
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {step.label}
                </h3>
                <p
                  className={`
                    text-xs lg:text-sm mt-1 leading-relaxed transition-colors duration-500
                    ${state === 'completed'
                      ? 'text-[#B8956A]/60'
                      : state === 'active'
                        ? 'text-[#EDE3D0]/60'
                        : 'text-[#EDE3D0]/20'
                    }
                  `}
                >
                  {step.description}
                </p>

                {/* Active step badge */}
                {state === 'active' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="mt-2.5"
                  >
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B8956A]/10 border border-[#B8956A]/20 text-[#B8956A] text-[10px] tracking-[0.15em] uppercase font-semibold"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-[#B8956A]"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      Current
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
