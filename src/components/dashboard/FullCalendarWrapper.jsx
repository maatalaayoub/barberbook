'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const FullCalendarWrapper = forwardRef(function FullCalendarWrapper(
  { events, onEventClick, onDateClick, onEventDrop, onEventResize },
  ref
) {
  const calendarRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getApi: () => calendarRef.current?.getApi(),
  }));

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      initialView="timeGridWeek"
      headerToolbar={false}
      events={events}
      editable={true}
      droppable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={3}
      eventClick={onEventClick}
      dateClick={onDateClick}
      eventDrop={onEventDrop}
      eventResize={onEventResize}
      slotMinTime="08:00:00"
      slotMaxTime="21:00:00"
      allDaySlot={false}
      slotDuration="00:15:00"
      slotLabelInterval="01:00:00"
      expandRows={true}
      height="auto"
      contentHeight={600}
      nowIndicator={true}
      eventDisplay="block"
      slotLabelFormat={{
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }}
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }}
      dayHeaderFormat={{
        weekday: 'short',
        day: 'numeric',
      }}
    />
  );
});

export default FullCalendarWrapper;
