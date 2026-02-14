'use client';

import { SignUp } from '@clerk/nextjs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Scissors, ArrowRight, Zap } from 'lucide-react';
import { frFR, arSA } from '@clerk/localizations';

const clerkLocalizations = {
  en: undefined,
  fr: frFR,
  ar: arSA,
};

export default function BarberSignUpPage() {
  const params = useParams();
  const locale = params.locale || 'en';
  const { t, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Left Side - Features & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Animated Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 h-full w-full">
          <div>
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
            
            <div className="flex items-center gap-3 mt-4">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5" />
                {t('auth.barber.professionalPortal') || 'Professional Portal'}
              </span>
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                {t('auth.barber.freeTrial') || 'Free to Start'}
              </span>
            </div>
          </div>
          
          <div className="my-auto py-8">
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              {t('auth.barber.joinNetwork') || 'Grow your barbering business'}
            </h1>
            
            <p className="text-gray-400 text-lg mb-10 max-w-md">
              {t('auth.barber.signUpSubtitle') || 'Join 500+ professionals who trust BarberBook to manage and grow their business.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 bg-gradient-to-r from-slate-900 to-slate-800">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3">
            <Image 
              src="/images/logo.png" 
              alt="BarberBook" 
              width={150} 
              height={40}
              className="h-10 w-auto filter brightness-0 invert"
              priority
            />
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <Scissors className="w-3 h-3" />
              PRO
            </span>
          </Link>
          <h2 className="text-white text-xl font-bold mt-4">
            {t('auth.barber.createAccount') || 'Create your professional account'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {t('auth.barber.freeToStart') || 'Free to start • No credit card required'}
          </p>
        </div>
        
        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8 hidden lg:block">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {t('auth.barber.createYourAccount') || 'Create your account'}
              </h2>
              <p className="text-gray-600">
                {t('auth.barber.startFreeToday') || 'Start free today • No credit card required'}
              </p>
            </div>

            {/* Clerk Sign Up */}
            <div className="flex justify-center">
              <SignUp
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
              path={`/${locale}/auth/barber/sign-up`}
              signInUrl={`/${locale}/auth/barber/sign-in`}
              forceRedirectUrl={`/${locale}/auth/barber/complete-signup`}
            />
            </div>

            {/* Switch to Customer */}
            <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-700 font-medium text-sm">
                    {t('auth.barber.lookingForAppointment') || 'Looking to book a haircut?'}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {t('auth.barber.createCustomerAccount') || 'Create a customer account instead'}
                  </p>
                </div>
                <Link
                  href={`/${locale}/auth/user/sign-up`}
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:border-slate-300"
                >
                  {t('auth.barber.customerSignUp') || 'Sign Up'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                href={`/${locale}`}
                className="text-slate-400 hover:text-slate-600 text-sm transition-colors inline-flex items-center gap-1"
              >
                ← {t('auth.backToHome') || 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
