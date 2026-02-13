'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Facebook, 
  Instagram, 
  Linkedin,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

// Custom X (Twitter) icon
const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#' },
    { name: 'Download App', href: '#download' }
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Press Kit', href: '#' }
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' }
  ],
  barbers: [
    { name: 'Register as Barber', href: '#' },
    { name: 'Barber Dashboard', href: '#' },
    { name: 'Success Stories', href: '#' },
    { name: 'Partner Program', href: '#' }
  ]
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: XIcon, href: '#', label: 'X' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' }
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0F172A]">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo */}
              <div className="mb-6">
                <Image 
                  src="/images/logo.png" 
                  alt="BarberBook" 
                  width={200} 
                  height={50}
                  className="h-11 w-auto"
                />
              </div>
              
              <p className="mb-6 max-w-xs text-gray-400">
                The smartest way to book barber appointments. Join thousands of 
                satisfied customers and barbers on our platform.
              </p>
              
              {/* Contact info */}
              <div className="space-y-3">
                <a href="mailto:hello@barberbook.app" className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-[#D4AF37]">
                  <Mail className="h-4 w-4" />
                  hello@barberbook.app
                </a>
                <a href="tel:+212600000000" className="flex items-center gap-3 text-sm text-gray-400 transition-colors hover:text-[#D4AF37]">
                  <Phone className="h-4 w-4" />
                  +212 6 00 00 00 00
                </a>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <MapPin className="h-4 w-4" />
                  Fes, Morocco
                </div>
              </div>
              
              {/* Social links */}
              <div className="mt-6 flex gap-3">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-all hover:bg-[#D4AF37] hover:text-[#0F172A]"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-[#D4AF37]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-[#D4AF37]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-[#D4AF37]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              For Barbers
            </h4>
            <ul className="space-y-3">
              {footerLinks.barbers.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-[#D4AF37]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} BarberBook. All rights reserved.
            </p>
            
            {/* Download badges */}
            <div className="flex items-center gap-4">
              <a href="#" className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 transition-colors hover:bg-white/10">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="text-xs text-gray-400">App Store</span>
              </a>
              <a href="#" className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 transition-colors hover:bg-white/10">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span className="text-xs text-gray-400">Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
