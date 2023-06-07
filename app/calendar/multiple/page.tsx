import { Metadata } from 'next';
import { MultipleCalendar } from '@components';

export const metadata: Metadata = {
  title: 'DHI | Calendario multiple',
};

const MultipleCalendarPage = () => {
  return <MultipleCalendar />;
};

export default MultipleCalendarPage;
