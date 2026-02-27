'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardHeader, Sidebar } from '@/components/dashboard';

// Read cached onboarding status synchronously to avoid flicker
function getCachedOnboardingStatus() {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem('onboarding-completed');
    if (cached === 'true') return true;
    if (cached === 'false') return false;
  } catch {}
  return null;
}

function DashboardSkeleton({ isRTL }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Sidebar skeleton */}
      <aside className={`hidden lg:block fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} bg-white ${isRTL ? 'border-l' : 'border-r'} border-gray-200 z-40 w-16`}>
        <div className="flex flex-col h-full px-3 py-4 space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </aside>
      <div className={`flex flex-col min-h-screen overflow-x-hidden ${isRTL ? 'lg:mr-16' : 'lg:ml-16'}`}>
        {/* Header skeleton */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
                <div className="w-32 h-10 bg-gray-100 rounded-lg animate-pulse hidden sm:block" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="space-y-4">
            <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const { isLoaded } = useUser();
  const { isRTL } = useLanguage();
  const cachedStatus = useRef(getCachedOnboardingStatus());
  const [onboardingCompleted, setOnboardingCompleted] = useState(cachedStatus.current);

  // Check onboarding status directly from the API
  useEffect(() => {
    async function checkOnboarding() {
      try {
        const response = await fetch('/api/business/onboarding');
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json') && response.ok) {
          const data = await response.json();
          setOnboardingCompleted(data.onboardingCompleted);
          try {
            localStorage.setItem('onboarding-completed', String(data.onboardingCompleted));
          } catch {}
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
      try {
        localStorage.setItem('onboarding-completed', String(event.detail.completed));
      } catch {}
    };
    
    window.addEventListener('onboarding-status', handleOnboardingStatus);
    return () => window.removeEventListener('onboarding-status', handleOnboardingStatus);
  }, []);

  // Show skeleton while auth is loading — preserves layout structure to prevent flicker
  if (!isLoaded && onboardingCompleted !== false) {
    // If we have a cached status of true, show skeleton with sidebar+header shape
    // If no cache, also show the full skeleton (most returning users have onboarded)
    return <DashboardSkeleton isRTL={isRTL} />;
  }

  // Show minimal layout during onboarding (no sidebar) or while waiting for status with no cache
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
