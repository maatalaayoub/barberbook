'use client';

import { motion } from 'framer-motion';
import { 
  UserCircle, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Users,
  CheckCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: UserCircle,
    title: 'Professional Profile',
    description: 'Showcase your skills, portfolio, services, and pricing to attract more clients.',
    color: 'from-[#D4AF37] to-[#F4CF67]'
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Manage appointments and queues digitally. Reduce no-shows with automated reminders.',
    color: 'from-[#14B8A6] to-[#5EEAD4]'
  },
  {
    icon: CreditCard,
    title: 'Flexible Payments',
    description: 'Accept online payments or cash. Get instant payouts to your bank account.',
    color: 'from-[#8B5CF6] to-[#A78BFA]'
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Track daily income, monitor metrics, and gain insights to grow your business.',
    color: 'from-[#F59E0B] to-[#FBBF24]'
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Build lasting relationships with customers. Store preferences and booking history.',
    color: 'from-[#EC4899] to-[#F472B6]'
  },
  {
    icon: TrendingUp,
    title: 'Marketing Tools',
    description: 'Get discovered by new customers. Run promotions and build your brand.',
    color: 'from-[#06B6D4] to-[#22D3EE]'
  }
];

const benefits = [
  'Instant payouts',
  'Full control',
  'Secure platform',
  'Premium features'
];

export default function BarberFeatures() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/10 blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#14B8A6]/10 blur-[100px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              For Barbers & Salons
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] bg-clip-text text-transparent">
              Grow Your Business
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Join thousands of successful barbers who've transformed their business with BarberBook's powerful tools.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-[5px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/10"
            >
              {/* Icon */}
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-[5px] bg-gradient-to-br ${feature.color}`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="mb-2 text-lg font-bold text-white">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              
              {/* Hover effect */}
              <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br ${feature.color} opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20`} />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative overflow-hidden rounded-[5px] border border-[#D4AF37]/20 bg-gradient-to-r from-[#D4AF37]/10 to-[#F4CF67]/10 p-8 md:p-12"
        >
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                Ready to Transform Your Business?
              </h3>
              <p className="mb-6 max-w-xl text-gray-400">
                Join BarberBook today and start accepting online bookings within minutes. No technical skills required.
              </p>
              
              {/* Benefits Grid */}
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 rounded-[5px] bg-white/5 px-3 py-1.5">
                    <CheckCircle className="h-4 w-4 text-[#D4AF37]" />
                    <span className="text-sm text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right CTA */}
            <div className="flex flex-col gap-4">
              <button className="group flex items-center justify-center gap-2 rounded-[5px] border-2 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] px-8 py-4 text-lg font-bold text-[#0F172A] transition-all hover:brightness-110">
                Register as Barber
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-center text-sm text-gray-500">
                Already registered?{' '}
                <a href="#" className="text-[#D4AF37] hover:underline">
                  Login to dashboard
                </a>
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#D4AF37]/20 blur-3xl" />
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#F4CF67]/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
