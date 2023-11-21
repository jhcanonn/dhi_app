'use client'

import {
  CLIENT_PAGE_CRUD,
  CLIENT_PAGE_TAB,
  GET_CLIENT_BY_ID,
  PAGE_PATH,
  getCurrencyCOP,
  parseUrl,
  toTitleCase,
} from '@utils'
import { useQuery } from '@apollo/client'
import { useClientContext } from '@contexts'
import { ClientDirectus } from '@models'
import { PrimeIcons } from 'primereact/api'
import { Button } from 'primereact/button'
import { MenuItem } from 'primereact/menuitem'
import { Skeleton } from 'primereact/skeleton'
import { TabMenu } from 'primereact/tabmenu'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ScrollTop } from 'primereact/scrolltop'
import { useGoTo } from '@hooks'
import { ExtraDataDetail } from '@components/organisms'

type Props = {
  children: React.ReactNode
  params: { id: string }
}

const ClientLayout = ({ children, params }: Props) => {
  const { id } = params
  const pathname = usePathname()
  const arr = pathname.split('/')
  let lastItem = arr[arr.length - 1]
  lastItem = CLIENT_PAGE_CRUD.includes(lastItem)
    ? arr[arr.length - 2]
    : lastItem
  const tabIndex = CLIENT_PAGE_TAB.indexOf(lastItem) + 1

  const [activeIndex, setActiveIndex] = useState<number>(tabIndex)
  const { clientInfo, setClientInfo, setLoadingInfo } = useClientContext()
  const { goToPage } = useGoTo()

  const { data, loading } = useQuery(GET_CLIENT_BY_ID, { variables: { id } })

  const items: MenuItem[] = [
    {
      label: 'Perfil',
      icon: PrimeIcons.USER,
      command: () => goToPage(parseUrl(PAGE_PATH.clientDetail, { id })),
    },
    {
      label: 'Histórico citas',
      icon: PrimeIcons.SERVER,
      command: () =>
        goToPage(parseUrl(PAGE_PATH.clientHistorySchedule, { id })),
    },
    {
      label: 'Atenciones',
      icon: PrimeIcons.BOOK,
      command: () => goToPage(parseUrl(PAGE_PATH.clientDataSheet, { id })),
    },
    {
      label: 'Galería',
      icon: PrimeIcons.IMAGES,
      command: () => goToPage(parseUrl(PAGE_PATH.clientGallery, { id })),
    },
    {
      label: 'Presupuesto',
      icon: PrimeIcons.DOLLAR,
      command: () => goToPage(parseUrl(PAGE_PATH.clientBudget, { id })),
    },
  ]

  useEffect(() => {
    !loading && setClientInfo(data.pacientes_by_id as ClientDirectus)
    setLoadingInfo(loading)
  }, [data])

  return (
    <>
      <TabMenu
        model={items}
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        className={'custom-tab-menu custom-tab-menu-fixed'}
      />
      <section className='w-full max-w-[100rem] mx-auto px-4 custom-section-content'>
        <div className='py-3 flex flex-col md:flex-row justify-between gap-2'>
          <h2 className='text-2xl font-extrabold text-brand border-b-2 flex-grow'>
            {loading ? (
              <Skeleton height='2rem' borderRadius='16px'></Skeleton>
            ) : (
              toTitleCase(data.pacientes_by_id.full_name)
            )}
          </h2>
          <Button
            label={`NP:1, Deuda: ${getCurrencyCOP(0)}`}
            type='button'
            severity='danger'
            onClick={() => goToPage(parseUrl(PAGE_PATH.finance, { id }))}
            className='px-4 py-1 font-bold text-md'
          />
          {lastItem !== 'finance' && (
            <Button
              label={'Pagar'}
              type='button'
              severity='success'
              onClick={() => goToPage(parseUrl(PAGE_PATH.finance, { id }))}
              className='px-4 py-1 font-bold text-md'
            />
          )}
        </div>
        {activeIndex !== 0 && <ExtraDataDetail clientInfo={clientInfo} />}
        <section className='my-4'>{children}</section>
      </section>
      <ScrollTop />
    </>
  )
}

export default ClientLayout
