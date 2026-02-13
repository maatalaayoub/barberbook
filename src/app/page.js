import Hero from '@/components/Hero';
import BarberFeatures from '@/components/BarberFeatures';
import HowItWorks from '@/components/HowItWorks';
import AppShowcase from '@/components/AppShowcase';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <HowItWorks />
      <BarberFeatures />
      <AppShowcase />
      <CTA />
      <Footer />
    </main>
  );
}
