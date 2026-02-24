'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Menu, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/hooks/useRole';
import { ProfileHeader, ProfileSidebar, EditProfileDialog } from '@/components/profile';

export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || 'en';
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { isBarber, isLoaded: isRoleLoaded } = useRole();
  const { t, isRTL } = useLanguage();
  
  const isLoaded = isUserLoaded && isRoleLoaded;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    coverImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&h=400&fit=crop',
    businessName: 'Premium Barbershop',
    bio: 'Professional barbershop offering premium grooming services since 2015.',
    location: 'New York, USA',
    phone: '+1 (555) 123-4567',
    email: 'contact@premiumbarbershop.com',
    socialLinks: {
      instagram: 'https://instagram.com/premiumbarbershop',
      facebook: 'https://facebook.com/premiumbarbershop',
      website: 'https://premiumbarbershop.com'
    }
  });

  // Redirect if not signed in or not a business user
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push(`/${locale}/auth/business/sign-in`);
      } else if (!isBarber) {
        router.push(`/${locale}/profile`);
      }
    }
  }, [isLoaded, isSignedIn, isBarber, router, locale]);

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D4AF37] border-t-transparent"></div>
      </div>
    );
  }

  if (!isSignedIn || !isBarber) {
    return null;
  }

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Sidebar */}
      <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav dir="ltr" className={`flex items-center justify-between py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Left - Menu & Logo */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link href={`/${locale}`}>
                <Image 
                  src="/images/logo-booq.png" 
                  alt="Booq" 
                  width={120} 
                  height={35}
                  className="h-9 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Right - Navigation Links */}
            <Link
              href={`/${locale}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-semibold">{t('home') || 'Home'}</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Profile Header with Cover & Avatar */}
      <ProfileHeader
        user={user}
        coverImage={profileData.coverImage}
        bio={profileData.bio}
        location={profileData.location}
        socialLinks={profileData.socialLinks}
        isOwnProfile={true}
        isBusinessProfile={true}
        businessName={profileData.businessName}
        onEditProfile={handleEditProfile}
        onEditCover={() => {}}
        onEditProfilePicture={handleEditProfile}
      />

      {/* Edit Profile Dialog */}
      <EditProfileDialog 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />
    </div>
  );
}
