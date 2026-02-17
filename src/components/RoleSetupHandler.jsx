'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useRole } from '@/hooks/useRole';

/**
 * Component that handles role assignment after signup
 * Renders a loading overlay while setting up the user's role (barbers only)
 */
export default function RoleSetupHandler() {
  const { 
    role, 
    hasRole, 
    isLoaded, 
    isSignedIn, 
    assignRole 
  } = useRole();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || 'en';
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupType, setSetupType] = useState(null);

  useEffect(() => {
    async function handleRoleSetup() {
      const setupParam = searchParams.get('setup');
      
      console.log('[RoleSetupHandler] State:', { setupParam, isLoaded, isSignedIn, hasRole, role });
      
      // No setup needed
      if (!setupParam) {
        console.log('[RoleSetupHandler] No setup param, skipping');
        return;
      }
      
      // Track the setup type
      setSetupType(setupParam);
      
      // Wait for auth to load
      if (!isLoaded) {
        console.log('[RoleSetupHandler] Auth not loaded yet');
        return;
      }
      
      // Not signed in - redirect to appropriate sign up
      if (!isSignedIn) {
        console.log('[RoleSetupHandler] Not signed in, redirecting to sign up');
        if (setupParam === 'barber') {
          router.push(`/${locale}/auth/barber/sign-up`);
        } else {
          router.push(`/${locale}/auth/user/sign-up`);
        }
        return;
      }

      // If user already has a role
      if (hasRole) {
        console.log('[RoleSetupHandler] User already has role:', role);
        // Clean URL
        window.history.replaceState({}, '', `/${locale}`);
        
        // Redirect barbers to dashboard
        if (role === 'barber') {
          router.push(`/${locale}/barber/dashboard`);
        }
        setSetupComplete(true);
        return;
      }

      // User is signed in but no role - assign the role
      if (!hasRole && (setupParam === 'user' || setupParam === 'barber')) {
        console.log('[RoleSetupHandler] Assigning role:', setupParam);
        // Only show loading overlay for barbers
        if (setupParam === 'barber') {
          setIsSettingUp(true);
        }
        
        try {
          const result = await assignRole(setupParam);
          
          if (result.success) {
            // Clean URL first
            window.history.replaceState({}, '', `/${locale}`);
            
            // Redirect barbers to dashboard
            if (setupParam === 'barber') {
              router.push(`/${locale}/barber/dashboard`);
            } else {
              // Users stay on home page
              setSetupComplete(true);
            }
          } else if (result.error === 'Role already assigned. Role cannot be changed.') {
            // Role was already assigned somehow
            window.history.replaceState({}, '', `/${locale}`);
            if (result.role === 'barber') {
              router.push(`/${locale}/barber/dashboard`);
            }
            setSetupComplete(true);
          } else {
            console.error('Failed to assign role:', result.error);
            setSetupComplete(true);
          }
        } catch (error) {
          console.error('Error during role assignment:', error);
          setSetupComplete(true);
        }
        
        setIsSettingUp(false);
      }
    }

    handleRoleSetup();
  }, [isLoaded, isSignedIn, hasRole, role, searchParams, locale, assignRole, router]);

  // Show loading overlay only for barbers while setting up
  const isBarberSetup = setupType === 'barber' || searchParams.get('setup') === 'barber';
  if (isBarberSetup && (isSettingUp || (searchParams.get('setup') && !setupComplete && isSignedIn && !hasRole))) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Setting up your account</h2>
          <p className="text-gray-400">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if no setup needed
  return null;
}
