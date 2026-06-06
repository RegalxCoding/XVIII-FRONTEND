import { account, databases, APPWRITE_CONFIG, ID } from '@/lib/appwrite';
import type { LoginCredentials, RegisterCredentials } from '@/types/user.types';

// ─────────────────────────────────────────
// Auth Service
// ─────────────────────────────────────────

export const authService = {
  /**
   * Register a new user account
   */
  async register({ name, email, password }: RegisterCredentials) {
    const newAccount = await account.create(ID.unique(), email, password, name);
    await this.login({ email, password });
    return newAccount;
  },

  /**
   * Login with email and password
   */
  async login({ email, password }: LoginCredentials) {
    return await account.createEmailPasswordSession(email, password);
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  /**
   * Logout the current session
   */
  async logout() {
    return await account.deleteSession('current');
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  },

  /**
   * Send password recovery email
   */
  async sendPasswordRecovery(email: string, redirectUrl: string) {
    return await account.createRecovery(email, redirectUrl);
  },

  /**
   * Update account password
   */
  async updatePassword(newPassword: string, oldPassword: string) {
    return await account.updatePassword(newPassword, oldPassword);
  },
};
