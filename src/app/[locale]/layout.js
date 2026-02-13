'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'next/navigation';

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
  
  return <>{children}</>;
}
