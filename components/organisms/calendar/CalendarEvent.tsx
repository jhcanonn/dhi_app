'use client'

import { ButtonBase } from '@mui/material'
import { Tooltip } from 'primereact/tooltip'
import { EventRendererProps } from 'react-scheduler/src/lib/types'
import { useDragAttributes, useFormattedEventInfo } from '@hooks'
import { colors } from '@utils'
import { EventTags } from '@components/molecules'
import { DhiEvent } from '@models'

const CalendarEvent = ({ event, onClick }: EventRendererProps) => {
  const customDragProps = useDragAttributes(event)
  const { formatedTime } = useFormattedEventInfo(event)

  const { event_id, state, first_name, last_name } = event as DhiEvent
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
          <EventTags event={event} />
          <span className='font-bold'>
            {first_name} {last_name}
          </span>
          <span>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita,
            ipsam ratione ipsa magni nulla accusamus, dolorum omnis voluptatum
            voluptas laboriosam eos nemo tempora maxime unde quis ullam impedit
            non reiciendis?
          </span>
        </div>
      </ButtonBase>
    </>
  )
}

export default CalendarEvent
