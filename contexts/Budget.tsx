'use client'

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

type BudgetContextType = {
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

const budgetContextDefaultValues: BudgetContextType = {
  loading: true,
  setLoading: () => {},
}

const BudgetContext = createContext<BudgetContextType>(
  budgetContextDefaultValues,
)

export const useBudgetContext = () => {
  return useContext(BudgetContext)
}

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false)

  return (
    <BudgetContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}
