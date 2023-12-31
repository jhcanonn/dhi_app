'use client'

import {
  DataSheetAccordion,
  MenuDataSheet,
  MenuExamsPrescription,
  MenuFiles,
  MenuImages,
  UploadProfileImage,
} from '@components/organisms'
import ComingSoon from './ComingSoon'
import { useState } from 'react'
import { Card } from 'primereact/card'
import { TabMenu } from 'primereact/tabmenu'
import { MenuItem } from 'primereact/menuitem'
import { PrimeIcons } from 'primereact/api'
import { useClientContext } from '@contexts'
import { Divider } from 'primereact/divider'
import { useSearchParams } from 'next/navigation'

const ClientDataSheet = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const { clientInfo } = useClientContext()
  const searchParams = useSearchParams()

  const items: MenuItem[] = [
    {
      label: 'Historial',
      icon: PrimeIcons.LIST,
    },
    {
      label: 'Próximas citas',
      icon: PrimeIcons.CALENDAR,
    },
    {
      label: 'Recetas y exámenes',
      icon: PrimeIcons.BOOK,
    },
    {
      label: 'Imágenes',
      icon: PrimeIcons.IMAGES,
    },
    {
      label: 'Archivos',
      icon: PrimeIcons.FILE,
    },
  ]

  const menuSwitch = (index: number) => {
    switch (index) {
      case 0:
        return <MenuDataSheet />
      case 1:
        return <ComingSoon />
      case 2:
        return <MenuExamsPrescription />
      case 3:
        return <MenuImages />
      case 4:
        return <MenuFiles />
    }
  }

  return (
    <div className='flex flex-col'>
      <Card className='custom-table-card'>
        <div className='flex flex-row justify-between'>
          <TabMenu
            model={items}
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            className={'custom-tab-menu [&_.p-tabmenu-nav]:flex-wrap text-sm'}
          />
          <div className='w-fit'>
            <UploadProfileImage clientInfo={clientInfo} />
          </div>
        </div>
        {menuSwitch(activeIndex)}
      </Card>
      <Divider align='center' className='[&_.p-divider-content]:bg-transparent'>
        <h2 className='text-2xl font-extrabold text-brand bg-surfaceGround px-2'>
          Nueva atención
        </h2>
      </Divider>
      <Card className='custom-table-card'>
        <DataSheetAccordion serviceId={searchParams.get('serviceid')} />
      </Card>
    </div>
  )
}

export default ClientDataSheet
