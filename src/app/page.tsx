import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import PhilosophySection from '@/components/sections/PhilosophySection';
import BestSellersSection from '@/components/sections/BestSellersSection';
import ProcessSection from '@/components/sections/ProcessSection';
import RewardsSection from '@/components/sections/RewardsSection';
import MenuPreviewSection from '@/components/sections/MenuPreviewSection';
import FinalCTASection from '@/components/sections/FinalCTASection';

export const metadata: Metadata = {
  title: 'The XVIII Brew Co. | Crafted Coffee & Extraordinary Desserts',
  description:
    'Premium artisan coffee and extraordinary desserts. Single-origin beans, precision brewing, handcrafted confections. Something has been steeping.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <BestSellersSection />
      <ProcessSection />
      <RewardsSection />
      <MenuPreviewSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
