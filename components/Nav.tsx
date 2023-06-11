'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { useAsideContext } from '@contexts';
import { PAGE_PATH } from '@utils';

const Nav = () => {
  const { toggleVisible } = useAsideContext();

  return (
    <nav className="flex justify-between">
      <div className="flex w-full gap-3">
        <button className="layout-topbar-button" onClick={toggleVisible}>
          <i className="pi pi-bars" />
        </button>
        <Link
          href={PAGE_PATH.home}
          as={PAGE_PATH.home}
          className="flex items-center gap-2"
        >
          <Image
            className="object-contain"
            src="/assets/logo.svg"
            alt="DHI Logo"
            priority={true}
            width={80}
            height={80}
          />
        </Link>
      </div>
      <div className="flex w-full gap-2 items-center justify-end">
        <Button
          label="Cerrar sesión"
          className="p-button-rounded p-button-sm"
        />
        <Link href={PAGE_PATH.profile}>
          <Image
            className="rounded-full w-auto h-auto"
            src="/demo/avatar/profile.jpg"
            alt="Profile photo"
            width={45}
            height={45}
          />
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
