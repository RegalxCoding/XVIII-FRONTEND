'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Bell,
  MessageSquare,
  Package,
} from 'lucide-react';
import { feedbackService } from '@/services/feedback.service';
import { bulkOrdersService } from '@/services/bulk-orders.service';
import type { CustomerFeedback } from '@/types/contact.types';
import type { BulkOrderRequest } from '@/types/contact.types';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: ShoppingBag },
  { label: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { label: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
  { label: 'Bulk Orders', href: '/admin/bulk-orders', icon: Package },
];

// ─── Brand Logo ───────────────────────────
function BrandLogo() {
  return (
    <div
      className="flex items-center gap-3 px-6 py-5 border-b flex-shrink-0"
      style={{ borderColor: 'rgba(184,149,106,0.15)' }}
    >
      <div className="w-10 h-10 flex-shrink-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="#15110D" stroke="#B8956A" strokeWidth="2" />
          <text x="50" y="44" textAnchor="middle" fill="#EDE3D0" fontSize="18" fontFamily="Georgia, serif" fontWeight="700" letterSpacing="2">THE</text>
          <text x="50" y="62" textAnchor="middle" fill="#B8956A" fontSize="22" fontFamily="Georgia, serif" fontWeight="900" letterSpacing="-1">XVIII</text>
          <text x="50" y="74" textAnchor="middle" fill="#EDE3D0" fontSize="8" fontFamily="Georgia, serif" letterSpacing="3">BREW CO.</text>
        </svg>
      </div>
      <div>
        <p
          className="text-[9px] tracking-[0.3em] uppercase leading-none"
          style={{ color: 'rgba(237,227,208,0.45)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          XVIII Brew Co.
        </p>
        <p
          className="text-xs tracking-[0.2em] uppercase font-semibold mt-0.5"
          style={{ color: '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          Admin Panel
        </p>
      </div>
    </div>
  );
}

// ─── Nav Item ─────────────────────────────
function NavItem({
  item,
  isActive,
  badge,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="relative flex items-center gap-3 px-4 py-3 rounded-xl mx-3 text-sm font-medium transition-colors duration-200"
      style={{
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        background: isActive ? 'rgba(184,149,106,0.15)' : 'transparent',
        color: isActive ? '#B8956A' : 'rgba(237,227,208,0.55)',
      }}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r"
          style={{ background: '#B8956A' }}
        />
      )}
      <Icon size={17} strokeWidth={isActive ? 2 : 1.6} />
      <span className="tracking-[0.05em] flex-1">{item.label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
          style={{
            background: 'rgba(251,146,60,0.2)',
            color: '#fb923c',
            border: '1px solid rgba(251,146,60,0.3)',
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

// ─── Notification Pill ────────────────────
type NotifItem =
  | { type: 'feedback'; data: CustomerFeedback }
  | { type: 'bulk'; data: BulkOrderRequest };

function NotificationPill({ notifications }: { notifications: NotifItem[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const total = notifications.length;

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="mx-3 mt-4 flex-shrink-0 relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors"
        style={{
          borderColor: open ? 'rgba(184,149,106,0.3)' : 'rgba(184,149,106,0.15)',
          background: open ? 'rgba(184,149,106,0.1)' : 'rgba(184,149,106,0.05)',
        }}
      >
        <Bell size={14} style={{ color: '#B8956A' }} />
        <div className="flex-1 min-w-0 text-left">
          <p
            className="text-[10px] font-semibold tracking-[0.1em] uppercase"
            style={{ color: '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Notifications
          </p>
          <p
            className="text-[10px] truncate mt-0.5"
            style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            {total > 0 ? `${total} new item${total > 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        {total > 0 && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: '#fb923c', color: '#fff' }}
          >
            {total}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && total > 0 && (
        <div
          className="absolute left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden"
          style={{ background: '#1a1410', border: '1px solid rgba(184,149,106,0.18)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}
        >
          {notifications.slice(0, 5).map((n, i) => {
            const isLast = i === Math.min(notifications.length, 5) - 1;
            const href = n.type === 'feedback' ? '/admin/feedback' : '/admin/bulk-orders';
            const title = n.type === 'feedback' ? 'New Feedback' : 'New Bulk Order';
            const name = n.type === 'feedback' ? n.data.customerName : n.data.fullName;
            const sub = n.type === 'feedback' ? (n.data as CustomerFeedback).subject : (n.data as BulkOrderRequest).eventType;
            const time = n.type === 'feedback' ? n.data.createdAt : n.data.createdAt;

            return (
              <button
                key={i}
                onClick={() => { setOpen(false); router.push(href); }}
                className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[rgba(184,149,106,0.07)]"
                style={{ borderBottom: !isLast ? '1px solid rgba(184,149,106,0.08)' : 'none' }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: n.type === 'feedback' ? 'rgba(96,165,250,0.15)' : 'rgba(184,149,106,0.15)' }}
                >
                  {n.type === 'feedback'
                    ? <MessageSquare size={12} style={{ color: '#60a5fa' }} />
                    : <Package size={12} style={{ color: '#B8956A' }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold tracking-[0.05em] uppercase" style={{ color: n.type === 'feedback' ? '#60a5fa' : '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    {title}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(237,227,208,0.7)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    {name}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
                    {sub} · {timeAgo(time)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar Content (shared between desktop + mobile) ────
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadFeedback, setUnreadFeedback] = useState<CustomerFeedback[]>([]);
  const [pendingBulk, setPendingBulk] = useState<BulkOrderRequest[]>([]);

  useEffect(() => {
    const unsubFeedback = feedbackService.subscribeAll((items) => {
      setUnreadFeedback(items.filter((f) => f.status === 'unread'));
    });
    const unsubBulk = bulkOrdersService.subscribeAll((items) => {
      setPendingBulk(items.filter((b) => b.status === 'pending'));
    });
    return () => { unsubFeedback(); unsubBulk(); };
  }, []);

  const notifications: NotifItem[] = [
    ...unreadFeedback.map((d) => ({ type: 'feedback' as const, data: d })),
    ...pendingBulk.map((d) => ({ type: 'bulk' as const, data: d })),
  ].sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    if (onClose) onClose();
    router.push('/admin-login');
  };

  const getBadge = (href: string) => {
    if (href === '/admin/feedback') return unreadFeedback.length || undefined;
    if (href === '/admin/bulk-orders') return pendingBulk.length || undefined;
    return undefined;
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#120E0A' }}>
      <BrandLogo />

      <NotificationPill notifications={notifications} />

      {/* Nav section label */}
      <p
        className="px-7 mt-6 mb-2 text-[9px] tracking-[0.35em] uppercase flex-shrink-0"
        style={{ color: 'rgba(237,227,208,0.25)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
      >
        Navigation
      </p>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            badge={getBadge(item.href)}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Divider */}
      <div
        className="mx-6 mb-3 flex-shrink-0"
        style={{ height: '1px', background: 'rgba(184,149,106,0.12)' }}
      />

      {/* Logout button */}
      <button
        id="admin-logout-btn"
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl mx-3 mb-5 text-sm font-medium transition-colors duration-200 hover:bg-red-500/10 flex-shrink-0"
        style={{
          color: 'rgba(237,227,208,0.45)',
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget).style.color = '#fca5a5';
          (e.currentTarget).style.background = 'rgba(239,68,68,0.1)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget).style.color = 'rgba(237,227,208,0.45)';
          (e.currentTarget).style.background = 'transparent';
        }}
      >
        <LogOut size={16} strokeWidth={1.6} />
        <span className="tracking-[0.05em]">Logout</span>
      </button>
    </div>
  );
}

// ─── Main Sidebar Export ──────────────────
export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop Sidebar (fixed left) ── */}
      <aside
        className="hidden lg:flex flex-col w-[260px] flex-shrink-0 min-h-screen sticky top-0"
        style={{ borderRight: '1px solid rgba(184,149,106,0.12)' }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div
        className="lg:hidden flex items-center justify-between px-5 py-4 sticky top-0 z-30 border-b"
        style={{
          background: '#120E0A',
          borderColor: 'rgba(184,149,106,0.12)',
        }}
      >
        {/* Mini logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#15110D" stroke="#B8956A" strokeWidth="2" />
              <text x="50" y="62" textAnchor="middle" fill="#B8956A" fontSize="28" fontFamily="Georgia, serif" fontWeight="900">XVIII</text>
            </svg>
          </div>
          <span
            className="text-xs font-semibold tracking-[0.15em] uppercase"
            style={{ color: '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Admin
          </span>
        </div>

        {/* Hamburger */}
        <button
          id="admin-mobile-menu-toggle"
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg"
          style={{ color: 'rgba(237,227,208,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ── Mobile Overlay Drawer ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-[280px] h-full flex-shrink-0 flex flex-col"
            style={{
              background: '#120E0A',
              borderRight: '1px solid rgba(184,149,106,0.15)',
              animation: 'adminSlideIn 0.3s cubic-bezier(0.22,1,0.36,1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close row */}
            <div className="flex justify-end p-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg"
                style={{ color: 'rgba(237,227,208,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sidebar content below close button */}
            <div className="flex-1 overflow-y-auto">
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Keyframe injected via a plain <style> tag — no jsx prop needed */}
      <style>{`
        @keyframes adminSlideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
    </>
  );
}
