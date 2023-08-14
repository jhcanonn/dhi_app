'use client'

import es from 'date-fns/locale/es'
import { useEffect, useRef } from 'react'
import { Scheduler } from 'react-scheduler-lib'
import {
  EventRendererProps,
  ProcessedEvent,
  SchedulerHelpers,
  SchedulerRef,
} from 'react-scheduler-lib/types'
import {
  GET_BOXES,
  GET_PROFESSIONALS,
  calendarDay,
  calendarFieldsMapper,
  calendarMonth,
  calendarTranslations,
  calendarWeek,
  boxesMapper,
  professionalsMapper,
  GET_EVENT_STATE,
  eventStateMapper,
  paysMapper,
  // getOnlyDate,
  // colors,
} from '@utils'
import {
  CalendarEditor,
  CalendarEventViewer,
  CalendarEvent,
} from '@components/organisms'
import { CalendarHeader } from '@components/molecules'
import {
  BoxDirectus,
  CalendarType,
  DhiResource,
  EventStateDirectus,
  PaysDirectus,
  ProfessionalDirectus,
  ResourceType,
} from '@models'
import { useCalendarContext, useGlobalContext } from '@contexts'
import { useGetResources } from '@hooks'
import { useQuery } from '@apollo/client'
import { ProgressSpinner } from 'primereact/progressspinner'
import { PAYS } from '@utils/queries'
// import { useQuery as useReactQuery } from '@tanstack/react-query'
// import { getHolidays } from '@utils/api'

const Calendar = () => {
  const calendarRef = useRef<SchedulerRef>(null)
  const { events, setProfessionals, setBoxes } = useGlobalContext()
  const {
    setCalendarScheduler,
    calendarType,
    resourceType,
    resourceMode,
    setSelectedProfessional,
    setSelectedProfessionals,
    setSelectedBox,
    setSelectedBoxes,
    setEventStates,
    setPays,
  } = useCalendarContext()

  // const { data: holidaysFetch, isLoading: holidaysLoading } = useReactQuery(
  //   ['holidays'],
  //   getHolidays(new Date().getFullYear()),
  // )

  const { data: eventStateFetch, loading: eventStateLoading } =
    useQuery(GET_EVENT_STATE)

  const { data: paysFetch, loading: paysLoading } = useQuery(PAYS)

  const { data: professionalsFetch, loading: professionalsLoading } =
    useQuery(GET_PROFESSIONALS)

  const { data: boxesFetch, loading: boxesLoading } = useQuery(GET_BOXES)

  const fetchingFromDirectus =
    // holidaysLoading &&
    eventStateLoading && paysLoading && professionalsLoading && boxesLoading

  const resources = useGetResources(
    calendarType === CalendarType.INDIVIDUAL,
    resourceType === ResourceType.PROFESSIONAL,
  )

  const handleCustomHeader = (resource: DhiResource) => (
    <CalendarHeader {...resource} />
  )

  const handleCustomViewer = (event: ProcessedEvent, closeFn: () => void) => (
    <CalendarEventViewer event={event} closeFn={closeFn} />
  )

  const handleCustomEditor = (schedulerHelpers: SchedulerHelpers) => (
    <CalendarEditor scheduler={schedulerHelpers} />
  )

  const handleCustomEvent = (evetProps: EventRendererProps) => (
    <CalendarEvent {...evetProps} />
  )

  useEffect(() => {
    setCalendarScheduler(calendarRef)
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
    const professionals =
      professionalsFetch?.profesionales as ProfessionalDirectus[]
    if (professionals?.length) {
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

  return (
    <section className='scheduler [&>div]:w-full flex justify-center items-center grow px-1'>
      {fetchingFromDirectus ? (
        <ProgressSpinner />
      ) : (
        <Scheduler
          view='day'
          hourFormat='24'
          ref={calendarRef}
          month={resourceType === ResourceType.BOX ? calendarMonth : null}
          week={calendarWeek}
          day={calendarDay}
          // week={{
          //   weekDays: [0, 1, 2, 3, 4, 5, 6],
          //   weekStartOn: 1,
          //   startHour: 7,
          //   endHour: 19,
          //   step: 30,
          //   cellRenderer: ({ day, onClick, ...props }) => {
          //     const weekDay = getOnlyDate(new Date(day))
          //     const holiday = holidaysFetch?.find(
          //       (h) => h.date.slice(0, 10) === weekDay,
          //     )
          //     const disabled = holiday !== undefined
          //     const restProps = disabled ? {} : props
          //     return (
          //       <button
          //         style={{
          //           height: '100%',
          //           background: disabled ? colors.disabled : 'transparent',
          //           cursor: disabled ? 'not-allowed' : 'pointer',
          //         }}
          //         onClick={() => {
          //           if (disabled) return
          //           onClick()
          //         }}
          //         disabled={disabled}
          //         {...restProps}
          //       ></button>
          //     )
          //   },
          //   headRenderer: (day) => {
          //     const date = new Date(day)
          //     const weekDay = getOnlyDate(date)
          //     const holiday = holidaysFetch?.find(
          //       (h) => h.date.slice(0, 10) === weekDay,
          //     )
          //     return (
          //       <p className='text-[0.7rem] leading-[0.7rem] text-center text-gray-700 font-bold'>
          //         <i>{holiday?.name}</i>
          //       </p>
          //     )
          //   },
          // }}
          // day={{
          //   startHour: 7,
          //   endHour: 19,
          //   step: 30,
          //   cellRenderer: (props) => {
          //     const date = new Date(props.day)
          //     const day = getOnlyDate(date)
          //     const holiday = holidaysFetch?.find(
          //       (h: any) => h.date.slice(0, 10) === day,
          //     )
          //     console.log({ holiday })
          //     return <button {...props}>Day</button>
          //   },
          // }}
          translations={calendarTranslations}
          locale={es}
          events={events}
          resources={resources}
          resourceViewMode={resourceMode}
          resourceFields={calendarFieldsMapper(resourceType)}
          recourseHeaderComponent={handleCustomHeader}
          eventRenderer={handleCustomEvent}
          customViewer={handleCustomViewer}
          customEditor={handleCustomEditor}
        />
      )}
    </section>
  )
}

export default Calendar
