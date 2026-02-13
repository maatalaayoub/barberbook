'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Search, Map, Menu, X } from 'lucide-react';

export default function Hero() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can add document class toggle for full site dark mode
    document.documentElement.classList.toggle('dark');
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
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
        <nav className="flex items-center justify-between py-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4CF67]">
              <span className="text-xl font-bold text-[#0F172A]">B</span>
            </div>
            <span className="text-xl font-bold text-white">BarberBook</span>
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
              <a href="#features" className="text-sm text-gray-300 transition-colors hover:text-[#D4AF37]">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-300 transition-colors hover:text-[#D4AF37]">How It Works</a>
              <a href="#app" className="text-sm text-gray-300 transition-colors hover:text-[#D4AF37]">App</a>
            </div>
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-600 mr-6" />
            
            {/* Barber Space Button */}
            <a 
              href="/barber-space" 
              className="mr-4 flex items-center gap-2 rounded-[15px] border border-[#D4AF37] bg-[#D4AF37]/5 px-4 py-2 text-sm font-semibold text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-[#0F172A] hover:shadow-lg hover:shadow-[#D4AF37]/25"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3" />
                <path d="M8.12 8.12L12 12" />
                <path d="M20 4L8.12 15.88" />
                <circle cx="6" cy="18" r="3" />
                <path d="M14.8 14.8L20 20" />
              </svg>
              Barber Space
            </a>
            
            {/* Auth Buttons Group */}
            <div className="flex items-center gap-2 mr-4">
              <a 
                href="/login" 
                className="rounded-[15px] border border-gray-500 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-white hover:bg-white/5 hover:text-white"
              >
                Login
              </a>
              
              <a 
                href="/signup" 
                className="rounded-[15px] bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] px-5 py-2 text-sm font-semibold text-[#0F172A] transition-all hover:shadow-lg hover:shadow-[#D4AF37]/25 hover:scale-105"
              >
                Sign Up
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
            >
              <div className="rounded-[5px] border border-white/10 bg-[#0F172A]/95 backdrop-blur-lg p-6 mb-6">
                {/* Navigation Links */}
                <div className="flex flex-col gap-4 mb-6">
                  <a href="#features" className="text-base text-gray-300 transition-colors hover:text-[#D4AF37]">Features</a>
                  <a href="#how-it-works" className="text-base text-gray-300 transition-colors hover:text-[#D4AF37]">How It Works</a>
                  <a href="#app" className="text-base text-gray-300 transition-colors hover:text-[#D4AF37]">App</a>
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
                  Barber Space
                </a>
                
                {/* Auth Buttons */}
                <div className="flex gap-3 mb-6">
                  <a 
                    href="/login" 
                    className="flex-1 rounded-[5px] border border-gray-500 bg-transparent px-4 py-3 text-center text-sm font-medium text-gray-300 transition-all hover:border-white hover:bg-white/5 hover:text-white"
                  >
                    Login
                  </a>
                  
                  <a 
                    href="/signup" 
                    className="flex-1 rounded-[5px] bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] px-4 py-3 text-center text-sm font-semibold text-[#0F172A] transition-all hover:shadow-lg hover:shadow-[#D4AF37]/25"
                  >
                    Sign Up
                  </a>
                </div>
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="flex w-full items-center justify-center gap-2 rounded-[5px] bg-gray-800/50 py-3 text-sm text-gray-300 transition-all hover:bg-gray-700 hover:text-[#D4AF37]"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex min-h-[calc(100vh-88px)] items-center justify-center py-8 sm:py-12">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-4xl px-2 sm:px-0"
          >
            <h1 className="mb-6 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Book Your Barber or Salon{' '}
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] bg-clip-text text-transparent">
                in Seconds
              </span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-base sm:text-lg text-gray-400 px-2 sm:px-0">
              The smartest way to book haircuts, beauty appointments, and reserve queue spots. Connect with professional barbers and beauty salons effortlessly. No more waiting in lines — enjoy your perfect look on your schedule.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mb-10 max-w-2xl">
              <div className="flex items-center gap-1 sm:gap-2 rounded-[5px] bg-white p-1 sm:p-1.5 shadow-xl shadow-black/20">
                <div className="flex flex-1 items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-2.5">
                  <Search className="h-5 w-5 text-gray-400 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search barber, salon..."
                    className="flex-1 bg-transparent text-[#0F172A] placeholder-gray-400 outline-none text-xs sm:text-sm font-medium min-w-0"
                  />
                </div>
                <div className="hidden sm:block h-8 w-px bg-gray-200" />
                <button 
                  className="hidden sm:flex h-10 w-10 items-center justify-center rounded-[5px] text-gray-500 transition-all hover:bg-gray-100 hover:text-[#D4AF37]"
                  aria-label="Open map"
                >
                  <Map className="h-5 w-5" />
                </button>
                <button 
                  className="flex h-9 sm:h-10 items-center gap-2 rounded-[5px] bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] px-3 sm:px-6 text-xs sm:text-sm font-semibold text-[#0F172A] transition-all hover:shadow-lg hover:shadow-[#D4AF37]/30 shrink-0"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* Services */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <a 
                href="/mobile-barber" 
                className="group flex items-center gap-2 rounded-[5px] bg-white/5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-300 transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                Book a Mobile Barber
              </a>
              
              <span className="hidden sm:inline text-gray-600">|</span>
              
              <a 
                href="/learn-barbering" 
                className="group flex items-center gap-2 rounded-[5px] bg-white/5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-300 transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
                Learn Barbering
              </a>
              
              <span className="hidden sm:inline text-gray-600">|</span>
              
              <a 
                href="/shop" 
                className="group flex items-center gap-2 rounded-[5px] bg-white/5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-300 transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Shop Supplies
              </a>
              
              <span className="hidden sm:inline text-gray-600">|</span>
              
              <a 
                href="/careers" 
                className="group flex items-center gap-2 rounded-[5px] bg-white/5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-300 transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
                Career Opportunities
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
