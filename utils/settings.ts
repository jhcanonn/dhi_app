import { Translations } from 'react-scheduler-lib/types'
import { DayProps } from 'react-scheduler-lib/views/Day'
import { MonthProps } from 'react-scheduler-lib/views/Month'
import { WeekProps } from 'react-scheduler-lib/views/Week'

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
}

export const calendarMonth: MonthProps = {
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  weekStartOn: 1,
  startHour: 7,
  endHour: 19,
}

export const calendarWeek: WeekProps = {
  weekDays: [0, 1, 2, 3, 4, 5, 6],
  weekStartOn: 1,
  startHour: 7,
  endHour: 19,
  step: 30,
}

export const calendarDay: DayProps = {
  startHour: 7,
  endHour: 19,
  step: 30,
}

export const localeOptions = {
  firstDayOfWeek: 0,
  dayNames: [
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
    'domingo',
  ],
  dayNamesShort: ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'],
  dayNamesMin: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  today: 'Hoy',
  clear: 'Limpiar',
}

export const idTypes = [
  { type: 'CC', name: 'Cédula de ciudadanía' },
  { type: 'CE', name: 'Cédula de extranjería' },
  { type: 'PA', name: 'Pasaporte' },
  { type: 'PEP', name: 'Permiso especial de permanencia' },
]

export const civilStatus = [
  { type: 'S', name: 'Solero(a)' },
  { type: 'C', name: 'Casado(a)' },
  { type: 'U', name: 'Unión libre' },
  { type: 'V', name: 'Viudo(a)' },
  { type: 'D', name: 'Divorciado(a)' },
]

export const PanelGroupCustomCodes = {
  FOLICULOS_ZONA_DONANTE: 'hc_foliculos_zona_donante',
  FOLICULOS_CAPILAR: 'hc_foliculos_capilar',
  FOLICULOS_BARBA: 'hc_foliculos_barba',
  FOLICULOS_CEJA: 'hc_foliculos_ceja',
}
