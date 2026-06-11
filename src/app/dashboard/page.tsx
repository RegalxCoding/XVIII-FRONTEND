'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Package, Clock, MapPin, ChevronRight, User, Settings, LogOut, ArrowRight, Wallet } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useOrderStore } from '@/store/order.store';
import { useAuthStore } from '@/store/auth.store';
import { ordersService, mapAdminStatusToCustomerStatus } from '@/services/orders.service';
import type { Order } from '@/store/order.store';
import type { AdminOrder } from '@/types/admin.types';

const ease = [0.22, 1, 0.36, 1] as const;

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const localOrders = useOrderStore((s) => s.orders);
  const user = useAuthStore((s) => s.user);

  const [dbOrders, setDbOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Subscribe to Firestore orders for the current user
    const unsubscribe = ordersService.subscribeByUserId(user.uid, (ordersData) => {
      setDbOrders(ordersData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, isMounted]);

  // Merge/determine which orders to display. If authenticated, use Firestore orders mapped to customer shape.
  // Otherwise, use local Zustand storage orders
  const displayOrders = user
    ? dbOrders.map((dbOrder): Order => ({
        id: dbOrder.id,
        items: dbOrder.items.map((item) => ({
          product: {
            id: item.productId,
            name: item.productName,
            price: item.price,
            image: item.imageUrl || '',
            description: '',
            category: 'coffee',
            available: true,
            featured: false,
            stampReward: 1
          },
          quantity: item.quantity,
        })),
        subtotal: dbOrder.subtotal,
        deliveryFee: dbOrder.deliveryCharge,
        total: dbOrder.totalAmount,
        address: {
          fullName: dbOrder.customerName,
          phone: dbOrder.customerPhone,
          fullAddress: dbOrder.customerAddress,
          city: 'Kanpur',
        },
        location: dbOrder.location || null,
        status: mapAdminStatusToCustomerStatus(dbOrder.status) as any,
        date: dbOrder.createdAt,
        paymentMethod: 'Cash on Delivery',
        estimatedTime: '25–35 minutes',
      }))
    : localOrders;

  const orders = displayOrders;

  if (!isMounted) {
    return (
      <main className="bg-[#15110D] min-h-screen">
        <Navbar />
      </main>
    );
  }

  return (
    <main className="bg-[#15110D] min-h-screen flex flex-col">
      <Navbar />

      {/* ── Page Header ── */}
      <section className="pt-32 pb-8 lg:pt-40 lg:pb-12 border-b border-[#B8956A]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B8956A]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container-brand relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-px bg-[#B8956A]" />
              <span
                className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Your Profile
              </span>
            </div>

            <h1
              className="text-[#EDE3D0] text-3xl lg:text-5xl mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Dashboard<span className="text-[#B8956A]">.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── Dashboard Content ── */}
      <section className="py-12 lg:py-16 flex-1">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">
            
            {/* Sidebar Navigation */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="lg:sticky lg:top-32 space-y-2"
            >
              {[
                { name: 'Order History', icon: Package, active: true },
                { name: 'Account Settings', icon: Settings, active: false },
                { name: 'Payment Methods', icon: Wallet, active: false },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-colors duration-300 ${
                    item.active
                      ? 'bg-[#B8956A]/10 border-l-2 border-[#B8956A] text-[#B8956A]'
                      : 'text-[#EDE3D0]/60 hover:text-[#EDE3D0] hover:bg-[#1a1410]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm tracking-widest uppercase font-medium">
                    {item.name}
                  </span>
                </button>
              ))}

              <div className="pt-8 mt-8 border-t border-[#B8956A]/10">
                <button className="w-full flex items-center gap-4 px-6 py-4 text-left text-red-400/80 hover:bg-red-950/20 transition-colors duration-300">
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm tracking-widest uppercase font-medium">Log Out</span>
                </button>
              </div>
            </motion.aside>

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.2 }}
            >
              <h2 className="text-[#EDE3D0] text-2xl font-serif mb-8 flex items-center gap-3">
                Recent Orders <span className="text-[#B8956A] text-sm">({orders.length})</span>
              </h2>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 border border-[#B8956A]/10 bg-[#1a1410]">
                  <div className="w-8 h-8 border-2 border-t-[#B8956A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4" style={{ borderColor: 'rgba(184,149,106,0.2)', borderTopColor: '#B8956A' }}></div>
                  <p className="text-xs tracking-wider uppercase text-[#EDE3D0]/40 font-medium" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Loading order history…</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-[#1a1410] border border-[#B8956A]/15 p-12 text-center flex flex-col items-center">
                  <Package className="w-16 h-16 text-[#B8956A]/20 mb-6" />
                  <h3 className="text-[#EDE3D0] text-xl font-serif mb-4">No orders yet</h3>
                  <p className="text-[#EDE3D0]/40 max-w-sm mx-auto mb-8">
                    You haven't placed any orders. Browse our menu to discover your next favourite brew.
                  </p>
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-3 bg-[#B8956A] text-[#15110D] px-8 py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[#EDE3D0] transition-colors group"
                  >
                    Browse Menu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ─────────────────────────────────────────
// Dashboard Order Card Component
// ─────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const getStatusColor = (status: string) => {
    if (status.includes('Preparing')) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    if (status.includes('Delivery')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-green-500/10 text-green-500 border-green-500/20';
  };

  const formattedDate = new Date(order.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemSummary = order.items
    .map((i) => `${i.quantity}x ${i.product.name}`)
    .join(', ');

  return (
    <div className="bg-[#1a1410] border border-[#B8956A]/15 p-6 lg:p-8 hover:border-[#B8956A]/40 transition-colors duration-500 group">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#B8956A]/10">
        <div>
          <p className="text-[#EDE3D0]/40 text-[10px] tracking-[0.2em] uppercase mb-1">
            Order ID: {order.id}
          </p>
          <p className="text-[#EDE3D0] text-sm">
            {formattedDate}
          </p>
        </div>
        <div className={`px-4 py-1.5 text-[10px] tracking-widest uppercase font-bold border ${getStatusColor(order.status)} inline-flex w-max`}>
          {order.status}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left Col */}
        <div className="space-y-4">
          <div>
            <p className="text-[#EDE3D0]/40 text-[10px] tracking-[0.2em] uppercase mb-2">
              Items
            </p>
            <p className="text-[#EDE3D0] text-sm leading-relaxed line-clamp-2" title={itemSummary}>
              {itemSummary}
            </p>
          </div>
          <div>
            <p className="text-[#EDE3D0]/40 text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Estimated Arrival
            </p>
            <p className="text-[#EDE3D0] text-sm font-medium text-[#B8956A]">
              {order.estimatedTime}
            </p>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-4">
          <div>
            <p className="text-[#EDE3D0]/40 text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Delivery To
            </p>
            <p className="text-[#EDE3D0] text-sm leading-relaxed truncate">
              {order.address.fullAddress}, {order.address.city}
            </p>
          </div>
          <div>
            <p className="text-[#EDE3D0]/40 text-[10px] tracking-[0.2em] uppercase mb-2">
              Payment Method
            </p>
            <p className="text-[#EDE3D0] text-sm">
              {order.paymentMethod} <span className="text-[#EDE3D0]/30 ml-2">(₹{order.total.toLocaleString('en-IN')})</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
