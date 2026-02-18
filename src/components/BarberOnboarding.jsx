'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

const DAYS_OF_WEEK = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];

const PROFESSIONAL_TYPES = [
  { id: 'barber', name: 'Barber', description: 'Specializing in men\'s haircuts, beard trims, and grooming.' },
  { id: 'hairdresser', name: 'Hairdresser', description: 'Expert in all types of hair styling and treatments.' },
  { id: 'stylist', name: 'Stylist', description: 'Creative hair design and fashion-forward looks.' },
  { id: 'colorist', name: 'Colorist', description: 'Specializing in hair coloring and highlighting techniques.' },
  { id: 'other', name: 'Other', description: 'Other hair care professional services.' },
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

export default function BarberOnboarding({ userName, onComplete }) {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [professionalType, setProfessionalType] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [businessHours, setBusinessHours] = useState(DEFAULT_HOURS);
  const [editingDay, setEditingDay] = useState(null);

  const displayName = userName || user?.firstName || 'there';
  const totalSteps = 3;

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return !!professionalType;
      case 2:
        return !!workLocation;
      case 3:
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
    try {
      const response = await fetch('/api/barber/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalType,
          workLocation,
          businessHours,
          completeOnboarding: true,
        }),
      });

      if (response.ok) {
        // Dispatch event for layout to show sidebar
        window.dispatchEvent(new Event('onboarding-complete'));
        onComplete?.();
      } else {
        console.error('Failed to save onboarding data');
      }
    } catch (error) {
      console.error('Error saving onboarding:', error);
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
            {[1, 2, 3].map((step) => (
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
                {step < 3 && (
                  <div className={`w-12 h-1 mx-1 rounded ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Professional Type */}
        {currentStep === 1 && (
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

        {/* Step 2: Work Location */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Where do you work, {displayName}?
            </h2>

            <div className="space-y-3">
              {WORK_LOCATIONS.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setWorkLocation(location.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    workLocation === location.id 
                      ? 'border-[#D4AF37] bg-amber-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                    workLocation === location.id 
                      ? 'bg-[#D4AF37] text-white' 
                      : 'bg-gray-100'
                  }`}>
                    {workLocation === location.id && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{location.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{location.description}</p>
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

        {/* Step 3: Business Hours */}
        {currentStep === 3 && (
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
                {isSubmitting ? 'Saving...' : 'CONTINUE'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
