'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';

export default function ClientProvider({ children }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
