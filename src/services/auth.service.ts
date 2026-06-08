import { auth } from '@/lib/firebase';
import {
  signOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

// ─────────────────────────────────────────
// Auth Service (Firebase Auth)
// ─────────────────────────────────────────

export const authService = {
  /**
   * Send OTP code to a phone number using ReCAPTCHA Verifier
   */
  async sendOtp(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  },

  /**
   * Confirm OTP code and complete sign-in
   */
  async confirmOtp(confirmationResult: ConfirmationResult, code: string): Promise<FirebaseUser> {
    const result = await confirmationResult.confirm(code);
    if (!result.user) {
      throw new Error('No user returned from OTP verification');
    }
    return result.user;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<FirebaseUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          resolve(user);
        },
        () => {
          resolve(null);
        }
      );
    });
  },

  /**
   * Logout the current session
   */
  async logout(): Promise<void> {
    await signOut(auth);
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  },

  /**
   * Subscribe to authentication state changes
   */
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};
