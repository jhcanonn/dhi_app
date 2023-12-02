import { SelectedRange } from 'react-scheduler-lib/store/types'
import { FieldValues, PathValue, UseFormReturn } from 'react-hook-form'
import { DefaultRecourse, ProcessedEvent } from 'react-scheduler-lib/types'
import { ServiceDirectus } from './Directus'

export type DhiEvent = ProcessedEvent & {
  professional_id?: number
  box_id?: number
  professional?: Professional
  box?: Box
  services?: Service[]
  client_id?: number
  state?: EventState
  pay?: Pay
  data_sheet?: string
  id_type?: IdType
  identification?: string
  first_name?: string
  middle_name?: string
  last_name?: string
  last_name_2?: string
  phone?: string | null
  phone_2?: string | null
  dialling?: Country
  dialling_2?: Country
  email?: string
  sent_email?: boolean
  description?: string
  eventStates?: EventState[]
  data_extra: any
  alerts: {
    id: number
    descripcion: string
    visible_agenda: boolean
    visible_atencion: boolean
  }[]
}

export type IdType = {
  type: string
  name: string
}

export type EventState = {
  state_id: number
  name: string
  color: string
}

export type Pay = {
  pay_id: number
  name: string
  code: string
}

export type CommonData = DefaultRecourse & {
  name: string
}

export type Professional = CommonData & {
  professional_id: number
  mobile: string
}

export type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  role: {
    id: string
    name: string
  }
  profesional: {
    id: string
    nombre: string
    no_registro_medico: string
    cargo: string
  }
  user_siigo: {
    id: number
    identification: string
    username: string
    email: string
    first_name: string
    last_name: string
  }
  avatar: {
    id: string
  }
  status: string
}

export type Patient = {
  id: string
  documento: string
  tipo_documento: string
  primer_nombre: string
  segundo_nombre: string
  apellido_paterno: string
  apellido_materno: string
  correo: string
  telefono: string
  indicativo: string
  telefono_2: string
  indicativo_2: string
  estado_civil: string
  registrado: boolean
  fecha_nacimiento: string
  alertas: {
    id: number
    descripcion: string
    visible_agenda: boolean
    visible_atencion: boolean
  }[]
}

export type ServiceDHI = { box_service_id: number } & ServiceDirectus

export type Box = CommonData & {
  box_id: number
  services: ServiceDHI[]
}

export type Service = {
  service_id: number
  name: string
  time: number | null
}

export type DhiResource = Box & Professional

export enum ResourceType {
  BOX = 'box',
  PROFESSIONAL = 'professional',
}

export enum CalendarType {
  INDIVIDUAL = 'individual',
  MULTIPLE = 'multiple',
}

export enum ResourceMode {
  DEFAULT = 'default',
  TABS = 'tabs',
}

export enum ViewMode {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export type EditFn = (
  status: boolean,
  event?: ProcessedEvent | SelectedRange | undefined,
) => void

export type FieldCommonProps<T> = {
  handleForm: UseFormReturn<T extends FieldValues ? any : any, any, undefined>
  name: string
  required?: boolean
  validate?: (
    value: PathValue<T extends FieldValues ? any : any, any>,
  ) => boolean
}

export type Country = {
  name: string
  image_url: string
  dialling: string
}

export type Holiday = {
  date: string
  start: string
  end: string
  name: string
  type: string
  rule: string
}
