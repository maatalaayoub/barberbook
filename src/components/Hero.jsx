'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Search, Map, Menu, X, ChevronDown, Globe } from 'lucide-react';
import Image from 'next/image';
import ReactCountryFlag from 'react-country-flag';
import { useLanguage } from '@/contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English', countryCode: 'GB' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
  { code: 'ar', name: 'العربية', countryCode: 'MA' },
];

export default function Hero() {
  const { t, locale, changeLanguage } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);
  
  // Typewriter effect state
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Get rotating sentences
  const getRotatingSentences = () => [
    t('heroRotating1'),
    t('heroRotating2'),
    t('heroRotating3'),
  ];

  // Typewriter effect
  useEffect(() => {
    const sentences = getRotatingSentences();
    const currentSentence = sentences[currentSentenceIndex];
    
    if (isTyping) {
      if (displayedText.length < currentSentence.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentSentence.slice(0, displayedText.length + 1));
        }, 40); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, wait before erasing
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000); // Display duration
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 25); // Erasing speed (faster)
        return () => clearTimeout(timeout);
      } else {
        // Move to next sentence
        setCurrentSentenceIndex((prev) => (prev + 1) % sentences.length);
        setIsTyping(true);
      }
    }
  }, [displayedText, isTyping, currentSentenceIndex, locale]);

  // Reset when language changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentSentenceIndex(0);
    setIsTyping(true);
  }, [locale]);

  // Sync currentLang with locale
  useEffect(() => {
    const lang = languages.find(l => l.code === locale);
    if (lang) setCurrentLang(lang);
  }, [locale]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can add document class toggle for full site dark mode
    document.documentElement.classList.toggle('dark');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] sm:min-h-screen">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-[#14B8A6]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-[#D4AF37]/5 blur-2xl" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <nav dir="ltr" className="flex items-center justify-between py-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Image 
              src="/images/logo.png" 
              alt="BarberBook" 
              width={200} 
              height={50}
              className="h-11 w-auto"
              priority
            />
          </motion.div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-gray-800/50 text-gray-300 transition-all hover:bg-gray-700 hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden items-center md:flex"
          >
            {/* Navigation Links */}
            <div className="flex items-center gap-6 mr-6">
              <a href="#features" className="text-sm text-gray-300 transition-colors hover:text-[#D4AF37]">{t('features')}</a>
              <a href="#how-it-works" className="text-sm text-gray-300 transition-colors hover:text-[#D4AF37]">{t('howItWorks')}</a>
              <a href="#app" className="text-sm text-gray-300 transition-colors hover:text-[#D4AF37]">{t('app')}</a>
            </div>
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-600 mr-6" />
            
            {/* Barber Space Button */}
            <a 
              href="/barber-space" 
              className="mr-4 flex items-center gap-2 rounded-[15px] border border-[#D4AF37] bg-[#D4AF37]/5 px-4 py-2 text-sm font-semibold text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3" />
                <path d="M8.12 8.12L12 12" />
                <path d="M20 4L8.12 15.88" />
                <circle cx="6" cy="18" r="3" />
                <path d="M14.8 14.8L20 20" />
              </svg>
              {t('barberSpace')}
            </a>
            
            {/* Auth Buttons Group */}
            <div className="flex items-center gap-2 mr-4">
              <a 
                href="/login" 
                className="rounded-[15px] border border-gray-500 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-white hover:bg-white/5 hover:text-white"
              >
                {t('login')}
              </a>
              
              <a 
                href="/signup" 
                className="rounded-[15px] border-2 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] px-5 py-2 text-sm font-semibold text-[#0F172A] transition-all hover:scale-105"
              >
                {t('signUp')}
              </a>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative flex h-10 w-10 items-center justify-center rounded-[15px] bg-gray-800/50 text-gray-300 transition-all hover:bg-gray-700 hover:text-[#D4AF37] hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Language Selector */}
            <div className="relative ml-2" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex h-10 items-center gap-2 rounded-[15px] bg-gray-800/50 px-3 text-sm text-gray-300 transition-all hover:bg-gray-700"
              >
                <ReactCountryFlag 
                  countryCode={currentLang.countryCode} 
                  svg 
                  style={{ width: '1.2em', height: '1.2em' }}
                />
                <span className="hidden lg:inline">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 z-50 min-w-[160px] overflow-hidden rounded-[10px] border border-gray-700 bg-[#1E293B]" 
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang);
                          changeLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-700 ${
                          currentLang.code === lang.code ? 'bg-gray-700/50 text-[#D4AF37]' : 'text-gray-300'
                        }`}
                      >
                        <ReactCountryFlag 
                          countryCode={lang.countryCode} 
                          svg 
                          style={{ width: '1.2em', height: '1.2em' }}
                        />
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
              dir="ltr"
            >
              <div className="rounded-[5px] border border-white/10 bg-[#0F172A]/95 backdrop-blur-lg p-6 mb-6">
                {/* Navigation Links */}
                <div className="flex flex-col gap-4 mb-6">
                  <a href="#features" className="text-base text-gray-300 transition-colors hover:text-[#D4AF37]">{t('features')}</a>
                  <a href="#how-it-works" className="text-base text-gray-300 transition-colors hover:text-[#D4AF37]">{t('howItWorks')}</a>
                  <a href="#app" className="text-base text-gray-300 transition-colors hover:text-[#D4AF37]">{t('app')}</a>
                </div>
                
                {/* Divider */}
                <div className="h-px w-full bg-gray-700 mb-6" />
                
                {/* Barber Space Button */}
                <a 
                  href="/barber-space" 
                  className="mb-4 flex items-center justify-center gap-2 rounded-[5px] border border-[#D4AF37] bg-[#D4AF37]/5 px-4 py-3 text-sm font-semibold text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="6" cy="6" r="3" />
                    <path d="M8.12 8.12L12 12" />
                    <path d="M20 4L8.12 15.88" />
                    <circle cx="6" cy="18" r="3" />
                    <path d="M14.8 14.8L20 20" />
                  </svg>
                  {t('barberSpace')}
                </a>
                
                {/* Auth Buttons */}
                <div className="flex gap-3 mb-6">
                  <a 
                    href="/login" 
                    className="flex-1 rounded-[5px] border border-gray-500 bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-300 transition-all hover:border-white hover:bg-white/5 hover:text-white"
                  >
                    {t('login')}
                  </a>
                  
                  <a 
                    href="/signup" 
                    className="flex-1 rounded-[5px] border-2 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] px-4 py-3 text-center text-sm font-semibold text-[#0F172A] transition-all hover:brightness-110"
                  >
                    {t('signUp')}
                  </a>
                </div>
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="flex w-full items-center justify-center gap-2 rounded-[5px] bg-gray-800/50 py-3 text-sm text-gray-300 transition-all hover:bg-gray-700 hover:text-[#D4AF37] mb-3"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span>{isDarkMode ? t('lightMode') : t('darkMode')}</span>
                </button>

                {/* Language Selector */}
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang);
                        changeLanguage(lang.code);
                      }}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-[5px] py-3 text-sm transition-all ${
                        currentLang.code === lang.code 
                          ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37]' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
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
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start pt-16 pb-12 sm:pt-0 sm:pb-0 sm:items-center sm:min-h-[calc(100vh-88px)] justify-center sm:py-12">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-4xl px-2 sm:px-0"
          >
            <h1 className="mb-14 min-h-[3.5rem] sm:min-h-[4rem] md:min-h-[4.5rem] lg:min-h-[5rem] text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
              <span className="text-white">
                {displayedText}
              </span>
              <span className="animate-pulse text-[#D4AF37]">|</span>
            </h1>

            {/* Search Bar */}
            <div className="mx-auto mb-10 max-w-2xl">
              <div className="flex items-center gap-1 sm:gap-2 rounded-[5px] border border-gray-200 bg-white p-1 sm:p-1.5">
                <div className="flex flex-1 items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-2.5">
                  <Search className="h-5 w-5 text-gray-400 shrink-0" />
                  <input 
                    type="text" 
                    placeholder={t('searchPlaceholder')}
                    className="flex-1 bg-transparent text-[#0F172A] placeholder-gray-400 outline-none text-xs sm:text-sm font-medium min-w-0"
                  />
                </div>
                <div className="h-6 sm:h-8 w-px bg-gray-200" />
                <button 
                  className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-[5px] text-gray-500 transition-all hover:bg-gray-100 hover:text-[#D4AF37]"
                  aria-label="Open map"
                >
                  <Map className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button 
                  className="flex h-9 sm:h-10 items-center gap-2 rounded-[5px] border-2 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] px-3 sm:px-6 text-xs sm:text-sm font-semibold text-[#0F172A] transition-all hover:brightness-110 shrink-0"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('search')}</span>
                </button>
              </div>
            </div>

            {/* Services - Grid on mobile, flex row on desktop */}
            <div className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-nowrap sm:items-center sm:justify-center sm:gap-3">
              <a 
                href="/mobile-barber" 
                className="group flex items-center justify-center gap-2 rounded-[5px] bg-white/5 px-3 py-2.5 text-xs sm:text-sm text-gray-300 transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span className="whitespace-nowrap">{t('bookMobileBarber')}</span>
              </a>
              
              <span className="hidden sm:inline text-gray-600">|</span>
              
              <a 
                href="/learn-barbering" 
                className="group flex items-center justify-center gap-2 rounded-[5px] bg-white/5 px-3 py-2.5 text-xs sm:text-sm text-gray-300 transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
                <span className="whitespace-nowrap">{t('learnBarbering')}</span>
              </a>
              
              <span className="hidden sm:inline text-gray-600">|</span>
              
              <a 
                href="/shop" 
                className="group flex items-center justify-center gap-2 rounded-[5px] bg-white/5 px-3 py-2.5 text-xs sm:text-sm text-gray-300 transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="whitespace-nowrap">{t('shopSupplies')}</span>
              </a>
              
              <span className="hidden sm:inline text-gray-600">|</span>
              
              <a 
                href="/careers" 
                className="group flex items-center justify-center gap-2 rounded-[5px] bg-white/5 px-3 py-2.5 text-xs sm:text-sm text-gray-300 transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
                <span className="whitespace-nowrap">{t('careerOpportunities')}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
