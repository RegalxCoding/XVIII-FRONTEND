import type { Metadata } from 'next';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import OrdersTable from '@/components/admin/orders/OrdersTable';

export const metadata: Metadata = {
  title: 'Orders — XVIII Brew Admin',
};

export default function AdminOrdersPage() {
  return (
    <>
      <AdminHeader
        title="Orders"
        subtitle="Review and manage all customer orders."
      />
      <div className="p-6">
        <OrdersTable />
      </div>
    </>
  );
}
