import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin Panel — XVIII Brew Co.',
  description: 'Internal admin panel for managing products, orders, and operations.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{ backgroundColor: '#15110D' }}
    >
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen min-w-0">
        {children}
      </main>
    </div>
  );
}
