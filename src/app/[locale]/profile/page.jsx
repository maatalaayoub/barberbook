'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProfileHeader, ProfileSidebar, EditProfileDialog, ProfilePageNav } from '@/components/profile';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || 'en';
  const { user, isLoaded, isSignedIn } = useUser();
  const { t, isRTL } = useLanguage();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    coverImage: null,
    coverPosition: 50,
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

  // Fetch profile data (cover image, etc.)
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch('/api/user-profile')
      .then(r => r.json())
      .then(data => {
        setProfileData(prev => ({
          ...prev,
          coverImage: data.coverImageUrl || null,
          coverPosition: data.coverImagePosition ?? 50,
          location: data.city || '',
        }));
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn]);

  // Refresh profile data after editing
  const refreshProfile = () => {
    fetch('/api/user-profile')
      .then(r => r.json())
      .then(data => {
        setProfileData(prev => ({
          ...prev,
          coverImage: data.coverImageUrl || null,
          coverPosition: data.coverImagePosition ?? 50,
          location: data.city || '',
        }));
      })
      .catch(() => {});
  };

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Actual nav */}
        <ProfilePageNav
          locale={locale}
          onMenuClick={() => {}}
          isRTL={isRTL}
          t={t}
        />
        <div className="animate-pulse">
          {/* Cover photo skeleton */}
          <div className="h-48 sm:h-64 bg-gray-200" />
          {/* Avatar + info skeleton */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full bg-gray-300 border-4 border-white mx-auto sm:mx-0" />
              <div className="pb-2 flex-1 w-full sm:w-auto">
                <div className="h-6 w-40 max-w-full bg-gray-200 rounded mb-2 mx-auto sm:mx-0" />
                <div className="h-4 w-28 max-w-full bg-gray-100 rounded mx-auto sm:mx-0" />
              </div>
              <div className="h-9 w-28 max-w-full bg-gray-200 rounded-lg mx-auto sm:mx-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
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
        isBusinessProfile={false}
        onEditProfile={handleEditProfile}
        onCoverChange={(url) => setProfileData(prev => ({ ...prev, coverImage: url }))}
        coverPosition={profileData.coverPosition ?? 50}
        onCoverPositionChange={(pos) => setProfileData(prev => ({ ...prev, coverPosition: pos }))}
      />

      {/* Edit Profile Dialog */}
      <EditProfileDialog 
        isOpen={isEditProfileOpen} 
        onClose={() => {
          setIsEditProfileOpen(false);
          refreshProfile();
        }} 
      />
    </div>
  );
}
