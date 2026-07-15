'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { bulkOrdersService } from '@/services/bulk-orders.service';
import type { ContactMethod } from '@/types/contact.types';

const ease = [0.22, 1, 0.36, 1] as const;

const inputBase =
  'w-full bg-[#1a1410] border border-[#EDE3D0]/10 px-4 py-3 text-[#EDE3D0] placeholder-[#EDE3D0]/25 text-sm outline-none focus:border-[#B8956A]/50 transition-colors duration-200 caret-[#B8956A]';

const labelBase =
  'block text-[#EDE3D0]/35 text-[9px] tracking-[0.35em] uppercase mb-2';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTACT_METHODS: { value: ContactMethod; label: string; emoji: string }[] = [
  { value: 'phone', label: 'Phone Call', emoji: '📞' },
  { value: 'whatsapp', label: 'WhatsApp', emoji: '💬' },
  { value: 'email', label: 'Email', emoji: '✉️' },
];

const EVENT_TYPES = [
  'Office Event',
  'Birthday Party',
  'College Fest',
  'Corporate Gathering',
  'Private Celebration',
  'Wedding',
  'Engagement',
  'Anniversary',
  'Other',
];

export default function BulkOrderModal({ isOpen, onClose }: BulkOrderModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    preferredContact: 'whatsapp' as ContactMethod,
    eventType: '',
    eventDate: '',
    estimatedGuests: '',
    specialRequirements: '',
  });

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  }

  function handleContactMethod(method: ContactMethod) {
    setForm((prev) => ({ ...prev, preferredContact: method }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await bulkOrdersService.create({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        preferredContact: form.preferredContact,
        eventType: form.eventType,
        eventDate: form.eventDate,
        estimatedGuests: form.estimatedGuests.trim(),
        specialRequirements: form.specialRequirements.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('[BulkOrderModal] submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setSubmitted(false);
      setError(null);
      setForm({
        fullName: '', phone: '', email: '',
        preferredContact: 'whatsapp', eventType: '', eventDate: '',
        estimatedGuests: '', specialRequirements: '',
      });
    }, 400);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70"
            style={{ backdropFilter: 'blur(8px)' }}
            onClick={handleClose}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto flex flex-col"
              style={{
                background: 'linear-gradient(135deg, #1a1410 0%, #15110D 100%)',
                border: '1px solid rgba(184,149,106,0.25)',
                boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(184,149,106,0.05)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at top right, rgba(184,149,106,0.08) 0%, transparent 60%)',
                }}
              />

              {/* Header */}
              <div
                className="flex items-start justify-between p-6 lg:p-8 border-b flex-shrink-0"
                style={{ borderColor: 'rgba(184,149,106,0.12)' }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-px bg-[#B8956A]" />
                    <span
                      className="text-[#B8956A] text-[9px] tracking-[0.4em] uppercase"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      Bulk Order Request
                    </span>
                  </div>
                  <h2
                    className="text-[#EDE3D0] text-2xl lg:text-3xl"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Planning{' '}
                    <span style={{ color: '#B8956A' }}>Something</span> Big?
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close modal"
                  className="p-2 text-[#EDE3D0]/40 hover:text-[#EDE3D0] transition-colors flex-shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="flex flex-col items-center text-center py-12 gap-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#B8956A]/10 border border-[#B8956A]/20 flex items-center justify-center">
                        <CheckCircle size={32} className="text-[#B8956A]" strokeWidth={1.4} />
                      </div>
                      <div>
                        <p
                          className="text-[#EDE3D0] text-xl mb-3"
                          style={{ fontFamily: 'Georgia, serif' }}
                        >
                          Request Received!
                        </p>
                        <p
                          className="text-[#EDE3D0]/50 text-sm leading-relaxed max-w-sm"
                          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                        >
                          Thank you. Your bulk order request has been received.
                          Our team will contact you within 24 hours.
                        </p>
                      </div>
                      <button
                        onClick={handleClose}
                        className="mt-4 inline-flex items-center gap-2 bg-[#B8956A] text-[#0e0b08] px-8 py-3.5 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#EDE3D0] transition-colors"
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      >
                        Close
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-7"
                    >
                      {/* Row 1: Name + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="bo-name" className={labelBase}>Full Name</label>
                          <input
                            id="bo-name"
                            name="fullName"
                            type="text"
                            required
                            placeholder="Your full name"
                            value={form.fullName}
                            onChange={handleChange}
                            className={inputBase}
                            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label htmlFor="bo-phone" className={labelBase}>Phone Number</label>
                          <input
                            id="bo-phone"
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

                      {/* Email */}
                      <div>
                        <label htmlFor="bo-email" className={labelBase}>Email</label>
                        <input
                          id="bo-email"
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

                      {/* Preferred Contact Method */}
                      <div>
                        <p className={labelBase}>Preferred Contact Method</p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          {CONTACT_METHODS.map((m) => (
                            <button
                              key={m.value}
                              type="button"
                              onClick={() => handleContactMethod(m.value)}
                              className="flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.12em] uppercase font-medium transition-all duration-200"
                              style={{
                                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                                background: form.preferredContact === m.value
                                  ? 'rgba(184,149,106,0.15)'
                                  : 'rgba(255,255,255,0.03)',
                                border: form.preferredContact === m.value
                                  ? '1px solid rgba(184,149,106,0.5)'
                                  : '1px solid rgba(237,227,208,0.1)',
                                color: form.preferredContact === m.value
                                  ? '#B8956A'
                                  : 'rgba(237,227,208,0.4)',
                              }}
                            >
                              <span>{m.emoji}</span>
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Row: Event Type + Event Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="bo-event-type" className={labelBase}>Event Type</label>
                          <select
                            id="bo-event-type"
                            name="eventType"
                            required
                            value={form.eventType}
                            onChange={handleChange}
                            className={inputBase}
                            style={{
                              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                              appearance: 'none',
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23B8956A' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 1rem center',
                              paddingRight: '2.5rem',
                              color: form.eventType ? '#EDE3D0' : 'rgba(237,227,208,0.25)',
                            }}
                          >
                            <option value="" disabled style={{ color: 'rgba(237,227,208,0.3)', background: '#1a1410' }}>
                              Select event type
                            </option>
                            {EVENT_TYPES.map((t) => (
                              <option key={t} value={t} style={{ background: '#1a1410', color: '#EDE3D0' }}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="bo-event-date" className={labelBase}>Event Date</label>
                          <input
                            id="bo-event-date"
                            name="eventDate"
                            type="date"
                            required
                            value={form.eventDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={inputBase}
                            style={{
                              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                              colorScheme: 'dark',
                            }}
                          />
                        </div>
                      </div>

                      {/* Estimated Guests */}
                      <div>
                        <label htmlFor="bo-guests" className={labelBase}>Estimated Guests</label>
                        <input
                          id="bo-guests"
                          name="estimatedGuests"
                          type="text"
                          required
                          placeholder="e.g. 50–100 people"
                          value={form.estimatedGuests}
                          onChange={handleChange}
                          className={inputBase}
                          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                        />
                      </div>

                      {/* Special Requirements */}
                      <div>
                        <label htmlFor="bo-requirements" className={labelBase}>
                          Special Requirements{' '}
                          <span className="normal-case tracking-normal text-[#EDE3D0]/20">(Optional)</span>
                        </label>
                        <textarea
                          id="bo-requirements"
                          name="specialRequirements"
                          rows={3}
                          placeholder="Any dietary restrictions, preferred flavours, packaging needs..."
                          value={form.specialRequirements}
                          onChange={handleChange}
                          className={`${inputBase} resize-none`}
                          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                        />
                      </div>

                      {/* Error */}
                      {error && (
                        <p
                          className="text-red-400 text-xs"
                          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                        >
                          {error}
                        </p>
                      )}

                      {/* Submit */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          id="bulk-order-submit-btn"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#B8956A] text-[#0e0b08] px-10 py-4 text-xs tracking-[0.3em] uppercase font-bold hover:bg-[#EDE3D0] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Submitting…
                            </>
                          ) : (
                            <>
                              Submit Request
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
