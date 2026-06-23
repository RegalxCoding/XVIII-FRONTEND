'use client';

import { motion } from 'framer-motion';
import {
  Package,
  MapPin,
  CreditCard,
  Clock,
  CalendarDays,
  Coffee,
  Cake,
} from 'lucide-react';
import type { AdminOrder } from '@/types/admin.types';
import { formatPrice } from '@/utils/helpers';
import { formatScheduledTime } from '@/utils/timeSlots';

interface OrderStatusCardProps {
  order: AdminOrder;
}

/** Human-readable payment method labels */
function formatPaymentMethod(method: string): string {
  switch (method) {
    case 'cash_on_delivery':
      return 'Cash on Delivery';
    case 'online':
      return 'Online Payment';
    case 'card':
      return 'Card Payment';
    default:
      return method;
  }
}

/** Format ISO date string to display format */
function formatOrderDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

export default function OrderStatusCard({ order }: OrderStatusCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#1e1812] border border-[#B8956A]/15 overflow-hidden"
    >
      {/* ── Card Header ── */}
      <div className="p-5 lg:p-6 border-b border-[#B8956A]/10">
        <p
          className="text-[#B8956A] text-[10px] tracking-[0.3em] uppercase font-semibold mb-3"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          Order Details
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className="text-[#EDE3D0] text-lg lg:text-xl font-bold tracking-wide"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {order.id}
            </h3>
            <p className="text-[#EDE3D0]/40 text-xs mt-1">
              Placed {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <div className="shrink-0">
            <Package className="w-5 h-5 text-[#B8956A]/40" />
          </div>
        </div>
      </div>

      {/* ── Items List ── */}
      <div className="p-5 lg:p-6 border-b border-[#B8956A]/10">
        <p
          className="text-[#EDE3D0]/50 text-[10px] tracking-[0.2em] uppercase font-semibold mb-4"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          Items
        </p>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={`${item.productId}-${index}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Quantity badge */}
                <span
                  className="shrink-0 w-7 h-7 flex items-center justify-center bg-[#B8956A]/10 border border-[#B8956A]/15 text-[#B8956A] text-[10px] font-bold"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {item.quantity}×
                </span>
                <span className="text-[#EDE3D0] text-sm truncate">
                  {item.productName}
                </span>
              </div>
              <span className="text-[#EDE3D0]/60 text-sm shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Price Breakdown ── */}
      <div className="p-5 lg:p-6 border-b border-[#B8956A]/10">
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-[#EDE3D0]/50">Subtotal</span>
            <span className="text-[#EDE3D0]/70">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#EDE3D0]/50">Delivery</span>
            <span className="text-[#EDE3D0]/70">{formatPrice(order.deliveryCharge)}</span>
          </div>
          <div className="w-full h-px bg-[#B8956A]/10 my-1" />
          <div className="flex justify-between">
            <span className="text-[#EDE3D0] text-sm font-semibold">Total</span>
            <span
              className="text-[#B8956A] text-base font-bold"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Delivery & Scheduling ── */}
      <div className="p-5 lg:p-6 space-y-4">
        {/* Delivery Address */}
        {order.customerAddress && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B8956A]/8 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#B8956A]/60" />
            </div>
            <div className="min-w-0">
              <p className="text-[#EDE3D0]/40 text-[10px] tracking-[0.15em] uppercase font-semibold mb-0.5">
                Delivery Address
              </p>
              <p className="text-[#EDE3D0]/80 text-sm leading-relaxed">
                {order.customerAddress}
              </p>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#B8956A]/8 flex items-center justify-center shrink-0 mt-0.5">
            <CreditCard className="w-3.5 h-3.5 text-[#B8956A]/60" />
          </div>
          <div>
            <p className="text-[#EDE3D0]/40 text-[10px] tracking-[0.15em] uppercase font-semibold mb-0.5">
              Payment
            </p>
            <p className="text-[#EDE3D0]/80 text-sm">
              {formatPaymentMethod(order.paymentMethod)}
            </p>
          </div>
        </div>

        {/* Scheduling / Estimated Time */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#B8956A]/8 flex items-center justify-center shrink-0 mt-0.5">
            {order.isScheduled ? (
              <CalendarDays className="w-3.5 h-3.5 text-[#B8956A]/60" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-[#B8956A]/60" />
            )}
          </div>
          <div>
            {order.isScheduled && order.scheduledTimestamp ? (
              <>
                <p className="text-[#EDE3D0]/40 text-[10px] tracking-[0.15em] uppercase font-semibold mb-0.5">
                  Scheduled Delivery
                </p>
                <p className="text-[#EDE3D0]/80 text-sm">
                  {formatScheduledTime(order.scheduledTimestamp)}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 bg-[#B8956A]/10 border border-[#B8956A]/15 text-[#B8956A] text-[9px] tracking-[0.15em] uppercase font-semibold"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  📅 Scheduled
                </span>
              </>
            ) : (
              <>
                <p className="text-[#EDE3D0]/40 text-[10px] tracking-[0.15em] uppercase font-semibold mb-0.5">
                  Estimated Delivery
                </p>
                <p className="text-[#EDE3D0]/80 text-sm">25–35 mins</p>
              </>
            )}
          </div>
        </div>

        {/* Coffee Delivery Mode — mixed orders */}
        {order.containsCoffee && order.containsDessert && order.coffeeDeliveryMode && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B8956A]/8 flex items-center justify-center shrink-0 mt-0.5">
              {order.coffeeDeliveryMode === 'immediate' ? (
                <Coffee className="w-3.5 h-3.5 text-[#B8956A]/60" />
              ) : (
                <Cake className="w-3.5 h-3.5 text-[#B8956A]/60" />
              )}
            </div>
            <div>
              <p className="text-[#EDE3D0]/40 text-[10px] tracking-[0.15em] uppercase font-semibold mb-0.5">
                Coffee Fulfillment
              </p>
              <span
                className={`
                  inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] tracking-[0.15em] uppercase font-semibold border
                  ${order.coffeeDeliveryMode === 'immediate'
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-[#B8956A]/10 border-[#B8956A]/15 text-[#B8956A]'
                  }
                `}
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                {order.coffeeDeliveryMode === 'immediate'
                  ? '☕ Immediate'
                  : '🍰 Bundled with Dessert'}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
