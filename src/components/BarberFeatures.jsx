'use client';

import { motion } from 'framer-motion';
import { 
  UserCircle, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Users,
  CheckCircle 
} from 'lucide-react';

const features = [
  {
    icon: UserCircle,
    title: 'Professional Profile',
    description: 'Create a stunning profile showcasing your skills, portfolio, and services to attract more clients.'
  },
  {
    icon: Calendar,
    title: 'Digital Management',
    description: 'Manage appointments and queues digitally. Say goodbye to paper schedules and missed bookings.'
  },
  {
    icon: CreditCard,
    title: 'Accept Online Bookings',
    description: 'Let customers book and pay online. Reduce no-shows with automated reminders.'
  },
  {
    icon: BarChart3,
    title: 'Track Performance',
    description: 'Monitor daily income, track metrics, and gain insights to grow your business.'
  },
  {
    icon: Users,
    title: 'Grow Customer Base',
    description: 'Get discovered by new customers in your area and build lasting relationships.'
  }
];

const benefits = [
  'Free to join',
  'No commission fees',
  'Instant payouts',
  '24/7 Support'
];

export default function BarberFeatures() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] to-[#1E293B] py-24">
      {/* Background decorations */}
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#14B8A6]/5 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-2">
            <span className="text-sm font-medium text-[#14B8A6]">For Barbers</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Grow Your Barbershop{' '}
            <span className="bg-gradient-to-r from-[#14B8A6] to-[#5EEAD4] bg-clip-text text-transparent">
              Digitally
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Join thousands of successful barbers who've transformed their business with BarberBook.
          </p>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Features list */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group flex gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#14B8A6]/30 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#5EEAD4]">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right side - CTA Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 backdrop-blur-sm lg:p-10">
              {/* Decorative gradient */}
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#14B8A6]/20 blur-3xl" />
              
              <div className="relative">
                <h3 className="mb-4 text-2xl font-bold text-white lg:text-3xl">
                  Ready to Transform Your Business?
                </h3>
                <p className="mb-8 text-gray-400">
                  Join BarberBook today and start accepting online bookings within minutes. 
                  No technical skills required.
                </p>
                
                {/* Benefits */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-[#14B8A6]" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <button className="group w-full rounded-2xl bg-gradient-to-r from-[#14B8A6] to-[#5EEAD4] px-8 py-4 text-lg font-bold text-[#0F172A] transition-all hover:shadow-xl hover:shadow-[#14B8A6]/25">
                  Register as Barber
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
                
                <p className="mt-4 text-center text-sm text-gray-500">
                  Already registered?{' '}
                  <a href="#" className="text-[#14B8A6] hover:underline">
                    Login to dashboard
                  </a>
                </p>
              </div>
            </div>
            
            {/* Stats floating card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-[#0F172A] p-4 shadow-xl lg:-left-12"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14B8A6]/20">
                  <BarChart3 className="h-6 w-6 text-[#14B8A6]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">+150%</p>
                  <p className="text-sm text-gray-400">Average Revenue Growth</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
