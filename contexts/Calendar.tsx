'use client'

import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'
import {
  Box,
  CalendarType,
  EventState,
  Pay,
  Professional,
  ResourceMode,
  ResourceType,
  ViewMode,
} from '@models'
import { SchedulerRef } from 'react-scheduler-lib/types'
import { useGlobalContext } from './Global'
import { ROLES, getOnlyDate } from '@utils'

type CalendarContextType = {
  calendarScheduler: RefObject<SchedulerRef> | null
  setCalendarScheduler: Dispatch<SetStateAction<RefObject<SchedulerRef> | null>>
  calendarType: CalendarType
  setCalendarType: Dispatch<SetStateAction<CalendarType>>
  resourceMode: ResourceMode
  setResourceMode: Dispatch<SetStateAction<ResourceMode>>
  resourceType: ResourceType
  setResourceType: Dispatch<SetStateAction<ResourceType>>
  selectedProfessional: Professional | null
  setSelectedProfessional: Dispatch<SetStateAction<Professional | null>>
  selectedProfessionals: Professional[]
  setSelectedProfessionals: Dispatch<SetStateAction<Professional[]>>
  selectedBox: Box | null
  setSelectedBox: Dispatch<SetStateAction<Box | null>>
  selectedBoxes: Box[]
  setSelectedBoxes: Dispatch<SetStateAction<Box[]>>
  eventStates: EventState[]
  setEventStates: Dispatch<SetStateAction<EventState[]>>
  pays: Pay[]
  setPays: Dispatch<SetStateAction<Pay[]>>
  view: ViewMode | null
  setView: Dispatch<SetStateAction<ViewMode | null>>
  currentDate: Date | null
  setCurrentDate: Dispatch<SetStateAction<Date | null>>
  startDate: Date | null
  setStartDate: Dispatch<SetStateAction<Date | null>>
  endDate: Date | null
  setEndDate: Dispatch<SetStateAction<Date | null>>
}

const calendarDefaultValues: CalendarContextType = {
  calendarScheduler: null,
  setCalendarScheduler: () => {},
  calendarType: CalendarType.MULTIPLE,
  setCalendarType: () => {},
  resourceMode: ResourceMode.DEFAULT,
  setResourceMode: () => {},
  resourceType: ResourceType.PROFESSIONAL,
  setResourceType: () => {},
  selectedProfessional: null,
  setSelectedProfessional: () => {},
  selectedProfessionals: [],
  setSelectedProfessionals: () => {},
  selectedBox: null,
  setSelectedBox: () => {},
  selectedBoxes: [],
  setSelectedBoxes: () => {},
  eventStates: [],
  setEventStates: () => {},
  pays: [],
  setPays: () => {},
  view: ViewMode.DAY,
  setView: () => {},
  currentDate: new Date(),
  setCurrentDate: () => {},
  startDate: new Date(getOnlyDate(new Date()) + 'T00:00:00'),
  setStartDate: () => {},
  endDate: new Date(getOnlyDate(new Date()) + 'T23:59:59'),
  setEndDate: () => {},
}

const Calendar = createContext<CalendarContextType>(calendarDefaultValues)

export const useCalendarContext = () => {
  return useContext(Calendar)
}

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { user } = useGlobalContext()
  const isProfessionalUser = user?.role.id === ROLES.dhi_profesional

  const [calendarScheduler, setCalendarScheduler] =
    useState<RefObject<SchedulerRef> | null>(null)
  // Toggle filters
  const [calendarType, setCalendarType] = useState(
    isProfessionalUser ? CalendarType.INDIVIDUAL : CalendarType.MULTIPLE,
  )
  const [resourceMode, setResourceMode] = useState(ResourceMode.DEFAULT)
  const [resourceType, setResourceType] = useState(ResourceType.PROFESSIONAL)
  // Professionals filters
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null)
  const [selectedProfessionals, setSelectedProfessionals] = useState<
    Professional[]
  >([])
  // Boxes filters
  const [selectedBox, setSelectedBox] = useState<Box | null>(null)
  const [selectedBoxes, setSelectedBoxes] = useState<Box[]>([])
  // EventStates and Pays
  const [eventStates, setEventStates] = useState<EventState[]>([])
  const [pays, setPays] = useState<Pay[]>([])
  // View and Start/End Dates
  const [view, setView] = useState<ViewMode | null>(ViewMode.DAY)
  const [currentDate, setCurrentDate] = useState<Date | null>(new Date())
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(getOnlyDate(new Date()) + 'T00:00:00'),
  )
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(getOnlyDate(new Date()) + 'T23:59:59'),
  )

  return (
    <Calendar.Provider
      value={{
        calendarScheduler,
        setCalendarScheduler,
        calendarType,
        setCalendarType,
        resourceMode,
        setResourceMode,
        resourceType,
        setResourceType,
        selectedProfessional,
        setSelectedProfessional,
        selectedProfessionals,
        setSelectedProfessionals,
        selectedBox,
        setSelectedBox,
        selectedBoxes,
        setSelectedBoxes,
        eventStates,
        setEventStates,
        pays,
        setPays,
        view,
        setView,
        currentDate,
        setCurrentDate,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
      }}
    >
      {children}
    </Calendar.Provider>
  )
}
