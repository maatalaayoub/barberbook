'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardHeader, Sidebar } from '@/components/dashboard';

export default function DashboardLayout({ children }) {
  const { isLoaded } = useUser();
  const { isRTL } = useLanguage();
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);

  // Check onboarding status directly from the API
  useEffect(() => {
    async function checkOnboarding() {
      try {
        const response = await fetch('/api/business/onboarding');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json') && response.ok) {
          const data = await response.json();
          setOnboardingCompleted(data.onboardingCompleted);
        } else {
          // If API fails, default to showing the full layout
          setOnboardingCompleted(true);
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setOnboardingCompleted(true);
      }
    }

    if (isLoaded) {
      checkOnboarding();
    }
  }, [isLoaded]);

  // Also listen for onboarding status updates from child pages (e.g. after completing onboarding)
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
      <Sidebar />
      <div className={`flex flex-col min-h-screen overflow-x-hidden ${isRTL ? 'lg:mr-16' : 'lg:ml-16'}`}>
        <DashboardHeader />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
