'use client'

import { ButtonBase } from '@mui/material'
import { Tooltip } from 'primereact/tooltip'
import { EventRendererProps } from 'react-scheduler-lib/types'
import { useDragAttributes, useFormattedEventInfo } from '@hooks'
import { colors } from '@utils'
import { DhiEvent } from '@models'
import { Tag } from 'primereact/tag'

const CalendarEvent = ({ event, onClick }: EventRendererProps) => {
  const customDragProps = useDragAttributes(event)
  const { formatedTime } = useFormattedEventInfo(event)

  const { event_id, state, pay, description, first_name, last_name } =
    event as DhiEvent
  const classEventId = 'event-' + event_id

  return (
    <>
      <Tooltip
        className='event-tooltip'
        target={`.${classEventId}`}
        position='top'
        content={formatedTime}
      />
      <ButtonBase
        style={{ backgroundColor: colors.bgEvent, color: 'black' }}
        onClick={onClick}
        {...customDragProps}
      >
        <div
          className={`calendar-event ${classEventId}`}
          style={{ border: `3px solid ${state?.color ?? 'black'}` }}
        >
          {pay && (
            <Tag className='calendar-tag' severity='danger' value={pay.code} />
          )}
          {description && (
            <Tag
              icon='pi pi-comment'
              severity='info'
              className='calendar-tag'
            />
          )}
          <Tag icon='pi pi-check' severity='success' className='calendar-tag' />
          <Tag
            icon='pi pi-exclamation-triangle'
            severity='warning'
            className='calendar-tag'
          />
          <span className='ml-[0.2rem]'>
            {first_name} {last_name}
          </span>
        </div>
      </ButtonBase>
    </>
  )
}

export default CalendarEvent
