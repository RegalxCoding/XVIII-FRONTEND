import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CustomerFeedback, FeedbackStatus } from '@/types/contact.types';

export const feedbackService = {
  /**
   * Submit customer feedback to Firestore.
   */
  async create(
    data: Omit<CustomerFeedback, 'id' | 'createdAt' | 'status'>
  ): Promise<string> {
    const col = collection(db, 'feedback');
    const ref = await addDoc(col, {
      ...data,
      createdAt: new Date().toISOString(),
      status: 'unread' as FeedbackStatus,
    });
    return ref.id;
  },

  /**
   * Real-time listener for all feedback (admin use).
   * Sorted by createdAt descending in-memory.
   */
  subscribeAll(callback: (items: CustomerFeedback[]) => void) {
    const col = collection(db, 'feedback');
    const q = query(col, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({
          ...(d.data() as Omit<CustomerFeedback, 'id'>),
          id: d.id,
        }));
        callback(items);
      },
      (err) => console.error('[feedbackService] subscribeAll error:', err)
    );
  },

  /**
   * Mark a feedback entry as read.
   */
  async markAsRead(id: string): Promise<void> {
    const ref = doc(db, 'feedback', id);
    await updateDoc(ref, { status: 'read' });
  },

  /**
   * Delete a feedback entry.
   */
  async delete(id: string): Promise<void> {
    const ref = doc(db, 'feedback', id);
    await deleteDoc(ref);
  },

  /**
   * Get count of unread feedback (for badges).
   * Uses a one-time query — subscribe to subscribeAll for real-time badge.
   */
  async getUnreadCount(): Promise<number> {
    const col = collection(db, 'feedback');
    const q = query(col, where('status', '==', 'unread'));
    const snap = await getDocs(q);
    return snap.size;
  },
};
