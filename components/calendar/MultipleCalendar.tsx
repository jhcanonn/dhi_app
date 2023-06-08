'use client';

import { useEffect, useRef } from 'react';
import { Scheduler } from '@aldabil/react-scheduler';
import {
  EventRendererProps,
  ProcessedEvent,
  SchedulerHelpers,
  SchedulerRef,
} from '@aldabil/react-scheduler/types';
import {
  EVENTS,
  PROFESSIONALS,
  calendarDay,
  calendarFieldsMapper,
  calendarMonth,
  calendarTranslations,
  calendarWeek,
} from '@utils';
import {
  CalendarHeader,
  CalendarEditor,
  CalendarEventViewer,
  CalendarEvent,
} from '.';
import { CalendarHeaderProps } from '@models';
import { useMultipleCalendarContext } from '@contexts';
import es from 'date-fns/locale/es';

const MultipleCalendar = () => {
  const calendarRef = useRef<SchedulerRef>(null);
  const { setScheduler } = useMultipleCalendarContext();

  const handlerCustomHeader = (resource: CalendarHeaderProps) => (
    <CalendarHeader {...resource} />
  );

  const handlerCustomViewer = (event: ProcessedEvent, closeFn: () => void) => (
    <CalendarEventViewer
      event={event}
      closeFn={closeFn}
      scheduler={calendarRef.current?.scheduler!}
    />
  );

  const handlerCustomEditor = (schedulerHelpers: SchedulerHelpers) => (
    <CalendarEditor scheduler={schedulerHelpers} />
  );

  const handlerCustomEvent = (evetProps: EventRendererProps) => (
    <CalendarEvent {...evetProps} />
  );

  useEffect(() => {
    setScheduler(calendarRef.current?.scheduler!);
  }, []);

  return (
    <section className="scheduler grow px-1">
      <Scheduler
        view="week"
        ref={calendarRef}
        month={calendarMonth}
        week={calendarWeek}
        day={calendarDay}
        translations={calendarTranslations}
        locale={es}
        events={EVENTS}
        resources={PROFESSIONALS}
        resourceFields={calendarFieldsMapper}
        recourseHeaderComponent={handlerCustomHeader}
        customViewer={handlerCustomViewer}
        customEditor={handlerCustomEditor}
        eventRenderer={handlerCustomEvent}
      />
    </section>
  );
};

export default MultipleCalendar;
