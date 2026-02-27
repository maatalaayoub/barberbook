'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
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

// ─── Helpers ────────────────────────────────────────────────
function generateId() {
  return `apt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function today(offsetDays = 0, hour = 9, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// ─── Status colours (full calendar event colours) ───────────
const STATUS_COLORS = {
  confirmed: { bg: '#D4AF37', border: '#B8960C' },
  pending: { bg: '#F59E0B', border: '#D97706' },
  completed: { bg: '#10B981', border: '#059669' },
  cancelled: { bg: '#EF4444', border: '#DC2626' },
};

// ─── Demo appointments ──────────────────────────────────────
const DEMO_EVENTS = [
  {
    id: generateId(),
    title: 'Haircut — Ahmed Ben Ali',
    start: today(0, 9, 0),
    end: today(0, 9, 30),
    backgroundColor: STATUS_COLORS.confirmed.bg,
    borderColor: STATUS_COLORS.confirmed.border,
    extendedProps: {
      client: 'Ahmed Ben Ali',
      phone: '+212 661 234 567',
      service: 'Haircut',
      price: '50',
      status: 'confirmed',
      notes: 'Regular client, prefers short on sides',
    },
  },
  {
    id: generateId(),
    title: 'Beard Trim — Youssef Alami',
    start: today(0, 10, 30),
    end: today(0, 11, 0),
    backgroundColor: STATUS_COLORS.pending.bg,
    borderColor: STATUS_COLORS.pending.border,
    extendedProps: {
      client: 'Youssef Alami',
      phone: '+212 655 987 654',
      service: 'Beard Trim',
      price: '30',
      status: 'pending',
      notes: '',
    },
  },
  {
    id: generateId(),
    title: 'Full Service — Karim Idrissi',
    start: today(0, 14, 0),
    end: today(0, 15, 0),
    backgroundColor: STATUS_COLORS.confirmed.bg,
    borderColor: STATUS_COLORS.confirmed.border,
    extendedProps: {
      client: 'Karim Idrissi',
      phone: '+212 670 111 222',
      service: 'Full Service',
      price: '120',
      status: 'confirmed',
      notes: 'First visit',
    },
  },
  {
    id: generateId(),
    title: 'Hair Coloring — Omar Saidi',
    start: today(1, 11, 0),
    end: today(1, 12, 0),
    backgroundColor: STATUS_COLORS.confirmed.bg,
    borderColor: STATUS_COLORS.confirmed.border,
    extendedProps: {
      client: 'Omar Saidi',
      phone: '+212 678 333 444',
      service: 'Hair Coloring',
      price: '150',
      status: 'confirmed',
      notes: 'Blonde highlights',
    },
  },
  {
    id: generateId(),
    title: 'Haircut & Beard — Mehdi Fassi',
    start: today(1, 15, 0),
    end: today(1, 15, 45),
    backgroundColor: STATUS_COLORS.pending.bg,
    borderColor: STATUS_COLORS.pending.border,
    extendedProps: {
      client: 'Mehdi Fassi',
      phone: '+212 699 555 666',
      service: 'Haircut & Beard',
      price: '70',
      status: 'pending',
      notes: '',
    },
  },
  {
    id: generateId(),
    title: 'Kids Haircut — Amine Tazi',
    start: today(2, 10, 0),
    end: today(2, 10, 20),
    backgroundColor: STATUS_COLORS.confirmed.bg,
    borderColor: STATUS_COLORS.confirmed.border,
    extendedProps: {
      client: 'Amine Tazi',
      phone: '+212 644 777 888',
      service: 'Kids Haircut',
      price: '35',
      status: 'confirmed',
      notes: "For his son, age 8",
    },
  },
  {
    id: generateId(),
    title: 'Shave — Hassan Bennani',
    start: today(-1, 9, 30),
    end: today(-1, 10, 0),
    backgroundColor: STATUS_COLORS.completed.bg,
    borderColor: STATUS_COLORS.completed.border,
    extendedProps: {
      client: 'Hassan Bennani',
      phone: '+212 612 999 000',
      service: 'Shave',
      price: '40',
      status: 'completed',
      notes: '',
    },
  },
  {
    id: generateId(),
    title: 'Haircut — Rachid El Amrani',
    start: today(-2, 16, 0),
    end: today(-2, 16, 30),
    backgroundColor: STATUS_COLORS.cancelled.bg,
    borderColor: STATUS_COLORS.cancelled.border,
    extendedProps: {
      client: 'Rachid El Amrani',
      phone: '+212 677 222 111',
      service: 'Haircut',
      price: '50',
      status: 'cancelled',
      notes: 'Client cancelled last minute',
    },
  },
  {
    id: generateId(),
    title: 'Hair Treatment — Nabil Chraibi',
    start: today(3, 13, 0),
    end: today(3, 13, 40),
    backgroundColor: STATUS_COLORS.confirmed.bg,
    borderColor: STATUS_COLORS.confirmed.border,
    extendedProps: {
      client: 'Nabil Chraibi',
      phone: '+212 650 444 555',
      service: 'Hair Treatment',
      price: '100',
      status: 'confirmed',
      notes: 'Keratin treatment',
    },
  },
  {
    id: generateId(),
    title: 'Haircut — Zakaria Lahlou',
    start: today(4, 9, 0),
    end: today(4, 9, 30),
    backgroundColor: STATUS_COLORS.pending.bg,
    borderColor: STATUS_COLORS.pending.border,
    extendedProps: {
      client: 'Zakaria Lahlou',
      phone: '+212 688 666 777',
      service: 'Haircut',
      price: '50',
      status: 'pending',
      notes: '',
    },
  },
];

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
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newDefaultDate, setNewDefaultDate] = useState(null);
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [statusFilter, setStatusFilter] = useState('all');

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

  // ── Date click => open new ──
  const handleDateClick = useCallback((info) => {
    setNewDefaultDate(info.dateStr);
    setIsNewOpen(true);
  }, []);

  // ── Drag & drop => reschedule ──
  const handleEventDrop = useCallback((info) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === info.event.id
          ? {
              ...e,
              start: info.event.start.toISOString(),
              end: info.event.end?.toISOString() || e.end,
            }
          : e
      )
    );
  }, []);

  // ── Resize ──
  const handleEventResize = useCallback((info) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === info.event.id
          ? {
              ...e,
              start: info.event.start.toISOString(),
              end: info.event.end?.toISOString() || e.end,
            }
          : e
      )
    );
  }, []);

  // ── Add new event ──
  const handleAddEvent = useCallback((eventData) => {
    setEvents((prev) => [...prev, { ...eventData, id: generateId() }]);
  }, []);

  // ── Mark complete ──
  const handleComplete = useCallback((eventId) => {
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
  }, []);

  // ── Cancel ──
  const handleCancelAppointment = useCallback((eventId) => {
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
          <FullCalendarWrapper
            ref={calendarRef}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
          />
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
      />
    </div>
  );
}
