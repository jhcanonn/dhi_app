'use client'

import { ClientDirectus, PanelsDirectus } from '@models'
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

type ClientContextType = {
  loadingInfo: boolean
  setLoadingInfo: Dispatch<SetStateAction<boolean>>
  clientInfo: ClientDirectus | null
  setClientInfo: Dispatch<SetStateAction<ClientDirectus | null>>
  dataSheetPanels: PanelsDirectus[]
  setDataSheetPanels: Dispatch<SetStateAction<PanelsDirectus[]>>
}

const clientContextDefaultValues: ClientContextType = {
  loadingInfo: true,
  setLoadingInfo: () => {},
  clientInfo: null,
  setClientInfo: () => {},
  dataSheetPanels: [],
  setDataSheetPanels: () => {},
}

const ClientContext = createContext<ClientContextType>(
  clientContextDefaultValues,
)

export const useClientContext = () => {
  return useContext(ClientContext)
}

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [clientInfo, setClientInfo] = useState<ClientDirectus | null>(null)
  const [dataSheetPanels, setDataSheetPanels] = useState<PanelsDirectus[]>([])

  return (
    <ClientContext.Provider
      value={{
        clientInfo,
        setClientInfo,
        loadingInfo,
        setLoadingInfo,
        dataSheetPanels,
        setDataSheetPanels,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}
