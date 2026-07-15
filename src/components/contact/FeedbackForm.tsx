'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { feedbackService } from '@/services/feedback.service';

const ease = [0.22, 1, 0.36, 1] as const;

const inputBase =
  'w-full bg-transparent border-b border-[#EDE3D0]/15 pb-3 pt-1 text-[#EDE3D0] placeholder-[#EDE3D0]/25 text-sm outline-none focus:border-[#B8956A]/60 transition-colors duration-300 caret-[#B8956A]';

const labelBase =
  'block text-[#EDE3D0]/35 text-[9px] tracking-[0.35em] uppercase mb-2';

export default function FeedbackForm() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: '',
  });

  // Pre-fill from auth user on mount / auth change
  // We use a local state init pattern so the form remains editable
  const [prefilled, setPrefilled] = useState(false);
  if (!authLoading && isAuthenticated && user && !prefilled) {
    setPrefilled(true);
    setForm((prev) => ({
      ...prev,
      name: user.displayName || prev.name,
      email: user.email || prev.email,
    }));
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Auth gate
    if (!isAuthenticated) {
      router.push('/login?redirect=/contact');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await feedbackService.create({
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        orderNumber: form.orderNumber.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setSubmitted(true);
      setForm({ name: '', phone: '', email: '', orderNumber: '', subject: '', message: '' });
      setPrefilled(false);
    } catch (err) {
      console.error('[FeedbackForm] submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact-feedback"
      className="bg-[#15110D] py-24 lg:py-40 overflow-hidden"
    >
      <div className="container-brand">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">

          {/* Left — heading */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-10"
            >
              <div className="w-10 h-px bg-[#B8956A]" />
              <span
                className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Feedback
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 1, delay: 0.1, ease }}
              className="text-[#EDE3D0] leading-[0.9] tracking-tight mb-8"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                fontWeight: 700,
              }}
            >
              We&apos;d Love
              <br />
              <span style={{ fontFamily: 'Georgia, serif', color: '#B8956A' }}>
                To Hear
              </span>
              <br />
              From You.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.8, delay: 0.22, ease }}
              className="text-[#EDE3D0]/40 leading-[1.9] max-w-xs"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
              }}
            >
              Whether it&apos;s a compliment, a suggestion, or something we
              could do better — every message matters to us.
            </motion.p>

            {/* Auth hint for guests */}
            {!authLoading && !isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35, ease }}
                className="mt-8 flex items-start gap-3 p-4 border border-[#B8956A]/20 bg-[#B8956A]/5"
              >
                <Lock size={14} className="text-[#B8956A] mt-0.5 shrink-0" />
                <p
                  className="text-[#EDE3D0]/50 text-xs leading-relaxed"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  You&apos;ll need to{' '}
                  <button
                    onClick={() => router.push('/login?redirect=/contact')}
                    className="text-[#B8956A] underline underline-offset-2 hover:text-[#EDE3D0] transition-colors"
                  >
                    sign in
                  </button>{' '}
                  to submit feedback.
                </p>
              </motion.div>
            )}
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.9, delay: 0.18, ease }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="flex flex-col items-start gap-6 py-16"
                >
                  <CheckCircle size={40} className="text-[#B8956A]" strokeWidth={1.2} />
                  <div>
                    <p
                      className="text-[#EDE3D0] text-xl mb-2"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      Thank you for your feedback.
                    </p>
                    <p
                      className="text-[#EDE3D0]/40 text-sm leading-relaxed"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      Our team will review your message soon.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#B8956A]/60 text-xs tracking-[0.2em] uppercase hover:text-[#B8956A] transition-colors"
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-10"
                >
                  {/* Row 1: Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div>
                      <label htmlFor="cf-name" className={labelBase}>Name</label>
                      <input
                        id="cf-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        className={inputBase}
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="cf-phone" className={labelBase}>Phone Number</label>
                      <input
                        id="cf-phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+91 00000 00000"
                        value={form.phone}
                        onChange={handleChange}
                        className={inputBase}
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Email */}
                  <div>
                    <label htmlFor="cf-email" className={labelBase}>Email</label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      className={inputBase}
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    />
                  </div>

                  {/* Row 3: Order Number + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div>
                      <label htmlFor="cf-order" className={labelBase}>
                        Order Number{' '}
                        <span className="text-[#EDE3D0]/20 normal-case tracking-normal">(Optional)</span>
                      </label>
                      <input
                        id="cf-order"
                        name="orderNumber"
                        type="text"
                        placeholder="#ORD-000000"
                        value={form.orderNumber}
                        onChange={handleChange}
                        className={inputBase}
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="cf-subject" className={labelBase}>Subject</label>
                      <input
                        id="cf-subject"
                        name="subject"
                        type="text"
                        required
                        placeholder="What's on your mind?"
                        value={form.subject}
                        onChange={handleChange}
                        className={inputBase}
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="cf-message" className={labelBase}>Message</label>
                    <textarea
                      id="cf-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us everything..."
                      value={form.message}
                      onChange={handleChange}
                      className={`${inputBase} resize-none`}
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <p
                      className="text-red-400 text-xs"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
                    <motion.button
                      type="submit"
                      id="contact-send-feedback-btn"
                      disabled={isSubmitting}
                      whileHover={!isSubmitting ? { x: 4 } : {}}
                      className="inline-flex items-center gap-3
                        bg-[#B8956A] text-[#0e0b08]
                        px-10 py-4 text-xs tracking-[0.3em] uppercase font-bold
                        hover:bg-[#EDE3D0] transition-colors duration-300 group
                        disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      {isSubmitting ? 'Sending…' : 'Send Feedback'}
                      {!isSubmitting && (
                        <Send size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                      )}
                    </motion.button>
                    {!isAuthenticated && !authLoading && (
                      <p
                        className="text-[#B8956A]/60 text-[10px] tracking-[0.2em] uppercase"
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      >
                        Sign in required
                      </p>
                    )}
                    {isAuthenticated && (
                      <p
                        className="text-[#EDE3D0]/28 text-[10px] tracking-[0.25em] uppercase"
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      >
                        We read every message personally.
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
