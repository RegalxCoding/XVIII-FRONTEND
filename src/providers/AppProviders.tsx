'use client';

import { type ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Root providers wrapper.
 * Add context providers here (auth, theme, etc.) as needed.
 */
export default function AppProviders({ children }: AppProvidersProps) {
  return <>{children}</>;
}
