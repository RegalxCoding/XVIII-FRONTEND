'use client';

import type { AdminOrderStatus } from '@/types/admin.types';

interface StatusBadgeProps {
  status: AdminOrderStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  AdminOrderStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  pending:   { label: 'Pending',   color: '#fb923c', bg: 'rgba(251,146,60,0.12)',   dot: '#fb923c' },
  confirmed: { label: 'Confirmed', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',   dot: '#60a5fa' },
  preparing: { label: 'Preparing', color: '#c084fc', bg: 'rgba(192,132,252,0.12)',  dot: '#c084fc' },
  ready:     { label: 'Ready',     color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)',   dot: '#2dd4bf' },
  delivered: { label: 'Delivered', color: '#4ade80', bg: 'rgba(74,222,128,0.12)',   dot: '#4ade80' },
  cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.12)', dot: '#f87171' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const px = size === 'sm' ? '0.5rem 0.875rem' : '0.375rem 0.875rem';
  const fontSize = size === 'sm' ? '0.625rem' : '0.6875rem';

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-semibold tracking-[0.08em] uppercase"
      style={{
        padding: px,
        fontSize,
        background: cfg.bg,
        color: cfg.color,
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
}

export { STATUS_CONFIG };
