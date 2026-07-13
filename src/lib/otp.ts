// ─────────────────────────────────────────
// OTP Utilities — Server-Side Only
// Used exclusively by Next.js API routes.
// Never import this file in client components.
// ─────────────────────────────────────────

import { randomInt, createHash } from 'crypto';

/**
 * Generate a cryptographically secure 6-digit numeric OTP.
 * Uses Node.js `crypto.randomInt` for unbiased random generation.
 */
export function generateOtp(): string {
  // randomInt(min, max) — min inclusive, max exclusive
  const code = randomInt(100000, 1000000);
  return code.toString();
}

/**
 * Hash an OTP using SHA-256.
 * The plain OTP is NEVER stored — only this hash is persisted in Firestore.
 */
export function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex');
}

/**
 * Verify an OTP by comparing its hash against a stored hash.
 * Timing-safe comparison is not critical here since the hash
 * is not a secret (the OTP is short-lived and rate-limited).
 */
export function verifyOtpHash(otp: string, storedHash: string): boolean {
  const inputHash = hashOtp(otp);
  return inputHash === storedHash;
}

/**
 * Check if an ISO timestamp is in the past (i.e., expired).
 */
export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now();
}

/**
 * Calculate the distance between two GPS coordinates using the Haversine formula.
 * Returns distance in meters.
 */
export function haversineDistance(
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number }
): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.lat)) *
      Math.cos(toRad(loc2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if two GPS locations are within a given radius (in meters).
 */
export function isWithinProximity(
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number },
  radiusMeters: number
): boolean {
  return haversineDistance(loc1, loc2) <= radiusMeters;
}
