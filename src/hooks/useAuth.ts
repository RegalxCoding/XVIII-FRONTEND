'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import type { AuthUser } from '@/store/auth.store';
import type { User as FirebaseUser } from 'firebase/auth';

// ─────────────────────────────────────────
// useAuth Hook
// ─────────────────────────────────────────

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUser = (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      setUser({
        uid: firebaseUser.uid,
        phoneNumber: firebaseUser.phoneNumber,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Set up Firebase auth listener to update hook state.
    // This listener automatically fires once with current auth state upon subscription.
    const unsubscribe = authService.onAuthStateChange((firebaseUser) => {
      syncUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const refetch = () => {
    authService.getCurrentUser().then((firebaseUser) => {
      syncUser(firebaseUser);
    });
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refetch,
  };
}
