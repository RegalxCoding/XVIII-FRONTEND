'use client';

import { type ReactNode } from 'react';
import CartToast from '@/components/ui/CartToast';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Root providers wrapper.
 * CartToast is mounted here so it is available on every page.
 * Add further providers (auth, theme, etc.) inside this wrapper.
 */
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      {children}
      <CartToast />
    </>
  );
}
