'use client';

import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  accent: string;        // hex color
  trend?: string;        // e.g. "+3 today"
  trendUp?: boolean;
  description?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  accent,
  trend,
  trendUp,
  description,
}: StatCardProps) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden transition-all duration-300 group"
      style={{
        background: 'rgba(26, 20, 14, 0.8)',
        border: '1px solid rgba(184,149,106,0.15)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${accent}40`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accent}20`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,149,106,0.15)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Gradient glow in corner */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-20"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
          transform: 'translate(30%, -30%)',
        }}
      />

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${accent}18`, color: accent }}
      >
        {icon}
      </div>

      {/* Value */}
      <div
        className="text-4xl font-bold mb-1 leading-none"
        style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
      >
        {value}
      </div>

      {/* Label */}
      <p
        className="text-xs tracking-[0.15em] uppercase font-medium mt-2"
        style={{ color: 'rgba(237,227,208,0.45)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
      >
        {label}
      </p>

      {/* Description or Trend */}
      {(description || trend) && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(184,149,106,0.1)' }}>
          {trend ? (
            <p
              className="text-xs font-medium"
              style={{
                color: trendUp ? '#4ade80' : trendUp === false ? '#f87171' : 'rgba(237,227,208,0.35)',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              }}
            >
              {trend}
            </p>
          ) : (
            <p
              className="text-xs"
              style={{ color: 'rgba(237,227,208,0.3)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
