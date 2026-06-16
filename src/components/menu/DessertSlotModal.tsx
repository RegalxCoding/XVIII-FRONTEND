'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import type { MenuProduct } from '@/data/menuData';
import type { DessertSlot } from '@/utils/timeSlots';
import {
  getAvailableDates,
  getAvailableSlotsForDate,
  buildDessertSlot,
  getRelativeDateLabel,
  type SlotOption,
} from '@/utils/timeSlots';
import { useCartStore } from '@/store/cart.store';

// ─────────────────────────────────────────
// Props
// ─────────────────────────────────────────

interface DessertSlotModalProps {
  /** The dessert product being added. Null = slot-edit mode (no add to cart). */
  product: MenuProduct | null;
  /** Called when user confirms slot — adds product to cart and saves slot */
  onConfirm: (product: MenuProduct | null, slot: DessertSlot) => void;
  onClose: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

// ─────────────────────────────────────────
// DessertSlotModal
// ─────────────────────────────────────────

export default function DessertSlotModal({ product, onConfirm, onClose }: DessertSlotModalProps) {
  const existingSlot = useCartStore(s => s.dessertSlot);

  const [todayISO, setTodayISO] = useState('');
  const [tomorrowISO, setTomorrowISO] = useState('');
  const [todayDisabled, setTodayDisabled] = useState(false);
  const [todayDisabledReason, setTodayDisabledReason] = useState<string | undefined>();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // ── Initialise on mount ──
  useEffect(() => {
    const dates = getAvailableDates();
    setTodayISO(dates.todayISO);
    setTomorrowISO(dates.tomorrowISO);
    setTodayDisabled(dates.todayDisabled);
    setTodayDisabledReason(dates.todayDisabledReason);

    // If user is editing an existing slot, pre-select it
    if (existingSlot) {
      const preDate = existingSlot.isoDate;
      const preTime = existingSlot.time;
      // Validate pre-selected date is still valid (today/tomorrow)
      if (preDate === dates.todayISO || preDate === dates.tomorrowISO) {
        setSelectedDate(preDate);
        setSelectedTime(preTime);
        return;
      }
    }

    // Default: tomorrow if today is fully disabled, else today
    const defaultDate = dates.todayDisabled ? dates.tomorrowISO : dates.todayISO;
    setSelectedDate(defaultDate);
  }, [existingSlot]);

  // ── Update slot list when date changes ──
  useEffect(() => {
    if (!selectedDate) return;
    const available = getAvailableSlotsForDate(selectedDate);
    setSlots(available);
    // If previously selected time is now disabled on the new date, clear it
    if (selectedTime) {
      const current = available.find(s => s.label === selectedTime);
      if (current?.isDisabled) setSelectedTime('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const canConfirm = selectedDate !== '' && selectedTime !== '';

  const handleConfirm = () => {
    if (!canConfirm) return;
    const slot = buildDessertSlot(selectedDate, selectedTime);
    onConfirm(product, slot);
  };

  const isEditMode = product === null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.35, ease }}
          className="relative w-full max-w-lg z-10 flex flex-col"
          style={{
            background: '#1a1410',
            border: '1px solid rgba(184,149,106,0.2)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div
            className="flex items-start justify-between p-6 pb-5 border-b sticky top-0 z-10"
            style={{ background: '#1a1410', borderColor: 'rgba(184,149,106,0.15)' }}
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Calendar className="w-4 h-4" style={{ color: '#B8956A' }} />
                <h2
                  className="text-lg font-semibold"
                  style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
                >
                  {isEditMode ? 'Edit Delivery Slot' : 'Schedule Dessert Delivery'}
                </h2>
              </div>
              {product && (
                <p
                  className="text-xs"
                  style={{
                    color: 'rgba(184,149,106,0.8)',
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  }}
                >
                  {product.name} · ₹{product.price.toLocaleString('en-IN')}
                </p>
              )}
              {isEditMode && (
                <p
                  className="text-xs"
                  style={{
                    color: 'rgba(237,227,208,0.4)',
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  }}
                >
                  Applies to all desserts in your cart
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 flex-shrink-0 transition-colors"
              style={{ color: 'rgba(237,227,208,0.4)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EDE3D0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.4)'; }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="p-6 space-y-7 flex-1">

            {/* ── Date Selection ── */}
            <div>
              <p
                className="text-[10px] tracking-[0.25em] uppercase mb-4"
                style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Delivery Date
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Today */}
                <button
                  onClick={() => !todayDisabled && setSelectedDate(todayISO)}
                  disabled={todayDisabled}
                  className="relative p-4 text-left transition-all duration-200"
                  style={{
                    background: selectedDate === todayISO
                      ? 'rgba(184,149,106,0.15)'
                      : todayDisabled
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(255,255,255,0.03)',
                    border: selectedDate === todayISO
                      ? '1px solid rgba(184,149,106,0.5)'
                      : '1px solid rgba(184,149,106,0.12)',
                    opacity: todayDisabled ? 0.45 : 1,
                    cursor: todayDisabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  <p
                    className="text-sm font-semibold mb-0.5"
                    style={{
                      color: selectedDate === todayISO ? '#B8956A' : '#EDE3D0',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    Today
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {todayISO
                      ? new Date(todayISO + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
                      : '—'
                    }
                  </p>
                  {todayDisabled && (
                    <p className="text-[9px] mt-1.5" style={{ color: 'rgba(251,146,60,0.7)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      No slots left
                    </p>
                  )}
                  {selectedDate === todayISO && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: '#B8956A' }} />
                  )}
                </button>

                {/* Tomorrow */}
                <button
                  onClick={() => setSelectedDate(tomorrowISO)}
                  className="relative p-4 text-left transition-all duration-200"
                  style={{
                    background: selectedDate === tomorrowISO
                      ? 'rgba(184,149,106,0.15)'
                      : 'rgba(255,255,255,0.03)',
                    border: selectedDate === tomorrowISO
                      ? '1px solid rgba(184,149,106,0.5)'
                      : '1px solid rgba(184,149,106,0.12)',
                    cursor: 'pointer',
                  }}
                >
                  <p
                    className="text-sm font-semibold mb-0.5"
                    style={{
                      color: selectedDate === tomorrowISO ? '#B8956A' : '#EDE3D0',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    Tomorrow
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {tomorrowISO
                      ? new Date(tomorrowISO + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
                      : '—'
                    }
                  </p>
                  {selectedDate === tomorrowISO && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: '#B8956A' }} />
                  )}
                </button>
              </div>

              {/* Today disabled note */}
              {todayDisabled && todayDisabledReason && (
                <div className="flex items-start gap-2 mt-3">
                  <AlertCircle size={13} className="mt-0.5 flex-shrink-0" style={{ color: 'rgba(251,146,60,0.6)' }} />
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: 'rgba(251,146,60,0.7)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {todayDisabledReason}
                  </p>
                </div>
              )}
            </div>

            {/* ── Time Selection ── */}
            {selectedDate && (
              <div>
                <p
                  className="text-[10px] tracking-[0.25em] uppercase mb-4"
                  style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Delivery Time · {getRelativeDateLabel(selectedDate)}
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map(slot => (
                    <button
                      key={slot.label}
                      onClick={() => !slot.isDisabled && setSelectedTime(slot.label)}
                      disabled={slot.isDisabled}
                      title={slot.disabledReason}
                      className="relative px-2 py-3 text-center transition-all duration-150 text-xs"
                      style={{
                        background: selectedTime === slot.label
                          ? '#B8956A'
                          : slot.isDisabled
                            ? 'rgba(255,255,255,0.02)'
                            : 'rgba(255,255,255,0.04)',
                        border: selectedTime === slot.label
                          ? '1px solid #B8956A'
                          : slot.isDisabled
                            ? '1px solid rgba(184,149,106,0.06)'
                            : '1px solid rgba(184,149,106,0.15)',
                        color: selectedTime === slot.label
                          ? '#15110D'
                          : slot.isDisabled
                            ? 'rgba(237,227,208,0.2)'
                            : 'rgba(237,227,208,0.7)',
                        cursor: slot.isDisabled ? 'not-allowed' : 'pointer',
                        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                        fontWeight: selectedTime === slot.label ? 700 : 400,
                      }}
                    >
                      {slot.label}
                      {slot.isDisabled && (
                        <span
                          className="absolute bottom-0.5 left-0 right-0 text-center"
                          style={{ fontSize: '7px', color: 'rgba(237,227,208,0.15)' }}
                        >
                          ✗
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <div className="w-2.5 h-px" style={{ background: 'rgba(184,149,106,0.4)' }} />
                  <p
                    className="text-[9px] tracking-[0.15em] uppercase"
                    style={{ color: 'rgba(237,227,208,0.2)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    <Clock size={9} className="inline mr-1 opacity-60" />
                    Greyed slots require minimum 6-hour advance
                  </p>
                </div>
              </div>
            )}

            {/* ── Selection summary ── */}
            {selectedDate && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4"
                style={{
                  background: 'rgba(184,149,106,0.08)',
                  border: '1px solid rgba(184,149,106,0.2)',
                }}
              >
                <Calendar size={14} style={{ color: '#B8956A', flexShrink: 0 }} />
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
                  >
                    {getRelativeDateLabel(selectedDate)}, {selectedTime}
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    Your dessert{product ? '' : 's'} will be delivered at this time
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Footer ── */}
          <div
            className="flex items-center gap-3 p-6 border-t sticky bottom-0"
            style={{ background: '#1a1410', borderColor: 'rgba(184,149,106,0.12)' }}
          >
            <button
              onClick={onClose}
              className="flex-1 py-3.5 text-xs tracking-[0.2em] uppercase transition-colors duration-200"
              style={{
                border: '1px solid rgba(184,149,106,0.2)',
                color: 'rgba(237,227,208,0.5)',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#EDE3D0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.5)'; }}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="flex-[2] flex items-center justify-center gap-2 py-3.5 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-200"
              style={{
                background: canConfirm ? '#B8956A' : 'rgba(184,149,106,0.12)',
                color: canConfirm ? '#15110D' : 'rgba(237,227,208,0.2)',
                cursor: canConfirm ? 'pointer' : 'not-allowed',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              }}
              onMouseEnter={e => {
                if (canConfirm) (e.currentTarget as HTMLElement).style.background = '#EDE3D0';
              }}
              onMouseLeave={e => {
                if (canConfirm) (e.currentTarget as HTMLElement).style.background = '#B8956A';
              }}
            >
              {isEditMode ? 'Save Slot' : (
                <>
                  Confirm & Add
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
