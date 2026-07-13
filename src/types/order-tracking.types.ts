// ─────────────────────────────────────────
// Order Tracking Types
// Maps AdminOrderStatus → customer-friendly journey steps
// ─────────────────────────────────────────

import type { AdminOrderStatus } from './admin.types';

/** Visual state of a tracking step in the timeline */
export type TrackingState = 'completed' | 'active' | 'upcoming';

/** A single step in the customer-facing order journey */
export interface TrackingStep {
  /** The raw database status this step corresponds to */
  status: AdminOrderStatus;
  /** Customer-friendly label, e.g. "Crafting Your Order" */
  label: string;
  /** Supportive description shown below the label */
  description: string;
  /** Emoji icon for this step */
  icon: string;
}

// ─────────────────────────────────────────
// Status → Journey Step Mapping
// ─────────────────────────────────────────

export const TRACKING_STEPS: TrackingStep[] = [
  {
    status: 'pending',
    label: 'Order Received',
    description: 'We have received your order.',
    icon: '☑️',
  },
  {
    status: 'confirmed',
    label: 'Order Confirmed',
    description: 'Our team has started processing your order.',
    icon: '✅',
  },
  {
    status: 'preparing',
    label: 'Crafting Your Order',
    description: 'Our baristas are preparing your coffee and desserts.',
    icon: '☕',
  },
  {
    status: 'ready',
    label: 'Ready for Pickup',
    description: 'Your order is packed and ready.',
    icon: '📦',
  },
  {
    status: 'out_for_delivery',
    label: 'Out For Delivery',
    description: 'Your order is on its way to you.',
    icon: '🚚',
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Enjoy your XVIII Brew experience.',
    icon: '✨',
  },
];

/**
 * Determine the visual state of a tracking step given the current order status.
 *
 * The status progression order is:
 *   pending → confirmed → preparing → ready → out_for_delivery → delivered
 *
 * Steps before the current status are "completed",
 * the current status step is "active",
 * and steps after are "upcoming".
 */
export function getStepState(
  stepStatus: AdminOrderStatus,
  currentStatus: AdminOrderStatus
): TrackingState {
  const order: AdminOrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
  const stepIndex = order.indexOf(stepStatus);
  const currentIndex = order.indexOf(currentStatus);

  if (stepIndex < 0 || currentIndex < 0) return 'upcoming';

  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'active';
  return 'upcoming';
}
