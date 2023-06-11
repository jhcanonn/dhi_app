import { Metadata } from 'next';
import { Calendar } from '@components';

export const metadata: Metadata = {
  title: 'DHI | Calendario multiple',
};

const CalendarPage = () => <Calendar />;

export default CalendarPage;
