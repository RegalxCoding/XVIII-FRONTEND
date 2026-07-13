'use client';

import { X, MapPin, Phone, User, CheckCircle2, ChevronDown, Calendar, Clock, Coffee } from 'lucide-react';
import StatusBadge, { STATUS_CONFIG } from './StatusBadge';
import type { AdminOrder, AdminOrderStatus } from '@/types/admin.types';
import { formatScheduledTime, getRelativeDateLabel } from '@/utils/timeSlots';

interface OrderDetailDrawerProps {
  order: AdminOrder;
  onClose: () => void;
  onStatusChange: (orderId: string, status: AdminOrderStatus) => void;
}

const ALL_STATUSES: AdminOrderStatus[] = [
  'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled',
];

const PAYMENT_LABELS: Record<string, string> = {
  cash_on_delivery: 'Cash on Delivery',
  online: 'Online Payment',
  card: 'Card',
};

export default function OrderDetailDrawer({
  order,
  onClose,
  onStatusChange,
}: OrderDetailDrawerProps) {
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  const handleMarkDelivered = () => {
    if (!isDelivered) onStatusChange(order.id, 'delivered');
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const sectionHeading: React.CSSProperties = {
    fontSize: '0.6875rem',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: 'rgba(237,227,208,0.3)',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    marginBottom: '0.875rem',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-lg overflow-y-auto"
        style={{
          background: '#1a1410',
          borderLeft: '1px solid rgba(184,149,106,0.18)',
          boxShadow: '-32px 0 80px rgba(0,0,0,0.6)',
          animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 py-5 sticky top-0 z-10 border-b"
          style={{ background: '#1a1410', borderColor: 'rgba(184,149,106,0.15)' }}
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h2
                className="text-lg font-semibold"
                style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
              >
                Order Details
              </h2>
              <StatusBadge status={order.status} />
            </div>
            <p
              className="text-xs font-mono"
              style={{ color: '#B8956A', fontFamily: 'monospace' }}
            >
              {order.id}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              {formatDate(order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg flex-shrink-0 transition-colors"
            style={{ color: 'rgba(237,227,208,0.4)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#EDE3D0'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.4)'; }}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-6 space-y-7">
          {/* ── Customer Info ── */}
          <section>
            <p style={sectionHeading}>Customer Information</p>
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(184,149,106,0.12)' }}
            >
              <div className="flex items-start gap-3">
                <User size={15} strokeWidth={1.6} style={{ color: '#B8956A', marginTop: '1px', flexShrink: 0 }} />
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {order.customerName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={15} strokeWidth={1.6} style={{ color: '#B8956A', marginTop: '1px', flexShrink: 0 }} />
                <p
                  className="text-sm"
                  style={{ color: 'rgba(237,227,208,0.7)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {order.customerPhone}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={15} strokeWidth={1.6} style={{ color: '#B8956A', marginTop: '1px', flexShrink: 0 }} />
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(237,227,208,0.7)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {order.customerAddress}
                </p>
              </div>
              {order.notes && (
                <div
                  className="mt-1 pt-3 border-t"
                  style={{ borderColor: 'rgba(184,149,106,0.1)' }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    Note:
                  </p>
                  <p
                    className="text-sm italic"
                    style={{ color: 'rgba(237,227,208,0.55)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    &ldquo;{order.notes}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ── Ordered Items ── */}
          <section>
            <p style={sectionHeading}>Ordered Items</p>
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(184,149,106,0.12)' }}
            >
              {order.items.map((item, idx) => (
                <div
                  key={item.productId + idx}
                  className="flex items-center gap-4 px-4 py-3.5"
                  style={{
                    borderBottom: idx < order.items.length - 1 ? '1px solid rgba(184,149,106,0.08)' : 'none',
                    background: idx % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                  }}
                >
                  {/* Qty bubble */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(184,149,106,0.15)', color: '#B8956A', fontFamily: 'monospace' }}
                  >
                    {item.quantity}
                  </div>
                  <p
                    className="flex-1 text-sm"
                    style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {item.productName}
                  </p>
                  <p
                    className="text-sm font-semibold flex-shrink-0"
                    style={{ color: '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Delivery Schedule (only for scheduled orders) ── */}
          {order.isScheduled && order.scheduledTimestamp && (
            <section>
              <p style={sectionHeading}>Delivery Schedule</p>
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(184,149,106,0.2)', background: 'rgba(184,149,106,0.05)' }}
              >
                {/* Dessert slot */}
                <div className="p-4 flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(184,149,106,0.12)' }}
                  >
                    <span className="text-base">🍰</span>
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-[9px] tracking-[0.2em] uppercase mb-1"
                      style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      Dessert Delivery
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={13} style={{ color: '#B8956A', flexShrink: 0 }} />
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
                      >
                        {getRelativeDateLabel(order.deliveryDate ?? '')} · {order.deliveryTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} style={{ color: 'rgba(184,149,106,0.5)', flexShrink: 0 }} />
                      <p
                        className="text-xs"
                        style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      >
                        {formatScheduledTime(order.scheduledTimestamp)}
                      </p>
                    </div>
                  </div>
                  {/* Scheduled badge */}
                  <div
                    className="flex-shrink-0 px-2 py-1 rounded text-[9px] tracking-[0.15em] uppercase font-bold"
                    style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308', border: '1px solid rgba(234,179,8,0.25)' }}
                  >
                    🟡 Scheduled
                  </div>
                </div>

                {/* Coffee fulfillment mode */}
                {order.containsCoffee && order.coffeeDeliveryMode && (
                  <div
                    className="flex items-start gap-4 p-4 border-t"
                    style={{ borderColor: 'rgba(184,149,106,0.12)', background: 'rgba(255,255,255,0.015)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(184,149,106,0.08)' }}
                    >
                      <Coffee size={15} style={{ color: '#B8956A' }} />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-[9px] tracking-[0.2em] uppercase mb-1"
                        style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      >
                        Coffee Fulfillment
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
                      >
                        {order.coffeeDeliveryMode === 'immediate'
                          ? '☕ Immediate delivery'
                          : `🍰 With dessert · ${order.deliveryTime}`
                        }
                      </p>
                    </div>
                    <div
                      className="flex-shrink-0 px-2 py-1 rounded text-[9px] tracking-[0.15em] uppercase font-bold"
                      style={order.coffeeDeliveryMode === 'immediate'
                        ? { background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }
                        : { background: 'rgba(184,149,106,0.12)', color: '#B8956A', border: '1px solid rgba(184,149,106,0.3)' }
                      }
                    >
                      {order.coffeeDeliveryMode === 'immediate' ? '🟢 Immediate' : '🍰 Bundled'}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Order Summary ── */}
          <section>
            <p style={sectionHeading}>Order Summary</p>
            <div
              className="rounded-xl p-4 space-y-2.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(184,149,106,0.12)' }}
            >
              {[
                { label: 'Subtotal', value: `₹${order.subtotal}` },
                { label: 'Delivery', value: `₹${order.deliveryCharge}` },
                { label: 'Payment', value: PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: 'rgba(237,227,208,0.45)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {row.label}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: 'rgba(237,227,208,0.7)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <div
                className="flex items-center justify-between pt-3 border-t"
                style={{ borderColor: 'rgba(184,149,106,0.15)' }}
              >
                <span
                  className="text-sm font-semibold tracking-[0.05em]"
                  style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Total
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: '#B8956A', fontFamily: 'Georgia, serif' }}
                >
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>
          </section>

          {/* ── Status Update ── */}
          <section>
            <p style={sectionHeading}>Update Status</p>
            <div className="relative">
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value as AdminOrderStatus)}
                disabled={isDelivered || isCancelled}
                className="w-full py-3 pl-4 pr-10 rounded-xl text-sm outline-none appearance-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${STATUS_CONFIG[order.status].color}40`,
                  color: STATUS_CONFIG[order.status].color,
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  cursor: isDelivered || isCancelled ? 'not-allowed' : 'pointer',
                  opacity: isDelivered || isCancelled ? 0.6 : 1,
                }}
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s} style={{ background: '#1a1410', color: STATUS_CONFIG[s].color }}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'rgba(237,227,208,0.4)' }}
              />
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div
          className="sticky bottom-0 px-6 py-4 border-t"
          style={{ background: '#1a1410', borderColor: 'rgba(184,149,106,0.15)' }}
        >
          <button
            id="mark-delivered-btn"
            onClick={handleMarkDelivered}
            disabled={isDelivered || isCancelled}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold tracking-[0.08em] transition-all duration-200"
            style={{
              background: isDelivered ? 'rgba(74,222,128,0.12)' : isCancelled ? 'rgba(255,255,255,0.05)' : '#4ade80',
              color: isDelivered ? '#4ade80' : isCancelled ? 'rgba(237,227,208,0.3)' : '#15110D',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              border: isDelivered ? '1px solid rgba(74,222,128,0.3)' : 'none',
              cursor: isDelivered || isCancelled ? 'not-allowed' : 'pointer',
              opacity: isCancelled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isDelivered && !isCancelled)
                (e.currentTarget as HTMLElement).style.background = '#86efac';
            }}
            onMouseLeave={(e) => {
              if (!isDelivered && !isCancelled)
                (e.currentTarget as HTMLElement).style.background = '#4ade80';
            }}
          >
            <CheckCircle2 size={17} strokeWidth={2} />
            {isDelivered ? 'Order Delivered ✓' : 'Mark As Delivered'}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
