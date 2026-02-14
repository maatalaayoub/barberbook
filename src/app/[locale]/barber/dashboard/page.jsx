'use client';

import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
} from 'lucide-react';

import { 
  StatsCard, 
  StatsGrid, 
  RevenueChart, 
  AppointmentsChart,
  ServicesPieChart,
  AppointmentCalendar,
} from '@/components/dashboard';

export default function BarberDashboard() {
  const { user } = useUser();
  const params = useParams();
  const locale = params.locale || 'en';
  const { t, isRTL } = useLanguage();

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greeting.morning') || 'Good morning';
    if (hour < 18) return t('dashboard.greeting.afternoon') || 'Good afternoon';
    return t('dashboard.greeting.evening') || 'Good evening';
  };

  // Demo data for upcoming appointments
  const upcomingAppointments = [
    { 
      id: 1, 
      time: '09:00 AM', 
      client: 'John Smith', 
      service: 'Haircut', 
      duration: '30 min',
      avatar: '👨',
      status: 'confirmed'
    },
    { 
      id: 2, 
      time: '10:00 AM', 
      client: 'Mike Johnson', 
      service: 'Beard Trim', 
      duration: '20 min',
      avatar: '🧔',
      status: 'confirmed'
    },
    { 
      id: 3, 
      time: '11:00 AM', 
      client: 'David Wilson', 
      service: 'Haircut & Beard', 
      duration: '45 min',
      avatar: '👤',
      status: 'pending'
    },
    { 
      id: 4, 
      time: '12:30 PM', 
      client: 'Chris Brown', 
      service: 'Haircut', 
      duration: '30 min',
      avatar: '👱',
      status: 'confirmed'
    },
  ];

  // Demo data for recent clients
  const recentClients = [
    { id: 1, name: 'John Smith', visits: 12, lastVisit: '2 days ago', rating: 5 },
    { id: 2, name: 'Mike Johnson', visits: 8, lastVisit: '1 week ago', rating: 5 },
    { id: 3, name: 'David Wilson', visits: 5, lastVisit: '2 weeks ago', rating: 4 },
    { id: 4, name: 'Chris Brown', visits: 3, lastVisit: '3 weeks ago', rating: 5 },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {getGreeting()}, {user?.firstName || t('dashboard.defaultName') || 'Professional'}!
          </h1>
          <p className="text-slate-400 mt-1">
            {t('dashboard.subtitle') || "Here's what's happening with your business today."}
          </p>
        </div>
        <Link
          href={`/${locale}/barber/dashboard/appointments/new`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
        >
          <Plus className="w-5 h-5" />
          {t('dashboard.newAppointment') || 'New Appointment'}
        </Link>
      </div>

      {/* Stats Grid */}
      <StatsGrid>
        <StatsCard
          icon={Calendar}
          label={t('dashboard.stats.todayAppointments') || "Today's Appointments"}
          value="8"
          trend="+2"
          trendDirection="up"
          color="amber"
        />
        <StatsCard
          icon={Users}
          label={t('dashboard.stats.totalClients') || 'Total Clients'}
          value="156"
          trend="+12"
          trendDirection="up"
          color="blue"
        />
        <StatsCard
          icon={DollarSign}
          label={t('dashboard.stats.monthlyRevenue') || 'Monthly Revenue'}
          value="$2,840"
          trend="+18%"
          trendDirection="up"
          color="green"
        />
        <StatsCard
          icon={TrendingUp}
          label={t('dashboard.stats.avgRating') || 'Average Rating'}
          value="4.9"
          trend="Top 5%"
          trendDirection="up"
          color="purple"
        />
      </StatsGrid>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-6">
          <RevenueChart />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppointmentsChart />
            <ServicesPieChart />
          </div>
        </div>

        {/* Right Column - Appointments & Clients */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {t('dashboard.todayAppointments') || "Today's Appointments"}
              </h3>
              <Link
                href={`/${locale}/barber/dashboard/appointments`}
                className="text-amber-400 text-sm hover:text-amber-300 flex items-center gap-1"
              >
                {t('dashboard.viewAll') || 'View All'}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">
                    {apt.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium truncate">{apt.client}</p>
                      {getStatusIcon(apt.status)}
                    </div>
                    <p className="text-sm text-slate-400">{apt.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{apt.time}</p>
                    <p className="text-xs text-slate-500">{apt.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Clients */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {t('dashboard.recentClients') || 'Recent Clients'}
              </h3>
              <Link
                href={`/${locale}/barber/dashboard/clients`}
                className="text-amber-400 text-sm hover:text-amber-300 flex items-center gap-1"
              >
                {t('dashboard.viewAll') || 'View All'}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                    <span className="text-amber-400 font-medium">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{client.name}</p>
                    <p className="text-sm text-slate-400">
                      {client.visits} {t('dashboard.visits') || 'visits'} • {client.lastVisit}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-white text-sm font-medium">{client.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <AppointmentCalendar />
    </div>
  );
}
