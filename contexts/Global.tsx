'use client';

import { Box, DhiEvent, Professional, Service } from '@models';
import { BOXES, EVENTS, PROFESSIONALS, SERVICES } from '@utils';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

type GlobalContextType = {
  events: DhiEvent[];
  setEvents: Dispatch<SetStateAction<DhiEvent[]>>;
  professionals: Professional[];
  setProfessionals: Dispatch<SetStateAction<Professional[]>>;
  boxes: Box[];
  setBoxes: Dispatch<SetStateAction<Box[]>>;
  services: Service[];
  setServices: Dispatch<SetStateAction<Service[]>>;
};

const globalContextDefaultValues: GlobalContextType = {
  events: EVENTS,
  setEvents: () => {},
  professionals: PROFESSIONALS,
  setProfessionals: () => {},
  boxes: BOXES,
  setBoxes: () => {},
  services: SERVICES,
  setServices: () => {},
};

const GlobalContext = createContext<GlobalContextType>(
  globalContextDefaultValues
);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState(EVENTS);
  const [professionals, setProfessionals] = useState(PROFESSIONALS);
  const [boxes, setBoxes] = useState(BOXES);
  const [services, setServices] = useState(SERVICES);

  return (
    <GlobalContext.Provider
      value={{
        events,
        setEvents,
        professionals,
        setProfessionals,
        boxes,
        setBoxes,
        services,
        setServices,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
