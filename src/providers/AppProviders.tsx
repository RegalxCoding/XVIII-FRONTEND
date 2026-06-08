'use client';

import { type ReactNode, useEffect } from 'react';
import CartToast from '@/components/ui/CartToast';
import { useAuthStore } from '@/store/auth.store';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Root providers wrapper.
 * CartToast is mounted here so it is available on every page.
 * Add further providers (auth, theme, etc.) inside this wrapper.
 */
export default function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    // Initialize the global auth store listeners
    useAuthStore.getState().initialize();
  }, []);

  return (
    <>
      {children}
      <CartToast />
    </>
  );
}
