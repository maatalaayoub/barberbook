'use client';

import { motion } from 'framer-motion';
import { Search, CalendarClock, Scissors, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Find Your Barber',
    description: 'Browse verified barbers and salons near you. View ratings, portfolios, and real customer reviews.',
    highlights: ['Verified profiles', 'Real reviews', 'Portfolio gallery']
  },
  {
    number: '02',
    icon: CalendarClock,
    title: 'Book Instantly',
    description: 'Choose your preferred time slot or join the smart queue for immediate service.',
    highlights: ['Real-time availability', 'Queue system', 'Instant confirmation']
  },
  {
    number: '03',
    icon: Scissors,
    title: 'Enjoy Your Service',
    description: 'Arrive at your appointment and enjoy a premium grooming experience.',
    highlights: ['No waiting', 'Premium service', 'Rate & review']
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#0F172A] py-24">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-[5px] bg-[#D4AF37]/10 px-4 py-1.5 text-sm font-medium text-[#D4AF37]">
            How It Works
          </span>
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            Book Your Appointment in{' '}
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] bg-clip-text text-transparent">
              3 Easy Steps
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Simple, fast, and hassle-free. Your perfect haircut is just a few taps away.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent lg:block" />
          
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={`relative flex flex-col items-center gap-8 lg:flex-row ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
              >
                {/* Content Card */}
                <div className={`w-full lg:w-[calc(50%-3rem)] ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="rounded-[5px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-[#D4AF37]/30 hover:bg-white/10">
                    <div className={`mb-4 flex items-center gap-3 ${idx % 2 === 0 ? 'lg:justify-end' : ''}`}>
                      <span className="text-3xl font-bold text-[#D4AF37]">{step.number}</span>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="mb-6 text-gray-400">{step.description}</p>
                    <div className={`flex flex-wrap gap-2 ${idx % 2 === 0 ? 'lg:justify-end' : ''}`}>
                      {step.highlights.map((highlight, hIdx) => (
                        <span 
                          key={hIdx} 
                          className="inline-flex items-center gap-1.5 rounded-[5px] bg-[#D4AF37]/10 px-3 py-1 text-xs font-medium text-[#D4AF37]"
                        >
                          <CheckCircle className="h-3 w-3" />
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Center Icon */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4CF67] shadow-lg shadow-[#D4AF37]/25">
                  <step.icon className="h-7 w-7 text-[#0F172A]" />
                </div>
                
                {/* Empty space for alignment */}
                <div className="hidden w-[calc(50%-3rem)] lg:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <a 
            href="#download" 
            className="inline-flex items-center gap-2 rounded-[5px] bg-gradient-to-r from-[#D4AF37] to-[#F4CF67] px-8 py-4 text-base font-semibold text-[#0F172A] transition-all hover:shadow-lg hover:shadow-[#D4AF37]/25"
          >
            Start Booking Now
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
