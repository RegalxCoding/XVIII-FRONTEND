// ─────────────────────────────────────────
// Delivery Verification Types
// Used by API routes (server) and driver app (client)
// ─────────────────────────────────────────

/**
 * Firestore document shape for `delivery_verifications` collection.
 * Stores hashed OTP, attempt tracking, and audit trail.
 * Plain OTP is NEVER stored — only the SHA-256 hash.
 */
export interface DeliveryVerification {
  id: string;
  orderId: string;
  otpHash: string;
  generatedAt: string;
  expiresAt: string;
  attempts: number;
  verified: boolean;
  verifiedAt?: string;
  resendCount: number;
  lastSentAt?: string;
  customerPhone: string;
  verificationLog: VerificationLogEntry[];
}

export interface VerificationLogEntry {
  timestamp: string;
  result: 'success' | 'failed' | 'expired' | 'locked';
  driverLocation?: { lat: number; lng: number };
}

export type PaymentStatus = 'pending' | 'paid' | 'cash_collected';

/**
 * Sanitized verification status returned to the driver app.
 * NEVER includes otpHash or plain OTP.
 */
export interface DeliveryVerificationStatus {
  orderId: string;
  attempts: number;
  maxAttempts: number;
  verified: boolean;
  verifiedAt?: string;
  expired: boolean;
  resendCount: number;
  canResend: boolean;
  cooldownRemaining: number;
  paymentStatus: PaymentStatus;
  otpSent: boolean;
}
