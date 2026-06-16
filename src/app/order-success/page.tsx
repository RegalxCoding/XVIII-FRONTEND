'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Clock, FileText, ArrowRight, Package } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useOrderStore, Order } from '@/store/order.store';
import { ordersService, mapAdminStatusToCustomerStatus } from '@/services/orders.service';
import { getRelativeDateLabel } from '@/utils/timeSlots';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');
  const getOrderById = useOrderStore((s) => s.getOrderById);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // Fetch from Firestore in case the order is placed on another device or cache was cleared
        const fetchOrder = async () => {
          try {
            const dbOrder = await ordersService.getById(orderId);
            if (dbOrder) {
              setOrder({
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
                  quantity: item.quantity
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
                estimatedTime: dbOrder.isScheduled && dbOrder.deliveryDate && dbOrder.deliveryTime
                  ? `Dessert by ${getRelativeDateLabel(dbOrder.deliveryDate)}, ${dbOrder.deliveryTime}`
                  : '25–35 minutes'
              });
            } else {
              router.push('/dashboard');
            }
          } catch (e) {
            console.error("Error fetching order in success page:", e);
            router.push('/dashboard');
          }
        };
        fetchOrder();
      }
    } else {
      router.push('/');
    }
  }, [orderId, getOrderById, router]);

  if (!isMounted || !order) return null;

  return (
    <div className="container-brand relative z-10 py-20 lg:py-32 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8"
      >
        <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={1.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-[#EDE3D0] text-3xl lg:text-5xl mb-4 text-center"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Order Placed Successfully!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[#EDE3D0]/60 max-w-md text-center leading-relaxed mb-12"
      >
        Your order is confirmed and will be prepared shortly. We will deliver it to your location using the provided details.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-lg bg-[#1a1410] border border-[#B8956A]/15 p-6 lg:p-8"
      >
        <div className="space-y-6">
          {/* Order ID */}
          <div className="flex items-center gap-4 border-b border-[#B8956A]/10 pb-6">
            <div className="w-10 h-10 rounded-full bg-[#B8956A]/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#B8956A]" />
            </div>
            <div>
              <p className="text-[#EDE3D0]/40 text-xs tracking-widest uppercase mb-1">Order ID</p>
              <p className="text-[#EDE3D0] font-medium">{order.id}</p>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="flex items-center gap-4 border-b border-[#B8956A]/10 pb-6">
            <div className="w-10 h-10 rounded-full bg-[#B8956A]/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#B8956A]" />
            </div>
            <div>
              <p className="text-[#EDE3D0]/40 text-xs tracking-widest uppercase mb-1">Estimated Delivery</p>
              <p className="text-[#EDE3D0] font-medium">{order.estimatedTime}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#B8956A]/10 flex items-center justify-center shrink-0">
              <span className="text-[#B8956A] font-serif italic font-bold">₹</span>
            </div>
            <div>
              <p className="text-[#EDE3D0]/40 text-xs tracking-widest uppercase mb-1">Payment Method</p>
              <p className="text-[#EDE3D0] font-medium">{order.paymentMethod}</p>
              <p className="text-orange-400/80 text-xs mt-1">Please keep exact change ready.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-4 mt-12 w-full max-w-lg"
      >
        <Link
          href={`/dashboard?track=${order.id}`}
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-[#B8956A] text-[#15110D] py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#EDE3D0] transition-colors"
        >
          <Package className="w-4 h-4" /> Track Order
        </Link>
        <Link
          href="/dashboard"
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-transparent border border-[#B8956A]/40 text-[#B8956A] py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#B8956A]/10 transition-colors group"
        >
          Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="bg-[#15110D] min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Background accents */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#B8956A]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#B8956A]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="flex-1">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center text-[#B8956A]">
            Loading...
          </div>
        }>
          <OrderSuccessContent />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
