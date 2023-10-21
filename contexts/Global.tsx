'use client'

import {
  Box,
  Country,
  DhiEvent,
  Holiday,
  PanelsDirectus,
  Professional,
  User,
} from '@models'
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

type GlobalContextType = {
  events: DhiEvent[]
  setEvents: Dispatch<SetStateAction<DhiEvent[]>>
  professionals: Professional[]
  setProfessionals: Dispatch<SetStateAction<Professional[]>>
  boxes: Box[]
  setBoxes: Dispatch<SetStateAction<Box[]>>
  user: User | null
  setUser: Dispatch<User | null>
  holidays: Holiday[]
  setHolidays: Dispatch<Holiday[]>
  countries: Country[]
  setCountries: Dispatch<Country[]>
  panels: PanelsDirectus[]
  setPanels: Dispatch<SetStateAction<PanelsDirectus[]>>
}

const globalContextDefaultValues: GlobalContextType = {
  events: [],
  setEvents: () => {},
  professionals: [],
  setProfessionals: () => {},
  boxes: [],
  setBoxes: () => {},
  user: null,
  setUser: () => {},
  holidays: [],
  setHolidays: () => {},
  countries: [],
  setCountries: () => {},
  panels: [],
  setPanels: () => {},
}

const GlobalContext = createContext<GlobalContextType>(
  globalContextDefaultValues,
)

export const useGlobalContext = () => {
  return useContext(GlobalContext)
}

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<DhiEvent[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [boxes, setBoxes] = useState<Box[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [panels, setPanels] = useState<PanelsDirectus[]>([])

  return (
    <GlobalContext.Provider
      value={{
        events,
        setEvents,
        professionals,
        setProfessionals,
        boxes,
        setBoxes,
        user,
        setUser,
        holidays,
        setHolidays,
        countries,
        setCountries,
        panels,
        setPanels,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
