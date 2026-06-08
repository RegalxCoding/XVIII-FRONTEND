'use client';

import AdminHeader from '@/components/admin/layout/AdminHeader';
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import { MOCK_ADMIN_PRODUCTS, MOCK_ADMIN_ORDERS } from '@/data/adminMockData';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, ClipboardList, TrendingUp } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pending',   color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  confirmed: { label: 'Confirmed', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  preparing: { label: 'Preparing', color: '#c084fc', bg: 'rgba(192,132,252,0.12)' },
  ready:     { label: 'Ready',     color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)' },
  delivered: { label: 'Delivered', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};

const QUICK_ACTIONS = [
  {
    label: 'Manage Products',
    desc: 'Add, edit, or remove products',
    href: '/admin/products',
    icon: <ShoppingBag size={18} />,
    accent: '#B8956A',
  },
  {
    label: 'View Orders',
    desc: 'Review and update order statuses',
    href: '/admin/orders',
    icon: <ClipboardList size={18} />,
    accent: '#60a5fa',
  },
  {
    label: 'Pending Orders',
    desc: `${MOCK_ADMIN_ORDERS.filter(o => o.status === 'pending').length} orders awaiting action`,
    href: '/admin/orders',
    icon: <TrendingUp size={18} />,
    accent: '#fb923c',
  },
];

export default function AdminDashboardPage() {
  const recentOrders = MOCK_ADMIN_ORDERS.slice(0, 5);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back. Here's your store overview."
      />

      <div className="p-6 space-y-8">
        {/* Stat cards */}
        <DashboardOverview
          products={MOCK_ADMIN_PRODUCTS}
          orders={MOCK_ADMIN_ORDERS}
        />

        {/* Quick actions */}
        <div>
          <h2
            className="text-xs tracking-[0.25em] uppercase mb-4"
            style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="flex items-center gap-4 p-5 rounded-xl border transition-all duration-200 group hover:opacity-90"
                style={{
                  background: 'rgba(26,20,14,0.6)',
                  borderColor: 'rgba(184,149,106,0.15)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${action.accent}18`, color: action.accent }}
                >
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium"
                    style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {action.label}
                  </p>
                  <p
                    className="text-xs mt-0.5 truncate"
                    style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {action.desc}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: 'rgba(237,227,208,0.3)' }}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-medium flex items-center gap-1 transition-opacity hover:opacity-75"
              style={{ color: '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: 'rgba(184,149,106,0.15)', background: 'rgba(26,20,14,0.6)' }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-12 gap-4 px-5 py-3 text-[10px] tracking-[0.2em] uppercase border-b"
              style={{
                color: 'rgba(237,227,208,0.3)',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                borderColor: 'rgba(184,149,106,0.1)',
              }}
            >
              <span className="col-span-3">Order ID</span>
              <span className="col-span-3">Customer</span>
              <span className="col-span-2 text-right">Total</span>
              <span className="col-span-4 text-right">Status</span>
            </div>

            {/* Table rows */}
            {recentOrders.map((order, idx) => {
              const sc = STATUS_CONFIG[order.status];
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-[rgba(184,149,106,0.04)] transition-colors duration-150"
                  style={{
                    borderBottom: idx < recentOrders.length - 1 ? '1px solid rgba(184,149,106,0.08)' : 'none',
                  }}
                >
                  <span
                    className="col-span-3 text-xs font-mono"
                    style={{ color: '#B8956A', fontFamily: 'monospace' }}
                  >
                    {order.id.slice(-6)}
                  </span>
                  <span
                    className="col-span-3 text-sm truncate"
                    style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {order.customerName}
                  </span>
                  <span
                    className="col-span-2 text-sm text-right font-medium"
                    style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    ₹{order.totalAmount}
                  </span>
                  <div className="col-span-4 flex justify-end">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase"
                      style={{ background: sc.bg, color: sc.color, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      {sc.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
