'use client'

import { ButtonBase } from '@mui/material'
import { Tooltip } from 'primereact/tooltip'
import { EventRendererProps } from 'react-scheduler-lib/types'
import { useDragAttributes, useFormattedEventInfo } from '@hooks'
import { colors } from '@utils'
import { DhiEvent } from '@models'
import { Tag } from 'primereact/tag'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'

const CalendarEvent = ({ event, onClick }: EventRendererProps) => {
  const customDragProps = useDragAttributes(event)
  const { formatedTime } = useFormattedEventInfo(event)

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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event)
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
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
        onContextMenu={handleClick}
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
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {eventStates?.map((p) => (
          <MenuItem onClick={handleClose}>{p.name}</MenuItem>
        ))}
        <MenuItem onClick={handleClose}>Eliminar</MenuItem>
      </Menu>
    </>
  )
}

export default CalendarEvent
