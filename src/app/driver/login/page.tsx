'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

export default function DriverLogin() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Check if already logged in
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/driver/dashboard');
      }
    });
    return () => unsub();
  }, [router]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (error) {
      console.error('Error during signInWithPhoneNumber', error);
      alert('Failed to send OTP. Make sure phone number is in E.164 format (e.g. +91XXXXXXXXXX)');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    setIsLoading(true);
    try {
      await confirmationResult.confirm(otp);
      // Auth state observer will redirect
    } catch (error) {
      console.error('Error during OTP confirmation', error);
      alert('Invalid OTP code.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0e0b08]">
      {/* Invisible Recaptcha Container */}
      <div id="recaptcha-container"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#EDE3D0]" style={{ fontFamily: 'Cinzel, serif' }}>
            Driver Portal
          </h1>
          <p className="text-[#EDE3D0]/60 text-sm">
            {step === 'phone' ? 'Enter your registered phone number to access deliveries.' : 'Enter the OTP sent to your phone.'}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#B8956A]">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-[#EDE3D0]/5 border border-[#EDE3D0]/10 rounded-lg p-4 text-[#EDE3D0] focus:outline-none focus:border-[#B8956A] transition-colors"
                placeholder="+91 00000 00000"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || phoneNumber.length < 10}
              className="w-full bg-[#B8956A] text-[#0e0b08] font-semibold tracking-wide py-4 rounded-lg uppercase text-sm disabled:opacity-50 transition-opacity"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#B8956A]">
                6-Digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[#EDE3D0]/5 border border-[#EDE3D0]/10 rounded-lg p-4 text-[#EDE3D0] focus:outline-none focus:border-[#B8956A] transition-colors text-center tracking-widest"
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full bg-[#B8956A] text-[#0e0b08] font-semibold tracking-wide py-4 rounded-lg uppercase text-sm disabled:opacity-50 transition-opacity"
            >
              {isLoading ? 'Verifying...' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-[#EDE3D0]/40 text-sm mt-4 hover:text-[#EDE3D0] transition-colors"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
