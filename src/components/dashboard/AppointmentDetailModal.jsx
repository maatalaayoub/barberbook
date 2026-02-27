'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  User,
  Scissors,
  Phone,
  CheckCircle2,
  XCircle,
  CalendarDays,
  GripVertical,
  MessageSquare,
} from 'lucide-react';

export default function AppointmentDetailModal({
  appointment,
  isOpen,
  onClose,
  onComplete,
  onCancel,
}) {
  if (!appointment) return null;

  const statusColors = {
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Confirmed' },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Completed' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Cancelled' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending' },
  };

  const status = statusColors[appointment.extendedProps?.status] || statusColors.pending;

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

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
            className="relative w-full sm:max-w-md bg-white rounded-t-[5px] sm:rounded-[5px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle on mobile */}
            <div className="sm:hidden flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header with colored accent */}
            <div
              className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4"
              style={{ borderTop: `4px solid ${appointment.backgroundColor || '#D4AF37'}` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    {appointment.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
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

            {/* Details */}
            <div className="px-4 sm:px-6 pb-4 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
              {/* Date & Time */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[5px]">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-[5px] shadow-sm">
                  <CalendarDays className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(appointment.start)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatTime(appointment.start)}
                    {appointment.end && ` — ${formatTime(appointment.end)}`}
                  </p>
                </div>
              </div>

              {/* Client */}
              {appointment.extendedProps?.client && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[5px]">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-[5px] shadow-sm">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Client</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {appointment.extendedProps.client}
                    </p>
                  </div>
                </div>
              )}

              {/* Service */}
              {appointment.extendedProps?.service && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[5px]">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-[5px] shadow-sm">
                    <Scissors className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Service</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {appointment.extendedProps.service}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone */}
              {appointment.extendedProps?.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[5px]">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-[5px] shadow-sm">
                    <Phone className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {appointment.extendedProps.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {appointment.extendedProps?.notes && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[5px]">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-[5px] shadow-sm">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Notes</p>
                    <p className="text-sm text-gray-700">
                      {appointment.extendedProps.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Price */}
              {appointment.extendedProps?.price && (
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-[5px]">
                  <span className="text-sm font-medium text-amber-800">Total Price</span>
                  <span className="text-lg font-bold text-amber-700">
                    {appointment.extendedProps.price} MAD
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            {appointment.extendedProps?.status !== 'completed' &&
              appointment.extendedProps?.status !== 'cancelled' && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      onComplete(appointment.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[5px] font-medium text-sm transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Complete
                  </button>
                  <button
                    onClick={() => {
                      onCancel(appointment.id);
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-[5px] font-medium text-sm transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}

            {/* Completed / Cancelled footer */}
            {(appointment.extendedProps?.status === 'completed' ||
              appointment.extendedProps?.status === 'cancelled') && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-[5px] font-medium text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
