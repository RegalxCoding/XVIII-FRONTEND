'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, CheckCircle, LogOut, AlertCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { RecaptchaVerifier, type ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Interface for type-safe window extension without using "any"
interface WindowWithRecaptcha extends Window {
  recaptchaVerifier?: RecaptchaVerifier;
}

export default function LoginForm() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((s) => s.items);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Initialize invisible recaptcha verifier
  const initRecaptcha = () => {
    if (typeof window === 'undefined') return null;
    const customWindow = window as unknown as WindowWithRecaptcha;
    try {
      // Return existing verifier if initialized to avoid duplicate mounting
      if (customWindow.recaptchaVerifier) {
        return customWindow.recaptchaVerifier;
      }

      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try sending the verification code again.');
        },
      });

      customWindow.recaptchaVerifier = verifier;
      return verifier;
    } catch (err: unknown) {
      console.error('Failed to initialize ReCAPTCHA', err);
      setError('Failed to configure security verification.');
      return null;
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const customWindow = window as unknown as WindowWithRecaptcha;
    try {
      const verifier = initRecaptcha();
      if (!verifier) {
        throw new Error('ReCAPTCHA verifier could not be established.');
      }

      let formattedPhone = phone.trim();
      // Ensure number has a country code prefix. Default to +91 (India) if it starts with 10 digits
      if (!formattedPhone.startsWith('+')) {
        if (/^\d{10}$/.test(formattedPhone)) {
          formattedPhone = `+91${formattedPhone}`;
        } else {
          throw new Error('Please enter a valid 10-digit mobile number, or include your country code (e.g. +91).');
        }
      }

      // Verify overall format
      if (!/^\+?[1-9]\d{1,14}$/.test(formattedPhone)) {
        throw new Error('Invalid phone number format. Please check and try again.');
      }

      const result = await authService.sendOtp(formattedPhone, verifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: unknown) {
      console.error('Error sending OTP:', err);
      const ex = err as Error;
      // Clean up verifier on failure so next attempt gets a fresh verifier
      if (customWindow.recaptchaVerifier) {
        try {
          customWindow.recaptchaVerifier.clear();
          customWindow.recaptchaVerifier = undefined;
        } catch (clearErr) {
          console.error(clearErr);
        }
      }
      setError(ex.message || 'Unable to send SMS verification code. Please check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!confirmationResult) {
        throw new Error('Verification session has expired. Please request a new code.');
      }

      const cleanOtp = otp.trim();
      if (cleanOtp.length !== 6 || !/^\d+$/.test(cleanOtp)) {
        throw new Error('Please enter a valid 6-digit numerical code.');
      }

      await authService.confirmOtp(confirmationResult, cleanOtp);
      // Success: useAuthStore onAuthStateChange listener will capture the signed-in user and update state.
    } catch (err: unknown) {
      console.error('Error verifying OTP:', err);
      const ex = err as { code?: string; message?: string };
      setError(
        ex.code === 'auth/invalid-verification-code'
          ? 'The verification code entered is incorrect. Please try again.'
          : ex.message || 'OTP verification failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError(null);
    setConfirmationResult(null);
  };

  // Redirect if logged in
  if (isAuthenticated && user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#1e1812] border border-[#B8956A]/15 p-8 md:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative background logo */}
        <div className="absolute -right-10 -bottom-10 opacity-2 select-none pointer-events-none text-9xl font-bold text-[#B8956A] font-serif">
          XVIII
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 bg-[#B8956A]/10 border border-[#B8956A]/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={32} className="text-[#B8956A]" />
          </div>

          <h2
            className="text-[#EDE3D0] text-xl mb-2 tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
          >
            Welcome Back
          </h2>
          <p className="text-[#EDE3D0]/60 text-sm mb-8 font-light tracking-wide">
            Authenticated via {user.phoneNumber}
          </p>

          <div className="w-full space-y-4">
            {cartItemsCount > 0 ? (
              <button
                onClick={() => router.push('/cart')}
                className="w-full py-4 text-xs font-bold uppercase tracking-[0.25em] bg-[#B8956A] text-[#15110D] hover:bg-[#EDE3D0] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Proceed to Checkout ({cartItemsCount} item{cartItemsCount !== 1 ? 's' : ''})
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => router.push('/menu')}
                className="w-full py-4 text-xs font-bold uppercase tracking-[0.25em] bg-[#B8956A] text-[#15110D] hover:bg-[#EDE3D0] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Browse Our Menu
                <ArrowRight size={14} />
              </button>
            )}

            <button
              onClick={() => logout()}
              className="w-full py-4 text-xs font-bold uppercase tracking-[0.25em] border border-[#B8956A]/30 text-[#B8956A] hover:bg-[#B8956A]/10 hover:border-[#B8956A] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md bg-[#1e1812] border border-[#B8956A]/15 p-8 md:p-10 shadow-2xl relative"
    >
      {/* Invisible ReCAPTCHA placeholder */}
      <div id="recaptcha-container" className="hidden"></div>

      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <motion.div
            key="phone-step"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-[#B8956A]" />
              <h2
                className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Secure Sign In
              </h2>
            </div>

            <h1
              className="text-[#EDE3D0] text-3xl mb-3 tracking-widest font-normal uppercase"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              Sign In
            </h1>
            <p className="text-[#EDE3D0]/50 text-xs mb-8 tracking-wide leading-relaxed font-light">
              Enter your mobile number to receive a one-time secure passcode.
            </p>

            {error && (
              <div className="flex items-start gap-3 bg-red-950/20 border border-red-900/30 p-4 mb-6">
                <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-200/80 text-xs leading-relaxed tracking-wide">{error}</p>
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[#EDE3D0]/60 text-[10px] uppercase tracking-[0.2em] font-medium">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8956A] text-sm font-medium">
                    <Phone size={16} className="opacity-70" />
                  </span>
                  <input
                    type="tel"
                    placeholder="e.g. 98765 43210 or +919876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full bg-[#15110D] border border-[#B8956A]/20 focus:border-[#B8956A] text-[#EDE3D0] pl-11 pr-4 py-3.5 outline-none transition-all duration-300 text-sm tracking-widest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full py-4 text-xs font-bold uppercase tracking-[0.25em] bg-[#B8956A] text-[#15110D] hover:bg-[#EDE3D0] disabled:bg-[#EDE3D0]/10 disabled:text-[#EDE3D0]/20 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP Code
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleBackToPhone}
              className="flex items-center gap-2 text-[#B8956A] hover:text-[#EDE3D0] text-[10px] tracking-[0.2em] uppercase mb-6 group transition-colors duration-300"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
              Change Number
            </button>

            <h1
              className="text-[#EDE3D0] text-3xl mb-3 tracking-widest font-normal uppercase"
              style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
            >
              Verify Code
            </h1>
            <p className="text-[#EDE3D0]/50 text-xs mb-8 tracking-wide leading-relaxed font-light">
              We sent a 6-digit verification code to <span className="text-[#B8956A] font-medium">{phone}</span>.
            </p>

            {error && (
              <div className="flex items-start gap-3 bg-red-950/20 border border-red-900/30 p-4 mb-6">
                <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-200/80 text-xs leading-relaxed tracking-wide">{error}</p>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[#EDE3D0]/60 text-[10px] uppercase tracking-[0.2em] font-medium">
                  Verification Code
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8956A]">
                    <Lock size={16} className="opacity-70" />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full bg-[#15110D] border border-[#B8956A]/20 focus:border-[#B8956A] text-[#EDE3D0] pl-11 pr-4 py-3.5 outline-none transition-all duration-300 text-sm tracking-[0.5em] text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-4 text-xs font-bold uppercase tracking-[0.25em] bg-[#B8956A] text-[#15110D] hover:bg-[#EDE3D0] disabled:bg-[#EDE3D0]/10 disabled:text-[#EDE3D0]/20 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Sign In
                    <CheckCircle size={14} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
