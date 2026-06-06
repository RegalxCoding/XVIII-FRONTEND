import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// ─────────────────────────────────────────
// Appwrite Client Singleton
// ─────────────────────────────────────────

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

// ─────────────────────────────────────────
// Service Instances
// ─────────────────────────────────────────

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// ─────────────────────────────────────────
// Environment Variables
// ─────────────────────────────────────────

export const APPWRITE_CONFIG = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  collections: {
    users: process.env.NEXT_PUBLIC_USERS_COLLECTION_ID || '',
    products: process.env.NEXT_PUBLIC_PRODUCTS_COLLECTION_ID || '',
    orders: process.env.NEXT_PUBLIC_ORDERS_COLLECTION_ID || '',
    rewards: process.env.NEXT_PUBLIC_REWARDS_COLLECTION_ID || '',
    coupons: process.env.NEXT_PUBLIC_COUPONS_COLLECTION_ID || '',
  },
  storage: {
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '',
  },
} as const;

// ─────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────

export { ID, Query };
export default client;
