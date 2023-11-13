'use client'

import { PrimeIcons } from 'primereact/api'
import { Sidebar } from 'primereact/sidebar'
import { SlideMenu } from 'primereact/slidemenu'
import { useAsideContext } from '@contexts'
import { useWindowHeight } from '@react-hook/window-size'
import { PAGE_PATH } from '@utils'
import { useGoTo } from '@hooks'

const Aside = () => {
  const { visible, toggleVisible } = useAsideContext()
  const { goToPage } = useGoTo()
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
            goToPage(PAGE_PATH.calendar)
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
            goToPage(PAGE_PATH.dayCalendar)
          },
        },
        {
          label: 'Listado de citas',
          icon: PrimeIcons.LIST,
          command: () => {
            toggleVisible()
            goToPage(PAGE_PATH.dateListCalendar)
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
            goToPage(PAGE_PATH.clientList)
          },
        },
        {
          label: 'Galería',
          icon: PrimeIcons.IMAGES,
          command: () => {
            toggleVisible()
            goToPage(PAGE_PATH.gallery)
          },
        },
      ],
    },
    {
      label: 'CRM',
      icon: PrimeIcons.HEART,
      command: () => {
        toggleVisible()
        goToPage(PAGE_PATH.crm)
      },
    },
    {
      label: 'Finanzas',
      icon: PrimeIcons.DOLLAR,
      command: () => {
        toggleVisible()
        goToPage(PAGE_PATH.finance)
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
        goToPage(PAGE_PATH.settings)
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
