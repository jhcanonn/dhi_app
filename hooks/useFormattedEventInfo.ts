import { format } from 'date-fns';
import { useCalendarContext } from '@contexts';
import { ProcessedEvent } from '@aldabil/react-scheduler/types';

export const useFormattedEventInfo = ({ start, end }: ProcessedEvent) => {
  const { multipleCalendarScheduler } = useCalendarContext();

  const scheduler = multipleCalendarScheduler?.current?.scheduler;
  const hFormat = scheduler?.hourFormat === '12' ? 'hh:mm a' : 'HH:mm';
  const formatedTime = `${format(start, hFormat, {
    locale: scheduler?.locale,
  })} - ${format(end, hFormat, { locale: scheduler?.locale })}`;

  return { formatedTime };
};
