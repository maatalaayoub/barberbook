'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  CalendarDays,
  List,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarCheck,
} from 'lucide-react';
import AppointmentDetailModal from '@/components/dashboard/AppointmentDetailModal';
import NewAppointmentModal from '@/components/dashboard/NewAppointmentModal';

// Dynamic import of the FullCalendar wrapper to avoid SSR issues
const FullCalendarWrapper = dynamic(
  () => import('@/components/dashboard/FullCalendarWrapper'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-96 text-gray-400">Loading calendar...</div> }
);

// ─── Status colours (full calendar event colours) ───────────
const STATUS_COLORS = {
  confirmed: { bg: '#D4AF37', border: '#B8960C' },
  pending: { bg: '#F59E0B', border: '#D97706' },
  completed: { bg: '#10B981', border: '#059669' },
  cancelled: { bg: '#EF4444', border: '#DC2626' },
};

// Convert a DB appointment row to a FullCalendar event object
function toCalendarEvent(apt) {
  const colors = STATUS_COLORS[apt.status] || STATUS_COLORS.confirmed;
  return {
    id: apt.id,
    title: `${apt.service} — ${apt.client_name}`,
    start: apt.start_time,
    end: apt.end_time,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    editable: apt.status !== 'confirmed' && apt.status !== 'completed' && apt.status !== 'cancelled',
    extendedProps: {
      client: apt.client_name,
      phone: apt.client_phone || '',
      service: apt.service,
      price: apt.price != null ? String(apt.price) : '',
      status: apt.status,
      notes: apt.notes || '',
    },
  };
}

// ─── Stat Cards ─────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-[5px] border border-gray-200">
      <div className={`flex items-center justify-center w-10 h-10 rounded-[5px] ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Filter Pill ────────────────────────────────────────────
function FilterPill({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
        active
          ? `${color} text-white border-transparent shadow-sm`
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function AppointmentsPage() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newDefaultDate, setNewDefaultDate] = useState(null);
  const [newDefaultEndDate, setNewDefaultEndDate] = useState(null);
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((message, type = 'error') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Load appointments from database ──
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch('/api/business/appointments');
        if (res.ok) {
          const data = await res.json();
          const calendarEvents = (data.appointments || []).map(toCalendarEvent);
          setEvents(calendarEvents);
        } else {
          console.error('[Appointments] Failed to fetch:', res.status);
        }
      } catch (err) {
        console.error('[Appointments] Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  // ── Stats ──
  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);
    return {
      today: events.filter(
        (e) => new Date(e.start) >= todayStart && new Date(e.start) < todayEnd && e.extendedProps?.status !== 'cancelled'
      ).length,
      confirmed: events.filter((e) => e.extendedProps?.status === 'confirmed').length,
      pending: events.filter((e) => e.extendedProps?.status === 'pending').length,
      completed: events.filter((e) => e.extendedProps?.status === 'completed').length,
    };
  }, [events]);

  // ── Filtered events ──
  const filteredEvents = useMemo(() => {
    if (statusFilter === 'all') return events;
    return events.filter((e) => e.extendedProps?.status === statusFilter);
  }, [events, statusFilter]);

  // ── Calendar navigation ──
  const goToday = () => calendarRef.current?.getApi().today();
  const goPrev = () => calendarRef.current?.getApi().prev();
  const goNext = () => calendarRef.current?.getApi().next();
  const changeView = (view) => {
    calendarRef.current?.getApi().changeView(view);
    setCurrentView(view);
  };

  // ── Event click => open detail ──
  const handleEventClick = useCallback((info) => {
    info.jsEvent.preventDefault();
    const evt = info.event;
    setSelectedEvent({
      id: evt.id,
      title: evt.title,
      start: evt.start?.toISOString(),
      end: evt.end?.toISOString(),
      backgroundColor: evt.backgroundColor,
      extendedProps: { ...evt.extendedProps },
    });
    setIsDetailOpen(true);
  }, []);

  // ── Date click / drag select => open new ──
  const handleSelect = useCallback((info) => {
    const now = new Date();
    const selectedStart = new Date(info.startStr);

    if (info.allDay) {
      // Month view: block past dates, allow today
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (selectedStart < todayStart) {
        showToast('Cannot create an appointment for a past date.');
        const api = calendarRef.current?.getApi();
        if (api) api.unselect();
        return;
      }
    } else {
      // Time grid: block past times
      if (selectedStart < now) {
        showToast('Cannot create an appointment for a past date or time.');
        const api = calendarRef.current?.getApi();
        if (api) api.unselect();
        return;
      }
    }

    setNewDefaultDate(info.startStr);
    setNewDefaultEndDate(info.endStr);
    setIsNewOpen(true);
    // Unselect the calendar highlight
    const api = calendarRef.current?.getApi();
    if (api) api.unselect();
  }, [showToast]);

  // ── Drag & drop => reschedule (persist to DB) ──
  const handleEventDrop = useCallback(async (info) => {
    const status = info.event.extendedProps?.status;
    if (status === 'confirmed') {
      showToast('Confirmed appointments cannot be moved.');
      info.revert();
      return;
    }
    if (status === 'completed' || status === 'cancelled') {
      info.revert();
      return;
    }
    const newStart = info.event.start.toISOString();
    const newEnd = info.event.end?.toISOString() || newStart;
    // Optimistic update
    setEvents((prev) =>
      prev.map((e) =>
        e.id === info.event.id ? { ...e, start: newStart, end: newEnd } : e
      )
    );
    try {
      await fetch('/api/business/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: info.event.id, start_time: newStart, end_time: newEnd }),
      });
    } catch (err) {
      console.error('[Appointments] Drop update failed:', err);
      info.revert();
    }
  }, [showToast]);

  // ── Resize (persist to DB) ──
  const handleEventResize = useCallback(async (info) => {
    const status = info.event.extendedProps?.status;
    if (status === 'confirmed') {
      showToast('Confirmed appointments cannot be resized.');
      info.revert();
      return;
    }
    if (status === 'completed' || status === 'cancelled') {
      info.revert();
      return;
    }
    const newStart = info.event.start.toISOString();
    const newEnd = info.event.end?.toISOString() || newStart;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === info.event.id ? { ...e, start: newStart, end: newEnd } : e
      )
    );
    try {
      await fetch('/api/business/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: info.event.id, start_time: newStart, end_time: newEnd }),
      });
    } catch (err) {
      console.error('[Appointments] Resize update failed:', err);
      info.revert();
    }
  }, [showToast]);

  // ── Add new event (save to DB) ──
  const handleAddEvent = useCallback(async (eventData) => {
    // Safety check: prevent saving past appointments
    if (new Date(eventData.start) < new Date()) {
      showToast('Cannot create an appointment for a past date or time.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/business/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: eventData.extendedProps.client,
          client_phone: eventData.extendedProps.phone,
          service: eventData.extendedProps.service,
          price: eventData.extendedProps.price,
          start_time: eventData.start,
          end_time: eventData.end,
          status: eventData.extendedProps.status || 'confirmed',
          notes: eventData.extendedProps.notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const calendarEvent = toCalendarEvent(data.appointment);
        setEvents((prev) => [...prev, calendarEvent]);
        setIsNewOpen(false);
      } else {
        const err = await res.json().catch(() => ({}));
        console.error('[Appointments] Save failed:', res.status, err);
        showToast(err.error || 'Failed to save appointment. Please try again.');
      }
    } catch (err) {
      console.error('[Appointments] Save error:', err);
      showToast('Failed to save appointment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [showToast]);

  // ── Mark complete (persist to DB) ──
  const handleComplete = useCallback(async (eventId) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              backgroundColor: STATUS_COLORS.completed.bg,
              borderColor: STATUS_COLORS.completed.border,
              extendedProps: { ...e.extendedProps, status: 'completed' },
            }
          : e
      )
    );
    try {
      await fetch('/api/business/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, status: 'completed' }),
      });
    } catch (err) {
      console.error('[Appointments] Complete update failed:', err);
    }
  }, []);

  // ── Cancel (persist to DB) ──
  const handleCancelAppointment = useCallback(async (eventId) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              backgroundColor: STATUS_COLORS.cancelled.bg,
              borderColor: STATUS_COLORS.cancelled.border,
              extendedProps: { ...e.extendedProps, status: 'cancelled' },
            }
          : e
      )
    );
    try {
      await fetch('/api/business/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, status: 'cancelled' }),
      });
    } catch (err) {
      console.error('[Appointments] Cancel update failed:', err);
    }
  }, []);

  // ── View buttons config ──
  const views = [
    { key: 'timeGridDay', icon: Clock, label: 'Day' },
    { key: 'timeGridWeek', icon: CalendarDays, label: 'Week' },
    { key: 'dayGridMonth', icon: CalendarDays, label: 'Month' },
    { key: 'listWeek', icon: List, label: 'List' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and track all your bookings
          </p>
        </div>
        <button
          onClick={() => {
            setNewDefaultDate(null);
            setNewDefaultEndDate(null);
            setIsNewOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#364153] hover:bg-[#2a3444] text-white rounded-[5px] font-medium text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarCheck} label="Today" value={stats.today} color="bg-blue-500" />
        <StatCard icon={CheckCircle2} label="Confirmed" value={stats.confirmed} color="bg-amber-500" />
        <StatCard icon={AlertCircle} label="Pending" value={stats.pending} color="bg-orange-500" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} color="bg-emerald-500" />
      </div>

      {/* ── Calendar Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[5px] border border-gray-200 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToday}
                className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={goPrev}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goNext}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
              {views.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => changeView(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    currentView === key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <FilterPill label="All" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} color="bg-gray-700" />
              <FilterPill label="Confirmed" active={statusFilter === 'confirmed'} onClick={() => setStatusFilter('confirmed')} color="bg-amber-500" />
              <FilterPill label="Pending" active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} color="bg-orange-500" />
              <FilterPill label="Completed" active={statusFilter === 'completed'} onClick={() => setStatusFilter('completed')} color="bg-emerald-500" />
              <FilterPill label="Cancelled" active={statusFilter === 'cancelled'} onClick={() => setStatusFilter('cancelled')} color="bg-red-500" />
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-2 sm:p-4 fc-custom">
          {isLoading ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin mx-auto" />
                <p className="text-sm">Loading appointments...</p>
              </div>
            </div>
          ) : (
            <FullCalendarWrapper
              ref={calendarRef}
              events={filteredEvents}
              onEventClick={handleEventClick}
              onSelect={handleSelect}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
            />
          )}
        </div>
      </motion.div>

      {/* ── Modals ── */}
      <AppointmentDetailModal
        appointment={selectedEvent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onComplete={handleComplete}
        onCancel={handleCancelAppointment}
      />

      <NewAppointmentModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onSave={handleAddEvent}
        defaultDate={newDefaultDate}
        defaultEndDate={newDefaultEndDate}
        isSaving={isSaving}
      />

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-[5px] shadow-lg text-sm font-medium flex items-center gap-2 ${
              toast.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {toast.type === 'error' ? (
              <XCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
