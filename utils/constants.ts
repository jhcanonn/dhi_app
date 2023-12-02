export const colors = {
  bgEventDefault: '#ffffff',
  bgEventBlock: '#707070',
  invalid: '#dc3545',
  disabled: '#eee',
}

export const errorMessages = {
  mandatoryField: 'Este campo es obligatorio.',
  shortMandatoryField: 'Obligatorio.',
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

export const budgetFormCodes = {
  presupuesto_vacio: 'presupuesto_vacio_',
  presupuesto_barba: 'presupuesto_barba_',
  presupuesto_capilar: 'presupuesto_capilar_',
  presupuesto_ceja: 'presupuesto_ceja_',
  presupuesto_medicamentos: 'presupuesto_medicamento_',
  presupuesto_micropigmentacion: 'presupuesto_micropigmentacion_',
  presupuesto_terapia_complementaria: 'presupuesto_terapia_complementaria_',
  presupuesto_terapias_capilares: 'presupuesto_terapia_capilar_',
}

export const regexPatterns = {
  onlyEmpty: /^(?!\s+$)[\s\S]*$/,
  email: /\S+@\S+\.\S+/,
}

export const errorCodes = {
  ERR_JWT_EXPIRED: 'ERR_JWT_EXPIRED',
}

export const CLIENT_PAGE_TAB = [
  'historyschedule',
  'dataSheet',
  'gallery',
  'budget',
  'finance',
]

export const CLIENT_PAGE_CRUD = ['create', 'read', 'update', 'delete']

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
  clientDataSheetService: '/client/{id}/dataSheet?serviceid={serviceId}',
  clientHistorySchedule: '/client/{id}/historyschedule',
  clientGallery: '/client/{id}/gallery',
  clientBudget: '/client/{id}/budget',
  clientBudgetCreate: '/client/{id}/budget/create',
  gallery: '/client/gallery',
  crm: '/crm',
  finance: '/client/{id}/finance',
  financeCreate: '/client/{id}/finance/create',
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
  BUDGET = 'Presupuesto',
}

export enum TypesExamsPrescription {
  EXAMEN = 'Examen',
  RECETA = 'Receta',
}

export const DHI_SESSION = 'dhi_session'
export const BLOCK_BOX = 'Bloqueo'
export const BLOCK_SERVICE = 'Bloqueo Otra Razón'

export const DEFAULT_APPOINTMENT_MINUTES = 30
export const REQUEST_ATTEMPT_NUMBER = 3

export const MAX_MB_GALLERY = 7
export const PATIENT_GALLERY = 'ce89509c-fcb6-4acd-afb2-3d3fec5e6058'
export const PATIENT_FILES = '94d99b64-b5e6-42b4-9324-f281bc7941ae'
export const DHI_SUCRUSAL = 'DHI COLOMBIA RESTAURACION CLINICA CAPILAR SAS'
export const HC_IMPLANTE_CODE = 'hc_implantecm_'
export const PAYMENT_WAY_CODE = 'formas_de_pago'
export const BUDGET_CODE = 'presupuesto_'
export const FINANCE_CODE = 'finance_'
export const COMING_SOON = 'Esta funcionalidad estará disponible proximamente.'
export const TRICOSCOPIA_URL = 'https://visor.dhicolombia.net/'
