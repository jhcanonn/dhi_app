'use client';

import { AsideProvider, CalendarProvider, GlobalProvider } from '@contexts';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalProvider>
      <CalendarProvider>
        <AsideProvider>{children}</AsideProvider>
      </CalendarProvider>
    </GlobalProvider>
  );
};

export default Providers;
