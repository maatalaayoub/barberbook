'use client';

import { forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const FullCalendarWrapper = forwardRef(function FullCalendarWrapper(
  { events, onEventClick, onSelect, onEventDrop, onEventResize },
  ref
) {
  const calendarRef = useRef(null);
  const containerRef = useRef(null);
  const longPressTimer = useRef(null);
  const isDragging = useRef(false);

  useImperativeHandle(ref, () => ({
    getApi: () => calendarRef.current?.getApi(),
  }));

  // Disable page scroll on long-press inside the calendar for touch devices
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const disableScroll = (e) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    };

    const onTouchStart = () => {
      longPressTimer.current = setTimeout(() => {
        isDragging.current = true;
      }, 300);
    };

    const onTouchEnd = () => {
      clearTimeout(longPressTimer.current);
      isDragging.current = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', disableScroll, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', disableScroll);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
      clearTimeout(longPressTimer.current);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ touchAction: 'pan-x' }}>
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
        longPressDelay={300}
        selectLongPressDelay={300}
        eventLongPressDelay={300}
        dayMaxEvents={3}
        eventClick={onEventClick}
        select={onSelect}
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
    </div>
  );
});

export default FullCalendarWrapper;
