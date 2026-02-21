'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Store, Car, Briefcase, Award, Clock } from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];

const BUSINESS_CATEGORIES = [
  { 
    id: 'shop_salon_owner', 
    name: 'Shop or salon owner', 
    description: 'You own or manage a physical location where clients visit',
    icon: 'store'
  },
  { 
    id: 'mobile_service', 
    name: 'Mobile service provider', 
    description: 'You travel to client locations to provide services',
    icon: 'car'
  },
  { 
    id: 'job_seeker', 
    name: 'Job seeker', 
    description: 'You are looking for employment opportunities in the industry',
    icon: 'briefcase'
  },
];

const PROFESSIONAL_TYPES = [
  { id: 'barber', name: 'Barber', description: 'Specializing in men\'s haircuts, beard trims, and grooming.' },
  { id: 'hairdresser', name: 'Hairdresser', description: 'Expert in all types of hair styling and treatments.' },
  { id: 'stylist', name: 'Stylist', description: 'Creative hair design and fashion-forward looks.' },
  { id: 'colorist', name: 'Colorist', description: 'Specializing in hair coloring and highlighting techniques.' },
  { id: 'other', name: 'Other', description: 'Other hair care professional services.' },
];

const YEARS_OF_EXPERIENCE = [
  { id: 'less_than_1', name: 'Less than 1 year', description: 'Just starting out in the industry' },
  { id: '1_to_3', name: '1-3 years', description: 'Building foundational skills and experience' },
  { id: '3_to_5', name: '3-5 years', description: 'Established professional with solid experience' },
  { id: '5_to_10', name: '5-10 years', description: 'Experienced professional with deep expertise' },
  { id: 'more_than_10', name: '10+ years', description: 'Senior professional with extensive experience' },
];

const WORK_LOCATIONS = [
  { 
    id: 'my_place', 
    name: 'At my place', 
    description: 'Clients come to the business, such as your own place, a salon, or a suite where other professionals work.' 
  },
  { 
    id: 'client_location', 
    name: 'At the client\'s location', 
    description: 'Services are performed at the client\'s location.' 
  },
  { 
    id: 'both', 
    name: 'Both locations', 
    description: 'Services can be performed at your place or the client\'s location.' 
  },
];

const DEFAULT_HOURS = DAYS_OF_WEEK.map(day => ({
  dayOfWeek: day.id,
  isOpen: day.id >= 1 && day.id <= 5, // Monday to Friday open by default
  openTime: '10:00',
  closeTime: '19:00',
}));

export default function BusinessOnboarding({ userName, onComplete }) {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Form data
  const [businessCategory, setBusinessCategory] = useState('');
  const [professionalType, setProfessionalType] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [businessHours, setBusinessHours] = useState(DEFAULT_HOURS);
  const [editingDay, setEditingDay] = useState(null);
  // Job seeker specific fields
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [hasCertificate, setHasCertificate] = useState(null);

  const displayName = userName || user?.firstName || 'there';
  
  // Determine total steps and step content based on business category
  const getTotalSteps = () => {
    if (businessCategory === 'job_seeker') return 4;
    return 3; // shop_salon_owner and mobile_service
  };
  const totalSteps = getTotalSteps();

  // Map logical steps to actual step content
  // For shop_salon_owner: 1=Category, 2=ProfessionalType (services), 3=BusinessHours
  // For mobile_service: 1=Category, 2=ProfessionalType (services), 3=BusinessHours
  // For job_seeker: 1=Category, 2=ProfessionalType, 3=YearsOfExperience, 4=Certificate
  const getStepContent = () => {
    if (businessCategory === 'shop_salon_owner' || businessCategory === 'mobile_service') {
      return {
        1: 'category',
        2: 'professional_type',
        3: 'business_hours'
      };
    }
    // job_seeker flow
    return {
      1: 'category',
      2: 'professional_type',
      3: 'years_of_experience',
      4: 'certificate'
    };
  };

  const currentStepContent = getStepContent()[currentStep];

  const canContinue = () => {
    switch (currentStepContent) {
      case 'category':
        return !!businessCategory;
      case 'professional_type':
        return !!professionalType;
      case 'years_of_experience':
        return !!yearsOfExperience;
      case 'certificate':
        return hasCertificate !== null;
      case 'business_hours':
        return businessHours.some(h => h.isOpen);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleDayOpen = (dayId) => {
    setBusinessHours(hours => 
      hours.map(h => 
        h.dayOfWeek === dayId ? { ...h, isOpen: !h.isOpen } : h
      )
    );
  };

  const updateDayHours = (dayId, field, value) => {
    setBusinessHours(hours => 
      hours.map(h => 
        h.dayOfWeek === dayId ? { ...h, [field]: value } : h
      )
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Client-side validation
    console.log('[BusinessOnboarding] Starting submit with:', { businessCategory, professionalType, yearsOfExperience, hasCertificate });
    
    if (!businessCategory) {
      setSubmitError('Please select a business category');
      setIsSubmitting(false);
      return;
    }
    
    if (!professionalType) {
      setSubmitError('Please select your professional type');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // First, assign the business role
      console.log('[BusinessOnboarding] Assigning business role...');
      const roleResponse = await fetch('/api/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'business' }),
      });

      const roleData = await roleResponse.json();
      console.log('[BusinessOnboarding] Role response:', JSON.stringify({ ok: roleResponse.ok, status: roleResponse.status, data: roleData }));
      
      if (!roleResponse.ok) {
        // If role already assigned, continue (user might be retrying)
        if (roleData.error !== 'Role already assigned. Role cannot be changed.') {
          console.error('[BusinessOnboarding] Failed to assign role:', roleData.error);
          setSubmitError(roleData.error || 'Failed to assign role');
          return;
        }
        console.log('[BusinessOnboarding] Role already assigned, continuing...');
      }

      // Build request body based on business category
      const requestBody = {
        businessCategory,
        professionalType,
        completeOnboarding: true,
      };

      // Set work location and business hours based on category
      if (businessCategory === 'shop_salon_owner') {
        requestBody.workLocation = 'my_place';
        requestBody.businessHours = businessHours;
      } else if (businessCategory === 'mobile_service') {
        requestBody.workLocation = 'client_location';
        requestBody.businessHours = businessHours;
      } else if (businessCategory === 'job_seeker') {
        // Job seekers don't have work location or business hours
        requestBody.yearsOfExperience = yearsOfExperience;
        requestBody.hasCertificate = hasCertificate;
      }
      
      console.log('[BusinessOnboarding] Saving onboarding data:', requestBody);
      const response = await fetch('/api/business/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('[BusinessOnboarding] Response status:', response.status);
      const responseText = await response.text();
      console.log('[BusinessOnboarding] Response text (raw):', responseText);
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('[BusinessOnboarding] Failed to parse response:', e);
        responseData = { error: 'Invalid response', raw: responseText };
      }
      
      console.log('[BusinessOnboarding] Onboarding response:', JSON.stringify({ ok: response.ok, status: response.status, data: responseData }));
      
      if (response.ok) {
        // Dispatch event for layout to show sidebar
        window.dispatchEvent(new Event('onboarding-complete'));
        onComplete?.();
      } else {
        const errorMessage = responseData.error || responseData.details || JSON.stringify(responseData) || 'Failed to save onboarding data';
        console.error('[BusinessOnboarding] Failed to save onboarding data:', JSON.stringify(responseData));
        setSubmitError(errorMessage);
      }
    } catch (error) {
      console.error('Error saving onboarding:', error);
      setSubmitError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step === currentStep 
                      ? 'bg-[#D4AF37] text-white' 
                      : step < currentStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < totalSteps && (
                  <div className={`w-8 h-1 mx-1 rounded ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step: Business Category */}
        {currentStepContent === 'category' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Welcome, {displayName}!
            </h2>
            <p className="text-gray-500 text-center mb-8">
              What best describes your business?
            </p>

            <div className="space-y-3">
              {BUSINESS_CATEGORIES.map((category) => {
                const IconComponent = category.icon === 'store' ? Store : category.icon === 'car' ? Car : Briefcase;
                return (
                  <button
                    key={category.id}
                    onClick={() => setBusinessCategory(category.id)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      businessCategory === category.id 
                        ? 'border-[#D4AF37] bg-amber-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`mt-0.5 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      businessCategory === category.id 
                        ? 'bg-[#D4AF37] text-white' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className={`w-full mt-8 py-4 rounded-xl font-semibold text-white transition-colors ${
                canContinue() 
                  ? 'bg-gray-900 hover:bg-gray-800' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              CONTINUE
            </button>
          </div>
        )}

        {/* Step: Professional Type */}
        {currentStepContent === 'professional_type' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              What type of professional are you, {displayName}?
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Select the option that best describes your work
            </p>

            <div className="space-y-3">
              {PROFESSIONAL_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setProfessionalType(type.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    professionalType === type.id 
                      ? 'border-[#D4AF37] bg-amber-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                    professionalType === type.id 
                      ? 'bg-[#D4AF37] text-white' 
                      : 'bg-gray-100'
                  }`}>
                    {professionalType === type.id && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className={`flex-1 py-4 rounded-xl font-semibold text-white transition-colors ${
                  canContinue() 
                    ? 'bg-gray-900 hover:bg-gray-800' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        {/* Step: Years of Experience (for job seekers) */}
        {currentStepContent === 'years_of_experience' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              How many years of experience do you have?
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Select your level of experience in the {PROFESSIONAL_TYPES.find(t => t.id === professionalType)?.name || 'selected'} field
            </p>

            <div className="space-y-3">
              {YEARS_OF_EXPERIENCE.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setYearsOfExperience(exp.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    yearsOfExperience === exp.id 
                      ? 'border-[#D4AF37] bg-amber-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                    yearsOfExperience === exp.id 
                      ? 'bg-[#D4AF37] text-white' 
                      : 'bg-gray-100'
                  }`}>
                    {yearsOfExperience === exp.id && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{exp.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className={`flex-1 py-4 rounded-xl font-semibold text-white transition-colors ${
                  canContinue() 
                    ? 'bg-gray-900 hover:bg-gray-800' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        {/* Step: Certificate/Diploma (for job seekers) */}
        {currentStepContent === 'certificate' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-[#D4AF37]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Professional Certification
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Do you have a certificate or diploma in {PROFESSIONAL_TYPES.find(t => t.id === professionalType)?.name || 'your profession'}?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setHasCertificate(true)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  hasCertificate === true 
                    ? 'border-[#D4AF37] bg-amber-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                  hasCertificate === true 
                    ? 'bg-[#D4AF37] text-white' 
                    : 'bg-gray-100'
                }`}>
                  {hasCertificate === true && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Yes, I have a certificate or diploma</h3>
                  <p className="text-sm text-gray-500 mt-0.5">I have formal education or certification in this field</p>
                </div>
              </button>

              <button
                onClick={() => setHasCertificate(false)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  hasCertificate === false 
                    ? 'border-[#D4AF37] bg-amber-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                  hasCertificate === false 
                    ? 'bg-[#D4AF37] text-white' 
                    : 'bg-gray-100'
                }`}>
                  {hasCertificate === false && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">No, I learned through experience</h3>
                  <p className="text-sm text-gray-500 mt-0.5">I developed my skills through hands-on training and practice</p>
                </div>
              </button>
            </div>

            {submitError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canContinue() || isSubmitting}
                className={`flex-1 py-4 rounded-xl font-semibold text-white transition-colors ${
                  canContinue() && !isSubmitting 
                    ? 'bg-gray-900 hover:bg-gray-800' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'CREATING...' : 'CREATE ACCOUNT'}
              </button>
            </div>
          </div>
        )}

        {/* Step: Business Hours */}
        {currentStepContent === 'business_hours' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Your Business Hours
            </h2>
            <p className="text-gray-500 text-center mb-6">
              When can clients book with you?
            </p>

            <div className="space-y-2">
              {DAYS_OF_WEEK.map((day) => {
                const dayHours = businessHours.find(h => h.dayOfWeek === day.id);
                const isOpen = dayHours?.isOpen || false;
                const isEditing = editingDay === day.id;

                return (
                  <div key={day.id}>
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
                      {/* Toggle and Day Name */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleDayOpen(day.id)}
                          className={`w-12 h-7 rounded-full transition-colors relative ${
                            isOpen ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            isOpen ? 'left-6' : 'left-1'
                          }`} />
                        </button>
                        <span className="font-medium text-gray-900">{day.name}</span>
                      </div>

                      {/* Hours or Closed */}
                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <>
                            <span className="text-gray-600">
                              {formatTime(dayHours?.openTime)} - {formatTime(dayHours?.closeTime)}
                            </span>
                            <button
                              onClick={() => setEditingDay(isEditing ? null : day.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <span className="text-red-500 font-medium">Closed</span>
                        )}
                      </div>
                    </div>

                    {/* Time picker when editing */}
                    {isEditing && isOpen && (
                      <div className="ml-16 mr-4 mb-2 p-4 bg-gray-50 rounded-xl">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Open</label>
                            <input
                              type="time"
                              value={dayHours?.openTime || '10:00'}
                              onChange={(e) => updateDayHours(day.id, 'openTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Close</label>
                            <input
                              type="time"
                              value={dayHours?.closeTime || '19:00'}
                              onChange={(e) => updateDayHours(day.id, 'closeTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {submitError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canContinue() || isSubmitting}
                className={`flex-1 py-4 rounded-xl font-semibold text-white transition-colors ${
                  canContinue() && !isSubmitting
                    ? 'bg-gray-900 hover:bg-gray-800' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'CREATE ACCOUNT'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
