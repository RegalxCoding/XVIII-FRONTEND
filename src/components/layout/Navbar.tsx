'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { NAV_LINKS } from '@/constants';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Reactive cart count from Zustand
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Reactive auth status from Zustand
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500
          ${isScrolled
            ? 'bg-[#15110D]/95 backdrop-blur-sm border-b border-[#B8956A]/20 py-3'
            : 'bg-transparent py-6'
          }
        `}
      >
        <div className="container-brand flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="The XVIII Brew Co. - Home">
            <div className="w-14 h-14 relative">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="50" cy="50" r="48" fill="#15110D" stroke="#B8956A" strokeWidth="2"/>
                <text x="50" y="44" textAnchor="middle" fill="#EDE3D0" fontSize="18" fontFamily="Georgia, serif" fontWeight="700" letterSpacing="2">THE</text>
                <text x="50" y="62" textAnchor="middle" fill="#B8956A" fontSize="24" fontFamily="Georgia, serif" fontWeight="900" letterSpacing="-1">XVIII</text>
                <text x="50" y="74" textAnchor="middle" fill="#EDE3D0" fontSize="8" fontFamily="Georgia, serif" letterSpacing="3">BREW CO.</text>
              </svg>
            </div>
            <div className="hidden sm:block">
              <span
                className="block text-[#EDE3D0] text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                The
              </span>
              <span
                className="block text-[#EDE3D0] text-base font-bold tracking-[0.15em] uppercase leading-none"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                XVIII Brew Co.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  text-[#EDE3D0]/70 hover:text-[#EDE3D0] transition-colors duration-300
                  text-xs tracking-[0.2em] uppercase font-medium
                  relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px
                  after:bg-[#B8956A] after:transition-all after:duration-300
                  hover:after:w-full
                "
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Cart + Mobile Toggle */}
          <div className="flex items-center gap-3">

            {/* ── Cart Icon — desktop + mobile ── */}
            <Link
              href="/cart"
              id="navbar-cart-btn"
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
              className="
                relative flex items-center gap-2
                text-[#EDE3D0]/70 hover:text-[#EDE3D0]
                px-3 py-2 transition-colors duration-300
              "
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="
                      absolute -top-1 -right-1
                      min-w-[18px] h-[18px] px-1
                      bg-[#B8956A] text-[#15110D]
                      text-[9px] font-bold
                      flex items-center justify-center
                      rounded-full leading-none
                    "
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Sign In / Sign Out CTA — desktop only */}
            {isAuthenticated ? (
              <button
                onClick={() => logout()}
                id="navbar-auth-btn"
                className="
                  hidden lg:inline-flex items-center
                  border border-[#B8956A]/30 text-[#B8956A]
                  px-5 py-2 text-xs tracking-[0.2em] uppercase font-bold
                  transition-all duration-300
                  hover:bg-[#B8956A]/10 hover:border-[#B8956A]
                  active:scale-95 cursor-pointer
                "
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                id="navbar-auth-btn"
                className="
                  hidden lg:inline-flex items-center
                  border border-[#B8956A]/30 text-[#B8956A]
                  px-5 py-2 text-xs tracking-[0.2em] uppercase font-bold
                  transition-all duration-300
                  hover:bg-[#B8956A]/10 hover:border-[#B8956A]
                  active:scale-95
                "
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Sign In
              </Link>
            )}

            {/* Order Now CTA — desktop only */}
            <Link
              href="/menu"
              id="navbar-order-cta"
              className="
                hidden lg:inline-flex items-center
                bg-[#B8956A] text-[#15110D]
                px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-bold
                transition-all duration-300
                hover:bg-[#EDE3D0]
                active:scale-95
              "
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Order Now
            </Link>

            <button
              id="navbar-mobile-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden text-[#EDE3D0] p-2"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#15110D] flex flex-col"
          >
            {/* Close button row */}
            <div className="flex justify-end p-6 pt-8">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-[#EDE3D0] p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile nav links */}
            <div className="flex-1 flex flex-col justify-center px-8 gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-[#EDE3D0] text-4xl font-light tracking-tight hover:text-[#B8956A] transition-colors duration-200"
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="pt-4 border-t border-[#B8956A]/20 flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <Link
                    href="/menu"
                    onClick={() => setIsMobileOpen(false)}
                    className="
                      flex-grow inline-flex items-center justify-center
                      bg-[#B8956A] text-[#15110D]
                      py-3.5 text-xs tracking-[0.25em] uppercase font-bold
                      hover:bg-[#EDE3D0] transition-colors duration-300
                    "
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    Order Now
                  </Link>

                  {/* Cart link — mobile menu */}
                  <Link
                    href="/cart"
                    onClick={() => setIsMobileOpen(false)}
                    id="mobile-cart-link"
                    className="
                      flex-grow inline-flex items-center justify-center gap-2
                      border border-[#B8956A]/30 text-[#EDE3D0]/70
                      py-3.5 text-xs tracking-[0.25em] uppercase font-medium
                      hover:border-[#B8956A] hover:text-[#EDE3D0] transition-colors duration-300
                    "
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    <ShoppingBag size={14} />
                    Cart
                    {totalItems > 0 && (
                      <span
                        className="bg-[#B8956A] text-[#15110D] text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      >
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileOpen(false);
                    }}
                    className="
                      w-full inline-flex items-center justify-center gap-2
                      border border-[#B8956A]/30 text-[#EDE3D0]/70
                      py-3.5 text-xs tracking-[0.25em] uppercase font-medium
                      hover:border-[#B8956A] hover:text-[#EDE3D0] transition-colors duration-300
                      cursor-pointer
                    "
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="
                      w-full inline-flex items-center justify-center gap-2
                      border border-[#B8956A]/30 text-[#EDE3D0]/70
                      py-3.5 text-xs tracking-[0.25em] uppercase font-medium
                      hover:border-[#B8956A] hover:text-[#EDE3D0] transition-colors duration-300
                    "
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    Sign In
                  </Link>
                )}
              </motion.div>
            </div>

            {/* Footer note */}
            <div className="p-8 border-t border-[#B8956A]/10">
              <p
                className="text-[#EDE3D0]/30 text-[10px] tracking-[0.3em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Something Has Been Steeping.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
