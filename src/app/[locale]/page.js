import Hero from '@/components/Hero';
import BarberFeatures from '@/components/BarberFeatures';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import AppShowcase from '@/components/AppShowcase';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'ar' }];
}

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <HowItWorks />
      <Features />
      <BarberFeatures />
      <AppShowcase />
      <Footer />
    </main>
  );
}
