'use client'

import { ClientDirectus, DataSheet } from '@models'
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
        dataSheets,
        setDataSheets,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}
