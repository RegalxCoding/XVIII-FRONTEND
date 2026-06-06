import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Rewards | The XVIII Brew Co.',
  description: 'Join The XVIII Brew Co. Loyalty Programme. Earn stamps, unlock rewards, enjoy exclusives.',
};

export default function RewardsPage() {
  return (
    <main className="bg-[#15110D] min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 container-brand">
        <p
          className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase mb-6"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          Loyalty Programme
        </p>
        <h1
          className="text-[#EDE3D0] mb-6"
          style={{
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: 'clamp(3rem, 6vw, 6rem)',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          Rewards.
        </h1>
        <p
          className="text-[#EDE3D0]/40"
          style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          Full rewards page coming soon.
        </p>
      </div>
      <Footer />
    </main>
  );
}

