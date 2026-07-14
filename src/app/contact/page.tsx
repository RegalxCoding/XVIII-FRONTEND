import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactHero from '@/components/contact/ContactHero';
import ContactWays from '@/components/contact/ContactWays';
import BusinessEnquiries from '@/components/contact/BusinessEnquiries';
import FeedbackForm from '@/components/contact/FeedbackForm';
import ContactFAQ from '@/components/contact/ContactFAQ';
import FinalCTASection from '@/components/sections/FinalCTASection';

export const metadata: Metadata = {
  title: 'Contact | The XVIII Brew Co.',
  description: 'Get in touch with The XVIII Brew Co. — find us, reach us, connect with us.',
};

export default function ContactPage() {
  return (
    <main className="bg-[#15110D] min-h-screen">
      <Navbar />
      <ContactHero />
      <ContactWays />
      <BusinessEnquiries />
      <FeedbackForm />
      <ContactFAQ />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
