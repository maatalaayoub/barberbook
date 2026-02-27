'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Clock,
  CalendarDays,
  Coffee,
  Utensils,
  XCircle,
  Palmtree,
  Plane,
  HelpCircle,
  MessageSquare,
  RotateCw,
} from 'lucide-react';

const EXCEPTION_TYPES = [
  { value: 'break', label: 'Break', icon: Coffee, color: 'bg-blue-500' },
  { value: 'lunch_break', label: 'Lunch Break', icon: Utensils, color: 'bg-orange-500' },
  { value: 'closure', label: 'Closure', icon: XCircle, color: 'bg-red-500' },
  { value: 'holiday', label: 'Holiday', icon: Palmtree, color: 'bg-emerald-500' },
  { value: 'vacation', label: 'Vacation', icon: Plane, color: 'bg-purple-500' },
  { value: 'other', label: 'Other', icon: HelpCircle, color: 'bg-gray-500' },
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AddExceptionModal({ isOpen, onClose, onSave, defaultDate }) {
  const [formData, setFormData] = useState({
    title: 'Break',
    type: 'break',
    date: defaultDate || new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    isFullDay: false,
    recurring: false,
    recurringDay: new Date().getDay(),
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Sync defaultDate prop when modal opens with a different date
  useEffect(() => {
    if (isOpen && defaultDate) {
      setFormData((prev) => ({ ...prev, date: defaultDate }));
    }
  }, [isOpen, defaultDate]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-set title based on type
      if (field === 'type') {
        const typeObj = EXCEPTION_TYPES.find((t) => t.value === value);
        if (!prev.title || EXCEPTION_TYPES.some((t) => t.label === prev.title)) {
          updated.title = typeObj?.label || '';
        }
      }
      if (field === 'isFullDay' && value) {
        updated.startTime = '';
        updated.endTime = '';
      }
      return updated;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Title is required';
    if (!formData.date) e.date = 'Date is required';
    if (!formData.isFullDay && !formData.startTime) e.startTime = 'Start time required';
    if (!formData.isFullDay && !formData.endTime) e.endTime = 'End time required';
    if (!formData.isFullDay && formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      e.endTime = 'End must be after start';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        title: formData.title,
        type: formData.type,
        date: formData.date,
        isFullDay: formData.isFullDay,
        startTime: formData.isFullDay ? null : formData.startTime,
        endTime: formData.isFullDay ? null : formData.endTime,
        recurring: formData.recurring,
        recurringDay: formData.recurring ? formData.recurringDay : null,
        notes: formData.notes,
      });
      // Reset
      setFormData({
        title: 'Break',
        type: 'break',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        isFullDay: false,
        recurring: false,
        recurringDay: new Date().getDay(),
        notes: '',
      });
      onClose();
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 bg-gray-50 border rounded-[5px] text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 ${
      errors[field] ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full sm:max-w-lg bg-white rounded-t-[5px] sm:rounded-[5px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-[5px]">
                    <Plus className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Add Schedule Exception</h2>
                    <p className="text-xs text-gray-400">Break, closure, holiday, etc.</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-[5px] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto flex-1">
              {/* Type selector */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {EXCEPTION_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handleChange('type', t.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-[5px] border text-xs font-medium transition-all ${
                        formData.type === t.value
                          ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lunch Break, Public Holiday..."
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={inputClass('title')}
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                  Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={inputClass('date')}
                />
                {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
              </div>

              {/* Full day toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    formData.isFullDay ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                  onClick={() => handleChange('isFullDay', !formData.isFullDay)}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      formData.isFullDay ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-700 font-medium">Full day</span>
              </label>

              {/* Time range (hidden if full day) */}
              {!formData.isFullDay && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Start <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                      className={inputClass('startTime')}
                    />
                    {errors.startTime && <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      End <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                      className={inputClass('endTime')}
                    />
                    {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>}
                  </div>
                </div>
              )}

              {/* Recurring toggle */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      formData.recurring ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                    onClick={() => handleChange('recurring', !formData.recurring)}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        formData.recurring ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">Repeat weekly</span>
                  </div>
                </label>

                {formData.recurring && (
                  <select
                    value={formData.recurringDay}
                    onChange={(e) => handleChange('recurringDay', parseInt(e.target.value))}
                    className={inputClass('recurringDay')}
                  >
                    {DAY_NAMES.map((name, i) => (
                      <option key={i} value={i}>{name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional notes..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className={`${inputClass('notes')} resize-none`}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <button
                onClick={onClose}
                className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-[5px] font-medium text-sm transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 bg-[#364153] hover:bg-[#2a3444] disabled:opacity-50 text-white rounded-[5px] font-medium text-sm transition-colors shadow-sm order-1 sm:order-2"
              >
                {saving ? 'Saving...' : 'Add Exception'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
