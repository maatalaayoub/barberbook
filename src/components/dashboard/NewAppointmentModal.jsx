'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  User,
  Scissors,
  Phone,
  CalendarDays,
  MessageSquare,
  DollarSign,
  Plus,
} from 'lucide-react';

const SERVICES = [
  { name: 'Haircut', duration: 30, price: 50 },
  { name: 'Beard Trim', duration: 20, price: 30 },
  { name: 'Haircut & Beard', duration: 45, price: 70 },
  { name: 'Hair Coloring', duration: 60, price: 150 },
  { name: 'Hair Treatment', duration: 40, price: 100 },
  { name: 'Full Service', duration: 60, price: 120 },
  { name: 'Kids Haircut', duration: 20, price: 35 },
  { name: 'Shave', duration: 25, price: 40 },
];

function parseDateAndTime(dateStr) {
  if (!dateStr) {
    const now = new Date();
    return {
      date: now.toISOString().split('T')[0],
      time: '09:00',
    };
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    // dateStr might be just a date like "2026-02-27" without time
    return {
      date: dateStr.split('T')[0],
      time: '09:00',
    };
  }
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  // If time is midnight (00:00), it's likely just a date click — use default 09:00
  const time = (hours === '00' && minutes === '00') ? '09:00' : `${hours}:${minutes}`;
  return {
    date: d.toISOString().split('T')[0],
    time,
  };
}

function computeEndTime(startTime, durationMinutes) {
  const [h, m] = startTime.split(':').map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;
  const endH = Math.floor(totalMinutes / 60) % 24;
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

export default function NewAppointmentModal({ isOpen, onClose, onSave, defaultDate, defaultEndDate, isSaving }) {
  const [formData, setFormData] = useState({
    client: '',
    phone: '',
    service: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    endTime: '09:30',
    notes: '',
    price: '',
  });

  const [errors, setErrors] = useState({});

  // Reset form and populate date/time whenever the modal opens or defaultDate changes
  const defaultEndDateStr = defaultEndDate || '';
  const defaultDateStr = defaultDate || '';
  useEffect(() => {
    if (isOpen) {
      const { date, time } = parseDateAndTime(defaultDateStr);
      let endTime;
      if (defaultEndDateStr) {
        // Use the drag-selected end time
        const parsed = parseDateAndTime(defaultEndDateStr);
        endTime = parsed.time;
      } else {
        endTime = computeEndTime(time, 30);
      }
      setFormData({
        client: '',
        phone: '',
        service: '',
        date,
        time,
        endTime,
        notes: '',
        price: '',
      });
      setErrors({});
    }
  }, [isOpen, defaultDateStr, defaultEndDateStr]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-fill price and recalculate end time when service is selected
      if (field === 'service') {
        const svc = SERVICES.find((s) => s.name === value);
        if (svc) {
          updated.price = String(svc.price);
          updated.endTime = computeEndTime(prev.time, svc.duration);
        }
      }
      // Recalculate end time when start time changes
      if (field === 'time') {
        const svc = SERVICES.find((s) => s.name === prev.service);
        const duration = svc ? svc.duration : 30;
        updated.endTime = computeEndTime(value, duration);
      }
      return updated;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.client.trim()) newErrors.client = 'Client name is required';
    if (!formData.service) newErrors.service = 'Please select a service';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const svc = SERVICES.find((s) => s.name === formData.service);
    const durationMinutes = svc ? svc.duration : 30;

    const start = new Date(`${formData.date}T${formData.time}:00`);
    const end = formData.endTime
      ? new Date(`${formData.date}T${formData.endTime}:00`)
      : new Date(start.getTime() + durationMinutes * 60000);

    onSave({
      title: `${formData.service} — ${formData.client}`,
      start: start.toISOString(),
      end: end.toISOString(),
      backgroundColor: '#D4AF37',
      borderColor: '#B8960C',
      extendedProps: {
        client: formData.client,
        phone: formData.phone,
        service: formData.service,
        notes: formData.notes,
        price: formData.price || (svc ? String(svc.price) : ''),
        status: 'confirmed',
      },
    });
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
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full sm:max-w-lg bg-white rounded-t-[5px] sm:rounded-[5px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle on mobile */}
            <div className="sm:hidden flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            {/* Header */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-[5px]">
                    <Plus className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">New Appointment</h2>
                    <p className="text-xs text-gray-400">Fill in the details below</p>
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
              {/* Client Name */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  Client Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ahmed Ben Ali"
                  value={formData.client}
                  onChange={(e) => handleChange('client', e.target.value)}
                  className={inputClass('client')}
                />
                {errors.client && <p className="mt-1 text-xs text-red-500">{errors.client}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +212 6XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={inputClass('phone')}
                />
              </div>

              {/* Service */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Scissors className="w-3.5 h-3.5 text-gray-400" />
                  Service <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => handleChange('service', e.target.value)}
                  className={inputClass('service')}
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} — {s.duration}min — {s.price} MAD
                    </option>
                  ))}
                </select>
                {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service}</p>}
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

              {/* Start Time & End Time row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    Start Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className={inputClass('time')}
                  />
                  {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    End Time <span className="text-red-400">*</span>
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

              {/* Price */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                  Price (MAD)
                </label>
                <input
                  type="number"
                  placeholder="Auto-filled from service"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className={inputClass('price')}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Any special instructions..."
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
                disabled={isSaving}
                className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 bg-[#364153] hover:bg-[#2a3444] text-white rounded-[5px] font-medium text-sm transition-colors shadow-sm order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Add Appointment'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
