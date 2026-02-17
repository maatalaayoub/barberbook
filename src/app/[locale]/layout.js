'use client';

import { Suspense, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'next/navigation';
import RoleSetupHandler from '@/components/RoleSetupHandler';

export default function LocaleLayout({ children }) {
  const params = useParams();
  const { changeLanguage, locale } = useLanguage();
  
  useEffect(() => {
    const urlLocale = params?.locale;
    if (urlLocale && ['en', 'fr', 'ar'].includes(urlLocale)) {
      // Set document direction for Arabic
      if (typeof document !== 'undefined') {
        if (urlLocale === 'ar') {
          document.documentElement.dir = 'rtl';
          document.documentElement.lang = 'ar';
        } else {
          document.documentElement.dir = 'ltr';
          document.documentElement.lang = urlLocale;
        }
      }
    }
  }, [params?.locale]);
  
  return (
    <>
      <Suspense fallback={null}>
        <RoleSetupHandler />
      </Suspense>
      {children}
    </>
  );
}
