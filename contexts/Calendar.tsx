'use client';

import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import {
  Box,
  CalendarType,
  Professional,
  ResourceMode,
  ResourceType,
} from '@models';
import { SchedulerRef } from '@aldabil/react-scheduler/types';
import { BOXES, PROFESSIONALS } from '@utils';

type CalendarContextType = {
  resourceMode: ResourceMode;
  setResourceMode: Dispatch<SetStateAction<ResourceMode>>;
  resourceType: ResourceType;
  setResourceType: Dispatch<SetStateAction<ResourceType>>;
  calendarType: CalendarType;
  setCalendarType: Dispatch<SetStateAction<CalendarType>>;
  professionals: Professional[];
  setProfessionals: Dispatch<SetStateAction<Professional[]>>;
  boxes: Box[];
  setBoxes: Dispatch<SetStateAction<Box[]>>;
  calendarScheduler: RefObject<SchedulerRef> | null;
  setCalendarScheduler: Dispatch<
    SetStateAction<RefObject<SchedulerRef> | null>
  >;
};

const calendarDefaultValues: CalendarContextType = {
  resourceMode: ResourceMode.DEFAULT,
  setResourceMode: () => {},
  resourceType: ResourceType.PROFESSIONAL,
  setResourceType: () => {},
  calendarType: CalendarType.INDIVIDUAL,
  setCalendarType: () => {},
  professionals: PROFESSIONALS,
  setProfessionals: () => {},
  boxes: BOXES,
  setBoxes: () => {},
  calendarScheduler: null,
  setCalendarScheduler: () => {},
};

const Calendar = createContext<CalendarContextType>(calendarDefaultValues);

export const useCalendarContext = () => {
  return useContext(Calendar);
};

export const CalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [resourceMode, setResourceMode] = useState(ResourceMode.DEFAULT);
  const [resourceType, setResourceType] = useState(ResourceType.PROFESSIONAL);
  const [calendarType, setCalendarType] = useState(CalendarType.INDIVIDUAL);
  const [professionals, setProfessionals] = useState(PROFESSIONALS);
  const [boxes, setBoxes] = useState(BOXES);
  const [calendarScheduler, setCalendarScheduler] =
    useState<RefObject<SchedulerRef> | null>(null);

  return (
    <>
      <Calendar.Provider
        value={{
          resourceMode,
          setResourceMode,
          resourceType,
          setResourceType,
          calendarType,
          setCalendarType,
          professionals,
          setProfessionals,
          boxes,
          setBoxes,
          calendarScheduler,
          setCalendarScheduler,
        }}
      >
        {children}
      </Calendar.Provider>
    </>
  );
};
