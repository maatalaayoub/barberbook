'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for role-based access control using Supabase
 * @param {Object} options
 * @param {'user' | 'barber' | null} options.requiredRole - The role required to access the current page
 * @param {string} options.redirectTo - Where to redirect if role doesn't match
 * @returns {Object} Role information and utilities
 */
export function useRole({ requiredRole = null, redirectTo = '/' } = {}) {
  const { user, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const router = useRouter();
  
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUserId, setSupabaseUserId] = useState(null);

  // Fetch role from Supabase
  const fetchRole = useCallback(async () => {
    if (!isSignedIn || !user) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/get-role');
      const data = await response.json();
      
      if (response.ok) {
        setRole(data.role);
        setSupabaseUserId(data.userId || null);
      } else {
        setRole(null);
      }
    } catch (error) {
      console.error('Error fetching role:', error);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (isClerkLoaded) {
      fetchRole();
    }
  }, [isClerkLoaded, fetchRole]);

  const isUser = role === 'user';
  const isBarber = role === 'barber';
  const hasRole = role !== null;
  const isLoaded = isClerkLoaded && !isLoading;

  // Client-side role enforcement (backup to middleware)
  useEffect(() => {
    if (!isLoaded) return;
    
    if (requiredRole && role !== requiredRole) {
      router.push(redirectTo);
    }
  }, [isLoaded, role, requiredRole, redirectTo, router]);

  // Function to assign role
  const assignRole = useCallback(async (newRole) => {
    console.log('[useRole] assignRole called with:', newRole);
    try {
      const response = await fetch('/api/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      
      const responseText = await response.text();
      console.log('[useRole] Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[useRole] Failed to parse response:', parseError);
        return { success: false, error: 'Invalid server response', details: responseText };
      }
      
      console.log('[useRole] API response:', { status: response.status, data });
      
      if (response.ok) {
        setRole(data.role);
        setSupabaseUserId(data.userId || null);
        return { success: true, role: data.role };
      } else {
        // Log full error details
        console.error('[useRole] Error details:', JSON.stringify(data, null, 2));
        // If role already assigned (403), set the returned role
        if (response.status === 403 && data.role) {
          setRole(data.role);
        }
        return { success: false, error: data.error, details: data.details, code: data.code };
      }
    } catch (error) {
      console.error('[useRole] Error assigning role:', error);
      return { success: false, error: 'Network error', details: error.message };
    }
  }, []);

  // Refetch role data
  const refetch = useCallback(() => {
    setIsLoading(true);
    return fetchRole();
  }, [fetchRole]);

  return {
    role,
    isUser,
    isBarber,
    hasRole,
    isLoaded,
    isLoading,
    isSignedIn,
    user,
    supabaseUserId,
    assignRole,
    refetch,
  };
}

export default useRole;
