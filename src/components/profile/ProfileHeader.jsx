'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Link as LinkIcon, Instagram, Twitter, Facebook, Linkedin, Edit3, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProfileHeader({ 
  user, 
  coverImage = '/images/default-cover.jpg',
  isOwnProfile = true,
  socialLinks = {},
  location = '',
  bio = '',
  isBusinessProfile = false,
  businessName = '',
  onEditProfile,
  onEditCover,
  onEditProfilePicture
}) {
  const { t, isRTL } = useLanguage();
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  const socialIcons = {
    instagram: Instagram,
    twitter: Twitter,
    facebook: Facebook,
    linkedin: Linkedin,
    website: LinkIcon,
  };

  const displayName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';

  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="relative h-32 sm:h-48 md:h-56 lg:h-64 w-full bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        <img 
          src={coverImage} 
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Edit Cover */}
        {isOwnProfile && onEditCover && (
          <button
            onClick={onEditCover}
            className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} flex items-center gap-2 px-3 py-1.5 bg-black/60 hover:bg-black/70 backdrop-blur-sm rounded-lg text-xs font-medium text-white transition-all`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('editCover') || 'Edit'}</span>
          </button>
        )}
      </div>

      {/* Profile Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className={`flex flex-col sm:flex-row ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            
            {/* Profile Photo */}
            <div className={`relative -mt-12 sm:-mt-16 ${isRTL ? 'mr-0 ml-6 sm:mr-0 sm:ml-6' : 'mr-6 sm:mr-6'} flex-shrink-0 self-start`}>
              <motion.div
                className="relative group"
                onMouseEnter={() => setIsHoveringProfile(true)}
                onMouseLeave={() => setIsHoveringProfile(false)}
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border-4 border-white bg-gradient-to-br from-[#D4AF37] to-[#B8963A] shadow-lg overflow-hidden">
                  {user?.imageUrl && user?.hasImage ? (
                    <img 
                      src={user.imageUrl} 
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Edit Photo Overlay */}
                {isOwnProfile && onEditProfilePicture && (
                  <motion.button
                    onClick={onEditProfilePicture}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </motion.button>
                )}
                
                {/* Verified Badge */}
                {isBusinessProfile && (
                  <div className={`absolute -bottom-0.5 ${isRTL ? '-left-0.5' : '-right-0.5'} bg-white rounded-full p-0.5`}>
                    <BadgeCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37] fill-[#D4AF37]/20" />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Info & Actions */}
            <div className={`flex-1 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              
              {/* Name & Location */}
              <div className={`text-left ${isRTL ? 'text-right' : ''}`}>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  {displayName}
                </h1>
                {location && (
                  <p className={`flex items-center gap-1 mt-1 text-sm text-gray-500 ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                    <MapPin className="w-3.5 h-3.5" />
                    {location}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {/* Social Links */}
                {Object.entries(socialLinks).length > 0 && (
                  <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {Object.entries(socialLinks).map(([platform, url]) => {
                      const Icon = socialIcons[platform] || LinkIcon;
                      return url ? (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-[#D4AF37] transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      ) : null;
                    })}
                  </div>
                )}
                
                {/* Edit Profile */}
                {isOwnProfile && onEditProfile && (
                  <button
                    onClick={onEditProfile}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{t('editProfile') || 'Edit Profile'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
