import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/ClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BarberBook - Book Your Barber or Salon in Seconds",
  description: "The smartest way to book barber appointments. Instant booking, smart queue system, and mobile barber services. Download the app today!",
  keywords: ["barber", "booking", "appointment", "haircut", "barbershop", "grooming", "queue system"],
  authors: [{ name: "BarberBook" }],
  openGraph: {
    title: "BarberBook - Book Your Barber or Salon in Seconds",
    description: "The smartest way to book barber appointments. Instant booking, smart queue system, and mobile barber services.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
