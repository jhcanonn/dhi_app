'use client'

import { ButtonBase, Menu, MenuItem } from '@mui/material'
import { Tooltip } from 'primereact/tooltip'
import { EventRendererProps } from 'react-scheduler-lib/types'
import { useDragAttributes, useFormattedEventInfo } from '@hooks'
import { DHI_SESSION, colors, directusAppointmentMapper } from '@utils'
import { DhiEvent, EventState } from '@models'
import { Tag } from 'primereact/tag'
import { useState } from 'react'
import { EventStateItem } from '@components/molecules'
import { useCalendarContext, useGlobalContext } from '@contexts'
import { useCookies, Cookies } from 'react-cookie'
import { editAppointment, refreshToken } from '@utils/api'

const CalendarEvent = ({ event, onClick }: EventRendererProps) => {
  const customDragProps = useDragAttributes(event)
  const { formatedTime } = useFormattedEventInfo(event)
  const { calendarScheduler } = useCalendarContext()
  const { setEvents } = useGlobalContext()
  const [cookies] = useCookies([DHI_SESSION])

  const {
    event_id,
    state,
    pay,
    description,
    first_name,
    last_name,
    eventStates,
  } = event as DhiEvent
  const classEventId = 'event-' + event_id
  const scheduler = calendarScheduler?.current?.scheduler

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleRightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleDeleteItem = () => {
    console.log('Deleted Item!')
  }

  const updateDirectusEvent = async (e: DhiEvent) => {
    const appointment = directusAppointmentMapper(e)
    const access_token = await refreshToken(new Cookies(cookies))
    await editAppointment(+e.event_id, appointment, access_token)
  }

  const handleClickItem = async (es: EventState) => {
    const newEvent = event as DhiEvent
    newEvent.state = es
    scheduler?.confirmEvent(newEvent, 'edit')
    setEvents((preEvents) => [...preEvents, newEvent])
    setAnchorEl(null)
    await updateDirectusEvent(newEvent)
  }

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
        onContextMenu={handleRightClick}
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
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {eventStates?.map((option) => (
          <MenuItem onClick={() => handleClickItem(option)}>
            <EventStateItem {...option} />
          </MenuItem>
        ))}
        <MenuItem onClick={handleDeleteItem}>Eliminar</MenuItem>
      </Menu>
    </>
  )
}

export default CalendarEvent
