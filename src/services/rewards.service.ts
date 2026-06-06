import { databases, APPWRITE_CONFIG, Query } from '@/lib/appwrite';
import type { RewardStamp, Reward } from '@/types/order.types';

// ─────────────────────────────────────────
// Rewards Service
// ─────────────────────────────────────────

export const rewardsService = {
  /**
   * Get user's current stamp card
   */
  async getUserStamps(userId: string): Promise<RewardStamp | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.rewards,
        [Query.equal('userId', userId), Query.limit(1)],
      );

      if (response.documents.length === 0) return null;
      return response.documents[0] as unknown as RewardStamp;
    } catch {
      return null;
    }
  },

  /**
   * Get all available rewards
   */
  async getAvailableRewards(): Promise<Reward[]> {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.rewards,
      [Query.equal('isActive', true)],
    );
    return response.documents as unknown as Reward[];
  },
};
