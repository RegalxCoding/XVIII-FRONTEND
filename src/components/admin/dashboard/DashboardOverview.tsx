'use client';

import { Package, ShoppingCart, Clock, CheckCircle2 } from 'lucide-react';
import StatCard from './StatCard';
import type { AdminProduct, AdminOrder } from '@/types/admin.types';

interface DashboardOverviewProps {
  products: AdminProduct[];
  orders: AdminOrder[];
}

export default function DashboardOverview({ products, orders }: DashboardOverviewProps) {
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  // Orders placed today (mock: using june 8 2025)
  const todayStr = '2025-06-08';
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr)).length;

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: <Package size={20} strokeWidth={1.8} />,
      accent: '#B8956A',
      description: `${products.filter((p) => p.isAvailable).length} currently available`,
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingCart size={20} strokeWidth={1.8} />,
      accent: '#60a5fa',
      trend: `+${todayOrders} today`,
      trendUp: true,
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: <Clock size={20} strokeWidth={1.8} />,
      accent: '#fb923c',
      description: pendingOrders > 0 ? 'Awaiting confirmation' : 'All caught up!',
    },
    {
      label: 'Delivered',
      value: deliveredOrders,
      icon: <CheckCircle2 size={20} strokeWidth={1.8} />,
      accent: '#4ade80',
      description: `${Math.round((deliveredOrders / totalOrders) * 100)}% fulfillment rate`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
