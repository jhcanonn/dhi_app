'use client'

import { useCalendarContext } from '@contexts'
import { DhiEvent, EditFn } from '@models'
import { useEffect } from 'react'

type Props = {
  event: DhiEvent
  closeFn: () => void
}

const CalendarEventViewerAvoided = ({ event, closeFn }: Props) => {
  const { calendarScheduler } = useCalendarContext()
  const scheduler = calendarScheduler?.current?.scheduler!
  const editFn: EditFn = scheduler.triggerDialog!

  useEffect(() => {
    editFn(true, event)
    closeFn()
  }, [])

  return null
}

export default CalendarEventViewerAvoided
