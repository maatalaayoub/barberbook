'use client';

import { motion } from 'framer-motion';
import { 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Shield, 
  Zap 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function CustomerFeatures() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: CalendarCheck,
      title: t('appointmentBooking'),
      description: t('appointmentBookingDesc'),
      color: 'from-[#D4AF37] to-[#F4CF67]'
    },
    {
      icon: Clock,
      title: t('turnBasedBookingFeature'),
      description: t('turnBasedBookingFeatureDesc'),
      color: 'from-[#14B8A6] to-[#5EEAD4]'
    },
    {
      icon: MapPin,
      title: t('mobileBarberFeature'),
      description: t('mobileBarberFeatureDesc'),
      color: 'from-[#8B5CF6] to-[#A78BFA]'
    },
    {
      icon: Shield,
      title: t('secureBookingGuarantee'),
      description: t('secureBookingGuaranteeDesc'),
      color: 'from-[#F59E0B] to-[#FBBF24]'
    },
    {
      icon: Zap,
      title: t('realTimeAvailabilityFeature'),
      description: t('realTimeAvailabilityFeatureDesc'),
      color: 'from-[#EC4899] to-[#F472B6]'
    }
  ];
  
  return (
    <section id="features" className="relative overflow-hidden bg-white py-24">
      {/* Background decorations */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#14B8A6]/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 px-4 py-2">
            <span className="text-sm font-medium text-[#D4AF37]">{t('forCustomers')}</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-[#0F172A] sm:text-4xl lg:text-5xl">
            {t('everythingForHaircut')}{' '}
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] bg-clip-text text-transparent">
              {t('perfectHaircut')}
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            {t('customerFeaturesDesc')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative">
                {/* Icon */}
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="mb-3 text-xl font-bold text-[#0F172A]">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
                
                {/* Learn more link */}
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#D4AF37] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span>Learn more</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
