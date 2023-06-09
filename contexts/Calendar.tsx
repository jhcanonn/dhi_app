'use client';

import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { ResourceMode, ResourceType } from '@models';
import { SchedulerRef } from '@aldabil/react-scheduler/types';

type CalendarType = {
  resourceMode: ResourceMode;
  setResourceMode: Dispatch<SetStateAction<ResourceMode>>;
  resourceType: ResourceType;
  setResourceType: Dispatch<SetStateAction<ResourceType>>;
  multipleCalendarScheduler: RefObject<SchedulerRef> | null;
  setMultipleCalendarScheduler: Dispatch<
    SetStateAction<RefObject<SchedulerRef> | null>
  >;
};

const calendarDefaultValues: CalendarType = {
  resourceMode: ResourceMode.DEFAULT,
  setResourceMode: () => {},
  resourceType: ResourceType.PROFESSIONAL,
  setResourceType: () => {},
  multipleCalendarScheduler: null,
  setMultipleCalendarScheduler: () => {},
};

const Calendar = createContext<CalendarType>(calendarDefaultValues);

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
  const [multipleCalendarScheduler, setMultipleCalendarScheduler] =
    useState<RefObject<SchedulerRef> | null>(null);

  return (
    <>
      <Calendar.Provider
        value={{
          resourceMode,
          setResourceMode,
          multipleCalendarScheduler,
          setMultipleCalendarScheduler,
          resourceType,
          setResourceType,
        }}
      >
        {children}
      </Calendar.Provider>
    </>
  );
};
