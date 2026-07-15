// ─────────────────────────────────────────
// Contact Types
// CustomerFeedback and BulkOrderRequest
// ─────────────────────────────────────────

export type FeedbackStatus = 'unread' | 'read';

export interface CustomerFeedback {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  orderNumber?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: FeedbackStatus;
}

export type BulkOrderStatus = 'pending' | 'contacted' | 'approved' | 'rejected';
export type ContactMethod = 'phone' | 'whatsapp' | 'email';

export interface BulkOrderRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  preferredContact: ContactMethod;
  eventType: string;
  eventDate: string;
  estimatedGuests: string;
  specialRequirements?: string;
  createdAt: string;
  status: BulkOrderStatus;
}
