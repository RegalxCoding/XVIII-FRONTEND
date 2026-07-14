'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    id: 'faq-bulk',
    question: 'Can I place bulk orders?',
    answer:
      'Yes, absolutely. We accept bulk orders for events, celebrations, office gatherings, and more. Get in touch via email or use the Bulk Order form above — our team will work with you to customize quantities, flavours, and packaging.',
  },
  {
    id: 'faq-notice',
    question: 'How much notice is required?',
    answer:
      'For standard orders, same-day delivery is available within our service areas. For bulk or custom orders, we recommend at least 48–72 hours advance notice to ensure quality and availability. For large events, 5–7 days is ideal.',
  },
  {
    id: 'faq-events',
    question: 'Do you cater private events?',
    answer:
      'Yes. We cater birthday parties, corporate events, college fests, private dinners, and more. Our catering packages include curated coffee service and dessert platters. Reach out to us to discuss your event requirements.',
  },
  {
    id: 'faq-customize',
    question: 'Can I customize desserts?',
    answer:
      'Many of our desserts can be customized for flavour preferences, dietary restrictions, or branding needs for events. Custom orders typically require a few days of lead time. Contact us with your specific requirements and we\'ll let you know what\'s possible.',
  },
];

export default function ContactFAQ() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section
      id="contact-faq"
      className="bg-[#0e0b08] py-24 lg:py-40 overflow-hidden"
    >
      <div className="container-brand">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-14 lg:mb-20"
        >
          <div className="w-10 h-px bg-[#B8956A]" />
          <span
            className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            FAQ
          </span>
        </motion.div>

        {/* Two-column on lg: heading left, accordion right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24">

          {/* Left — heading */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.h2
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="text-[#EDE3D0] leading-[0.92] tracking-tight"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)',
                fontWeight: 700,
              }}
            >
              Common
              <br />
              <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>
                Questions.
              </span>
            </motion.h2>
          </div>

          {/* Right — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="divide-y divide-[#EDE3D0]/[0.07]"
          >
            {faqs.map((faq, i) => {
              const isOpen = open === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease }}
                  className="py-6 lg:py-7"
                >
                  {/* Question row */}
                  <button
                    id={faq.id}
                    type="button"
                    onClick={() => setOpen(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-6 text-left group"
                  >
                    <span
                      className={`leading-snug transition-colors duration-300 ${
                        isOpen ? 'text-[#EDE3D0]' : 'text-[#EDE3D0]/65 group-hover:text-[#EDE3D0]'
                      }`}
                      style={{
                        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                        fontSize: 'clamp(0.9375rem, 1.3vw, 1.0625rem)',
                        fontWeight: 500,
                      }}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 w-8 h-8 border flex items-center justify-center transition-all duration-400 ${
                        isOpen
                          ? 'border-[#B8956A]/50 text-[#B8956A]'
                          : 'border-[#EDE3D0]/12 text-[#EDE3D0]/35 group-hover:border-[#B8956A]/30 group-hover:text-[#B8956A]/70'
                      }`}
                    >
                      {isOpen ? <Minus size={14} strokeWidth={1.5} /> : <Plus size={14} strokeWidth={1.5} />}
                    </span>
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p
                          className="pt-5 pb-1 text-[#EDE3D0]/45 leading-[1.85]"
                          style={{
                            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                            fontSize: 'clamp(0.875rem, 1.15vw, 1rem)',
                          }}
                        >
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
