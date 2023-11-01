'use client'

import { PrimeIcons } from 'primereact/api'
import { Sidebar } from 'primereact/sidebar'
import { SlideMenu } from 'primereact/slidemenu'
import { useAsideContext } from '@contexts'
import { useWindowHeight } from '@react-hook/window-size'
import { useRouter } from 'next/navigation'
import { PAGE_PATH } from '@utils'
import { goToPage } from '@utils/go-to'

const Aside = () => {
  const { visible, toggleVisible } = useAsideContext()
  const router = useRouter()
  const wh = useWindowHeight()

  const sideBarWidth = 320
  const slideMenuWidth = sideBarWidth - 43

  const asideItems = [
    {
      label: 'Agenda',
      icon: PrimeIcons.CALENDAR,
      items: [
        {
          label: 'Agenda Individual/Multiple',
          icon: PrimeIcons.CALENDAR,
          command: () => {
            toggleVisible()
            goToPage(PAGE_PATH.calendar, router)
          },
        },
        {
          separator: true,
        },
        {
          label: 'Agenda del día',
          icon: PrimeIcons.PLUS,
          command: () => {
            toggleVisible()
            goToPage(PAGE_PATH.dayCalendar, router)
          },
        },
        {
          label: 'Listado de citas',
          icon: PrimeIcons.LIST,
          command: () => {
            toggleVisible()
            goToPage(PAGE_PATH.dateListCalendar, router)
          },
        },
      ],
    },
    {
      label: 'Pacientes',
      icon: PrimeIcons.USERS,
      items: [
        {
          label: 'Lista de Pacientes',
          icon: PrimeIcons.USERS,
          command: () => {
            toggleVisible()
            goToPage(PAGE_PATH.clientList, router)
          },
        },
        {
          label: 'Galería',
          icon: PrimeIcons.IMAGES,
          command: () => {
            toggleVisible()
            goToPage(PAGE_PATH.gallery, router)
          },
        },
      ],
    },
    {
      label: 'CRM',
      icon: PrimeIcons.HEART,
      command: () => {
        toggleVisible()
        goToPage(PAGE_PATH.crm, router)
      },
    },
    {
      label: 'Finanzas',
      icon: PrimeIcons.DOLLAR,
      command: () => {
        toggleVisible()
        goToPage(PAGE_PATH.finance, router)
      },
    },
    {
      separator: true,
    },
    {
      label: 'Configuración',
      icon: PrimeIcons.COG,
      command: () => {
        toggleVisible()
        goToPage(PAGE_PATH.settings, router)
      },
    },
  ]

  return (
    <Sidebar
      style={{ width: `${sideBarWidth}px` }}
      visible={visible}
      baseZIndex={1000000}
      onHide={() => toggleVisible()}
      ariaCloseLabel='open'
    >
      <SlideMenu
        style={{ width: `${slideMenuWidth}px` }}
        model={asideItems}
        viewportHeight={wh - 105}
        menuWidth={slideMenuWidth}
      ></SlideMenu>
    </Sidebar>
  )
}

export default Aside
