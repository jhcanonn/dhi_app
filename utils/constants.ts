import { SelectedRange } from '@aldabil/react-scheduler/store/types';
import { ProcessedEvent, Translations } from '@aldabil/react-scheduler/types';
import { DayProps } from '@aldabil/react-scheduler/views/Day';
import { MonthProps } from '@aldabil/react-scheduler/views/Month';
import { WeekProps } from '@aldabil/react-scheduler/views/Week';

export const PAGE_PATH = {
  home: '/',
  profile: '/profile',
  individualCalendar: '/calendar/individual',
  multipleCalendar: '/calendar/multiple',
  dayCalendar: '/calendar/day',
  dateListCalendar: '/calendar/date-list',
  clientList: '/client',
  clientGallery: '/client/gallery',
  crm: '/crm',
  finance: '/finance',
  statistics: '/statistics',
  settings: '/settings',
};

export const calendarTranslations: Translations = {
  navigation: {
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    today: 'Hoy',
  },
  form: {
    addTitle: 'Agregar cita',
    editTitle: 'Editar cita',
    confirm: 'Confirmar',
    delete: 'Borar',
    cancel: 'Cancelar',
  },
  event: {
    title: 'Titulo',
    start: 'Inicio',
    end: 'Final',
    allDay: 'Todo el día',
  },
  moreEvents: 'Más...',
  loading: 'Cargando...',
};

export enum MultipleCalendarMode {
  DEFAULT = 'default',
  TABS = 'tabs',
}

export const calendarMonth: MonthProps = {
  weekDays: [1, 2, 3, 4, 5, 6],
  weekStartOn: 0,
  startHour: 7,
  endHour: 20,
};

export const calendarWeek: WeekProps = {
  weekDays: [1, 2, 3, 4, 5, 6],
  weekStartOn: 0,
  startHour: 7,
  endHour: 19,
  step: 30,
};

export const calendarDay: DayProps = {
  startHour: 7,
  endHour: 19,
  step: 30,
};

export const calendarFieldsMapper = {
  idField: 'professional_id',
  textField: 'title',
};

export type EditFn = (
  status: boolean,
  event?: ProcessedEvent | SelectedRange | undefined
) => void;

export const EVENTS = [
  {
    event_id: 1,
    title: 'Event 1',
    start: new Date(new Date(new Date().setHours(9)).setMinutes(30)),
    end: new Date(new Date(new Date().setHours(10)).setMinutes(30)),
    professional_id: 1,
    state_color: 'red',
  },
  {
    event_id: 2,
    title: 'Event 2',
    start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
    professional_id: 2,
    state_color: 'yellow',
  },
  {
    event_id: 3,
    title: 'Event 3',
    start: new Date(
      new Date(new Date(new Date().setHours(9)).setMinutes(0)).setDate(
        new Date().getDate() - 1
      )
    ),
    end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    professional_id: 1,
    state_color: 'purple',
  },
  {
    event_id: 4,
    title: 'Event 4',
    start: new Date(
      new Date(new Date(new Date().setHours(9)).setMinutes(0)).setDate(
        new Date().getDate() - 2
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(0)).setDate(
        new Date().getDate() - 2
      )
    ),
    professional_id: 2,
    state_color: 'gray',
  },
  {
    event_id: 5,
    title: 'Event 5',
    start: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(0)).setDate(
        new Date().getDate() - 2
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() + 10
      )
    ),
    professional_id: 4,
    state_color: 'darkcyan',
  },
  {
    event_id: 6,
    title: 'Event 6',
    start: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    professional_id: 2,
  },
  {
    event_id: 7,
    title: 'Event 7',
    start: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() - 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(12)).setMinutes(0)).setDate(
        new Date().getDate() - 1
      )
    ),
    professional_id: 3,
  },
  {
    event_id: 8,
    title: 'Event 8',
    start: new Date(
      new Date(new Date(new Date().setHours(13)).setMinutes(0)).setDate(
        new Date().getDate() - 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
        new Date().getDate() - 1
      )
    ),
    professional_id: 4,
    state_color: 'purple',
  },
  {
    event_id: 9,
    title: 'Event 11',
    start: new Date(
      new Date(new Date(new Date().setHours(13)).setMinutes(0)).setDate(
        new Date().getDate() + 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(15)).setMinutes(30)).setDate(
        new Date().getDate() + 1
      )
    ),
    professional_id: 1,
  },
  {
    event_id: 10,
    title: 'Event 9',
    start: new Date(
      new Date(new Date(new Date().setHours(15)).setMinutes(0)).setDate(
        new Date().getDate() + 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(16)).setMinutes(30)).setDate(
        new Date().getDate() + 1
      )
    ),
    professional_id: 2,
    state_color: 'gray',
  },
  {
    event_id: 11,
    title: 'Event 10',
    start: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() - 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(15)).setMinutes(0)).setDate(
        new Date().getDate() - 1
      )
    ),
    professional_id: 1,
    state_color: 'darkcyan',
  },
];

export type Professional = {
  professional_id: number;
  name: string;
  mobile: string;
  avatar?: string;
  color?: string;
};

export const PROFESSIONALS: Professional[] = [
  {
    professional_id: 1,
    name: 'John',
    mobile: '555666777',
    avatar: '/assets/avatar-1.png',
  },
  {
    professional_id: 2,
    name: 'Sarah',
    mobile: '545678354',
    color: 'darkgreen',
  },
  {
    professional_id: 3,
    name: 'Joseph',
    mobile: '543678433',
    avatar: '/assets/avatar-3.png',
  },
  {
    professional_id: 4,
    name: 'Mera',
    mobile: '507487620',
    color: 'red',
  },
];
