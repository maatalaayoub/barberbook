'use client';

import { Suspense } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ProgressBar from '@/components/ProgressBar';

export default function ClientProvider({ children }) {
  return (
    <LanguageProvider>
      <Suspense fallback={null}>
        <ProgressBar />
      </Suspense>
      {children}
    </LanguageProvider>
  );
}
