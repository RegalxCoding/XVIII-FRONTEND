'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Check, Trash2, Mail, Phone, User,
  Hash, Clock, Eye, EyeOff, Loader2
} from 'lucide-react';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { feedbackService } from '@/services/feedback.service';
import type { CustomerFeedback } from '@/types/contact.types';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Detail Drawer ────────────────────────────────────
function FeedbackDrawer({
  item,
  onClose,
  onMarkRead,
  onDelete,
}: {
  item: CustomerFeedback;
  onClose: () => void;
  onMarkRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isMarking, setIsMarking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Drawer */}
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
        <div
          className="flex items-start justify-between px-6 py-5 sticky top-0 z-10 border-b"
          style={{ background: '#1a1410', borderColor: 'rgba(184,149,106,0.15)' }}
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <MessageSquare size={16} style={{ color: '#B8956A' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}>
                Feedback Details
              </h2>
              <span
                className="text-[9px] tracking-[0.15em] uppercase font-bold px-2 py-0.5"
                style={{
                  background: item.status === 'unread' ? 'rgba(251,146,60,0.12)' : 'rgba(74,222,128,0.1)',
                  color: item.status === 'unread' ? '#fb923c' : '#4ade80',
                  border: item.status === 'unread' ? '1px solid rgba(251,146,60,0.3)' : '1px solid rgba(74,222,128,0.2)',
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                }}
              >
                {item.status === 'unread' ? 'Unread' : 'Read'}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
              {formatDate(item.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors"
            style={{ color: 'rgba(237,227,208,0.4)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#EDE3D0'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.4)'; }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-6 space-y-6">
          {/* Customer Info */}
          <section>
            <p
              className="text-[10px] tracking-[0.25em] uppercase mb-3"
              style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Customer
            </p>
            <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(184,149,106,0.12)' }}>
              {[
                { icon: <User size={14} />, label: item.customerName },
                { icon: <Phone size={14} />, label: item.phone },
                { icon: <Mail size={14} />, label: item.email },
                ...(item.orderNumber ? [{ icon: <Hash size={14} />, label: item.orderNumber }] : []),
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

          {/* Subject + Message */}
          <section>
            <p
              className="text-[10px] tracking-[0.25em] uppercase mb-3"
              style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Message
            </p>
            <div className="rounded-xl p-4 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(184,149,106,0.12)' }}>
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Subject</p>
                <p className="text-sm font-semibold" style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>{item.subject}</p>
              </div>
              <div className="h-px" style={{ background: 'rgba(184,149,106,0.1)' }} />
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>Full Message</p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(237,227,208,0.7)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                  {item.message}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 px-6 py-4 border-t flex gap-3" style={{ background: '#1a1410', borderColor: 'rgba(184,149,106,0.15)' }}>
          {item.status === 'unread' && (
            <button
              onClick={async () => {
                setIsMarking(true);
                await onMarkRead(item.id);
                setIsMarking(false);
                onClose();
              }}
              disabled={isMarking}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-[0.15em] uppercase font-bold transition-colors disabled:opacity-50"
              style={{
                background: 'rgba(74,222,128,0.12)',
                border: '1px solid rgba(74,222,128,0.25)',
                color: '#4ade80',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              }}
            >
              {isMarking ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Mark as Read
            </button>
          )}
          <button
            onClick={async () => {
              if (!confirm('Delete this feedback?')) return;
              setIsDeleting(true);
              await onDelete(item.id);
              setIsDeleting(false);
              onClose();
            }}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-[0.15em] uppercase font-bold transition-colors disabled:opacity-50"
            style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              color: '#f87171',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            }}
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
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
export default function AdminFeedbackPage() {
  const [items, setItems] = useState<CustomerFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<CustomerFeedback | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    const unsub = feedbackService.subscribeAll((data) => {
      setItems(data);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = filter === 'all' ? items : items.filter((f) => f.status === filter);
  const unreadCount = items.filter((f) => f.status === 'unread').length;

  const handleMarkRead = async (id: string) => {
    await feedbackService.markAsRead(id);
  };

  const handleDelete = async (id: string) => {
    await feedbackService.delete(id);
  };

  return (
    <>
      <AdminHeader
        title="Feedback"
        subtitle="Customer messages and feedback submissions"
      />

      <div className="p-6 space-y-6">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          {([
            { key: 'all', label: 'All', count: items.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: items.length - unreadCount },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-[0.1em] uppercase font-medium transition-all"
              style={{
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                background: filter === f.key ? 'rgba(184,149,106,0.15)' : 'rgba(26,20,14,0.8)',
                border: filter === f.key ? '1px solid rgba(184,149,106,0.4)' : '1px solid rgba(184,149,106,0.12)',
                color: filter === f.key ? '#B8956A' : 'rgba(237,227,208,0.5)',
                borderRadius: '0.75rem',
              }}
            >
              {f.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px]"
                style={{
                  background: filter === f.key ? 'rgba(184,149,106,0.25)' : 'rgba(237,227,208,0.08)',
                  color: filter === f.key ? '#B8956A' : 'rgba(237,227,208,0.4)',
                }}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(184,149,106,0.15)', background: 'rgba(26,20,14,0.6)' }}>
          {/* Header */}
          <div
            className="hidden lg:grid px-5 py-3.5 border-b text-[10px] tracking-[0.2em] uppercase"
            style={{
              gridTemplateColumns: '1fr 1fr 140px 100px 120px',
              color: 'rgba(237,227,208,0.3)',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              borderColor: 'rgba(184,149,106,0.1)',
            }}
          >
            <span>Customer</span>
            <span>Subject</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin mb-3" style={{ color: '#B8956A' }} />
              <p className="text-xs tracking-wider uppercase" style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                Loading feedback…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <MessageSquare size={32} style={{ color: 'rgba(237,227,208,0.1)' }} className="mb-4" />
              <p className="text-sm" style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                No feedback found
              </p>
            </div>
          ) : (
            filtered.map((item, idx) => (
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
                  style={{ gridTemplateColumns: '1fr 1fr 140px 100px 120px' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-3">
                    {item.status === 'unread' && (
                      <span className="w-2 h-2 rounded-full bg-[#fb923c] shrink-0" />
                    )}
                    <span className="text-sm font-medium truncate" style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      {item.customerName}
                    </span>
                  </div>
                  <span className="text-sm truncate pr-3" style={{ color: 'rgba(237,227,208,0.55)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    {item.subject}
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    {timeAgo(item.createdAt)}
                  </span>
                  <span
                    className="text-[9px] tracking-[0.1em] uppercase font-bold px-2 py-1 inline-block w-fit"
                    style={{
                      background: item.status === 'unread' ? 'rgba(251,146,60,0.12)' : 'rgba(74,222,128,0.08)',
                      color: item.status === 'unread' ? '#fb923c' : '#4ade80',
                      border: item.status === 'unread' ? '1px solid rgba(251,146,60,0.25)' : '1px solid rgba(74,222,128,0.15)',
                      fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    }}
                  >
                    {item.status === 'unread' ? 'Unread' : 'Read'}
                  </span>
                  <div className="flex justify-end">
                    <span className="text-xs font-medium" style={{ color: '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      View Details →
                    </span>
                  </div>
                </div>

                {/* Mobile row */}
                <div className="lg:hidden px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {item.status === 'unread' && <span className="w-2 h-2 rounded-full bg-[#fb923c] shrink-0" />}
                        <p className="text-sm font-medium" style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                          {item.customerName}
                        </p>
                      </div>
                      <p className="text-xs truncate" style={{ color: 'rgba(237,227,208,0.5)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                        {item.subject}
                      </p>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <p className="text-xs" style={{ color: 'rgba(237,227,208,0.25)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
          {filtered.length} message{filtered.length !== 1 ? 's' : ''} · Click any row to view details
        </p>
      </div>

      <AnimatePresence>
        {selected && (
          <FeedbackDrawer
            key={selected.id}
            item={selected}
            onClose={() => setSelected(null)}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
