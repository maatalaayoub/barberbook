'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  Scissors,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale || 'en';
  const { t, isRTL } = useLanguage();

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: t('dashboard.sidebar.overview') || 'Overview', 
      href: `/${locale}/barber/dashboard` 
    },
    { 
      icon: Calendar, 
      label: t('dashboard.sidebar.appointments') || 'Appointments', 
      href: `/${locale}/barber/dashboard/appointments` 
    },
    { 
      icon: Clock, 
      label: t('dashboard.sidebar.schedule') || 'Schedule', 
      href: `/${locale}/barber/dashboard/schedule` 
    },
    { 
      icon: Users, 
      label: t('dashboard.sidebar.clients') || 'Clients', 
      href: `/${locale}/barber/dashboard/clients` 
    },
    { 
      icon: Scissors, 
      label: t('dashboard.sidebar.services') || 'Services', 
      href: `/${locale}/barber/dashboard/services` 
    },
    { 
      icon: DollarSign, 
      label: t('dashboard.sidebar.earnings') || 'Earnings', 
      href: `/${locale}/barber/dashboard/earnings` 
    },
    { 
      icon: BarChart3, 
      label: t('dashboard.sidebar.analytics') || 'Analytics', 
      href: `/${locale}/barber/dashboard/analytics` 
    },
  ];

  const bottomItems = [
    { 
      icon: Bell, 
      label: t('dashboard.sidebar.notifications') || 'Notifications', 
      href: `/${locale}/barber/dashboard/notifications`,
      badge: 3
    },
    { 
      icon: Settings, 
      label: t('dashboard.sidebar.settings') || 'Settings', 
      href: `/${locale}/barber/dashboard/settings` 
    },
  ];

  const isActive = (href) => {
    if (href === `/${locale}/barber/dashboard`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className={`flex flex-col h-full ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-slate-700`}>
        {!collapsed && (
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Scissors className="w-7 h-7 text-amber-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              BarberBook
            </span>
          </Link>
        )}
        {collapsed && (
          <Scissors className="w-7 h-7 text-amber-400" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-300" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </div>

      {/* PRO Badge */}
      {!collapsed && (
        <div className="mx-4 mt-4 px-3 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm font-medium">PRO</span>
            <span className="text-slate-400 text-xs">{t('dashboard.sidebar.professionalAccount') || 'Professional Account'}</span>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive(item.href)
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-amber-400' : ''}`} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-slate-700 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive(item.href)
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <div className="relative">
              <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-amber-400' : ''}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            {!collapsed && (
              <span className="font-medium flex-1">{item.label}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 border border-slate-700 rounded-lg"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-72 bg-slate-800 border-r border-slate-700 z-50 transform transition-transform ${
          mobileOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-1 text-slate-400 hover:text-white`}
        >
          <X className="w-6 h-6" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} bg-slate-800 border-${isRTL ? 'l' : 'r'} border-slate-700 transition-all duration-300 z-40 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Spacer */}
      <div className={`hidden lg:block transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`} />
    </>
  );
}
