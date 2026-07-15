'use client';

import { Bell, MessageSquare, Package, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { feedbackService } from '@/services/feedback.service';
import { bulkOrdersService } from '@/services/bulk-orders.service';
import type { CustomerFeedback } from '@/types/contact.types';
import type { BulkOrderRequest } from '@/types/contact.types';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

type NotifItem =
  | { type: 'feedback'; data: CustomerFeedback }
  | { type: 'bulk'; data: BulkOrderRequest };

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [dateStr, setDateStr] = useState('');
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, []);

  // Subscribe to unread feedback + pending bulk orders in real-time
  useEffect(() => {
    let feedbackItems: CustomerFeedback[] = [];
    let bulkItems: BulkOrderRequest[] = [];

    const merge = () => {
      const combined: NotifItem[] = [
        ...feedbackItems.filter((f) => f.status === 'unread').map((d) => ({ type: 'feedback' as const, data: d })),
        ...bulkItems.filter((b) => b.status === 'pending').map((d) => ({ type: 'bulk' as const, data: d })),
      ].sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());
      setNotifications(combined);
    };

    const unsubFeedback = feedbackService.subscribeAll((items) => {
      feedbackItems = items;
      merge();
    });
    const unsubBulk = bulkOrdersService.subscribeAll((items) => {
      bulkItems = items;
      merge();
    });

    return () => { unsubFeedback(); unsubBulk(); };
  }, []);

  // Close bell dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const totalCount = notifications.length;

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-20"
      style={{
        background: 'rgba(21, 17, 13, 0.9)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(184,149,106,0.12)',
      }}
    >
      {/* Left: Page title */}
      <div>
        <h1
          className="text-lg font-semibold leading-tight"
          style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif', letterSpacing: '0.01em' }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className="text-xs mt-0.5"
            style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            {subtitle}
          </p>
        ) : (
          <p
            className="text-xs mt-0.5"
            style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            {dateStr}
          </p>
        )}
      </div>

      {/* Right: Notification + Avatar */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div ref={bellRef} className="relative">
          <button
            id="admin-notification-bell"
            onClick={() => setBellOpen((o) => !o)}
            className="relative p-2.5 rounded-xl transition-all duration-200"
            style={{
              background: bellOpen ? 'rgba(184,149,106,0.15)' : 'rgba(184,149,106,0.08)',
              border: bellOpen ? '1px solid rgba(184,149,106,0.4)' : '1px solid rgba(184,149,106,0.15)',
              color: bellOpen ? '#B8956A' : 'rgba(237,227,208,0.5)',
            }}
            onMouseEnter={(e) => {
              if (!bellOpen) {
                (e.currentTarget as HTMLElement).style.color = '#B8956A';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,149,106,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!bellOpen) {
                (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.5)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,149,106,0.15)';
              }
            }}
            aria-label="Notifications"
          >
            <Bell size={16} strokeWidth={1.6} />
            {/* Badge */}
            {totalCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: '#fb923c', color: '#fff', boxShadow: '0 0 0 2px #15110D', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                {totalCount > 99 ? '99+' : totalCount}
              </span>
            )}
            {totalCount === 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: '#B8956A', boxShadow: '0 0 0 2px #15110D' }}
              />
            )}
          </button>

          {/* Notification dropdown */}
          {bellOpen && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden z-50"
              style={{
                background: '#1a1410',
                border: '1px solid rgba(184,149,106,0.2)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              }}
            >
              {/* Dropdown header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'rgba(184,149,106,0.1)' }}
              >
                <p
                  className="text-[10px] tracking-[0.25em] uppercase font-semibold"
                  style={{ color: '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Notifications {totalCount > 0 && `(${totalCount})`}
                </p>
                <button
                  onClick={() => setBellOpen(false)}
                  className="p-1 transition-colors"
                  style={{ color: 'rgba(237,227,208,0.3)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#EDE3D0'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.3)'; }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Notification list */}
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell size={24} className="mx-auto mb-3" style={{ color: 'rgba(237,227,208,0.15)' }} />
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    All caught up!
                  </p>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {notifications.slice(0, 8).map((n, i) => {
                    const isLast = i === Math.min(notifications.length, 8) - 1;
                    const href = n.type === 'feedback' ? '/admin/feedback' : '/admin/bulk-orders';
                    const title = n.type === 'feedback' ? 'New Feedback' : 'New Bulk Order';
                    const name = n.type === 'feedback' ? n.data.customerName : (n.data as BulkOrderRequest).fullName;
                    const sub = n.type === 'feedback'
                      ? (n.data as CustomerFeedback).subject
                      : (n.data as BulkOrderRequest).eventType;

                    return (
                      <button
                        key={i}
                        onClick={() => { setBellOpen(false); router.push(href); }}
                        className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors"
                        style={{
                          borderBottom: !isLast ? '1px solid rgba(184,149,106,0.07)' : 'none',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(184,149,106,0.05)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: n.type === 'feedback'
                              ? 'rgba(96,165,250,0.15)'
                              : 'rgba(184,149,106,0.15)',
                          }}
                        >
                          {n.type === 'feedback'
                            ? <MessageSquare size={14} style={{ color: '#60a5fa' }} />
                            : <Package size={14} style={{ color: '#B8956A' }} />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[10px] font-semibold tracking-[0.08em] uppercase mb-0.5"
                            style={{
                              color: n.type === 'feedback' ? '#60a5fa' : '#B8956A',
                              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                            }}
                          >
                            {title}
                          </p>
                          <p
                            className="text-sm font-medium truncate"
                            style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                          >
                            {name}
                          </p>
                          <p
                            className="text-xs truncate mt-0.5"
                            style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                          >
                            {sub} · {timeAgo(n.data.createdAt)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Footer links */}
              {notifications.length > 0 && (
                <div
                  className="grid grid-cols-2 border-t"
                  style={{ borderColor: 'rgba(184,149,106,0.1)' }}
                >
                  <button
                    onClick={() => { setBellOpen(false); router.push('/admin/feedback'); }}
                    className="flex items-center justify-center gap-1.5 py-3 text-[10px] tracking-[0.1em] uppercase font-semibold transition-colors border-r"
                    style={{ color: '#60a5fa', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', borderColor: 'rgba(184,149,106,0.1)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(96,165,250,0.05)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <MessageSquare size={11} />
                    Feedback
                  </button>
                  <button
                    onClick={() => { setBellOpen(false); router.push('/admin/bulk-orders'); }}
                    className="flex items-center justify-center gap-1.5 py-3 text-[10px] tracking-[0.1em] uppercase font-semibold transition-colors"
                    style={{ color: '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(184,149,106,0.05)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <Package size={11} />
                    Bulk Orders
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin avatar */}
        <div
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
          style={{
            background: 'rgba(184,149,106,0.08)',
            border: '1px solid rgba(184,149,106,0.15)',
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#B8956A', color: '#15110D', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            A
          </div>
          <div className="hidden sm:block">
            <p
              className="text-xs font-semibold leading-none"
              style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              Admin
            </p>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              XVIII Brew Co.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
