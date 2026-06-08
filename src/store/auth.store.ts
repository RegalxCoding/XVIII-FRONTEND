import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import type { User as FirebaseUser } from 'firebase/auth';

export interface AuthUser {
  uid: string;
  phoneNumber: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// Helper to map Firebase User to serializable AuthUser
export const mapFirebaseUser = (user: FirebaseUser | null): AuthUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    phoneNumber: user.phoneNumber,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
};

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  initialize: async () => {
    // Set up auth state change listener to sync Zustand state
    authService.onAuthStateChange((user) => {
      set({
        user: mapFirebaseUser(user),
        isAuthenticated: !!user,
        isLoading: false,
      });
    });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
