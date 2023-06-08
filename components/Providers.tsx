'use client';

import { AsideProvider, MultipleCalendarProvider } from '@contexts';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <MultipleCalendarProvider>
      <AsideProvider>{children}</AsideProvider>
    </MultipleCalendarProvider>
  );
};

export default Providers;
