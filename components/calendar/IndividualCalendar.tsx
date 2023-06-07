'use client';

import { Scheduler } from '@aldabil/react-scheduler';
import { EVENTS, calendarWeek } from '@utils';

const IndividualCalendar = () => {
  return (
    <section className="scheduler grow">
      <Scheduler events={EVENTS} week={calendarWeek} />
    </section>
  );
};

export default IndividualCalendar;
