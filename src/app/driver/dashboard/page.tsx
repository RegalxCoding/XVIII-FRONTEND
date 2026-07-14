'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Package, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ordersService } from '@/services/orders.service';
import type { AdminOrder } from '@/types/admin.types';

export default function DriverDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<AdminOrder[]>([]);
  const [view, setView] = useState<'queue' | 'active'>('queue');
  const [loading, setLoading] = useState(true);

  // Authentication & Data Subscription
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/driver/login');
        return;
      }
      setUser(currentUser);

      // Subscribe to Ready for Pickup queue
      const unsubQueue = ordersService.subscribeDriverQueue((fetchedOrders) => {
        setOrders(fetchedOrders);
        setLoading(false);
      });

      // Subscribe to Driver's Active Orders
      const unsubActive = ordersService.subscribeDriverActive(currentUser.uid, (fetchedActive) => {
        setActiveOrders(fetchedActive);
      });

      return () => {
        unsubQueue();
        unsubActive();
      };
    });

    return () => unsubscribeAuth();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/driver/login');
  };

  const handleAcceptOrder = async (orderId: string) => {
    if (!user) return;
    try {
      await ordersService.assignToDriver(orderId, user.uid);
      setView('active');
    } catch (error) {
      alert('Failed to accept order.');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0e0b08] flex items-center justify-center text-[#B8956A]">Loading...</div>;
  }

  const displayedOrders = view === 'queue' ? orders : activeOrders;

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0b08]">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 bg-[#0e0b08] sticky top-0 z-10 border-b border-[#EDE3D0]/10 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>
            {view === 'queue' ? 'Active Queue' : 'My Deliveries'}
          </h1>
          <p className="text-[#B8956A] text-sm mt-1">
            {displayedOrders.length} {displayedOrders.length === 1 ? 'order' : 'orders'} available
          </p>
        </div>
        <button onClick={handleLogout} className="text-[#EDE3D0]/40 p-2 rounded-full hover:bg-[#EDE3D0]/5">
          <LogOut size={20} />
        </button>
      </header>

      {/* Order List */}
      <main className="flex-1 p-6 space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="text-center text-[#EDE3D0]/40 mt-10">
            No orders here right now.
          </div>
        ) : (
          displayedOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#EDE3D0]/5 border border-[#EDE3D0]/10 rounded-xl p-5"
            >
              <div 
                className="flex justify-between items-start mb-4 cursor-pointer"
                onClick={() => view === 'active' && router.push(`/driver/active/${order.id}`)}
              >
                <div>
                  <h3 className="font-bold text-lg">{order.id}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    order.status === 'ready' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {order.status === 'ready' ? 'Ready for Pickup' : 'Out for Delivery'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[#EDE3D0]/60 text-xs flex items-center justify-end gap-1">
                    <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-4 text-sm text-[#EDE3D0]/80">
                <div className="flex items-start gap-2">
                  <MapPin className="text-[#B8956A] mt-1 shrink-0" size={16} />
                  <p className="line-clamp-2">{order.customerAddress}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="text-[#B8956A] shrink-0" size={16} />
                  <p>{order.items.reduce((acc, item) => acc + item.quantity, 0)} items • ₹{order.totalAmount}</p>
                </div>
              </div>

              {view === 'queue' && (
                <button 
                  onClick={() => handleAcceptOrder(order.id)}
                  className="w-full mt-5 bg-[#B8956A] text-[#0e0b08] font-bold tracking-widest py-3 rounded-lg uppercase text-sm active:scale-[0.98] transition-transform"
                >
                  Accept Delivery
                </button>
              )}
            </motion.div>
          ))
        )}
      </main>

      {/* Bottom Nav Spacer */}
      <div className="h-20" />

      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0e0b08] border-t border-[#EDE3D0]/10 p-4 flex justify-around items-center z-50 pb-safe">
        <button 
          onClick={() => setView('queue')}
          className={`flex flex-col items-center gap-1 ${view === 'queue' ? 'text-[#B8956A]' : 'text-[#EDE3D0]/40'}`}
        >
          <MapPin size={24} />
          <span className="text-[10px] uppercase tracking-widest">Queue</span>
        </button>
        <button 
          onClick={() => setView('active')}
          className={`flex flex-col items-center gap-1 relative ${view === 'active' ? 'text-[#B8956A]' : 'text-[#EDE3D0]/40'}`}
        >
          {activeOrders.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {activeOrders.length}
            </span>
          )}
          <Package size={24} />
          <span className="text-[10px] uppercase tracking-widest">My Runs</span>
        </button>
      </div>
    </div>
  );
}
