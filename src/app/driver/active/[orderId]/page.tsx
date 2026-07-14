'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Navigation, Phone, MessageCircle } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { ordersService } from '@/services/orders.service';
import type { AdminOrder } from '@/types/admin.types';

export default function ActiveDelivery({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.orderId;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = ordersService.subscribeOrderById(orderId, (fetchedOrder) => {
      setOrder(fetchedOrder);
      setLoading(false);
    });

    return () => unsub();
  }, [orderId]);

  const handleComplete = async () => {
    if (!order) return;
    try {
      // Basic implementation for now: Assume cash collected if it was cash on delivery
      const paymentStatus = order.paymentMethod === 'cash_on_delivery' ? 'cash_collected' : 'paid';
      await ordersService.markDelivered(order.id, paymentStatus);
      router.push('/driver/dashboard');
    } catch (error) {
      console.error('Failed to complete delivery:', error);
      alert('Error completing delivery');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0e0b08] flex items-center justify-center text-[#B8956A]">Loading...</div>;
  }

  if (!order) {
    return <div className="min-h-screen bg-[#0e0b08] flex items-center justify-center text-red-500">Order not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0b08]">
      {/* Header (Overlapping Map) */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 pt-12 flex justify-between items-center bg-gradient-to-b from-[#0e0b08]/80 to-transparent">
        <button 
          onClick={() => router.push('/driver/dashboard')}
          className="bg-[#0e0b08]/80 p-2 rounded-full backdrop-blur-md border border-[#EDE3D0]/20 text-[#EDE3D0]"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold tracking-wider text-sm bg-[#0e0b08]/80 px-4 py-1.5 rounded-full border border-[#EDE3D0]/20">
          {order.id}
        </span>
        <div className="w-10" /> {/* Balancer */}
      </header>

      {/* Map Placeholder */}
      <div className="h-[50vh] bg-[#1a1714] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(#B8956A 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
        <Navigation size={48} className="text-[#B8956A] relative z-10 animate-pulse" />
      </div>

      {/* Delivery Details Bottom Sheet */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="flex-1 bg-[#0e0b08] -mt-6 rounded-t-3xl relative z-10 p-6 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-[#EDE3D0]/10"
      >
        <div className="w-12 h-1.5 bg-[#EDE3D0]/20 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[#B8956A] text-xs uppercase tracking-widest font-semibold mb-1">Delivering To</p>
            <h2 className="text-xl font-bold">{order.customerName}</h2>
            <p className="text-[#EDE3D0]/60 text-sm mt-1">{order.customerAddress}</p>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${order.customerPhone}`} className="bg-[#EDE3D0]/10 p-3 rounded-full text-[#B8956A]">
              <Phone size={20} />
            </a>
            <a href={`sms:${order.customerPhone}`} className="bg-[#EDE3D0]/10 p-3 rounded-full text-[#B8956A]">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <div className="bg-[#EDE3D0]/5 rounded-xl p-4 mb-auto border border-[#EDE3D0]/10 max-h-[200px] overflow-y-auto">
          <p className="text-xs uppercase tracking-widest text-[#B8956A] mb-2">Order Summary • ₹{order.totalAmount}</p>
          <ul className="text-sm space-y-2 text-[#EDE3D0]/80">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.quantity}x {item.productName}</span>
                <span>₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        {order.status === 'out_for_delivery' ? (
          <button 
            onClick={handleComplete}
            className="w-full mt-6 bg-[#B8956A] text-[#0e0b08] font-bold tracking-widest py-4 rounded-xl uppercase active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(184,149,106,0.3)]"
          >
            {order.paymentMethod === 'cash_on_delivery' ? 'Collect ₹' + order.totalAmount + ' & Complete' : 'Slide to Complete'}
          </button>
        ) : (
          <div className="w-full mt-6 bg-[#B8956A]/20 text-[#B8956A] font-bold tracking-widest py-4 rounded-xl uppercase text-center">
            {order.status === 'delivered' ? 'Delivery Completed' : 'Order Not Active'}
          </div>
        )}
      </motion.div>
    </div>
  );
}
