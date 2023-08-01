'use client'

import { Box, DhiEvent, Professional } from '@models'
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
}

const globalContextDefaultValues: GlobalContextType = {
  events: EVENTS,
  setEvents: () => {},
  professionals: [],
  setProfessionals: () => {},
  boxes: [],
  setBoxes: () => {},
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

  return (
    <GlobalContext.Provider
      value={{
        events,
        setEvents,
        professionals,
        setProfessionals,
        boxes,
        setBoxes,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
