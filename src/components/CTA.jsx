'use client';

import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section id="download" className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-8 sm:p-12 lg:p-16"
        >
          {/* Background decorations */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#14B8A6]/20 blur-3xl" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/20 px-4 py-2"
              >
                <Download className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-sm font-medium text-[#D4AF37]">Available Now</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
              >
                Download BarberBook{' '}
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] bg-clip-text text-transparent">
                  Today
                </span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8 text-lg text-gray-400"
              >
                Join thousands of satisfied customers who have transformed their 
                barbershop experience. Download now and book your first appointment in under 60 seconds.
              </motion.p>
              
              {/* Download buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
              >
                <a 
                  href="#" 
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 transition-all hover:scale-105 hover:shadow-xl sm:w-auto"
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Download on the</div>
                    <div className="text-lg font-semibold text-[#0F172A]">App Store</div>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 transition-all hover:scale-105 hover:shadow-xl sm:w-auto"
                >
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Get it on</div>
                    <div className="text-lg font-semibold text-[#0F172A]">Google Play</div>
                  </div>
                </a>
              </motion.div>
            </div>

            {/* Right content - Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: '50K+', label: 'Active Users' },
                { value: '2K+', label: 'Barbers' },
                { value: '100K+', label: 'Bookings Made' },
                { value: '4.9', label: 'App Rating' }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
                >
                  <div className="mb-1 text-3xl font-bold text-[#D4AF37] lg:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Barber registration link */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative mt-10 border-t border-white/10 pt-8 text-center"
          >
            <p className="text-gray-400">
              Are you a barber?{' '}
              <a href="#" className="inline-flex items-center gap-1 font-semibold text-[#14B8A6] transition-colors hover:text-[#5EEAD4]">
                Register your barbershop today
                <ArrowRight className="h-4 w-4" />
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
