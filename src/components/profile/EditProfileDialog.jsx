'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useLanguage } from '@/contexts/LanguageContext';

const genderOptions = [
  { value: 'male', labelEn: 'Male', labelAr: 'ذكر', labelFr: 'Homme' },
  { value: 'female', labelEn: 'Female', labelAr: 'أنثى', labelFr: 'Femme' },
  { value: 'prefer_not_to_say', labelEn: 'Prefer not to say', labelAr: 'أفضل عدم الإفصاح', labelFr: 'Je préfère ne pas dire' },
];

const translations = {
  en: {
    title: 'Edit Profile',
    firstName: 'First Name',
    lastName: 'Last Name',
    birthday: 'Birthday',
    gender: 'Gender',
    selectGender: 'Select gender',
    save: 'Save',
    cancel: 'Cancel',
    saving: 'Saving...',
    error: 'Failed to update profile. Please try again.',
    success: 'Profile updated successfully!',
  },
  ar: {
    title: 'تعديل الملف الشخصي',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    birthday: 'تاريخ الميلاد',
    gender: 'الجنس',
    selectGender: 'اختر الجنس',
    save: 'حفظ',
    cancel: 'إلغاء',
    saving: 'جاري الحفظ...',
    error: 'فشل تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.',
    success: 'تم تحديث الملف الشخصي بنجاح!',
  },
  fr: {
    title: 'Modifier le profil',
    firstName: 'Prénom',
    lastName: 'Nom',
    birthday: 'Date de naissance',
    gender: 'Genre',
    selectGender: 'Sélectionner',
    save: 'Enregistrer',
    cancel: 'Annuler',
    saving: 'Enregistrement...',
    error: 'Échec de la mise à jour du profil. Veuillez réessayer.',
    success: 'Profil mis à jour avec succès!',
  },
};

export default function EditProfileDialog({ isOpen, onClose }) {
  const { user } = useUser();
  const { isRTL, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const labels = translations[language] || translations.en;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
  });

  // Fetch profile data from database when dialog opens
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isOpen || !user) return;
      
      setIsFetching(true);
      setError('');
      
      try {
        const response = await fetch('/api/user-profile');
        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.firstName || user.firstName || '',
            lastName: data.lastName || user.lastName || '',
            birthday: data.birthday || '',
            gender: data.gender || '',
          });
        } else {
          // Fallback to Clerk data
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            birthday: '',
            gender: '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // Fallback to Clerk data
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          birthday: '',
          gender: '',
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfileData();
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Update Clerk user (first name, last name)
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Update database (all fields including birthday and gender)
      const response = await fetch('/api/user-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthday: formData.birthday || null,
          gender: formData.gender || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile in database');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(labels.error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGenderLabel = (option) => {
    if (language === 'ar') return option.labelAr;
    if (language === 'fr') return option.labelFr;
    return option.labelEn;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          >
            <div 
              className="w-full sm:max-w-md bg-white rounded-t-[5px] sm:rounded-[5px] shadow-xl max-h-[90vh] sm:max-h-[85vh] flex flex-col sm:mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 shrink-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{labels.title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-[5px] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {error && (
                  <div className="mb-4 sm:mb-5 p-3 rounded-[5px] bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 sm:mb-5 p-3 rounded-[5px] bg-green-50 text-green-600 text-sm flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {labels.success}
                  </div>
                )}

                {isFetching ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
                  </div>
                ) : (
                <div className="space-y-4 sm:space-y-5">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      {labels.firstName}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-[5px] text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors text-base"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      {labels.lastName}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-[5px] text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors text-base"
                    />
                  </div>

                  {/* Birthday */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      {labels.birthday}
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-[5px] text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors text-base"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      {labels.gender}
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-[5px] text-gray-900 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-colors bg-white cursor-pointer text-base"
                    >
                      <option value="">{labels.selectGender}</option>
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {getGenderLabel(option)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                )}

                {/* Buttons */}
                <div className={`flex items-center justify-end gap-3 mt-6 sm:mt-8 pt-4 border-t border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-[90px] font-medium transition-all"
                  >
                    {labels.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || isFetching}
                    className="px-3 sm:px-6 py-2.5 bg-green-500 sm:bg-white border border-green-500 sm:border-gray-300 text-white sm:text-gray-700 rounded-[90px] font-medium transition-all sm:hover:bg-green-500 sm:hover:text-white sm:hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{labels.saving}</span>
                      </>
                    ) : (
                      labels.save
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
