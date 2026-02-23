'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Menu, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProfileHeader, ProfileSidebar } from '@/components/profile';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || 'en';
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  const { t, isRTL } = useLanguage();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=400&fit=crop',
    bio: '',
    location: '',
    socialLinks: {}
  });

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(`/${locale}/auth/user/sign-in`);
    }
  }, [isLoaded, isSignedIn, router, locale]);

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D4AF37] border-t-transparent"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  const handleEditProfile = () => {
    clerk.openUserProfile();
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

            {/* Right - Home Link */}
            <Link
              href={`/${locale}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-[#D4AF37] transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Home className="w-5 h-5" />
              <span className="text-sm font-medium">{t('home') || 'Home'}</span>
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
        isBusinessProfile={false}
        onEditProfile={handleEditProfile}
        onEditCover={() => {}}
        onEditProfilePicture={handleEditProfile}
      />


    </div>
  );
}
