'use client';

import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CompleteUserSignup() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const { t, isRTL } = useLanguage();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function assignRole() {
      if (!isLoaded || !user) return;

      // Check if role already exists
      if (user.publicMetadata?.role) {
        // Role already assigned, redirect to home
        router.push(`/${locale}`);
        return;
      }

      try {
        setStatus('assigning');
        
        const response = await fetch('/api/set-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: 'user' }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to assign role');
        }

        setStatus('success');
        
        // Force a session refresh to get updated claims
        await user.reload();
        
        // Small delay to ensure session is updated, then redirect to home
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 1000);
      } catch (err) {
        console.error('Error assigning role:', err);
        setError(err.message);
        setStatus('error');
      }
    }

    assignRole();
  }, [isLoaded, user, router, locale]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center">
        {status === 'loading' || status === 'assigning' ? (
          <>
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {t('auth.settingUpAccount') || 'Setting up your account...'}
            </h2>
            <p className="text-gray-400">
              {t('auth.pleaseWait') || 'Please wait while we configure your profile.'}
            </p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {t('auth.accountReady') || 'Account Ready!'}
            </h2>
            <p className="text-gray-400">
              {t('auth.redirecting') || 'Redirecting to your dashboard...'}
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {t('auth.errorOccurred') || 'An Error Occurred'}
            </h2>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              {t('auth.tryAgain') || 'Try Again'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
