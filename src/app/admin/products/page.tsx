import type { Metadata } from 'next';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ProductsTable from '@/components/admin/products/ProductsTable';

export const metadata: Metadata = {
  title: 'Products — XVIII Brew Admin',
};

export default function AdminProductsPage() {
  return (
    <>
      <AdminHeader
        title="Products"
        subtitle="Manage your coffee and dessert catalogue."
      />
      <div className="p-6">
        <ProductsTable />
      </div>
    </>
  );
}
