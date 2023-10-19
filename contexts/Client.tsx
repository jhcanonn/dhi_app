'use client'

import { ClientDirectus, DataSheet, PanelsDirectus } from '@models'
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
  savingDataSheet: boolean
  setSavingDataSheet: Dispatch<SetStateAction<boolean>>
  clientInfo: ClientDirectus | null
  setClientInfo: Dispatch<SetStateAction<ClientDirectus | null>>
  dataSheetPanels: PanelsDirectus[]
  setDataSheetPanels: Dispatch<SetStateAction<PanelsDirectus[]>>
  dataSheets: DataSheet[]
  setDataSheets: Dispatch<SetStateAction<DataSheet[]>>
}

const clientContextDefaultValues: ClientContextType = {
  loadingInfo: true,
  setLoadingInfo: () => {},
  savingDataSheet: false,
  setSavingDataSheet: () => {},
  clientInfo: null,
  setClientInfo: () => {},
  dataSheetPanels: [],
  setDataSheetPanels: () => {},
  dataSheets: [],
  setDataSheets: () => {},
}

const ClientContext = createContext<ClientContextType>(
  clientContextDefaultValues,
)

export const useClientContext = () => {
  return useContext(ClientContext)
}

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [savingDataSheet, setSavingDataSheet] = useState(false)
  const [clientInfo, setClientInfo] = useState<ClientDirectus | null>(null)
  const [dataSheetPanels, setDataSheetPanels] = useState<PanelsDirectus[]>([])
  const [dataSheets, setDataSheets] = useState<DataSheet[]>([])

  return (
    <ClientContext.Provider
      value={{
        clientInfo,
        setClientInfo,
        savingDataSheet,
        setSavingDataSheet,
        loadingInfo,
        setLoadingInfo,
        dataSheetPanels,
        setDataSheetPanels,
        dataSheets,
        setDataSheets,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}
