/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'primereact/button';
import { useAsideContext } from '@contexts';
import { DHI_SESSION, GET_USER_BY_ID, PAGE_PATH } from '@utils';
import { Cookies, withCookies } from 'react-cookie';
import { useQuery } from '@apollo/client';
import { directusSystemClient } from '@components/templates/Providers';
import { Avatar } from 'primereact/avatar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { classNames as cx } from 'primereact/utils';

const Nav = ({ userId, cookies }: { userId: string; cookies: Cookies }) => {
  const router = useRouter();
  const { toggleVisible } = useAsideContext();

  const { data, loading, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
    client: directusSystemClient,
  });

  const handleLogout = () => {
    cookies.remove(DHI_SESSION);
    router.push(PAGE_PATH.login);
  };

  useEffect(() => {
    refetch({ id: userId });
  }, [data]);

  return (
    <nav className="flex justify-between items-center h-full">
      <div className="flex w-full gap-3">
        <button className="layout-topbar-button" onClick={toggleVisible}>
          <i className="pi pi-bars" />
        </button>
        <Link
          href={PAGE_PATH.calendar}
          as={PAGE_PATH.calendar}
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
          className="p-button-rounded p-button-sm bg-brand border-brand"
          onClick={handleLogout}
        />
        <Link href={PAGE_PATH.profile} className="h-[3rem]">
          <Avatar
            image={
              !loading && data.users_by_id.avatar
                ? `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${data.users_by_id.avatar?.id}`
                : undefined
            }
            label={
              !loading && data.users_by_id.first_name
                ? data.users_by_id.first_name.slice(0, 1)
                : undefined
            }
            className={cx('mr-2 !rounded-full bg-transparent', {
              '!bg-brand text-white': !loading,
            })}
            size="large"
            shape="circle"
          />
        </Link>
      </div>
    </nav>
  );
};

export default withCookies(Nav);
