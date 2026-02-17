'use client';

import { SignIn } from '@clerk/nextjs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { frFR, arSA } from '@clerk/localizations';
import ClientOnly from '@/components/ClientOnly';

const clerkLocalizations = {
  en: undefined,
  fr: frFR,
  ar: arSA,
};

export default function UserSignInPage() {
  const params = useParams();
  const locale = params.locale || 'en';
  const { t, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Premium Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col p-12 xl:p-16 h-full">
          <div className="flex items-center justify-between mb-12">
            <Link href={`/${locale}`} className="inline-block">
              <Image 
                src="/images/logo.png" 
                alt="BarberBook" 
                width={200} 
                height={50}
                className="h-12 w-auto filter brightness-0 invert"
                priority
              />
            </Link>
            <Link
              href={`/${locale}`}
              className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
            >
              ← {t('auth.backToHome') || 'Back to Home'}
            </Link>
          </div>
          
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              {t('auth.user.signInHeroTitle') || 'Welcome Back'}
            </h1>
            
            <p className="text-gray-400 text-lg max-w-md">
              {t('auth.user.signInHeroSubtitle') || 'Sign in to book your next appointment and enjoy a premium grooming experience.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-between">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3">
            <Image 
              src="/images/logo.png" 
              alt="BarberBook" 
              width={150} 
              height={40}
              className="h-10 w-auto filter brightness-0 invert"
              priority
            />
          </Link>
          <Link
            href={`/${locale}`}
            className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
          >
            ← {t('auth.backToHome') || 'Back to Home'}
          </Link>
        </div>
        
        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {t('auth.user.welcomeBack') || 'Welcome back'}
              </h2>
              <p className="text-gray-600">
                {t('auth.user.signInFormSubtitle') || 'Sign in to continue to your account'}
              </p>
            </div>

            {/* Clerk Sign In */}
            <div className="flex justify-center">
              <ClientOnly fallback={
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              }>
              <SignIn
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-white shadow-xl shadow-slate-200/50 border-0 rounded-2xl p-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all rounded-xl h-12',
                  socialButtonsBlockButtonText: 'text-slate-700 font-medium',
                  socialButtonsBlockButtonArrow: 'text-slate-400',
                  dividerLine: 'bg-slate-200',
                  dividerText: 'text-slate-400 text-sm',
                  formFieldLabel: 'text-slate-700 font-medium text-sm',
                  formFieldInput: 'bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-0 focus:bg-white rounded-xl h-12 transition-all',
                  formButtonPrimary: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 rounded-xl h-12 text-base font-semibold transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02]',
                  footerActionLink: 'text-amber-600 hover:text-amber-700 font-semibold',
                  identityPreviewText: 'text-slate-900',
                  identityPreviewEditButton: 'text-amber-600 hover:text-amber-700',
                  formFieldInputShowPasswordButton: 'text-slate-400 hover:text-slate-600',
                  otpCodeFieldInput: 'border-2 border-slate-200 focus:border-amber-500 rounded-xl',
                  footer: 'bg-transparent pt-4',
                  footerAction: 'text-slate-600',
                  formFieldAction: 'text-amber-600 hover:text-amber-700 font-medium',
                  alertText: 'text-red-600',
                  formFieldSuccessText: 'text-green-600',
                },
              }}
              localization={clerkLocalizations[locale]}
              routing="path"
              path={`/${locale}/auth/user/sign-in`}
              signUpUrl={`/${locale}/auth/user/sign-up`}
              forceRedirectUrl={`/${locale}`}
            />
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
