'use client';

import { motion } from 'framer-motion';
import { Home, Heart, Calendar, Users, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

const navItems = [
  { id: 'menu', icon: Menu, labelKey: 'navMenu', href: null, action: 'openSidebar' },
  { id: 'favorite', icon: Heart, labelKey: 'navFavorite', href: '/favorites' },
  { id: 'booking', icon: Calendar, labelKey: 'navBooking', href: '/bookings' },
  { id: 'community', icon: Users, labelKey: 'navCommunity', href: '/community' },
  { id: 'home', icon: Home, labelKey: 'navHome', href: '' },
];

const defaultLabels = {
  navHome: 'Home',
  navFavorite: 'Favorite',
  navBooking: 'Booking',
  navCommunity: 'Community',
  navMenu: 'Menu',
};

// Pages where bottom navigation should be hidden
const excludedPaths = [
  '/admin',
  '/business/dashboard',
  '/auth',
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  
  // Check if current path should hide navigation
  const shouldHide = excludedPaths.some(path => pathname?.includes(path));
  
  if (shouldHide) return null;
  
  const getActiveTab = () => {
    if (pathname === `/${locale}` || pathname === `/${locale}/`) return 'home';
    if (pathname?.includes('/favorites')) return 'favorite';
    if (pathname?.includes('/bookings')) return 'booking';
    if (pathname?.includes('/community')) return 'community';
    if (pathname?.includes('/profile')) return null;
    return 'home';
  };
  
  const activeTab = getActiveTab();

  const handleNavClick = (item, e) => {
    if (item.action === 'openSidebar') {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('toggle-home-sidebar'));
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const label = t(item.labelKey) || defaultLabels[item.labelKey];
          const href = item.href !== null ? (item.href ? `/${locale}${item.href}` : `/${locale}`) : '#';
          
          return (
            <Link
              key={item.id}
              href={href}
              onClick={(e) => handleNavClick(item, e)}
              className="relative flex flex-col items-center justify-center flex-1 h-full group"
            >
              <motion.div
                className="flex flex-col items-center justify-center"
                whileTap={{ scale: 0.9 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 w-12 h-1 bg-[#0F172A] rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <div
                  className={`p-1.5 rounded-xl transition-colors duration-200 ${
                    isActive 
                      ? 'text-[#0F172A]' 
                      : 'text-gray-400 group-hover:text-[#0F172A]/70'
                  }`}
                >
                  <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? 'fill-[#0F172A]/20' : ''}
                  />
                </div>
                <span
                  className={`text-xs mt-0.5 font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-[#0F172A]' 
                      : 'text-gray-400 group-hover:text-[#0F172A]/70'
                  }`}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  );
}
