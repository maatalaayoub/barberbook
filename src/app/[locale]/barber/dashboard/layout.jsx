'use client';

import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardHeader } from '@/components/dashboard';

export default function DashboardLayout({ children }) {
  const { isLoaded } = useUser();
  const { isRTL } = useLanguage();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      <DashboardHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
