import { Translations } from '@aldabil/react-scheduler/types'
import { DayProps } from '@aldabil/react-scheduler/views/Day'
import { MonthProps } from '@aldabil/react-scheduler/views/Month'
import { WeekProps } from '@aldabil/react-scheduler/views/Week'

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
  weekDays: [1, 2, 3, 4, 5, 6],
  weekStartOn: 0,
  startHour: 7,
  endHour: 20,
}

export const calendarWeek: WeekProps = {
  weekDays: [1, 2, 3, 4, 5, 6],
  weekStartOn: 0,
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

export const mandatoryAppointmentFields = [
  'start',
  'end',
  'identification',
  'first_name',
  'last_name',
  'phone',
  'dialling',
  'email',
  'professional',
  'box',
]
