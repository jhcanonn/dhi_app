import { Translations } from '@aldabil/react-scheduler/types';
import { DayProps } from '@aldabil/react-scheduler/views/Day';
import { MonthProps } from '@aldabil/react-scheduler/views/Month';
import { WeekProps } from '@aldabil/react-scheduler/views/Week';
import { ResourceType } from '@models';

export const bgEventColor = '#fff';

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

/* Los campos que se mapean son del Evento */
export const calendarFieldsMapper = (resource: string) => {
  return { idField: `${resource}_id`, textField: 'title' };
};
