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
  calendarDay,
  calendarFieldsMapper,
  calendarMonth,
  calendarTranslations,
  calendarWeek,
} from '@utils';
import {
  CalendarEditor,
  CalendarEventViewer,
  CalendarEvent,
} from '@components/organisms';
import { CalendarHeader } from '@components/molecules';
import { CalendarType, DhiResource, ResourceType } from '@models';
import { useCalendarContext, useGlobalContext } from '@contexts';
import { useGetResources } from '@hooks';

const Calendar = () => {
  const calendarRef = useRef<SchedulerRef>(null);
  const { events } = useGlobalContext();
  const { setCalendarScheduler, calendarType, resourceType, resourceMode } =
    useCalendarContext();

  const resources = useGetResources(
    calendarType === CalendarType.INDIVIDUAL,
    resourceType === ResourceType.PROFESSIONAL
  );

  const handleCustomHeader = (resource: DhiResource) => (
    <CalendarHeader {...resource} />
  );

  const handleCustomViewer = (event: ProcessedEvent, closeFn: () => void) => (
    <CalendarEventViewer event={event} closeFn={closeFn} />
  );

  const handleCustomEditor = (schedulerHelpers: SchedulerHelpers) => (
    <CalendarEditor scheduler={schedulerHelpers} />
  );

  const handleCustomEvent = (evetProps: EventRendererProps) => (
    <CalendarEvent {...evetProps} />
  );

  useEffect(() => {
    console.log({ resourceType, events });
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
        events={events}
        resources={resources}
        resourceViewMode={resourceMode}
        resourceFields={calendarFieldsMapper(resourceType)}
        recourseHeaderComponent={handleCustomHeader}
        eventRenderer={handleCustomEvent}
        customViewer={handleCustomViewer}
        customEditor={handleCustomEditor}
      />
    </section>
  );
};

export default Calendar;
