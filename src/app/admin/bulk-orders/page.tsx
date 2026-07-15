'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, X, Check, Trash2, Phone, Mail, User,
  Calendar, Users, MessageSquare, Loader2, CheckCircle, XCircle
} from 'lucide-react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { bulkOrdersService } from '@/services/bulk-orders.service';
import type { BulkOrderRequest, BulkOrderStatus } from '@/types/contact.types';

const STATUS_CONFIG: Record<BulkOrderStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:   { label: 'Pending',   color: '#fb923c', bg: 'rgba(251,146,60,0.12)',   border: 'rgba(251,146,60,0.25)' },
  contacted: { label: 'Contacted', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',   border: 'rgba(96,165,250,0.25)' },
  approved:  { label: 'Approved',  color: '#4ade80', bg: 'rgba(74,222,128,0.10)',   border: 'rgba(74,222,128,0.2)' },
  rejected:  { label: 'Rejected',  color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.2)' },
};

const CONTACT_METHOD_LABEL: Record<string, string> = {
  phone: '📞 Phone Call',
  whatsapp: '💬 WhatsApp',
  email: '✉️ Email',
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Detail Drawer ────────────────────────────────────
function BulkOrderDrawer({
  item,
  onClose,
  onStatusUpdate,
  onDelete,
}: {
  item: BulkOrderRequest;
  onClose: () => void;
  onStatusUpdate: (id: string, status: BulkOrderStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  const doAction = async (action: string, fn: () => Promise<void>) => {
    setBusy(action);
    await fn();
    setBusy(null);
    onClose();
  };

  const sectionHead = {
    fontSize: '0.6875rem',
    letterSpacing: '0.25em',
    textTransform: 'uppercase' as const,
    color: 'rgba(237,227,208,0.3)',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    marginBottom: '0.875rem',
  };

  const sc = STATUS_CONFIG[item.status];

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-lg overflow-y-auto"
        style={{
          background: '#1a1410',
          borderLeft: '1px solid rgba(184,149,106,0.18)',
          boxShadow: '-32px 0 80px rgba(0,0,0,0.6)',
          animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 sticky top-0 z-10 border-b" style={{ background: '#1a1410', borderColor: 'rgba(184,149,106,0.15)' }}>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Package size={16} style={{ color: '#B8956A' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}>Bulk Order Request</h2>
              <span
                className="text-[9px] tracking-[0.12em] uppercase font-bold px-2 py-0.5"
                style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                {sc.label}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
              {formatDate(item.createdAt)}
            </p>
          </div>
          <button onClick={onClose} className="p-2 transition-colors" style={{ color: 'rgba(237,227,208,0.4)' }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-6 space-y-7">
          {/* Customer info */}
          <section>
            <p style={sectionHead}>Customer Information</p>
            <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(184,149,106,0.12)' }}>
              {[
                { icon: <User size={14} />, label: item.fullName },
                { icon: <Phone size={14} />, label: item.phone },
                { icon: <Mail size={14} />, label: item.email },
                { icon: <MessageSquare size={14} />, label: CONTACT_METHOD_LABEL[item.preferredContact] || item.preferredContact },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span style={{ color: '#B8956A' }}>{row.icon}</span>
                  <span className="text-sm" style={{ color: 'rgba(237,227,208,0.75)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Event details */}
          <section>
            <p style={sectionHead}>Event Details</p>
            <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(184,149,106,0.12)' }}>
              {[
                { icon: <Package size={14} />, label: item.eventType, sub: 'Event Type' },
                { icon: <Calendar size={14} />, label: new Date(item.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), sub: 'Event Date' },
                { icon: <Users size={14} />, label: item.estimatedGuests, sub: 'Estimated Guests' },
              ].map((row, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-0.5" style={{ color: '#B8956A' }}>{row.icon}</span>
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase mb-0.5" style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      {row.sub}
                    </p>
                    <p className="text-sm" style={{ color: 'rgba(237,227,208,0.8)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      {row.label}
                    </p>
                  </div>
                </div>
              ))}
              {item.specialRequirements && (
                <div className="pt-3 border-t" style={{ borderColor: 'rgba(184,149,106,0.1)' }}>
                  <p className="text-[9px] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    Special Requirements
                  </p>
                  <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(237,227,208,0.6)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    &ldquo;{item.specialRequirements}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 px-6 py-4 border-t space-y-3" style={{ background: '#1a1410', borderColor: 'rgba(184,149,106,0.15)' }}>
          <div className="grid grid-cols-2 gap-3">
            {item.status !== 'contacted' && (
              <button
                onClick={() => doAction('contact', () => onStatusUpdate(item.id, 'contacted'))}
                disabled={!!busy}
                className="flex items-center justify-center gap-2 py-2.5 text-xs tracking-[0.12em] uppercase font-bold transition-colors disabled:opacity-50"
                style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60a5fa', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                {busy === 'contact' ? <Loader2 size={13} className="animate-spin" /> : <Phone size={13} />}
                Mark Contacted
              </button>
            )}
            {item.status !== 'approved' && (
              <button
                onClick={() => doAction('approve', () => onStatusUpdate(item.id, 'approved'))}
                disabled={!!busy}
                className="flex items-center justify-center gap-2 py-2.5 text-xs tracking-[0.12em] uppercase font-bold transition-colors disabled:opacity-50"
                style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                {busy === 'approve' ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                Approve
              </button>
            )}
            {item.status !== 'rejected' && (
              <button
                onClick={() => doAction('reject', () => onStatusUpdate(item.id, 'rejected'))}
                disabled={!!busy}
                className="flex items-center justify-center gap-2 py-2.5 text-xs tracking-[0.12em] uppercase font-bold transition-colors disabled:opacity-50"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                {busy === 'reject' ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                Reject
              </button>
            )}
            <button
              onClick={() => {
                if (!confirm('Delete this bulk order request?')) return;
                doAction('delete', () => onDelete(item.id));
              }}
              disabled={!!busy}
              className="flex items-center justify-center gap-2 py-2.5 text-xs tracking-[0.12em] uppercase font-bold transition-colors disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(237,227,208,0.5)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              {busy === 'delete' ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              Delete
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────
export default function AdminBulkOrdersPage() {
  const [items, setItems] = useState<BulkOrderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<BulkOrderRequest | null>(null);
  const [filter, setFilter] = useState<'all' | BulkOrderStatus>('all');

  useEffect(() => {
    const unsub = bulkOrdersService.subscribeAll((data) => {
      setItems(data);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = filter === 'all' ? items : items.filter((r) => r.status === filter);

  const handleStatusUpdate = async (id: string, status: BulkOrderStatus) => {
    await bulkOrdersService.updateStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    await bulkOrdersService.delete(id);
  };

  const statusFilters: { key: 'all' | BulkOrderStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <>
      <AdminHeader
        title="Bulk Orders"
        subtitle="Event and bulk order requests from customers"
      />

      <div className="p-6 space-y-6">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-3">
          {statusFilters.map((f) => {
            const count = f.key === 'all' ? items.length : items.filter((r) => r.status === f.key).length;
            const cfg = f.key !== 'all' ? STATUS_CONFIG[f.key] : null;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="flex items-center gap-2 px-4 py-2 text-xs tracking-[0.1em] uppercase font-medium transition-all"
                style={{
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  background: filter === f.key ? (cfg ? cfg.bg : 'rgba(184,149,106,0.15)') : 'rgba(26,20,14,0.8)',
                  border: filter === f.key ? `1px solid ${cfg ? cfg.border : 'rgba(184,149,106,0.4)'}` : '1px solid rgba(184,149,106,0.12)',
                  color: filter === f.key ? (cfg ? cfg.color : '#B8956A') : 'rgba(237,227,208,0.5)',
                  borderRadius: '0.75rem',
                }}
              >
                {f.label}
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{
                    background: 'rgba(237,227,208,0.08)',
                    color: 'rgba(237,227,208,0.4)',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(184,149,106,0.15)', background: 'rgba(26,20,14,0.6)' }}>
          <div
            className="hidden lg:grid px-5 py-3.5 border-b text-[10px] tracking-[0.2em] uppercase"
            style={{
              gridTemplateColumns: '1fr 1fr 120px 100px 90px 120px',
              color: 'rgba(237,227,208,0.3)',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              borderColor: 'rgba(184,149,106,0.1)',
            }}
          >
            <span>Customer</span>
            <span>Event Type</span>
            <span>Event Date</span>
            <span>Guests</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin mb-3" style={{ color: '#B8956A' }} />
              <p className="text-xs tracking-wider uppercase" style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                Loading requests…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Package size={32} style={{ color: 'rgba(237,227,208,0.1)' }} className="mb-4" />
              <p className="text-sm" style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                No bulk order requests found
              </p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const sc = STATUS_CONFIG[item.status];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(184,149,106,0.08)' : 'none' }}
                  onClick={() => setSelected(item)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(184,149,106,0.04)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  {/* Desktop row */}
                  <div
                    className="hidden lg:grid items-center px-5 py-4"
                    style={{ gridTemplateColumns: '1fr 1fr 120px 100px 90px 120px' }}
                  >
                    <span className="text-sm font-medium truncate pr-3" style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      {item.fullName}
                    </span>
                    <span className="text-sm truncate pr-3" style={{ color: 'rgba(237,227,208,0.55)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      {item.eventType}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      {new Date(item.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      {item.estimatedGuests}
                    </span>
                    <span
                      className="text-[9px] tracking-[0.1em] uppercase font-bold px-2 py-1 inline-block w-fit"
                      style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      {sc.label}
                    </span>
                    <div className="flex justify-end">
                      <span className="text-xs font-medium" style={{ color: '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                        View Details →
                      </span>
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="lg:hidden px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-medium" style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                        {item.fullName}
                      </p>
                      <span
                        className="text-[9px] tracking-[0.08em] uppercase font-bold px-2 py-0.5 shrink-0"
                        style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                      >
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(237,227,208,0.45)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      {item.eventType} · {item.estimatedGuests} guests · {timeAgo(item.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <p className="text-xs" style={{ color: 'rgba(237,227,208,0.25)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          {filtered.length} request{filtered.length !== 1 ? 's' : ''} · Click any row to view details
        </p>
      </div>

      <AnimatePresence>
        {selected && (
          <BulkOrderDrawer
            key={selected.id}
            item={selected}
            onClose={() => setSelected(null)}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
