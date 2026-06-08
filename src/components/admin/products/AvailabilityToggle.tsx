'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export default function AvailabilityToggle({
  checked,
  onChange,
  labelOn = 'Available',
  labelOff = 'Unavailable',
  size = 'md',
  disabled = false,
}: ToggleProps) {
  // Dimensions
  const trackW = size === 'sm' ? 40 : 48;
  const trackH = size === 'sm' ? 22 : 26;
  const thumbD = size === 'sm' ? 16 : 20;
  const pad    = (trackH - thumbD) / 2; // vertical padding = 3px

  // Horizontal travel
  const thumbLeft  = pad;                          // OFF → thumb on left
  const thumbRight = trackW - thumbD - pad;         // ON  → thumb on right

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 select-none"
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
    >
      {/* ── Track ── */}
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          width: trackW,
          height: trackH,
          borderRadius: trackH,          // full pill
          flexShrink: 0,
          transition: 'background 0.25s ease, border-color 0.25s ease',
          background: checked
            ? 'rgba(74, 222, 128, 0.2)'
            : 'rgba(248, 113, 113, 0.15)',
          border: `1.5px solid ${
            checked
              ? 'rgba(74, 222, 128, 0.6)'
              : 'rgba(248, 113, 113, 0.5)'
          }`,
        }}
      >
        {/* ── Thumb ── */}
        <span
          style={{
            position: 'absolute',
            top: pad,
            left: checked ? thumbRight : thumbLeft,
            width: thumbD,
            height: thumbD,
            borderRadius: '50%',
            background: checked ? '#4ade80' : '#f87171',
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.5)',
            transition: 'left 0.25s cubic-bezier(0.22, 1, 0.36, 1), background 0.25s ease',
          }}
        />
      </span>

      {/* ── Label ── */}
      <span
        style={{
          fontSize: size === 'sm' ? '0.6875rem' : '0.75rem',
          fontWeight: 500,
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          color: checked ? '#4ade80' : '#f87171',
          transition: 'color 0.25s ease',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
      >
        {checked ? labelOn : labelOff}
      </span>
    </button>
  );
}
