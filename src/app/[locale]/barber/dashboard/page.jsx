'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';

export default function BarberDashboard() {
  const { 
    role, 
    isBarber, 
    hasRole, 
    isLoaded, 
    isSignedIn, 
    assignRole, 
    refetch 
  } = useRole();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || 'en';
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    async function setupRole() {
      const setupParam = searchParams.get('setup');
      
      // Wait for auth and role data to load
      if (!isLoaded || !isSignedIn) return;
      
      // If user already has barber role, just clean URL and continue
      if (isBarber) {
        if (setupParam) {
          window.history.replaceState({}, '', `/${locale}/barber/dashboard`);
        }
        setSetupComplete(true);
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

  // Show loading while auth is loading or setting up
  if (!isLoaded || isSettingUp || (searchParams.get('setup') && !setupComplete && !hasRole)) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Setting up your account...</p>
        </div>
      </div>
    );
  }

  // Redirect if not a barber (extra client-side protection)
  if (isLoaded && isSignedIn && hasRole && !isBarber) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Dashboard content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-black mb-4">Barber Dashboard</h1>
        <p className="text-gray-400">Welcome to your professional dashboard!</p>
      </div>
    </div>
  );
}
