'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Bell, 
  Heart, 
  Star,
  Clock,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AppShowcase() {
  const { t } = useLanguage();
  
  const appFeatures = [
    { icon: Sparkles, text: t('intuitiveInterface') },
    { icon: Bell, text: t('smartNotifications') },
    { icon: Heart, text: t('saveFavorites') },
    { icon: Star, text: t('rateAndReview') }
  ];
  
  return (
    <section id="app" className="relative overflow-hidden bg-gray-50 py-24">
      {/* Background decorations */}
      <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Phone mockups */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Main phone */}
              <div className="relative z-10 h-[600px] w-[300px] overflow-hidden rounded-[3rem] border-[8px] border-[#0F172A] bg-[#0F172A]">
                <div className="h-full w-full bg-gradient-to-b from-[#1E293B] to-[#0F172A] p-5">
                  {/* Status bar */}
                  <div className="mb-4 flex items-center justify-between px-2 text-xs text-white">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-4 rounded-sm border border-white/50">
                        <div className="ml-auto h-full w-3/4 rounded-sm bg-[#D4AF37]" />
                      </div>
                    </div>
                  </div>
                  
                  {/* App header */}
                  <div className="mb-5">
                    <h3 className="mb-1 text-lg font-bold text-white">{t('bookingDetails')}</h3>
                    <p className="text-sm text-gray-400">{t('confirmedAppointment')}</p>
                  </div>
                  
                  {/* Booking card */}
                  <div className="mb-5 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F4CF67] p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <Image 
                        src="/images/barber-profile.jpg" 
                        alt="Mohammed Ahajoui"
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-[#0F172A]">Mohammed Ahajoui</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-[#0F172A]" fill="#0F172A" />
                          <span className="text-sm text-[#0F172A]/80">4.9 (312 {t('reviews')})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-[#0F172A]">
                        <Calendar className="h-4 w-4" />
                        <span>Friday, Feb 14, 2026</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#0F172A]">
                        <Clock className="h-4 w-4" />
                        <span>2:30 PM - 3:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#0F172A]">
                        <MapPin className="h-4 w-4" />
                        <span>Fes Medina, Morocco</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Services */}
                  <div className="mb-5">
                    <p className="mb-3 text-sm font-semibold text-white">{t('services')}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                        <span className="text-sm text-gray-300">{t('classicHaircut')}</span>
                        <span className="text-sm font-semibold text-[#D4AF37]">50 DH</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                        <span className="text-sm text-gray-300">{t('beardTrim')}</span>
                        <span className="text-sm font-semibold text-[#D4AF37]">30 DH</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="mb-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="font-semibold text-white">{t('total')}</span>
                    <span className="text-xl font-bold text-[#D4AF37]">80 DH</span>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 rounded-xl border border-white/20 py-3 text-sm font-semibold text-white">
                      {t('reschedule')}
                    </button>
                    <button className="flex-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] py-3 text-sm font-semibold text-[#0F172A]">
                      {t('navigate')}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Second phone (behind) */}
              <div className="absolute -left-20 top-12 z-0 h-[520px] w-[260px] overflow-hidden rounded-[2.5rem] border-[6px] border-gray-300 bg-gray-200 opacity-50 blur-[2px]">
                <div className="h-full w-full bg-gradient-to-b from-gray-100 to-gray-200" />
              </div>
              
              {/* Floating notification card */}
              <motion.div 
                initial={{ opacity: 0, y: 20, x: 20 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -right-8 top-20 z-20 flex items-center gap-3 rounded-[5px] border border-gray-300 bg-white p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{t('reminder')}</p>
                  <p className="text-xs text-gray-500">{t('appointmentIn30Min')}</p>
                </div>
              </motion.div>
              
              {/* Payment card */}
              <motion.div 
                initial={{ opacity: 0, y: -20, x: -20 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -left-12 bottom-24 z-20 flex items-center gap-3 rounded-[5px] border-2 border-[#14B8A6] bg-gradient-to-r from-[#14B8A6] to-[#5EEAD4] p-4"
              >
                <CreditCard className="h-8 w-8 text-white" />
                <div>
                  <p className="text-sm font-semibold text-white">{t('paymentSuccess')}</p>
                  <p className="text-xs text-white/80">-80 DH</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
                {t('premiumExperience')}
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            
            <h2 className="mb-6 text-3xl font-bold text-[#0F172A] sm:text-4xl lg:text-5xl">
              {t('mobileApp')}{' '}
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] bg-clip-text text-transparent">
                {t('youllLove')}
              </span>
            </h2>
            
            <p className="mb-8 text-lg text-gray-600">
              {t('appDescription')}
            </p>
            
            {/* Feature list */}
            <div className="mb-10 grid grid-cols-2 gap-4">
              {appFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3 rounded-[5px] border border-gray-200 bg-white p-4 transition-all hover:border-[#D4AF37]"
                >
                  <feature.icon className="h-5 w-5 text-[#D4AF37]" />
                  <span className="text-sm font-medium text-[#0F172A]">{feature.text}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Download buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <a 
                href="#" 
                className="group relative flex items-center justify-center gap-4 overflow-hidden rounded-[5px] border-2 border-[#0F172A] bg-[#0F172A] px-8 py-4 transition-all hover:scale-[1.02] sm:justify-start"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] to-[#1E293B] opacity-0 transition-opacity group-hover:opacity-100" />
                <svg className="relative h-9 w-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="relative text-left">
                  <div className="text-xs font-medium text-gray-400">{t('downloadOnThe')}</div>
                  <div className="text-xl font-bold text-white">{t('appStore')}</div>
                </div>
              </a>
              
              <a 
                href="#" 
                className="group relative flex items-center justify-center gap-4 overflow-hidden rounded-[5px] border-2 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] px-8 py-4 transition-all hover:scale-[1.02] hover:brightness-110 sm:justify-start"
              >
                <svg className="h-9 w-9 text-[#0F172A]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs font-medium text-[#0F172A]/70">{t('getItOn')}</div>
                  <div className="text-xl font-bold text-[#0F172A]">{t('googlePlay')}</div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
