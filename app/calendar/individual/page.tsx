import { Metadata } from 'next';
import { IndividualCalendar } from '@components';

export const metadata: Metadata = {
  title: 'DHI | Calendario individual',
};

const IndividualCalendarPage = () => <IndividualCalendar />;

export default IndividualCalendarPage;
