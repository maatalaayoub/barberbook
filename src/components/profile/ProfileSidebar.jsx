'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, Home, GraduationCap, ShoppingBag, Briefcase, 
  Settings, LogOut, Globe 
} from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import Link from 'next/link';

const languages = [
  { code: 'en', name: 'English', countryCode: 'GB' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
  { code: 'ar', name: 'العربية', countryCode: 'MA' },
];

export default function ProfileSidebar({ isOpen, onClose }) {
  const params = useParams();
  const locale = params.locale || 'en';
  const { t, changeLanguage, isRTL } = useLanguage();
  const { user, isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const { isBarber, isLoaded: isRoleLoaded } = useRole();
  const sideMenuRef = useRef(null);
  
  const [currentLang, setCurrentLang] = useState(
    languages.find(l => l.code === locale) || languages[0]
  );

  const isLoaded = isClerkLoaded && isRoleLoaded;

  // Sync currentLang with locale
  useEffect(() => {
    const lang = languages.find(l => l.code === locale);
    if (lang) setCurrentLang(lang);
  }, [locale]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Side Panel */}
          <motion.div
            ref={sideMenuRef}
            initial={{ x: isRTL ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRTL ? '100%' : '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-screen w-[340px] max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <span className="text-gray-900 text-base font-semibold">Menu</span>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Profile Card */}
              {isLoaded && isSignedIn && user && (
                <div className="p-5">
                  <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
                    {/* Profile Info - Clickable */}
                    <Link
                      href={isBarber ? `/${locale}/business/profile` : `/${locale}/profile`}
                      onClick={onClose}
                      className="w-full flex items-center gap-4 p-4 cursor-pointer transition-all hover:bg-gray-50 group"
                    >
                      <div className="w-12 h-12 rounded-full ring-2 ring-gray-300 ring-offset-2 ring-offset-white overflow-hidden shrink-0 shadow-md">
                        <img 
                          src={user?.imageUrl} 
                          alt={user?.firstName || 'Profile'} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.emailAddresses?.[0]?.emailAddress}
                        </p>
                      </div>
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-[#D4AF37] group-hover:text-white transition-all shrink-0">
                        <ChevronDown className={`h-3.5 w-3.5 ${isRTL ? 'rotate-90' : '-rotate-90'}`} />
                      </div>
                    </Link>
                    {/* Divider */}
                    <div className="h-px bg-gray-200" />
                    {/* Logout Button */}
                    <SignOutButton redirectUrl={`/${locale}`}>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 transition-all hover:bg-red-50 hover:text-red-600 group">
                        <LogOut className="h-4 w-4" />
                        <span>{t('signOut') || 'Sign Out'}</span>
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              )}

              {/* Services Section */}
              <div className="px-5 pb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  {t('services') || 'Services'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/${locale}/home-barber`}
                    className="flex flex-col items-center gap-3 p-4 rounded-[7px] bg-white border-2 border-gray-100 text-gray-700 transition-all hover:border-[#D4AF37] group"
                    onClick={onClose}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-[7px] bg-gray-50 group-hover:bg-[#D4AF37]/10 transition-all">
                      <Home className="h-6 w-6 text-gray-500 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-center text-gray-700 group-hover:text-gray-900">
                      {t('homeBarber') || 'Mobile barber'}
                    </span>
                  </Link>
                  <Link
                    href={`/${locale}/training`}
                    className="flex flex-col items-center gap-3 p-4 rounded-[7px] bg-white border-2 border-gray-100 text-gray-700 transition-all hover:border-[#D4AF37] group"
                    onClick={onClose}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-[7px] bg-gray-50 group-hover:bg-[#D4AF37]/10 transition-all">
                      <GraduationCap className="h-6 w-6 text-gray-500 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-center text-gray-700 group-hover:text-gray-900">
                      {t('barberTraining') || 'Learn barbering'}
                    </span>
                  </Link>
                  <Link
                    href={`/${locale}/shop`}
                    className="flex flex-col items-center gap-3 p-4 rounded-[7px] bg-white border-2 border-gray-100 text-gray-700 transition-all hover:border-[#D4AF37] group"
                    onClick={onClose}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-[7px] bg-gray-50 group-hover:bg-[#D4AF37]/10 transition-all">
                      <ShoppingBag className="h-6 w-6 text-gray-500 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-center text-gray-700 group-hover:text-gray-900">
                      {t('shop') || 'Boutique'}
                    </span>
                  </Link>
                  <Link
                    href={`/${locale}/jobs`}
                    className="flex flex-col items-center gap-3 p-4 rounded-[7px] bg-white border-2 border-gray-100 text-gray-700 transition-all hover:border-[#D4AF37] group"
                    onClick={onClose}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-[7px] bg-gray-50 group-hover:bg-[#D4AF37]/10 transition-all">
                      <Briefcase className="h-6 w-6 text-gray-500 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-center text-gray-700 group-hover:text-gray-900">
                      {t('jobs') || 'Emplois'}
                    </span>
                  </Link>
                </div>
              </div>

              {/* Settings - Only for business users */}
              {isLoaded && isBarber && (
                <div className="px-5 pb-5">
                  <Link
                    href={`/${locale}/business/dashboard/settings`}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-[7px] bg-gray-50 text-gray-700 transition-all hover:bg-gray-100 hover:text-gray-900 group"
                    onClick={onClose}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-[5px] bg-gray-50 group-hover:bg-[#D4AF37]/10 transition-all">
                      <Settings className="h-5 w-5 text-gray-500 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                    </div>
                    <span className="font-medium text-sm">{t('settings') || 'Settings'}</span>
                  </Link>
                </div>
              )}

              {/* Language Selector */}
              <div className="px-5 py-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {t('language') || 'Language'}
                </p>
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang);
                        changeLanguage(lang.code);
                      }}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-[7px] py-2.5 text-sm font-medium border-2 transition-all ${
                        currentLang.code === lang.code 
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-white' 
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:text-gray-700'
                      }`}
                    >
                      <ReactCountryFlag 
                        countryCode={lang.countryCode} 
                        svg 
                        style={{ width: '1.2em', height: '1.2em' }}
                      />
                      <span>{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
