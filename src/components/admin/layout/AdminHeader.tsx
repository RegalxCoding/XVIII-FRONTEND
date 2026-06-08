'use client';

import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [dateStr, setDateStr] = useState('');

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
        <button
          id="admin-notification-bell"
          className="relative p-2.5 rounded-xl transition-all duration-200"
          style={{
            background: 'rgba(184,149,106,0.08)',
            border: '1px solid rgba(184,149,106,0.15)',
            color: 'rgba(237,227,208,0.5)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#B8956A';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,149,106,0.4)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.5)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,149,106,0.15)';
          }}
          aria-label="Notifications"
        >
          <Bell size={16} strokeWidth={1.6} />
          {/* Badge — reserved for future use */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#B8956A', boxShadow: '0 0 0 2px #15110D' }}
          />
        </button>

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
