'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Star, Settings, Bell, Search } from 'lucide-react';

export default function UserDashboard() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const locale = params.locale || 'en';
  const { t, isRTL } = useLanguage();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const upcomingAppointments = [
    {
      id: 1,
      barber: 'Ahmad Hassan',
      service: 'Haircut & Beard Trim',
      date: 'Today',
      time: '2:30 PM',
      location: 'Downtown Barber',
      image: '/images/barber1.jpg',
    },
  ];

  const recentBarbers = [
    { id: 1, name: 'Ahmad Hassan', rating: 4.9, specialty: 'Classic Cuts', image: '/images/barber1.jpg' },
    { id: 2, name: 'Mohammed Ali', rating: 4.8, specialty: 'Modern Styles', image: '/images/barber2.jpg' },
  ];

  return (
    <div className={`min-h-screen bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                BarberBook
              </h1>
            </Link>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
              </button>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9',
                  },
                }}
                afterSignOutUrl={`/${locale}`}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('dashboard.user.welcome') || 'Welcome back'}, {user?.firstName || 'there'}!
          </h2>
          <p className="text-gray-400">
            {t('dashboard.user.subtitle') || 'Ready to book your next appointment?'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href={`/${locale}/user/search`}
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white hover:from-amber-600 hover:to-orange-600 transition-all group"
          >
            <Search className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg mb-1">
              {t('dashboard.user.findBarber') || 'Find a Barber'}
            </h3>
            <p className="text-amber-100 text-sm">
              {t('dashboard.user.findBarberDesc') || 'Search nearby professionals'}
            </p>
          </Link>

          <Link
            href={`/${locale}/user/appointments`}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-white hover:border-amber-500/50 transition-all group"
          >
            <Calendar className="w-8 h-8 mb-3 text-amber-400 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg mb-1">
              {t('dashboard.user.myAppointments') || 'My Appointments'}
            </h3>
            <p className="text-gray-400 text-sm">
              {t('dashboard.user.myAppointmentsDesc') || 'View and manage bookings'}
            </p>
          </Link>

          <Link
            href={`/${locale}/user/favorites`}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-white hover:border-amber-500/50 transition-all group"
          >
            <Star className="w-8 h-8 mb-3 text-amber-400 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg mb-1">
              {t('dashboard.user.favorites') || 'Favorites'}
            </h3>
            <p className="text-gray-400 text-sm">
              {t('dashboard.user.favoritesDesc') || 'Your saved barbers'}
            </p>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {t('dashboard.user.upcomingAppointments') || 'Upcoming Appointments'}
            </h3>
            <Link href={`/${locale}/user/appointments`} className="text-amber-400 text-sm hover:text-amber-300">
              {t('dashboard.user.viewAll') || 'View all'}
            </Link>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✂️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{appointment.service}</h4>
                    <p className="text-gray-400 text-sm">{appointment.barber}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {appointment.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {appointment.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {appointment.location}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                    {t('dashboard.user.reschedule') || 'Reschedule'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                {t('dashboard.user.noAppointments') || 'No upcoming appointments'}
              </p>
              <Link
                href={`/${locale}/user/search`}
                className="inline-block mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                {t('dashboard.user.bookNow') || 'Book Now'}
              </Link>
            </div>
          )}
        </div>

        {/* Recent Barbers */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('dashboard.user.recentBarbers') || 'Your Recent Barbers'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentBarbers.map((barber) => (
              <div
                key={barber.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-amber-500/50 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <h4 className="font-semibold text-white text-center">{barber.name}</h4>
                <p className="text-gray-400 text-sm text-center">{barber.specialty}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 text-sm">{barber.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
