'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import { useLanguage } from '@/contexts/LanguageContext';
import BarberOnboarding from '@/components/BarberOnboarding';

export default function BarberDashboard() {
  const { 
    role, 
    isBarber, 
    hasRole, 
    isLoaded, 
    isSignedIn,
    user,
    assignRole, 
    refetch 
  } = useRole();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || 'en';
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Notify layout about onboarding status
  const notifyLayout = (completed) => {
    window.dispatchEvent(new CustomEvent('onboarding-status', { 
      detail: { completed } 
    }));
  };

  // Check onboarding status
  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/barber/onboarding');
      
      // Check content type to ensure it's JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('API returned non-JSON response');
        setIsCheckingOnboarding(false);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setOnboardingStatus(data);
        notifyLayout(data.onboardingCompleted);
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  useEffect(() => {
    async function setupRole() {
      const setupParam = searchParams.get('setup');
      
      // Wait for auth and role data to load
      if (!isLoaded || !isSignedIn) return;
      
      // If user already has barber role, check onboarding and clean URL
      if (isBarber) {
        if (setupParam) {
          window.history.replaceState({}, '', `/${locale}/barber/dashboard`);
        }
        setSetupComplete(true);
        checkOnboardingStatus();
        return;
      }

      // If user has a different role (user role), redirect home
      if (hasRole && !isBarber) {
        router.push(`/${locale}`);
        return;
      }

      // If user has no role and setup param exists, assign barber role
      if (!hasRole && setupParam === 'barber') {
        setIsSettingUp(true);
        try {
          const result = await assignRole('barber');
          
          if (result.success || result.error === 'Role already assigned. Role cannot be changed.') {
            // Refetch role to confirm
            await refetch();
            // Clean URL
            window.history.replaceState({}, '', `/${locale}/barber/dashboard`);
            setSetupComplete(true);
            // Check onboarding status after role setup
            checkOnboardingStatus();
          } else {
            console.error('Error setting up role:', result.error);
          }
        } catch (error) {
          console.error('Error setting up role:', error);
        }
        setIsSettingUp(false);
        return;
      }

      // If user has no role and no setup param, redirect to sign up
      if (!hasRole && !setupParam) {
        router.push(`/${locale}/auth/barber/sign-up`);
        return;
      }
    }

    setupRole();
  }, [isLoaded, isSignedIn, isBarber, hasRole, searchParams, locale, assignRole, refetch, router]);

  const handleOnboardingComplete = () => {
    setOnboardingStatus({ ...onboardingStatus, onboardingCompleted: true });
    notifyLayout(true);
  };

  // Consolidated loading state - only show ONE loading screen
  if (!isLoaded || isSettingUp || isCheckingOnboarding || (searchParams.get('setup') && !setupComplete && !hasRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not a barber (extra client-side protection)
  if (isLoaded && isSignedIn && hasRole && !isBarber) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if not completed
  if (isBarber && onboardingStatus && !onboardingStatus.onboardingCompleted) {
    return (
      <BarberOnboarding 
        userName={user?.firstName} 
        onComplete={handleOnboardingComplete} 
      />
    );
  }

  return (
    <div>
      {/* Dashboard content */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t?.('dashboard.welcome') || 'Welcome back'}, {user?.firstName}!
        </h1>
        <p className="text-gray-500 mt-1">
          {t?.('dashboard.subtitle') || "Here's what's happening with your business today."}
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-[3px] p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{t?.('dashboard.stats.todayAppointments') || "Today's Appointments"}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[3px] p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{t?.('dashboard.stats.weeklyRevenue') || "This Week's Revenue"}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[3px] p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{t?.('dashboard.stats.totalClients') || 'Total Clients'}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[3px] p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{t?.('dashboard.stats.avgRating') || 'Rating'}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-[3px] border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t?.('dashboard.upcomingAppointments') || 'Upcoming Appointments'}</h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <p>{t?.('dashboard.noUpcomingAppointments') || 'No upcoming appointments'}</p>
        </div>
      </div>
    </div>
  );
}
