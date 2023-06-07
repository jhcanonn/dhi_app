'use client';

import { useRef, useState } from 'react';
import es from 'date-fns/locale/es';
import { Scheduler } from '@aldabil/react-scheduler';
import {
  DefaultRecourse,
  EventRendererProps,
  ProcessedEvent,
  SchedulerHelpers,
  SchedulerRef,
} from '@aldabil/react-scheduler/types';
import {
  EVENTS,
  PROFESSIONALS,
  MultipleCalendarMode,
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
import { Button } from '@mui/material';

const MultipleCalendar = () => {
  const calendarRef = useRef<SchedulerRef>(null);
  const [mode, setMode] = useState<MultipleCalendarMode>(
    MultipleCalendarMode.DEFAULT
  );

  const handlerCustomHeader = (resource: DefaultRecourse) => (
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

  return (
    <section className="scheduler grow">
      <div style={{ textAlign: 'center' }}>
        <span>Resource View Mode: </span>
        <Button
          color={mode === MultipleCalendarMode.DEFAULT ? 'primary' : 'inherit'}
          variant={mode === MultipleCalendarMode.DEFAULT ? 'contained' : 'text'}
          size="small"
          onClick={() => {
            setMode(MultipleCalendarMode.DEFAULT);
            calendarRef.current?.scheduler?.handleState(
              MultipleCalendarMode.DEFAULT,
              'resourceViewMode'
            );
          }}
        >
          Default
        </Button>
        <Button
          color={mode === MultipleCalendarMode.TABS ? 'primary' : 'inherit'}
          variant={mode === MultipleCalendarMode.TABS ? 'contained' : 'text'}
          size="small"
          onClick={() => {
            setMode(MultipleCalendarMode.TABS);
            calendarRef.current?.scheduler?.handleState(
              MultipleCalendarMode.TABS,
              'resourceViewMode'
            );
          }}
        >
          Tabs
        </Button>
      </div>
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
