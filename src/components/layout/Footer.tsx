'use client';

import Link from 'next/link';
import { MessageCircle, MapPin, Mail } from 'lucide-react';
import { NAV_LINKS, BRAND } from '@/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#15110D] border-t border-[#B8956A]/20">
      {/* Main footer grid */}
      <div className="container-brand pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <p
                className="text-[#EDE3D0]/40 text-[10px] tracking-[0.4em] uppercase mb-2"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Est. 2024
              </p>
              <h2
                className="text-[#EDE3D0] text-3xl font-bold leading-tight mb-1"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                The XVIII
              </h2>
              <h2
                className="text-[#B8956A] text-3xl font-bold leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Brew Co.
              </h2>
            </div>
            <p
              className="text-[#EDE3D0]/50 text-sm leading-relaxed max-w-xs mb-8"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Crafted coffee and extraordinary desserts. Every cup intentional. Every bite considered.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-10 h-10 border border-[#B8956A]/30 flex items-center justify-center text-[#EDE3D0]/50 hover:text-[#B8956A] hover:border-[#B8956A] transition-all duration-300"
              >
                {/* Instagram icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className="w-10 h-10 border border-[#B8956A]/30 flex items-center justify-center text-[#EDE3D0]/50 hover:text-[#B8956A] hover:border-[#B8956A] transition-all duration-300"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="text-[#EDE3D0]/40 text-[10px] tracking-[0.35em] uppercase mb-6"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Navigate
            </h3>
            <nav className="flex flex-col gap-4" aria-label="Footer navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#EDE3D0]/60 hover:text-[#EDE3D0] transition-colors duration-200 text-sm"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-[#EDE3D0]/40 text-[10px] tracking-[0.35em] uppercase mb-6"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Contact
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-start gap-3 text-[#EDE3D0]/60 hover:text-[#EDE3D0] transition-colors duration-200 text-sm"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                <Mail size={14} className="mt-0.5 shrink-0 text-[#B8956A]" />
                {BRAND.email}
              </a>
              <div
                className="flex items-start gap-3 text-[#EDE3D0]/60 text-sm"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#B8956A]" />
                {BRAND.address}
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/menu"
                className="
                  inline-flex items-center
                  bg-[#B8956A] text-[#15110D]
                  px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold
                  hover:bg-[#EDE3D0] transition-colors duration-300
                "
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#B8956A]/10 container-brand py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p
          className="text-[#EDE3D0]/25 text-xs tracking-[0.15em]"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          © {year} The XVIII Brew Co. All rights reserved.
        </p>
        <p
          className="text-[#B8956A]/40 text-[10px] tracking-[0.3em] uppercase"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Something Has Been Steeping.
        </p>
      </div>
    </footer>
  );
}
