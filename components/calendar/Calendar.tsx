/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import es from 'date-fns/locale/es';
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
import { DhiResource } from '@models';
import { useCalendarContext } from '@contexts';

const Calendar = () => {
  const calendarRef = useRef<SchedulerRef>(null);
  const { setCalendarScheduler, resourceType, calendarType, professionals } =
    useCalendarContext();

  const resources = calendarType
    ? professionals.length
      ? [professionals[0]]
      : []
    : professionals;

  const handlerCustomHeader = (resource: DhiResource) => (
    <CalendarHeader {...resource} />
  );

  const handlerCustomViewer = (event: ProcessedEvent, closeFn: () => void) => (
    <CalendarEventViewer event={event} closeFn={closeFn} />
  );

  const handlerCustomEditor = (schedulerHelpers: SchedulerHelpers) => (
    <CalendarEditor scheduler={schedulerHelpers} />
  );

  const handlerCustomEvent = (evetProps: EventRendererProps) => (
    <CalendarEvent {...evetProps} />
  );

  useEffect(() => {
    setCalendarScheduler(calendarRef);
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
        resources={resources}
        resourceFields={calendarFieldsMapper(resourceType)}
        recourseHeaderComponent={handlerCustomHeader}
        eventRenderer={handlerCustomEvent}
        customViewer={handlerCustomViewer}
        customEditor={handlerCustomEditor}
      />
    </section>
  );
};

export default Calendar;
