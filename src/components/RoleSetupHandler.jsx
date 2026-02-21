'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter, usePathname } from 'next/navigation';
import { useRole } from '@/hooks/useRole';

/**
 * Component that handles role assignment after signup
 * Role setup happens silently in the background
 * Note: Business role is handled by BusinessOnboarding, not here
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
  const pathname = usePathname();
  const locale = params.locale || 'en';
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    async function handleRoleSetup() {
      const setupParam = searchParams.get('setup');
      
      console.log('[RoleSetupHandler] State:', { setupParam, isLoaded, isSignedIn, hasRole, role, pathname });
      
      // IMPORTANT: Skip ALL business-related setup - handled by BusinessOnboarding
      if (setupParam === 'business' || pathname?.includes('/business/')) {
        console.log('[RoleSetupHandler] Business setup detected, skipping (handled by BusinessOnboarding)');
        return;
      }
      
      // No setup needed
      if (!setupParam) {
        console.log('[RoleSetupHandler] No setup param, skipping');
        return;
      }
      
      // Wait for auth to load
      if (!isLoaded) {
        console.log('[RoleSetupHandler] Auth not loaded yet');
        return;
      }
      
      // Not signed in - redirect to appropriate sign up
      if (!isSignedIn) {
        console.log('[RoleSetupHandler] Not signed in, redirecting to sign up');
        if (setupParam === 'business') {
          router.push(`/${locale}/auth/business/sign-up`);
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
        
        // Stay on home page for all users
        setSetupComplete(true);
        return;
      }

      // User is signed in but no role - assign the role (only for 'user' type, not 'business')
      // Business role is assigned after completing onboarding in BusinessOnboarding component
      if (!hasRole && setupParam === 'user') {
        console.log('[RoleSetupHandler] Assigning role:', setupParam);
        
        try {
          const result = await assignRole(setupParam);
          
          if (result.success || result.alreadyAssigned) {
            // Clean URL first
            window.history.replaceState({}, '', `/${locale}`);
            // All users stay on home page after signup
            setSetupComplete(true);
          } else {
            console.error('Failed to assign role:', result.error, 'Details:', result.details, 'Code:', result.code);
            setSetupComplete(true);
          }
        } catch (error) {
          console.error('Error during role assignment:', error);
          setSetupComplete(true);
        }
      }
    }

    handleRoleSetup();
  }, [isLoaded, isSignedIn, hasRole, role, searchParams, locale, assignRole, router]);

  // Don't render anything - role setup happens in the background
  return null;
}
