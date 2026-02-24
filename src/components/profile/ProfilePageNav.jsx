'use client';

import { Menu, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePageNav({ locale, onMenuClick, isRTL, t }) {
  return (
    <header className="relative z-10 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          dir="ltr"
          className={`flex items-center justify-between py-3 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {/* Left - Menu & Logo */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={onMenuClick}
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>

            <Link href={`/${locale}`}>
              <Image
                src="/images/logo-booq.png"
                alt="Booq"
                width={100}
                height={30}
                className="h-8 w-auto brightness-0 invert"
                priority
              />
            </Link>
          </div>

          {/* Right - Home Link */}
          <Link
            href={`/${locale}`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Home className="w-4 h-4" />
            <span>{t('home') || 'Home'}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
