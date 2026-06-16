/**
 * timeSlots.ts — Dessert Scheduling Utilities
 *
 * All datetime math is done explicitly in Asia/Kolkata (IST).
 * Never relies on browser/system timezone defaults.
 *
 * Key guarantee:
 *   buildDessertSlot() computes scheduledTimestamp first, then derives
 *   isoDate and deliveryTime from it. This makes it structurally impossible
 *   for the three fields to be inconsistent.
 */

import {
  BUSINESS_HOURS,
  DELIVERY_SLOT_INTERVAL_HOURS,
  DESSERT_MIN_ADVANCE_HOURS,
  BUSINESS_TIMEZONE,
} from '@/constants';

// ─────────────────────────────────────────
// DessertSlot — the shape stored in cart + Firestore
// ─────────────────────────────────────────

export interface DessertSlot {
  /** Unix milliseconds — CANONICAL source of truth */
  scheduledTimestamp: number;
  /** ISO date "YYYY-MM-DD" in IST — derived from scheduledTimestamp, for display */
  isoDate: string;
  /** Human-readable time "4:00 PM" — derived from scheduledTimestamp, for display */
  time: string;
}

// ─────────────────────────────────────────
// Internal IST helpers
// ─────────────────────────────────────────

/**
 * Return a Date object representing the current moment expressed in IST.
 * All comparisons should use this to avoid browser-timezone drift.
 */
export function nowInIST(): Date {
  // We create a Date whose numeric value corresponds to the current UTC instant.
  // getISTComponents() is used whenever we need IST wall-clock fields.
  return new Date();
}

/**
 * Extract IST wall-clock components from any Date (or now by default).
 * Uses Intl.DateTimeFormat for standards-compliant IST conversion.
 */
function getISTComponents(date: Date = new Date()): {
  year: number;
  month: number; // 1-indexed
  day: number;
  hour: number;
  minute: number;
} {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parseInt(parts.find(p => p.type === type)?.value ?? '0', 10);
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),   // 0-23
    minute: get('minute'),
  };
}

/**
 * Build an ISO "YYYY-MM-DD" string for a specific IST date offset.
 * offset=0 → today, offset=1 → tomorrow, etc.
 */
function isoDateWithOffset(offset: number): string {
  const now = new Date();
  // Shift by offset days in UTC — then format in IST
  const shifted = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
  const { year, month, day } = getISTComponents(shifted);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ─────────────────────────────────────────
// Public date helpers
// ─────────────────────────────────────────

/** Today's date as "YYYY-MM-DD" in IST */
export function getTodayISO(): string {
  return isoDateWithOffset(0);
}

/** Tomorrow's date as "YYYY-MM-DD" in IST */
export function getTomorrowISO(): string {
  return isoDateWithOffset(1);
}

// ─────────────────────────────────────────
// Slot label helpers
// ─────────────────────────────────────────

/**
 * Convert a 24-hour integer (e.g. 16) to a 12-hour label ("4:00 PM").
 */
function hourToLabel(hour: number): string {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  return hour < 12
    ? `${hour}:00 AM`
    : `${hour - 12}:00 PM`;
}

/**
 * Parse a slot label ("4:00 PM") back to a 24-hour integer.
 * Used when building the scheduled timestamp from a user selection.
 */
function labelToHour(label: string): number {
  const [timePart, period] = label.split(' ');
  let [h] = timePart.split(':').map(Number);
  if (period === 'AM') {
    return h === 12 ? 0 : h;
  } else {
    return h === 12 ? 12 : h + 12;
  }
}

/**
 * All business-hour slot labels from open to close, at DELIVERY_SLOT_INTERVAL_HOURS spacing.
 * e.g. ["8:00 AM", "9:00 AM", ..., "10:00 PM"]
 */
export function getAllSlots(): string[] {
  const slots: string[] = [];
  for (let h = BUSINESS_HOURS.open; h <= BUSINESS_HOURS.close; h += DELIVERY_SLOT_INTERVAL_HOURS) {
    slots.push(hourToLabel(h));
  }
  return slots;
}

// ─────────────────────────────────────────
// Slot availability
// ─────────────────────────────────────────

export interface SlotOption {
  label: string;
  isDisabled: boolean;
  disabledReason?: string;
}

/**
 * For a given ISO date, return all slots with their availability.
 *
 * - If isoDate === today: slots must be at least DESSERT_MIN_ADVANCE_HOURS ahead of now (IST)
 * - If isoDate === tomorrow or later: all business-hour slots are enabled
 */
export function getAvailableSlotsForDate(isoDate: string): SlotOption[] {
  const today = getTodayISO();
  const isToday = isoDate === today;
  const { hour: currentHour, minute: currentMinute } = getISTComponents();

  // Current fractional hour in IST (e.g. 10:30 → 10.5)
  const currentFractionalHour = currentHour + currentMinute / 60;
  const minimumHour = currentFractionalHour + DESSERT_MIN_ADVANCE_HOURS;

  return getAllSlots().map(label => {
    const slotHour = labelToHour(label);

    if (isToday && slotHour < minimumHour) {
      return {
        label,
        isDisabled: true,
        disabledReason: `Minimum ${DESSERT_MIN_ADVANCE_HOURS}h advance required`,
      };
    }

    return { label, isDisabled: false };
  });
}

export interface DateAvailability {
  todayISO: string;
  tomorrowISO: string;
  todayDisabled: boolean;
  todayDisabledReason?: string;
}

/**
 * Determine which dates are selectable.
 * todayDisabled = true if zero valid slots remain today (all within the 6-hour window).
 */
export function getAvailableDates(): DateAvailability {
  const todayISO = getTodayISO();
  const tomorrowISO = getTomorrowISO();

  const todaySlots = getAvailableSlotsForDate(todayISO);
  const anyTodayAvailable = todaySlots.some(s => !s.isDisabled);

  return {
    todayISO,
    tomorrowISO,
    todayDisabled: !anyTodayAvailable,
    todayDisabledReason: anyTodayAvailable
      ? undefined
      : 'No slots available today — minimum 6 hours required',
  };
}

// ─────────────────────────────────────────
// DessertSlot construction
// ─────────────────────────────────────────

/**
 * Build a DessertSlot from a real ISO date + a slot label.
 *
 * Process:
 *   1. Parse isoDate + label to get a wall-clock time in IST
 *   2. Convert to UTC Unix timestamp (ms) → this is `scheduledTimestamp`
 *   3. Derive `isoDate` and `time` back from the timestamp
 *
 * This guarantees the three fields can never be inconsistent.
 */
export function buildDessertSlot(isoDate: string, timeLabel: string): DessertSlot {
  const hour = labelToHour(timeLabel);
  const [year, month, day] = isoDate.split('-').map(Number);

  // Build a UTC timestamp that represents this IST wall-clock time.
  // IST = UTC+5:30
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const localMs = Date.UTC(year, month - 1, day, hour, 0, 0, 0);
  const scheduledTimestamp = localMs - IST_OFFSET_MS;

  // Derive display fields from the timestamp to guarantee consistency
  const derived = getISTComponents(new Date(scheduledTimestamp));
  const derivedISO = `${derived.year}-${String(derived.month).padStart(2, '0')}-${String(derived.day).padStart(2, '0')}`;
  const derivedTime = hourToLabel(derived.hour);

  return {
    scheduledTimestamp,
    isoDate: derivedISO,
    time: derivedTime,
  };
}

// ─────────────────────────────────────────
// Slot validity (expiry detection)
// ─────────────────────────────────────────

/**
 * Returns true if the slot is still valid — i.e. it is at least
 * DESSERT_MIN_ADVANCE_HOURS in the future from now.
 *
 * Called on Cart and Checkout mount to detect stale persisted slots.
 */
export function isSlotStillValid(slot: DessertSlot): boolean {
  const nowMs = Date.now();
  const minAdvanceMs = DESSERT_MIN_ADVANCE_HOURS * 60 * 60 * 1000;
  return slot.scheduledTimestamp > nowMs + minAdvanceMs;
}

// ─────────────────────────────────────────
// Display formatters
// ─────────────────────────────────────────

/**
 * Format a Unix timestamp (ms) as a full datetime string in IST.
 * e.g. "17 June 2026, 4:00 PM"
 */
export function formatScheduledTime(timestamp: number): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: BUSINESS_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
}

/**
 * Format a Unix timestamp (ms) as short date for admin tables.
 * e.g. "17 June"
 */
export function formatScheduledDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: BUSINESS_TIMEZONE,
    day: 'numeric',
    month: 'long',
  }).format(new Date(timestamp));
}

/**
 * Format a Unix timestamp as just the time string.
 * e.g. "4:00 PM"
 */
export function formatScheduledTimeOnly(timestamp: number): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: BUSINESS_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
}

/**
 * Get a human-friendly relative label ("Today" / "Tomorrow") for an ISO date.
 * Falls back to the formatted date if it's neither.
 */
export function getRelativeDateLabel(isoDate: string): string {
  if (isoDate === getTodayISO()) return 'Today';
  if (isoDate === getTomorrowISO()) return 'Tomorrow';
  // Fallback (shouldn't occur in normal usage)
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: BUSINESS_TIMEZONE,
    day: 'numeric',
    month: 'long',
  }).format(new Date(y, m - 1, d));
}
