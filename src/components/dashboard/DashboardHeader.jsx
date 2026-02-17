'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardHeader() {
  const { user } = useUser();
  const clerk = useClerk();
  const params = useParams();
  const locale = params.locale || 'en';
  const { t } = useLanguage();

  return (
    <header className="bg-[#121A2D] border-b border-gray-700/50 sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <nav dir="ltr" className="flex items-center justify-between py-4">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href={`/${locale}`}>
              <Image 
                src="/images/logo.png" 
                alt="BarberBook" 
                width={200} 
                height={50}
                className="h-11 w-auto filter brightness-0 invert"
                priority
              />
            </Link>
          </motion.div>
          
          {/* Right Section - Profile Button */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            {/* User Profile Button */}
            {user && (
              <button
                onClick={() => clerk.openUserProfile()}
                className="flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 pl-3 pr-1 py-1 transition-all hover:bg-white/10 hover:border-[#D4AF37]/30 cursor-pointer"
              >
                {user.firstName && (
                  <span className="text-sm font-medium text-white/90">
                    {user.firstName}
                  </span>
                )}
                <div className="w-8 h-8 rounded-full ring-2 ring-[#D4AF37]/50 overflow-hidden">
                  <img 
                    src={user.imageUrl} 
                    alt={user.firstName || 'Profile'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            )}
          </motion.div>
        </nav>
      </div>
    </header>
  );
}
