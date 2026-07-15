'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, Coffee, ArrowRight, MapPin, CreditCard, RotateCcw } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { ordersService, mapAdminStatusToCustomerStatus } from '@/services/orders.service';
import type { AdminOrder } from '@/types/admin.types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OrderProgressTimeline from '@/components/orders/OrderProgressTimeline';
import { formatPrice } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

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

export default function MyOrdersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/my-orders');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user?.uid) {
      const unsubscribe = ordersService.subscribeByUserId(user.uid, (fetchedOrders) => {
        setOrders(fetchedOrders);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const { activeOrder, previousOrders } = useMemo(() => {
    let active: AdminOrder | null = null;
    const previous: AdminOrder[] = [];

    // The user's primary goal is to quickly see the status of their *latest* order.
    // If the absolute latest order is not delivered/cancelled, it's the active one.
    // Otherwise, all orders go to previous. This prevents old test orders (e.g. stuck in 'confirmed')
    // from suddenly taking over the active order card when the latest order is delivered.
    if (orders.length > 0) {
      const latestOrder = orders[0];
      if (latestOrder.status !== 'delivered' && latestOrder.status !== 'cancelled') {
        active = latestOrder;
        previous.push(...orders.slice(1));
      } else {
        previous.push(...orders);
      }
    }
    
    return { activeOrder: active, previousOrders: previous };
  }, [orders]);

  if (authLoading || !isAuthenticated) {
    return (
      <main className="bg-[#15110D] min-h-screen flex flex-col relative">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#B8956A]/20 border-t-[#B8956A] animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-[#15110D] min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background ambient glow accents */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#B8956A]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-[#B8956A]/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 container-brand relative z-10 py-24 lg:py-32">
        <div className="mb-10 lg:mb-14">
          <h1
            className="text-[#EDE3D0] text-3xl lg:text-4xl mb-3"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            My Orders
          </h1>
          <p className="text-[#EDE3D0]/40 text-sm max-w-md leading-relaxed">
            Track your current order and review your past favorites.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
               <div className="w-8 h-8 rounded-full border-2 border-[#B8956A]/20 border-t-[#B8956A] animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12"
            >
              {/* LEFT COLUMN: ACTIVE ORDER (col-span-8) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                {activeOrder ? (
                  <div className="bg-[#1e1812] border border-[#B8956A]/30 overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="p-6 lg:p-8 border-b border-[#B8956A]/10 bg-gradient-to-br from-[#B8956A]/5 to-transparent">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <span className="text-[#B8956A] text-[10px] tracking-[0.2em] uppercase font-semibold block mb-2">
                            Current Order
                          </span>
                          <h2 className="text-[#EDE3D0] text-2xl lg:text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                            {activeOrder.id}
                          </h2>
                          <div className="flex items-center gap-2 text-[#EDE3D0]/60 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            {new Intl.DateTimeFormat('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                              hour: 'numeric', minute: '2-digit', hour12: true
                            }).format(new Date(activeOrder.createdAt))}
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#B8956A]/10 border border-[#B8956A]/30 text-[#B8956A] text-[11px] tracking-[0.1em] uppercase font-bold self-start">
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-[#B8956A]"
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          {mapAdminStatusToCustomerStatus(activeOrder.status)}
                        </div>
                      </div>

                      {/* Estimated Delivery */}
                      <div className="mt-6 flex items-center gap-4 bg-[#15110D]/30 border border-[#B8956A]/10 p-4">
                        <div className="w-10 h-10 rounded-full bg-[#B8956A]/10 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-[#B8956A]" />
                        </div>
                        <div>
                          <p className="text-[#EDE3D0]/50 text-[10px] tracking-[0.2em] uppercase font-semibold mb-0.5" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                            Estimated Delivery Time
                          </p>
                          <p className="text-[#EDE3D0] text-sm font-medium">25–35 minutes</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-6 lg:p-8 border-b border-[#B8956A]/10">
                      <OrderProgressTimeline currentStatus={activeOrder.status} />
                    </div>

                    {/* Order Details Grid */}
                    <div className="p-6 lg:p-8 border-b border-[#B8956A]/10 bg-[#15110D]/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Items */}
                        <div>
                          <p className="text-[#EDE3D0]/50 text-[10px] tracking-[0.2em] uppercase font-semibold mb-4" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                            Order Summary
                          </p>
                          <div className="space-y-3 mb-6">
                            {activeOrder.items.map((item, idx) => (
                              <div key={idx} className="flex items-start justify-between gap-3 text-sm">
                                <div className="flex gap-3 min-w-0">
                                  <span className="text-[#B8956A] font-medium shrink-0">{item.quantity}×</span>
                                  <span className="text-[#EDE3D0]">{item.productName}</span>
                                </div>
                                <span className="text-[#EDE3D0]/60 shrink-0">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2 border-t border-[#B8956A]/10 pt-4">
                            <div className="flex justify-between text-xs text-[#EDE3D0]/50">
                              <span>Subtotal</span>
                              <span>{formatPrice(activeOrder.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-[#EDE3D0]/50">
                              <span>Delivery</span>
                              <span>{formatPrice(activeOrder.deliveryCharge)}</span>
                            </div>
                            <div className="flex justify-between text-base text-[#EDE3D0] font-bold pt-2">
                              <span>Total</span>
                              <span className="text-[#B8956A]" style={{ fontFamily: 'Georgia, serif' }}>{formatPrice(activeOrder.totalAmount)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Delivery & Payment Info */}
                        <div className="space-y-6">
                          <div>
                            <p className="text-[#EDE3D0]/50 text-[10px] tracking-[0.2em] uppercase font-semibold mb-3" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                              Delivery Address
                            </p>
                            <div className="flex gap-3">
                              <MapPin className="w-4 h-4 text-[#B8956A]/60 shrink-0 mt-0.5" />
                              <p className="text-[#EDE3D0]/80 text-sm leading-relaxed">
                                {activeOrder.customerAddress || 'N/A'}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-[#EDE3D0]/50 text-[10px] tracking-[0.2em] uppercase font-semibold mb-3" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                              Payment Method
                            </p>
                            <div className="flex gap-3">
                              <CreditCard className="w-4 h-4 text-[#B8956A]/60 shrink-0 mt-0.5" />
                              <p className="text-[#EDE3D0]/80 text-sm">
                                {formatPaymentMethod(activeOrder.paymentMethod)}
                              </p>
                            </div>
                          </div>

                          {activeOrder.notes && (
                            <div>
                              <p className="text-[#EDE3D0]/50 text-[10px] tracking-[0.2em] uppercase font-semibold mb-2" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                                Special Instructions
                              </p>
                              <p className="text-[#EDE3D0]/60 text-sm italic border-l-2 border-[#B8956A]/30 pl-3">
                                &ldquo;{activeOrder.notes}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 lg:p-8 flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/orders/${activeOrder.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#B8956A] text-[#15110D] px-6 py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#EDE3D0] transition-colors"
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      >
                        <MapPin className="w-4 h-4" />
                        Track Live
                      </Link>
                      <Link
                        href="/menu"
                        className="flex-1 inline-flex items-center justify-center gap-2 border border-[#B8956A]/30 text-[#EDE3D0]/80 px-6 py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
                        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reorder
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#1e1812] border border-[#B8956A]/10 p-10 lg:p-16 text-center flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-[#B8956A]/5 border border-[#B8956A]/10 flex items-center justify-center mb-8">
                      <Coffee className="w-10 h-10 text-[#B8956A]/40" />
                    </div>
                    <h2 className="text-[#EDE3D0] text-2xl lg:text-3xl mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                      No Active Orders
                    </h2>
                    <p className="text-[#EDE3D0]/40 text-sm lg:text-base max-w-md mb-10 leading-relaxed">
                      Looks like you've enjoyed your last order. Ready for another handcrafted experience?
                    </p>
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-2 bg-[#B8956A] text-[#15110D] px-8 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#EDE3D0] transition-colors"
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      <Package className="w-4 h-4" />
                      Order Now
                    </Link>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: PREVIOUS ORDERS (col-span-4) */}
              <div className="lg:col-span-4 flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-[#EDE3D0] text-lg font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                    Previous Orders
                  </h3>
                  <span className="text-[#EDE3D0]/30 text-xs">
                    {previousOrders.length} order{previousOrders.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {previousOrders.length === 0 ? (
                  <div className="flex-1 bg-[#1e1812]/50 border border-[#B8956A]/5 p-8 flex flex-col items-center justify-center text-center rounded-sm min-h-[300px]">
                    <Clock className="w-8 h-8 text-[#EDE3D0]/10 mb-4" />
                    <p className="text-[#EDE3D0]/30 text-sm">No past orders found.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {previousOrders.map((order) => {
                      const isDelivered = order.status === 'delivered';
                      return (
                        <Link
                          key={order.id}
                          href={`/orders/${order.id}`}
                          className="bg-[#1e1812] border border-[#B8956A]/10 hover:border-[#B8956A]/30 p-5 group transition-colors duration-300 block"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-[#EDE3D0] font-bold text-base mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                                {order.id}
                              </h4>
                              <p className="text-[#EDE3D0]/40 text-xs">
                                {new Intl.DateTimeFormat('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                }).format(new Date(order.createdAt))}
                              </p>
                            </div>
                            <span className={`text-[9px] tracking-[0.1em] uppercase font-bold px-2 py-1 border ${isDelivered ? 'bg-[#15110D] border-[#EDE3D0]/10 text-[#EDE3D0]/40' : 'bg-red-500/5 border-red-500/10 text-red-400/70'}`}>
                              {mapAdminStatusToCustomerStatus(order.status)}
                            </span>
                          </div>
                          
                          <div className="h-px w-full bg-[#B8956A]/10 my-3" />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-[#EDE3D0] font-bold text-sm">
                              {formatPrice(order.totalAmount)}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[#B8956A] text-[10px] tracking-[0.1em] uppercase font-bold group-hover:translate-x-1 transition-transform">
                              View Details <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
