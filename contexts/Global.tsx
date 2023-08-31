'use client'

import { Box, Country, DhiEvent, Holiday, Professional, User } from '@models'
import { EVENTS } from '@utils'
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
}

const globalContextDefaultValues: GlobalContextType = {
  events: EVENTS,
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
}

const GlobalContext = createContext<GlobalContextType>(
  globalContextDefaultValues,
)

export const useGlobalContext = () => {
  return useContext(GlobalContext)
}

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState(EVENTS)
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [boxes, setBoxes] = useState<Box[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [countries, setCountries] = useState<Country[]>([])

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
