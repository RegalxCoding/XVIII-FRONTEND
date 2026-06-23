'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, XCircle, ArrowLeft, Coffee } from 'lucide-react';
import Link from 'next/link';
import type { AdminOrder } from '@/types/admin.types';
import OrderProgressTimeline from './OrderProgressTimeline';
import OrderStatusCard from './OrderStatusCard';

interface OrderTrackerProps {
  orderId: string;
}

type TrackerState = 'loading' | 'not-found' | 'cancelled' | 'tracking';

export default function OrderTracker({ orderId }: OrderTrackerProps) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [state, setState] = useState<TrackerState>('loading');

  useEffect(() => {
    // Real-time listener using the same pattern as ordersService.subscribeAll
    // but filtered to a single order by its custom brand ID.
    // We do NOT modify orders.service.ts per project constraints.
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where('id', '==', orderId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setState('not-found');
          setOrder(null);
          return;
        }

        const data = snapshot.docs[0].data();
        const fetchedOrder = { ...data, id: data.id } as AdminOrder;
        setOrder(fetchedOrder);

        if (fetchedOrder.status === 'cancelled') {
          setState('cancelled');
        } else {
          setState('tracking');
        }
      },
      (error) => {
        console.error('Error subscribing to order:', error);
        setState('not-found');
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  return (
    <div className="container-brand relative z-10 py-24 lg:py-32">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 lg:mb-12"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#EDE3D0]/40 hover:text-[#B8956A] text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-300 group"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── Loading State ── */}
        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSkeleton />
          </motion.div>
        )}

        {/* ── Not Found State ── */}
        {state === 'not-found' && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#1e1812] border border-[#B8956A]/15 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-[#EDE3D0]/25" />
            </div>
            <h2
              className="text-[#EDE3D0] text-2xl lg:text-3xl mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Order Not Found
            </h2>
            <p className="text-[#EDE3D0]/40 text-sm max-w-sm mb-8 leading-relaxed">
              We couldn&apos;t find an order with ID <span className="text-[#B8956A] font-medium">{orderId}</span>.
              Please check the order ID and try again.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#B8956A] text-[#15110D] px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#EDE3D0] transition-colors"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Back to Home
            </Link>
          </motion.div>
        )}

        {/* ── Cancelled State ── */}
        {state === 'cancelled' && order && (
          <motion.div
            key="cancelled"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {/* Page heading */}
            <div className="mb-10 lg:mb-14">
              <h1
                className="text-[#EDE3D0] text-2xl lg:text-4xl mb-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Track Your Order
              </h1>
              <p className="text-[#EDE3D0]/40 text-sm">
                Order {order.id}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Cancelled notice */}
              <div className="lg:col-span-3">
                <div className="bg-[#1e1812] border border-red-500/15 p-8 lg:p-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                    <XCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <h2
                    className="text-[#EDE3D0] text-xl lg:text-2xl mb-2"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Order Cancelled
                  </h2>
                  <p className="text-[#EDE3D0]/40 text-sm max-w-md leading-relaxed mb-6">
                    This order has been cancelled. If you believe this is an error
                    or need assistance, please contact us.
                  </p>
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 bg-[#B8956A] text-[#15110D] px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#EDE3D0] transition-colors"
                    style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    Order Again
                  </Link>
                </div>
              </div>

              {/* Order details still visible for reference */}
              <div className="lg:col-span-2">
                <OrderStatusCard order={order} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Active Tracking State ── */}
        {state === 'tracking' && order && (
          <motion.div
            key="tracking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {/* Page heading */}
            <div className="mb-10 lg:mb-14">
              <h1
                className="text-[#EDE3D0] text-2xl lg:text-4xl mb-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Track Your Order
              </h1>
              <p className="text-[#EDE3D0]/40 text-sm">
                Real-time updates for {order.id}
              </p>
            </div>

            {/* Two-column layout: timeline (3col) + details (2col) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              <div className="lg:col-span-3">
                <div className="bg-[#1e1812] border border-[#B8956A]/15 p-6 lg:p-8">
                  <OrderProgressTimeline currentStatus={order.status} />
                </div>
              </div>
              <div className="lg:col-span-2">
                <OrderStatusCard order={order} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────
// Loading Skeleton
// ─────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Heading skeleton */}
      <div className="mb-10 lg:mb-14">
        <div className="h-8 w-64 bg-[#1e1812] rounded mb-3" />
        <div className="h-4 w-40 bg-[#1e1812] rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Timeline skeleton */}
        <div className="lg:col-span-3">
          <div className="bg-[#1e1812] border border-[#B8956A]/10 p-6 lg:p-8">
            <div className="h-3 w-24 bg-[#B8956A]/10 rounded mb-8" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 mb-8 last:mb-0">
                <div className="w-11 h-11 rounded-full bg-[#B8956A]/8 shrink-0" />
                <div className="pt-2 flex-1">
                  <div className="h-4 w-36 bg-[#B8956A]/8 rounded mb-2" />
                  <div className="h-3 w-56 bg-[#B8956A]/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-[#1e1812] border border-[#B8956A]/10">
            <div className="p-5 lg:p-6 border-b border-[#B8956A]/10">
              <div className="h-3 w-20 bg-[#B8956A]/10 rounded mb-4" />
              <div className="h-5 w-32 bg-[#B8956A]/8 rounded mb-2" />
              <div className="h-3 w-44 bg-[#B8956A]/5 rounded" />
            </div>
            <div className="p-5 lg:p-6 border-b border-[#B8956A]/10 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#B8956A]/8 rounded" />
                    <div className="h-4 w-28 bg-[#B8956A]/8 rounded" />
                  </div>
                  <div className="h-4 w-16 bg-[#B8956A]/5 rounded" />
                </div>
              ))}
            </div>
            <div className="p-5 lg:p-6 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-[#B8956A]/5 rounded" />
                <div className="h-4 w-20 bg-[#B8956A]/5 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-12 bg-[#B8956A]/5 rounded" />
                <div className="h-4 w-16 bg-[#B8956A]/5 rounded" />
              </div>
              <div className="h-px bg-[#B8956A]/10 my-2" />
              <div className="flex justify-between">
                <div className="h-5 w-12 bg-[#B8956A]/8 rounded" />
                <div className="h-5 w-20 bg-[#B8956A]/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
