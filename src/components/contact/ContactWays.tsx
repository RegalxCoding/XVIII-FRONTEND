'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const cards = [
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    primary: 'hello@xviiibrewco.com',
    href: 'mailto:hello@xviiibrewco.com',
    details: ['General questions', 'Business enquiries', 'Bulk orders'],
    meta: 'Usually within 12 hours',
    metaLabel: 'Response time',
  },
  {
    id: 'phone',
    icon: Phone,
    label: 'Phone',
    primary: '+91 XXXXX XXXXX',
    href: 'tel:+91XXXXXXXXXX',
    details: ['Available'],
    meta: '10 AM – 10 PM',
    metaLabel: 'Hours',
  },
  {
    id: 'location',
    icon: MapPin,
    label: 'Location',
    primary: 'Kanpur, Uttar Pradesh',
    href: 'https://maps.google.com/?q=Kanpur,Uttar+Pradesh',
    details: ['Delivery available in selected areas.'],
    meta: null,
    metaLabel: null,
  },
];

export default function ContactWays() {
  return (
    <section
      id="contact-ways"
      className="bg-[#15110D] py-24 lg:py-36 overflow-hidden"
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
            Ways To Reach Us
          </span>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={card.id}
                href={card.href}
                target={card.id === 'location' ? '_blank' : undefined}
                rel={card.id === 'location' ? 'noopener noreferrer' : undefined}
                id={`contact-card-${card.id}`}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.8, delay: i * 0.12, ease }}
                whileHover={{ y: -4 }}
                className="group block relative p-8 lg:p-10 border border-[#EDE3D0]/[0.08]
                  bg-[#1a140e] hover:border-[#B8956A]/30 transition-all duration-500"
              >
                {/* Gold top line on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-[#B8956A]/0
                  group-hover:bg-[#B8956A]/50 transition-all duration-500" />

                {/* Icon */}
                <div className="mb-8">
                  <div className="w-12 h-12 border border-[#B8956A]/25 flex items-center justify-center
                    group-hover:border-[#B8956A]/55 transition-colors duration-400">
                    <Icon size={18} className="text-[#B8956A]" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Label */}
                <p
                  className="text-[#B8956A] text-[9px] tracking-[0.38em] uppercase mb-4"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {card.label}
                </p>

                {/* Primary info */}
                <p
                  className="text-[#EDE3D0] leading-tight mb-7
                    group-hover:text-[#EDE3D0] transition-colors duration-300"
                  style={{
                    fontFamily: card.id === 'email'
                      ? 'Helvetica Neue, Helvetica, Arial, sans-serif'
                      : 'Georgia, serif',
                    fontSize: card.id === 'email'
                      ? 'clamp(0.875rem, 1.2vw, 1rem)'
                      : 'clamp(1.1rem, 1.8vw, 1.375rem)',
                    fontWeight: card.id === 'email' ? 400 : 400,
                  }}
                >
                  {card.primary}
                </p>

                {/* Detail lines */}
                <div className="space-y-1.5 mb-8">
                  {card.details.map((d) => (
                    <p
                      key={d}
                      className="text-[#EDE3D0]/40 text-sm leading-relaxed"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      {d}
                    </p>
                  ))}
                </div>

                {/* Meta */}
                {card.meta && (
                  <div className="pt-6 border-t border-[#EDE3D0]/[0.07]">
                    <p
                      className="text-[#EDE3D0]/25 text-[9px] tracking-[0.3em] uppercase mb-1"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      {card.metaLabel}
                    </p>
                    <p
                      className="text-[#B8956A]/75 text-sm"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      {card.meta}
                    </p>
                  </div>
                )}
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
