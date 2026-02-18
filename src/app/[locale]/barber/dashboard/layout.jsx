'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardHeader, Sidebar } from '@/components/dashboard';

export default function DashboardLayout({ children }) {
  const { isLoaded } = useUser();
  const { isRTL } = useLanguage();
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);

  // Listen for onboarding status updates from page
  useEffect(() => {
    const handleOnboardingStatus = (event) => {
      setOnboardingCompleted(event.detail.completed);
    };
    
    window.addEventListener('onboarding-status', handleOnboardingStatus);
    return () => window.removeEventListener('onboarding-status', handleOnboardingStatus);
  }, []);

  // Show nothing while auth is loading (page will handle its own loading)
  if (!isLoaded) {
    return null;
  }

  // Show minimal layout during onboarding (no sidebar) or while waiting for status
  if (onboardingCompleted === null || !onboardingCompleted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
