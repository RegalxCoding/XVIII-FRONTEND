import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '@/types/user.types';

export const userService = {
  /**
   * Fetches a user's profile from the users collection
   */
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { $id: userSnap.id, ...userSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  },

  /**
   * Updates a user's email address
   */
  async updateUserEmail(userId: string, email: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { email }, { merge: true });
    } catch (error) {
      console.error('Failed to update user email:', error);
      throw error;
    }
  }
};
