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
import { useGlobalContext } from './Global';

type CalendarContextType = {
  calendarScheduler: RefObject<SchedulerRef> | null;
  setCalendarScheduler: Dispatch<
    SetStateAction<RefObject<SchedulerRef> | null>
  >;
  calendarType: CalendarType;
  setCalendarType: Dispatch<SetStateAction<CalendarType>>;
  resourceMode: ResourceMode;
  setResourceMode: Dispatch<SetStateAction<ResourceMode>>;
  resourceType: ResourceType;
  setResourceType: Dispatch<SetStateAction<ResourceType>>;
  selectedProfessional: Professional | null;
  setSelectedProfessional: Dispatch<SetStateAction<Professional | null>>;
  selectedProfessionals: Professional[];
  setSelectedProfessionals: Dispatch<SetStateAction<Professional[]>>;
  selectedBox: Box | null;
  setSelectedBox: Dispatch<SetStateAction<Box | null>>;
  selectedBoxes: Box[];
  setSelectedBoxes: Dispatch<SetStateAction<Box[]>>;
};

const calendarDefaultValues: CalendarContextType = {
  calendarScheduler: null,
  setCalendarScheduler: () => {},
  calendarType: CalendarType.INDIVIDUAL,
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
  const { professionals, boxes } = useGlobalContext();

  const [calendarScheduler, setCalendarScheduler] =
    useState<RefObject<SchedulerRef> | null>(null);
  // Toggle filters
  const [calendarType, setCalendarType] = useState(CalendarType.INDIVIDUAL);
  const [resourceMode, setResourceMode] = useState(ResourceMode.DEFAULT);
  const [resourceType, setResourceType] = useState(ResourceType.PROFESSIONAL);
  // Professionals filters
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(
      professionals.length ? professionals[0] : null
    );
  const [selectedProfessionals, setSelectedProfessionals] =
    useState<Professional[]>(professionals);
  // Boxes filters
  const [selectedBox, setSelectedBox] = useState<Box | null>(
    boxes.length ? boxes[0] : null
  );
  const [selectedBoxes, setSelectedBoxes] = useState<Box[]>(boxes);

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
      }}
    >
      {children}
    </Calendar.Provider>
  );
};
