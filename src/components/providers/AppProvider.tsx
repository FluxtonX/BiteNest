'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useVisitorTracking();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
