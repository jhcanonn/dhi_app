'use client';

import { AsideProvider } from '@contexts';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <AsideProvider>{children}</AsideProvider>;
};

export default Providers;
