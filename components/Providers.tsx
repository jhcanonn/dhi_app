'use client';

import { AsideProvider, CalendarProvider } from '@contexts';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CalendarProvider>
      <AsideProvider>{children}</AsideProvider>
    </CalendarProvider>
  );
};

export default Providers;
