import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OrderTracker from '@/components/orders/OrderTracker';

export const metadata: Metadata = {
  title: 'Track Order | The XVIII Brew Co.',
  description:
    'Track your XVIII Brew Co. order in real-time. Follow your premium coffee and desserts from preparation to delivery.',
};

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params;

  return (
    <main className="bg-[#15110D] min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background ambient glow accents */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#B8956A]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-[#B8956A]/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 w-[300px] h-[300px] bg-[#B8956A]/[0.02] rounded-full blur-[80px] pointer-events-none" />

      <div className="flex-1">
        <OrderTracker orderId={id} />
      </div>

      <Footer />
    </main>
  );
}
