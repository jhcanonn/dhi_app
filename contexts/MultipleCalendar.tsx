'use client';

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { MultipleCalendarMode } from '@utils';
import { Store } from '@aldabil/react-scheduler/store/types';

type MultipleCalendarType = {
  mode: MultipleCalendarMode;
  setMode: Dispatch<SetStateAction<MultipleCalendarMode>>;
  scheduler: Store | null;
  setScheduler: Dispatch<SetStateAction<Store | null>>;
};

const multipleCalendarDefaultValues: MultipleCalendarType = {
  mode: MultipleCalendarMode.DEFAULT,
  setMode: () => {},
  scheduler: null,
  setScheduler: () => {},
};

const MultipleCalendar = createContext<MultipleCalendarType>(
  multipleCalendarDefaultValues
);

export const useMultipleCalendarContext = () => {
  return useContext(MultipleCalendar);
};

export const MultipleCalendarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState(MultipleCalendarMode.DEFAULT);
  const [scheduler, setScheduler] = useState<Store | null>(null);

  return (
    <>
      <MultipleCalendar.Provider
        value={{ mode, setMode, scheduler, setScheduler }}
      >
        {children}
      </MultipleCalendar.Provider>
    </>
  );
};
