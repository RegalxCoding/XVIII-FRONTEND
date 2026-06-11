import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AdminOrder, AdminOrderStatus } from '@/types/admin.types';

// Helper to map AdminOrderStatus (db) to Customer Status (UI emoji-friendly)
export function mapAdminStatusToCustomerStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'Preparing ☕';
    case 'confirmed':
      return 'Preparing ☕';
    case 'preparing':
      return 'Preparing ☕';
    case 'ready':
      return 'Out for Delivery 🚚';
    case 'delivered':
      return 'Delivered ✅';
    case 'cancelled':
      return 'Cancelled ❌';
    default:
      return status;
  }
}

export const ordersService = {
  /**
   * Place a new order in Firestore.
   * Generates a custom ORD-xxxxxx ID to match the existing brand format.
   */
  async create(orderData: Omit<AdminOrder, 'id' | 'createdAt'> & { userId: string | null }): Promise<string> {
    const ordersCol = collection(db, 'orders');
    const customId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAt = new Date().toISOString();
    
    // Explicitly add customId field, or let Firestore generate it. We can store id as customId
    // to preserve the branding ID format
    await addDoc(ordersCol, {
      ...orderData,
      id: customId,
      createdAt
    });
    
    return customId;
  },

  /**
   * Fetch a single order by custom ID (id) from Firestore.
   */
  async getById(id: string): Promise<AdminOrder | null> {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where('id', '==', id));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      ...data,
      id: data.id // Use custom brand order ID
    } as AdminOrder;
  },

  /**
   * Get all orders for a specific user ID, sorted by date in memory.
   */
  async getByUserId(userId: string): Promise<AdminOrder[]> {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: data.id
      } as AdminOrder;
    });

    // Sort in-memory to prevent complex composite index errors
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Get all orders (for admin dashboard) sorted by date in memory.
   */
  async getAll(): Promise<AdminOrder[]> {
    const ordersCol = collection(db, 'orders');
    const snapshot = await getDocs(ordersCol);
    
    const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: data.id
      } as AdminOrder;
    });

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Update status of an order.
   * Finds the document by its custom order ID field 'id' and updates it.
   */
  async updateStatus(id: string, status: AdminOrderStatus): Promise<void> {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where('id', '==', id));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error(`Order with ID ${id} not found.`);
    }
    
    const docRef = doc(db, 'orders', snapshot.docs[0].id);
    await updateDoc(docRef, { status });
  },

  /**
   * Listen to all orders in real-time (for admin).
   * Sorts the results in-memory.
   */
  subscribeAll(callback: (orders: AdminOrder[]) => void) {
    const ordersCol = collection(db, 'orders');
    return onSnapshot(ordersCol, (snapshot) => {
      const orders = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: data.id
        } as AdminOrder;
      });
      // Sort in memory
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(orders);
    }, (error) => {
      console.error("Error subscribing to all orders:", error);
    });
  },

  /**
   * Listen to a user's orders in real-time (for customer dashboard).
   * Sorts the results in-memory.
   */
  subscribeByUserId(userId: string, callback: (orders: AdminOrder[]) => void) {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, where('userId', '==', userId));
    
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: data.id
        } as AdminOrder;
      });
      // Sort in memory
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(orders);
    }, (error) => {
      console.error("Error subscribing to user orders:", error);
    });
  }
};
