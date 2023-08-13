import { format } from 'date-fns'
import { useCalendarContext } from '@contexts'
import { ProcessedEvent } from 'react-scheduler/src/lib/types'

export const useFormattedEventInfo = ({ start, end }: ProcessedEvent) => {
  const { calendarScheduler } = useCalendarContext()

  const scheduler = calendarScheduler?.current?.scheduler
  const hFormat = scheduler?.hourFormat === '12' ? 'hh:mm a' : 'HH:mm'

  const formatedTime = (onlyTime: boolean = true) => {
    const formatString = (onlyTime ? '' : 'dd MMMM ') + hFormat
    return `${format(start, formatString, {
      locale: scheduler?.locale,
    })} - ${format(end, formatString, { locale: scheduler?.locale })}`
  }

  return {
    formatedTime: formatedTime(),
    formatedDateTime: formatedTime(false),
  }
}
