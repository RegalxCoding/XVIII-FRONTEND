'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Loader2 } from 'lucide-react';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onContinue: (email: string) => Promise<void>;
  onSkip: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function EmailCaptureModal({ isOpen, onContinue, onSkip }: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (e: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e);
  };

  const handleContinue = async () => {
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onContinue(email.trim());
    } catch (err) {
      setError('Failed to save email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease }}
            className="relative w-full max-w-md bg-[#1a1410] border border-[#B8956A]/20 shadow-2xl p-8"
          >
            <button
              onClick={onSkip}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-[#EDE3D0]/40 hover:text-[#B8956A] transition-colors disabled:opacity-50"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-16 h-16 rounded-full bg-[#B8956A]/10 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-[#B8956A]" />
              </div>
              
              <h3 className="text-[#EDE3D0] text-2xl mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Where should we send your receipt?
              </h3>
              
              <p className="text-[#EDE3D0]/60 text-sm leading-relaxed mb-8">
                Add your email once and we'll send all your XVIII Brew order receipts here.
              </p>

              <div className="w-full space-y-6">
                <div className="space-y-2 text-left">
                  <label className="text-[#EDE3D0]/60 text-[10px] tracking-[0.2em] uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="you@example.com"
                    className={`w-full bg-[#15110D] border ${error ? 'border-red-500/50' : 'border-[#B8956A]/20'} text-[#EDE3D0] p-4 focus:outline-none focus:border-[#B8956A] transition-colors`}
                  />
                  {error && <p className="text-red-400/80 text-xs mt-1">{error}</p>}
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleContinue}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-4 text-xs tracking-[0.2em] uppercase font-bold bg-[#B8956A] text-[#15110D] hover:bg-[#EDE3D0] transition-colors group"
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>Continue <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                  
                  <button
                    onClick={onSkip}
                    disabled={isSubmitting}
                    className="w-full py-4 text-xs tracking-[0.2em] uppercase transition-colors disabled:opacity-50 hover:text-[#B8956A]"
                    style={{
                      color: 'rgba(237,227,208,0.5)',
                      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    }}
                  >
                    Skip Receipt
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
