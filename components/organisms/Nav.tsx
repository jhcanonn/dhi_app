'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from 'primereact/button'
import { useAsideContext, useGlobalContext } from '@contexts'
import { Cookies, withCookies } from 'react-cookie'
import { useQuery } from '@apollo/client'
import { directusSystemClient } from '@components/templates/Providers'
import { Avatar } from 'primereact/avatar'
import { classNames as cx } from 'primereact/utils'
import { useEffect } from 'react'
import { getPanelsFromDirectus, logout, refreshToken } from '@utils/api'
import { PanelsDirectus } from '@models'
import { generateURLAssetsWithToken } from '@utils/url-access-token'
import { useGoTo } from '@hooks'
import { GET_CIE_10, GET_USER_ME, LocalStorageTags, PAGE_PATH } from '@utils'

const Nav = ({ cookies }: { cookies: Cookies }) => {
  const { goToPage } = useGoTo()
  const { setUser, setPanels } = useGlobalContext()
  const { toggleVisible } = useAsideContext()

  const { data, loading } = useQuery(GET_USER_ME, {
    client: directusSystemClient,
  })

  const { refetch: refetchCie10 } = useQuery(GET_CIE_10)

  const handleLogout = async () => {
    await logout(cookies)
    goToPage(PAGE_PATH.login)
  }

  const getPanels = async () => {
    const access_token = await refreshToken(cookies)
    const panels: PanelsDirectus[] = await getPanelsFromDirectus(access_token)
    setPanels(panels)
  }

  const getCie10 = async () => {
    const lsCie10 = window.localStorage.getItem(LocalStorageTags.CIE10)
    if (!lsCie10) {
      const cie10Data = await refetchCie10()
      window.localStorage.setItem(
        LocalStorageTags.CIE10,
        JSON.stringify(cie10Data.data.cie_10),
      )
    }
  }

  useEffect(() => {
    if (!loading) setUser(data.users_me)
  }, [data])

  useEffect(() => {
    getPanels()
    getCie10()
  }, [])

  return (
    <nav className='flex justify-between items-center h-full'>
      <div className='flex w-full gap-3'>
        <button className='layout-topbar-button' onClick={toggleVisible}>
          <i className='pi pi-bars' />
        </button>
        <Link
          href={PAGE_PATH.calendar}
          as={PAGE_PATH.calendar}
          className='flex items-center gap-2'
        >
          <Image
            className='object-contain'
            src='/assets/logo.svg'
            alt='DHI Logo'
            priority={true}
            width={80}
            height={80}
          />
        </Link>
      </div>
      <div className='flex w-full gap-2 items-center justify-end'>
        <Button
          label='Cerrar sesión'
          className='p-button-rounded p-button-sm bg-brand border-brand'
          onClick={handleLogout}
        />
        <Link href={PAGE_PATH.profile} className='h-[3rem]'>
          <Avatar
            image={
              !loading && data?.users_me.avatar
                ? generateURLAssetsWithToken(data.users_me.avatar?.id, {
                    quality: '15',
                  })
                : undefined
            }
            label={
              !loading && data?.users_me.first_name
                ? data.users_me.first_name.slice(0, 1)
                : undefined
            }
            className={cx('mr-2 !rounded-full', {
              '!bg-brand text-white': !loading,
            })}
            size='large'
            shape='circle'
          />
        </Link>
      </div>
    </nav>
  )
}

export default withCookies(Nav)
