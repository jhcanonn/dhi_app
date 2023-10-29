export const colors = {
  bgEventDefault: '#ffffff',
  bgEventBlock: '#707070',
  invalid: '#dc3545',
  disabled: '#eee',
}

export const errorMessages = {
  mandatoryField: 'Este campo es obligatorio.',
  acceptField: 'Aceptar es obligatorio.',
  invalidValue: 'Ingrese un valor válido.',
  invalidFormat: 'El formato no es válido.',
  minLength: 'Longitud minima:',
  noProfessionals: 'No hay profesionales',
  noBoxes: 'No hay boxes',
  noExists: 'No existe',
  statusOutRange: 'Horario fuera de rango',
  hoursOutRange: 'Solo se permiten citas entre 7AM y 7PM',
}

export const regexPatterns = {
  onlyEmpty: /^(?!\s+$)[\s\S]*$/,
  email: /\S+@\S+\.\S+/,
}

export const errorCodes = {
  ERR_JWT_EXPIRED: 'ERR_JWT_EXPIRED',
}

export const CLIENT_PAGE_TAB = ['dataSheet', 'gallery', 'budget']

export const PAGE_PATH = {
  home: '/',
  login: '/login',
  profile: '/profile',
  calendar: '/calendar',
  dayCalendar: '/calendar/day',
  dateListCalendar: '/calendar/date-list',
  clientList: '/client',
  clientDetail: '/client/{id}',
  clientEdit: '/client/{id}/edit',
  clientDataSheet: '/client/{id}/dataSheet',
  clientHistorySchedule: '/client/{id}/historyschedule',
  clientGallery: '/client/{id}/gallery',
  clientBudget: '/client/{id}/budget',
  gallery: '/client/gallery',
  crm: '/crm',
  finance: '/finance',
  statistics: '/statistics',
  settings: '/settings',
}

export const ROLES = {
  admin: '7785388b-e913-4477-89e0-f4473218246a',
  dhi_admin: '789f50a6-73fb-47a3-b10b-bd74a739f96e',
  dhi_profesional: '7c2b2916-670a-4a54-b312-abe66f556428',
  dhi_asistente: '864e0832-dd2c-4d49-b80a-e37438dd51a0',
  dhi_comercial: '46313e3f-942b-4456-a116-aeb759bb02b0',
}

export enum LocalStorageTags {
  COUNTRIES = 'countries',
  HOLIDAYS = 'holidays',
  CIE10 = 'cie10',
}

export enum PanelTags {
  ATENTIONS = 'Atenciones',
  PATIENT = 'Paciente',
}

export const DHI_SESSION = 'dhi_session'
export const BLOCK_BOX = 'Bloqueo'
export const BLOCK_SERVICE = 'Bloqueo Otra Razón'

export const DEFAULT_APPOINTMENT_MINUTES = 30
export const REQUEST_ATTEMPT_NUMBER = 3

export const MAX_MB_GALLERY = 7
export const PATIENTS_GALLERY = 'ce89509c-fcb6-4acd-afb2-3d3fec5e6058'
export const DHI_SUCRUSAL = 'DHI COLOMBIA RESTAURACION CLINICA CAPILAR SAS'
export const HC_IMPLANTE_CODE = 'hc_implantecm_'
