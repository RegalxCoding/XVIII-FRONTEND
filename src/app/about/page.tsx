import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import WhyXVIII from '@/components/about/WhyXVIII';
import WhatWeBelieve from '@/components/about/WhatWeBelieve';
import OurPromise from '@/components/about/OurPromise';
import FounderNote from '@/components/about/FounderNote';
import AboutCTA from '@/components/about/AboutCTA';

export const metadata: Metadata = {
  title: 'Our Story | The XVIII Brew Co.',
  description:
    'The XVIII Brew Co. wasn\'t created to serve coffee quickly. It was created to make every cup worth waiting for. Coffee and desserts prepared with patience, precision and intention.',
};

export default function AboutPage() {
  return (
    <main className="bg-[#15110D] min-h-screen">
      <Navbar />
      <AboutHero />
      <WhyXVIII />
      <WhatWeBelieve />
      <OurPromise />
      <FounderNote />
      <AboutCTA />
      <Footer />
    </main>
  );
}
