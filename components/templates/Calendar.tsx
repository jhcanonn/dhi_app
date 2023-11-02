'use client'

import es from 'date-fns/locale/es'
import { ReactNode, useEffect, useRef } from 'react'
import { Scheduler } from 'react-scheduler-lib'
import {
  CellRenderedProps,
  EventRendererProps,
  SchedulerHelpers,
  SchedulerRef,
} from 'react-scheduler-lib/types'
import {
  GET_BOXES,
  GET_PROFESSIONALS,
  calendarFieldsMapper,
  calendarMonth,
  calendarTranslations,
  boxesMapper,
  professionalsMapper,
  GET_EVENT_STATE,
  eventStateMapper,
  paysMapper,
  ROLES,
  getOnlyDate,
  colors,
  dhiAppointmentMapper,
  directusAppointmentMapper,
  calendarWeek,
  calendarDay,
  LocalStorageTags,
} from '@utils'
import {
  CalendarEditor,
  CalendarEvent,
  CalendarEventViewerAvoided,
} from '@components/organisms'
import { CalendarHeader } from '@components/molecules'
import {
  AppointmentQuery,
  BoxDirectus,
  CalendarType,
  DhiEvent,
  DhiResource,
  EventStateDirectus,
  PaysDirectus,
  ProfessionalDirectus,
  ResourceType,
  ViewMode,
} from '@models'
import { useCalendarContext, useGlobalContext } from '@contexts'
import { useGetResources, withToast } from '@hooks'
import { useQuery } from '@apollo/client'
import { ProgressSpinner } from 'primereact/progressspinner'
import { GET_APPOINTMENTS, PAYS } from '@utils/queries'
import {
  editAppointment,
  getCountries,
  getHolidays,
  refreshToken,
} from '@utils/api'
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns'
import moment from 'moment'
import { Cookies, withCookies } from 'react-cookie'

type Props = {
  cookies: Cookies
  showError: (summary: ReactNode, detail: ReactNode) => void
}

const Calendar = ({ cookies, showError }: Props) => {
  const calendarRef = useRef<SchedulerRef>(null)
  const {
    events,
    user,
    holidays,
    countries,
    setEvents,
    setHolidays,
    setCountries,
    setProfessionals,
    setBoxes,
  } = useGlobalContext()
  const {
    setCalendarScheduler,
    calendarType,
    resourceType,
    resourceMode,
    view,
    currentDate,
    startDate,
    endDate,
    eventStates,
    setView,
    setCurrentDate,
    setStartDate,
    setEndDate,
    setSelectedProfessional,
    setSelectedProfessionals,
    setSelectedBox,
    setSelectedBoxes,
    setEventStates,
    setPays,
  } = useCalendarContext()

  const { data: eventStateFetch, loading: eventStateLoading } =
    useQuery(GET_EVENT_STATE)

  const { data: paysFetch, loading: paysLoading } = useQuery(PAYS)

  const { data: professionalsFetch, loading: professionalsLoading } =
    useQuery(GET_PROFESSIONALS)

  const { data: boxesFetch, loading: boxesLoading } = useQuery(GET_BOXES)

  const { loading: appointmentsLoading, refetch: appointmentRefetch } =
    useQuery(GET_APPOINTMENTS)

  const isProfessionalUser = user?.role.id === ROLES.dhi_profesional
  const fetchingFromDirectus =
    eventStateLoading &&
    paysLoading &&
    professionalsLoading &&
    boxesLoading &&
    appointmentsLoading

  const resources = useGetResources(
    calendarType === CalendarType.INDIVIDUAL,
    resourceType === ResourceType.PROFESSIONAL,
  )

  const fetchHolidays = () => {
    const lsH = window.localStorage.getItem(LocalStorageTags.HOLIDAYS)
    if (!lsH) {
      getHolidays(new Date().getFullYear()).then((h) => {
        window.localStorage.setItem(
          LocalStorageTags.HOLIDAYS,
          JSON.stringify(h),
        )
        setHolidays(h)
      })
    } else setHolidays(JSON.parse(lsH))
  }

  const fetchCountries = () => {
    const lsC = window.localStorage.getItem(LocalStorageTags.COUNTRIES)
    if (!lsC) {
      getCountries().then((c) => {
        window.localStorage.setItem(
          LocalStorageTags.COUNTRIES,
          JSON.stringify(c),
        )
        setCountries(c)
      })
    } else setCountries(JSON.parse(lsC))
  }

  const handleCustomHeader = (resource: DhiResource) => (
    <CalendarHeader {...resource} />
  )

  const handleCustomViewer = (event: DhiEvent, closeFn: () => void) => (
    <CalendarEventViewerAvoided event={event} closeFn={closeFn} />
  )

  const handleCustomEditor = (schedulerHelpers: SchedulerHelpers) => (
    <CalendarEditor scheduler={schedulerHelpers} />
  )

  const handleCustomEvent = (evetProps: EventRendererProps) => (
    <CalendarEvent {...evetProps} />
  )

  const handleSelectedDateChange = (date: Date) => {
    setCurrentDate(date)
    switch (calendarRef.current?.scheduler.view) {
      case ViewMode.DAY:
        setStartDate(new Date(getOnlyDate(date) + 'T00:00:00'))
        setEndDate(new Date(getOnlyDate(date) + 'T23:59:59'))
        break
      case ViewMode.WEEK:
        setStartDate(startOfWeek(date, { weekStartsOn: 1 }))
        setEndDate(endOfWeek(date, { weekStartsOn: 1 }))
        break
      case ViewMode.MONTH:
        setStartDate(startOfMonth(date))
        setEndDate(endOfMonth(date))
        break
    }
  }

  const fetchAppointments = async () => {
    const start = startDate?.toISOString()
    const end = endDate?.toISOString()
    calendarRef.current?.scheduler.handleState(true, 'loading')
    const res = await appointmentRefetch({ start, end })
    const resAppointments: AppointmentQuery[] = res?.data?.citas
    if (resAppointments?.length) {
      const appointments = resAppointments.map((c) =>
        dhiAppointmentMapper(c, countries, eventStates),
      )
      calendarRef.current?.scheduler.handleState(appointments, 'events')
      setEvents(appointments)
    }
    calendarRef.current?.scheduler.handleState(false, 'loading')
  }

  const updateAppointment = async (
    eventId: number,
    resourceId: number,
    start: Date,
  ) => {
    const currentEvent = events.find((e) => +e.event_id === eventId)
    if (currentEvent) {
      const eventCopy = { ...currentEvent }
      calendarRef.current?.scheduler.handleState(true, 'loading')
      const diff = moment(currentEvent.end).diff(moment(currentEvent.start))
      currentEvent.start = start
      currentEvent.end = moment(start).add(diff).toDate()
      currentEvent[`${resourceType.toString()}_id`] = resourceId
      const appointment = directusAppointmentMapper(currentEvent)
      try {
        const access_token = await refreshToken(cookies)
        await editAppointment(eventId, appointment, access_token)
        setEvents((preEvents) => [...preEvents, currentEvent])
      } catch (error: any) {
        calendarRef.current?.scheduler.confirmEvent(eventCopy, 'edit')
        showError(error.response.data.status, error.response.data.message)
      } finally {
        calendarRef.current?.scheduler.handleState(false, 'loading')
      }
    }
  }

  const cellRenderer = ({
    day,
    start,
    onClick,
    onDrop,
    ...props
  }: CellRenderedProps) => {
    const currentDate = getOnlyDate(new Date(day))
    const holiday = holidays?.find((h) => h.date.slice(0, 10) === currentDate)
    const disabled = holiday !== undefined
    const restProps: any = disabled ? {} : props
    return (
      <button
        style={{
          height: '100%',
          background: disabled ? colors.disabled : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={() => {
          if (disabled) return
          onClick()
        }}
        onDrop={async (e) => {
          onDrop(e)
          const eventId = +e.dataTransfer.getData('text')
          const resourceId = restProps[`${resourceType.toString()}_id`]
          await updateAppointment(eventId, resourceId, start)
        }}
        disabled={disabled}
        {...restProps}
      ></button>
    )
  }

  const headRenderer = (day: Date) => {
    const date = new Date(day)
    const currentDate = getOnlyDate(date)
    const holiday = holidays?.find((h) => h.date.slice(0, 10) === currentDate)
    if (!holiday) return null
    return (
      <p className='text-[0.7rem] leading-[0.7rem] text-center text-white font-bold'>
        <i>{holiday?.name}</i>
      </p>
    )
  }

  useEffect(() => {
    setCalendarScheduler(calendarRef)
    fetchHolidays()
    fetchCountries()
  }, [])

  useEffect(() => {
    const eventState = eventStateFetch?.estado_citas as EventStateDirectus[]
    if (eventState?.length) {
      const mappedEventState = eventStateMapper(eventState)
      setEventStates(mappedEventState)
    }
  }, [eventStateFetch])

  useEffect(() => {
    const pays = paysFetch?.estado_pago as PaysDirectus[]
    if (pays?.length) {
      const mappedPays = paysMapper(pays)
      setPays(mappedPays)
    }
  }, [paysFetch])

  useEffect(() => {
    let professionals =
      professionalsFetch?.profesionales as ProfessionalDirectus[]
    if (professionals?.length) {
      if (isProfessionalUser) {
        const roleProfessional = professionals.find(
          (p) => user && +p.id === +user?.profesional?.id,
        )
        professionals = roleProfessional ? [roleProfessional] : []
      }
      const mappedProfessionals = professionalsMapper(professionals)
      setProfessionals(mappedProfessionals)
      setSelectedProfessionals(mappedProfessionals)
      setSelectedProfessional(
        mappedProfessionals?.length ? mappedProfessionals[0] : null,
      )
    }
  }, [professionalsFetch])

  useEffect(() => {
    const boxes = boxesFetch?.salas as BoxDirectus[]
    if (boxes?.length) {
      const mappedBoxes = boxesMapper(boxes)
      setBoxes(mappedBoxes)
      setSelectedBoxes(mappedBoxes)
      setSelectedBox(mappedBoxes?.length ? mappedBoxes[0] : null)
    }
  }, [boxesFetch])

  useEffect(() => {
    handleSelectedDateChange(currentDate!)
  }, [view])

  useEffect(() => {
    countries?.length && eventStates?.length && fetchAppointments()
  }, [startDate, endDate, countries, eventStates])

  return (
    <section className='scheduler [&>div]:w-full flex justify-center grow px-1'>
      {fetchingFromDirectus ? (
        <ProgressSpinner />
      ) : (
        <Scheduler
          view='day'
          hourFormat='24'
          ref={calendarRef}
          month={resourceType === ResourceType.BOX ? calendarMonth : null}
          week={{ ...calendarWeek, cellRenderer, headRenderer }}
          day={{ ...calendarDay, cellRenderer, headRenderer }}
          translations={calendarTranslations}
          locale={es}
          events={events}
          resources={resources}
          resourceViewMode={resourceMode}
          resourceFields={calendarFieldsMapper(resourceType)}
          resourceHeaderComponent={handleCustomHeader}
          eventRenderer={handleCustomEvent}
          customViewer={handleCustomViewer}
          customEditor={handleCustomEditor}
          onSelectedDateChange={handleSelectedDateChange}
          onViewChange={(view: ViewMode) => setView(view)}
        />
      )}
    </section>
  )
}

export default withCookies(withToast(Calendar))
