'use client';

import { createContext, useContext, useState } from 'react';

type AsideContextType = {
  visible: boolean;
  toggleVisible: () => void;
};

const asideContextDefaultValues: AsideContextType = {
  visible: false,
  toggleVisible: () => {},
};

const AsideContext = createContext<AsideContextType>(asideContextDefaultValues);

export const useAsideContext = () => {
  return useContext(AsideContext);
};

export const AsideProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <AsideContext.Provider value={{ visible, toggleVisible }}>
      {children}
    </AsideContext.Provider>
  );
};
