'use client'

import { ButtonBase, Menu, MenuItem } from '@mui/material'
import { Tooltip } from 'primereact/tooltip'
import { EventRendererProps } from 'react-scheduler-lib/types'
import { useDragAttributes, useFormattedEventInfo } from '@hooks'
import {
  BLOCK_BOX,
  DELETE_APPOINTMENT,
  DHI_SESSION,
  colors,
  directusAppointmentMapper,
} from '@utils'
import { DhiEvent, EventState } from '@models'
import { Tag } from 'primereact/tag'
import { useState } from 'react'
import { EventStateItem } from '@components/molecules'
import { useCalendarContext, useGlobalContext } from '@contexts'
import { useCookies, Cookies } from 'react-cookie'
import { editAppointment, refreshToken } from '@utils/api'
import { classNames as cx } from 'primereact/utils'
import { useMutation } from '@apollo/client'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

const CalendarEvent = ({ event, onClick }: EventRendererProps) => {
  const { formatedTime } = useFormattedEventInfo(event)
  const { calendarScheduler } = useCalendarContext()
  const { setEvents } = useGlobalContext()
  const [cookies] = useCookies([DHI_SESSION])
  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT)

  const {
    event_id,
    title,
    state,
    pay,
    description,
    first_name,
    last_name,
    eventStates,
  } = event as DhiEvent
  const classEventId = 'event-' + event_id
  const isBlock = state?.name === BLOCK_BOX
  const scheduler = calendarScheduler?.current?.scheduler

  const customDragProps = useDragAttributes(event, !isBlock)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const updateDirectusEvent = async (e: DhiEvent) => {
    const appointment = directusAppointmentMapper(e)
    const access_token = await refreshToken(new Cookies(cookies))
    await editAppointment(+e.event_id, appointment, access_token)
  }

  const handleDeleteAppointment = async () => {
    const updatedEvents = scheduler?.events.filter(
      (e) => e.event_id !== event_id,
    )
    scheduler?.handleState(updatedEvents, 'events')
    setEvents((preEvents) => preEvents.filter((e) => e.event_id !== event_id))
    await deleteAppointment({
      variables: {
        id: +event_id,
      },
    })
  }

  const handleDeleteItem = async () => {
    handleClose()
    if (isBlock) {
      await handleDeleteAppointment()
    } else {
      confirmDialog({
        tagKey: classEventId,
        message: 'Está seguro de eliminar la cita?',
        header: 'Confirmación',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        draggable: false,
        accept: async () => {
          await handleDeleteAppointment()
        },
      })
    }
  }

  const handleRightClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleClickItem = async (es: EventState) => {
    const newEvent = event as DhiEvent
    newEvent.state = es
    scheduler?.confirmEvent(newEvent, 'edit')
    setEvents((preEvents) => [...preEvents, newEvent])
    setAnchorEl(null)
    await updateDirectusEvent(newEvent)
  }

  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <Tooltip
        className='event-tooltip'
        target={`.${classEventId}`}
        position='top'
        content={formatedTime}
      />
      <ConfirmDialog tagKey={classEventId} />
      <ButtonBase
        style={{
          backgroundColor: isBlock
            ? colors.bgEventBlock
            : colors.bgEventDefault,
          color: isBlock ? 'white' : 'black',
        }}
        className={cx({ 'font-bold': isBlock })}
        onClick={(e) => {
          if (isBlock) return
          onClick && onClick(e)
        }}
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
            {title ? title : `${first_name} ${last_name}`}
          </span>
        </div>
      </ButtonBase>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
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
        {!isBlock &&
          eventStates
            ?.filter((es) => es.name !== BLOCK_BOX)
            ?.map((option) => (
              <MenuItem onClick={() => handleClickItem(option)}>
                <EventStateItem {...option} />
              </MenuItem>
            ))}
        <MenuItem onClick={handleDeleteItem}>
          Eliminar {isBlock && BLOCK_BOX}
        </MenuItem>
      </Menu>
    </>
  )
}

export default CalendarEvent
