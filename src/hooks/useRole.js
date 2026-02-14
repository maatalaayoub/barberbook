import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

/**
 * Custom hook for role-based access control
 * @param {Object} options
 * @param {'user' | 'barber' | null} options.requiredRole - The role required to access the current page
 * @param {string} options.redirectTo - Where to redirect if role doesn't match
 * @returns {Object} Role information and utilities
 */
export function useRole({ requiredRole = null, redirectTo = '/' } = {}) {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const role = useMemo(() => {
    if (!isLoaded || !user) return null;
    return user.publicMetadata?.role || null;
  }, [isLoaded, user]);

  const isUser = role === 'user';
  const isBarber = role === 'barber';
  const hasRole = role !== null;

  // Server-side role enforcement is done in middleware
  // This is for client-side convenience only
  useEffect(() => {
    if (!isLoaded) return;
    
    if (requiredRole && role !== requiredRole) {
      router.push(redirectTo);
    }
  }, [isLoaded, role, requiredRole, redirectTo, router]);

  return {
    role,
    isUser,
    isBarber,
    hasRole,
    isLoaded,
    isSignedIn,
    user,
  };
}

/**
 * Get role from session claims (for server components)
 * @param {Object} sessionClaims - Clerk session claims
 * @returns {string | null} The user's role
 */
export function getRoleFromClaims(sessionClaims) {
  return sessionClaims?.publicMetadata?.role || null;
}

/**
 * Check if user has the required role
 * @param {Object} sessionClaims - Clerk session claims
 * @param {'user' | 'barber'} requiredRole - Required role
 * @returns {boolean} Whether user has the required role
 */
export function hasRequiredRole(sessionClaims, requiredRole) {
  const role = getRoleFromClaims(sessionClaims);
  return role === requiredRole;
}
