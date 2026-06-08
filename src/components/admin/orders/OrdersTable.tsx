'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import StatusBadge from './StatusBadge';
import OrderDetailDrawer from './OrderDetailDrawer';
import type { AdminOrder, AdminOrderStatus } from '@/types/admin.types';

interface OrdersTableProps {
  initialOrders: AdminOrder[];
}

type FilterStatus = 'all' | AdminOrderStatus;

const STATUS_FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS_DOT_COLORS: Record<FilterStatus, string> = {
  all: 'rgba(237,227,208,0.4)',
  pending: '#fb923c',
  confirmed: '#60a5fa',
  preparing: '#c084fc',
  ready: '#2dd4bf',
  delivered: '#4ade80',
  cancelled: '#f87171',
};

const PAYMENT_LABELS: Record<string, string> = {
  cash_on_delivery: 'COD',
  online: 'Online',
  card: 'Card',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatItems(items: AdminOrder['items']) {
  if (items.length === 1) return items[0].productName;
  return `${items[0].productName} +${items.length - 1} more`;
}

export default function OrdersTable({ initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q);
    return matchStatus && matchSearch;
  });

  const handleStatusChange = (orderId: string, status: AdminOrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    // Update selected order if it's open
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : prev));
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Status filter scrollable row */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {STATUS_FILTERS.map((f) => {
            const active = filterStatus === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium tracking-[0.05em] whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={{
                  background: active ? 'rgba(184,149,106,0.15)' : 'rgba(26,20,14,0.8)',
                  border: active ? '1px solid rgba(184,149,106,0.4)' : '1px solid rgba(184,149,106,0.12)',
                  color: active ? '#B8956A' : 'rgba(237,227,208,0.5)',
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                }}
              >
                {f.key !== 'all' && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: STATUS_DOT_COLORS[f.key], flexShrink: 0 }}
                  />
                )}
                <Filter size={11} style={{ display: f.key === 'all' ? 'block' : 'none' }} />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(184,149,106,0.5)' }}>
            <Search size={15} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              background: 'rgba(26,20,14,0.8)',
              border: '1px solid rgba(184,149,106,0.15)',
              color: '#EDE3D0',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.15)'; }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: 'rgba(184,149,106,0.15)', background: 'rgba(26,20,14,0.6)' }}
      >
        {/* Desktop header */}
        <div
          className="hidden lg:grid px-5 py-3.5 border-b text-[10px] tracking-[0.2em] uppercase"
          style={{
            gridTemplateColumns: '130px 1fr 120px 1fr 90px 90px 130px 110px',
            color: 'rgba(237,227,208,0.3)',
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            borderColor: 'rgba(184,149,106,0.1)',
          }}
        >
          <span>Order ID</span>
          <span>Customer</span>
          <span>Phone</span>
          <span>Items</span>
          <span>Total</span>
          <span>Payment</span>
          <span>Date</span>
          <span className="text-right">Status</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p
              className="text-sm"
              style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              No orders found.
            </p>
          </div>
        ) : (
          filtered.map((order, idx) => (
            <div
              key={order.id}
              className="cursor-pointer transition-colors duration-150"
              style={{
                borderBottom: idx < filtered.length - 1 ? '1px solid rgba(184,149,106,0.08)' : 'none',
              }}
              onClick={() => setSelectedOrder(order)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(184,149,106,0.04)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {/* Desktop Row */}
              <div
                className="hidden lg:grid items-center px-5 py-4 gap-0"
                style={{ gridTemplateColumns: '130px 1fr 120px 1fr 90px 90px 130px 110px' }}
              >
                <span
                  className="text-xs font-mono"
                  style={{ color: '#B8956A', fontFamily: 'monospace' }}
                >
                  {order.id.slice(-7)}
                </span>
                <span
                  className="text-sm font-medium truncate pr-3"
                  style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {order.customerName}
                </span>
                <span
                  className="text-sm pr-3"
                  style={{ color: 'rgba(237,227,208,0.55)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '0.8125rem' }}
                >
                  {order.customerPhone}
                </span>
                <span
                  className="text-sm truncate pr-3"
                  style={{ color: 'rgba(237,227,208,0.5)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '0.8125rem' }}
                >
                  {formatItems(order.items)}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  ₹{order.totalAmount}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'rgba(237,227,208,0.45)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                </span>
                <span
                  className="text-xs"
                  style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  {formatDate(order.createdAt)}
                </span>
                <div className="flex justify-end">
                  <StatusBadge status={order.status} size="sm" />
                </div>
              </div>

              {/* Mobile Row */}
              <div className="lg:hidden px-5 py-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-mono"
                      style={{ color: '#B8956A', fontFamily: 'monospace' }}
                    >
                      #{order.id.slice(-6)}
                    </span>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                  <p
                    className="text-sm font-medium mb-0.5"
                    style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {order.customerName}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {formatItems(order.items)} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: '#B8956A', fontFamily: 'Georgia, serif' }}
                  >
                    ₹{order.totalAmount}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {PAYMENT_LABELS[order.paymentMethod]}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Count */}
      <p
        className="mt-3 text-xs"
        style={{ color: 'rgba(237,227,208,0.25)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
      >
        {filtered.length} order{filtered.length !== 1 ? 's' : ''} shown · Click any row to view details
      </p>

      {/* Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
