'use client';

import { Sidebar } from 'primereact/sidebar';
import { SlideMenu } from 'primereact/slidemenu';
import { useAside } from '@contexts';
import { useWindowHeight } from '@react-hook/window-size';
import { useRouter } from 'next/navigation';
import { PAGE_PATH } from '@utils';

const Aside = () => {
  const { visible, toggleVisible } = useAside();
  const router = useRouter();
  const wh = useWindowHeight();

  const sideBarWidth = 320;
  const slideMenuWidth = sideBarWidth - 43;

  const goToPage = (pagePath: string) => {
    router.push(pagePath);
    toggleVisible();
  };

  const asideItems = [
    {
      label: 'Agenda',
      icon: 'pi pi-fw pi-calendar',
      items: [
        {
          label: 'Agenda Individual',
          icon: 'pi pi-fw pi-calendar-minus',
          command: () => goToPage(PAGE_PATH.individualCalendar),
        },
        {
          label: 'Agenda Multiple',
          icon: 'pi pi-fw pi-calendar-plus',
          command: () => goToPage(PAGE_PATH.multipleCalendar),
        },
        {
          separator: true,
        },
        {
          label: 'Agenda del día',
          icon: 'pi pi-fw pi-calendar',
          command: () => goToPage(PAGE_PATH.dayCalendar),
        },
        {
          label: 'Listado de citas',
          icon: 'pi pi-fw pi-list',
          command: () => goToPage(PAGE_PATH.dateListCalendar),
        },
      ],
    },
    {
      label: 'Clientes',
      icon: 'pi pi-fw pi-users',
      items: [
        {
          label: 'Lista de Clientes',
          icon: 'pi pi-fw pi-users',
          command: () => goToPage(PAGE_PATH.clientList),
        },
        {
          label: 'Galería',
          icon: 'pi pi-fw pi-images',
          command: () => goToPage(PAGE_PATH.clientGallery),
        },
      ],
    },
    {
      label: 'CRM',
      icon: 'pi pi-fw pi-heart',
      command: () => goToPage(PAGE_PATH.crm),
    },
    {
      label: 'Finanzas',
      icon: 'pi pi-fw pi-dollar',
      command: () => goToPage(PAGE_PATH.finance),
    },
    {
      separator: true,
    },
    {
      label: 'Configuración',
      icon: 'pi pi-fw pi-cog',
      command: () => goToPage(PAGE_PATH.settings),
    },
  ];

  return (
    <Sidebar
      style={{ width: `${sideBarWidth}px` }}
      visible={visible}
      baseZIndex={1000000}
      onHide={() => toggleVisible()}
      ariaCloseLabel="open"
    >
      <SlideMenu
        style={{ width: `${slideMenuWidth}px` }}
        model={asideItems}
        viewportHeight={wh - 105}
        menuWidth={slideMenuWidth}
      ></SlideMenu>
    </Sidebar>
  );
};

export default Aside;
