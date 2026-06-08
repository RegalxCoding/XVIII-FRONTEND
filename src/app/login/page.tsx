import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login | The XVIII Brew Co.',
  description: 'Sign in to your XVIII Brew Co. account.',
};

export default function LoginPage() {
  return (
    <main className="bg-[#15110D] min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="pt-36 pb-24 flex-grow flex items-center justify-center container-brand">
        <LoginForm />
      </div>
      <Footer />
    </main>
  );
}
