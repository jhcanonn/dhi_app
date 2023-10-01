'use client'

import { useQuery } from '@apollo/client'
import { useClientContext } from '@contexts'
import { ClientDirectus } from '@models'
import { GET_CLIENT_BY_ID, PAGE_PATH, parseUrl, toTitleCase } from '@utils'
import { useRouter } from 'next/navigation'
import { PrimeIcons } from 'primereact/api'
import { Button } from 'primereact/button'
import { MenuItem } from 'primereact/menuitem'
import { Skeleton } from 'primereact/skeleton'
import { TabMenu } from 'primereact/tabmenu'
import { useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
  params: { id: string }
}

const ClientLayout = ({ children, params }: Props) => {
  const { id } = params
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const router = useRouter()
  const { setClientInfo, setLoadingInfo } = useClientContext()

  const { data, loading } = useQuery(GET_CLIENT_BY_ID, { variables: { id } })

  const goToPage = (pagePath: string) => router.push(pagePath)

  const items: MenuItem[] = [
    {
      label: 'Perfil',
      icon: PrimeIcons.USERS,
      command: () => goToPage(parseUrl(PAGE_PATH.clientDetail, { id })),
    },
    {
      label: 'Ficha',
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
        className={
          '[&_.p-highlight>a]:!border-b-4 [&_.p-highlight>a]:!border-brand [&_.p-highlight>a]:!text-brand [&_.p-tabmenuitem>a]:focus:!shadow-none'
        }
      />
      <section className='w-full max-w-[100rem] mx-auto px-4'>
        <div className='py-3 flex flex-col md:flex-row justify-between gap-2 mb-4'>
          <h2 className='text-2xl font-extrabold text-brand border-b-2 flex-grow'>
            {loading ? (
              <Skeleton height='2rem' borderRadius='16px'></Skeleton>
            ) : (
              toTitleCase(data.pacientes_by_id.full_name)
            )}
          </h2>
          <Button
            label={'Pagar'}
            type='button'
            severity='success'
            rounded
            onClick={() => goToPage(PAGE_PATH.finance)}
            className='px-4 py-1 font-bold text-md'
          />
        </div>
        {children}
      </section>
    </>
  )
}

export default ClientLayout
