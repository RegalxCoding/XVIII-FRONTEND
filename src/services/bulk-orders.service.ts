import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BulkOrderRequest, BulkOrderStatus } from '@/types/contact.types';

export const bulkOrdersService = {
  /**
   * Submit a new bulk order request to Firestore.
   */
  async create(
    data: Omit<BulkOrderRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<string> {
    const col = collection(db, 'bulk_orders');
    const ref = await addDoc(col, {
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending' as BulkOrderStatus,
    });
    return ref.id;
  },

  /**
   * Real-time listener for all bulk order requests (admin use).
   * Sorted by createdAt descending.
   */
  subscribeAll(callback: (items: BulkOrderRequest[]) => void) {
    const col = collection(db, 'bulk_orders');
    const q = query(col, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          ...(d.data() as Omit<BulkOrderRequest, 'id'>),
          id: d.id,
        }));
        callback(items);
      },
      (err) => console.error('[bulkOrdersService] subscribeAll error:', err)
    );
  },

  /**
   * Update the status of a bulk order request.
   */
  async updateStatus(id: string, status: BulkOrderStatus): Promise<void> {
    const ref = doc(db, 'bulk_orders', id);
    await updateDoc(ref, { status });
  },

  /**
   * Delete a bulk order request.
   */
  async delete(id: string): Promise<void> {
    const ref = doc(db, 'bulk_orders', id);
    await deleteDoc(ref);
  },

  /**
   * Get count of pending bulk order requests (for badges).
   */
  async getPendingCount(): Promise<number> {
    const col = collection(db, 'bulk_orders');
    const q = query(col, where('status', '==', 'pending'));
    const snap = await getDocs(q);
    return snap.size;
  },
};
