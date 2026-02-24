'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRole } from '@/hooks/useRole';
import { ProfileHeader, ProfileSidebar, EditProfileDialog, ProfilePageNav } from '@/components/profile';

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
    coverImage: null,
    coverPosition: 50,
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

  // Fetch profile data (cover image, etc.)
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !isBarber) return;
    fetch('/api/user-profile')
      .then(r => r.json())
      .then(data => {
        setProfileData(prev => ({
          ...prev,
          coverImage: data.coverImageUrl || null,
          coverPosition: data.coverImagePosition ?? 50,
        }));
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn, isBarber]);

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

      {/* Floating adaptive nav – fixed, overlays the cover photo */}
      <ProfilePageNav
        locale={locale}
        onMenuClick={() => setIsSidebarOpen(true)}
        isRTL={isRTL}
        t={t}
      />

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
        onCoverChange={(url) => setProfileData(prev => ({ ...prev, coverImage: url }))}
        coverPosition={profileData.coverPosition ?? 50}
        onCoverPositionChange={(pos) => setProfileData(prev => ({ ...prev, coverPosition: pos }))}
      />

      {/* Edit Profile Dialog */}
      <EditProfileDialog 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />
    </div>
  );
}
