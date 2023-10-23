'use client'

import { useState } from 'react'
import { Card } from 'primereact/card'
import { TabMenu } from 'primereact/tabmenu'
import { MenuItem } from 'primereact/menuitem'
import { PrimeIcons } from 'primereact/api'
import {
  DataSheetAccordion,
  MenuDataSheet,
  UploadProfileImage,
} from '@components/organisms'
import { useClientContext } from '@contexts'
import { Divider } from 'primereact/divider'
import ComingSoon from './ComingSoon'

const ClientDataSheet = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const { clientInfo } = useClientContext()

  const items: MenuItem[] = [
    {
      label: 'Historial',
      icon: PrimeIcons.BOOK,
    },
    {
      label: 'Próximas citas',
      icon: PrimeIcons.CALENDAR,
    },
    {
      label: 'Recetas y exámenes',
      icon: PrimeIcons.FILE,
    },
    {
      label: 'Imágenes y archivos',
      icon: PrimeIcons.IMAGES,
    },
    {
      label: 'Repositorio de archivos',
      icon: PrimeIcons.FOLDER,
    },
    {
      label: 'Consentimientos',
      icon: PrimeIcons.PAPERCLIP,
    },
  ]

  const menuSwitch = (index: number) => {
    switch (index) {
      case 0:
        return <MenuDataSheet />
      case 1:
        return <ComingSoon />
      case 2:
        return <ComingSoon />
      case 3:
        return <ComingSoon />
      case 4:
        return <ComingSoon />
      case 5:
        return <ComingSoon />
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
            className={'custom-tab-menu text-sm'}
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
        <DataSheetAccordion />
      </Card>
    </div>
  )
}

export default ClientDataSheet
