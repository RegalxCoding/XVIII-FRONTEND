// ─────────────────────────────────────────
// General Utility Helpers
// ─────────────────────────────────────────

/**
 * Merge class names conditionally (lightweight clsx alternative)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a price in INR
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Get Appwrite file preview URL
 */
export function getFileUrl(fileId: string, bucketId: string, endpoint: string, projectId: string): string {
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}

/**
 * Delay utility for animations
 */
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
