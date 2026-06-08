import type { RewardStamp, Reward } from '@/types/order.types';

// ─────────────────────────────────────────
// Rewards Service (Mock/Local fallback)
// ─────────────────────────────────────────

export const rewardsService = {
  /**
   * Get user's current stamp card
   */
  async getUserStamps(userId: string): Promise<RewardStamp | null> {
    try {
      // Return a mock stamp card so that the UI can render states nicely
      return {
        $id: `stamp-${userId}`,
        userId,
        stamps: 3, // Mocking 3 stamps to display rewards progression in components
        totalStampsEarned: 3,
        lastUpdated: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },

  /**
   * Get all available rewards
   */
  async getAvailableRewards(): Promise<Reward[]> {
    return [
      {
        $id: 'reward-001',
        title: 'Free Coffee',
        description: 'Get a free coffee of your choice after collecting 5 stamps.',
        stampsRequired: 5,
        type: 'free_item',
        value: 1,
        isActive: true,
      },
      {
        $id: 'reward-002',
        title: 'Free Dessert',
        description: 'Get a free artisan dessert after collecting 8 stamps.',
        stampsRequired: 8,
        type: 'free_item',
        value: 1,
        isActive: true,
      },
      {
        $id: 'reward-003',
        title: '20% Discount',
        description: 'Get a 20% discount code on your next purchase after collecting 10 stamps.',
        stampsRequired: 10,
        type: 'discount',
        value: 20,
        isActive: true,
      },
    ];
  },
};
