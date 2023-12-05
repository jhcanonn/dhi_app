import { UUID } from 'crypto'
import { Country, IdType } from './Calendar'
import { BudgetExtraData, ProfileAvatar, SchedulesServices } from './Directus'

export type DhiPatient = {
  avatar?: ProfileAvatar[]
  id?: number
  tipo_documento?: IdType
  documento?: string
  primer_nombre?: string
  segundo_nombre?: string
  apellido_paterno?: string
  apellido_materno?: string
  fecha_nacimiento?: Date | null
  correo?: string
  indicativo?: Country
  telefono?: string | null
  indicativo_2?: Country
  telefono_2?: string | null
  estado_civil?: CivilState
  datos_extra?: JSON
} & Record<string, any>

export type CivilState = {
  type: string
  name: string
}

export type PatientAvatar = {
  avatar: {
    create: {
      pacientes_id: string
      directus_files_id: {
        id: string
      }
    }[]
    delete: number[]
  }
}

export type PatientFile = {
  archivos: {
    create: {
      pacientes_id: string
      directus_files_id: {
        id: UUID
      }
      tag: number
    }[]
    update: []
    delete: number[]
  }
}

export type PatientGallery = {
  galeria: {
    create: {
      galeria_id: {
        tags: {
          create: {
            galeria_id: '+'
            tags_id: {
              id: number
            }
          }[]
          update: []
          delete: []
        }
        fotos: {
          create: {
            galeria_id: '+'
            directus_files_id: {
              id: UUID
            }
          }[]
          update: []
          delete: []
        }
      }
    }[]
    update: {
      id: number
      galeria_id: {
        id: number
        fotos: {
          create: []
          update: []
          delete: number[]
        }
      }
    }[]
    delete: number[]
  }
}

export type CreatedAttention = {
  id: UUID
  date_created: string
  sucursal: string
  valores: JSON
  user_created: {
    profesional: {
      nombre: string
      identificacion: string
      no_registro_medico: string
      firma: {
        id: string
        title: string
      }
    }
  }
  panel_id: {
    code: string
    nombre: string
  }
}

export type UpdatedAttention = {
  id: UUID
  valores: JSON
  status: StatusDataSheet
}

export type OptionType = {
  code: string
  name: string
}

export type DropdownOption = {
  name: string
  value: string
}

export type DataTableCurrency = {
  value: number
  formated: string
}

export type DataTableDate = {
  date: Date
  timestamp: number
  formated: string
}

export type BudgetType = {
  id: UUID
  name: string
  created_date: DataTableDate
  due_date: DataTableDate
  value: DataTableCurrency
  payed: DataTableCurrency
  state_budget: string
  state_payed: string
  state_track: string
  cost: DataTableCurrency
  extraData: BudgetExtraData & {
    presupuesto_incluye: string
    presupuesto_formas_pago: string
    presupuesto_observaciones: string
  }
}

export enum InvoiceItemType {
  SERVICE = 'Service',
  PRODUCT = 'Product',
}

export type InvoiceItem = {
  code: string
  type: InvoiceItemType
  description: string
  quantity: number
  price: number
  discount_rate: number
  discount: number
  taxes: {
    id: number
  }[]
  total_value: number
}

export type InvoicePaymentMethod = {
  id: number
  value: number
  due_date: string
}

export type InvoiceType = {
  id: UUID
  created_date: DataTableDate
  items: InvoiceItem[]
  monto: DataTableCurrency
  payed: DataTableCurrency
  debt: DataTableCurrency
  extraData: {
    typeId: number
    comercial: UUID
    vendedor: string
    paymentMethods: InvoicePaymentMethod[]
    total_bruto: number
    total_descuentos: number
    sub_total: number
    total_iva: number
    total_formas_pago: number
    total_neto: number
    stamp: boolean
    mail: boolean
    observations: string
  }
}

export type PatientExtraData = {
  patient_extra_identidad_de_genero: string
  patient_extra_fecha_exp_documento: string
  patient_extra_lugar_exp_doc: string
  patient_extra_edad: string
  patient_extra_pertencia_etnica: string
  patient_extra_extranjero: string
  patient_extra_ocupacion: string
  patient_extra_asegurador: string
  patient_extra_pais_origen: string
  patient_extra_departamento_residencia: string
  patient_extra_municipio: string
  patient_extra_zona_paciente: string
  patient_extra_direccion: string
  patient_extra_acompanante_paciente: string
  patient_extra_responsable_paciente: string
  patient_extra_acudiente_telefono: string
  patient_extra_comentario: string
  patient_extra_excepto_de_reponsabilidad_civil: string
  patient_extra_regimen: string
  patient_extra_comercial_que_lo_vendio: string
  patient_extra_medico_que_atiende: string
  patient_extra_estado_tratamiento: string
}

export type ScheduleType = {
  id: number
  date: DataTableDate
  init_time: string
  end_time: string
  comment: string
  schedule_state: OptionType & { color: string }
  payment_state: OptionType
  professional: string
  sucursal: string
  services: SchedulesServices[]
}

export enum StatusDataSheet {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  ANNULLED = 'annulled',
}

export enum StatusComplementMedical {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  ANNULLED = 'annulled',
}

export enum TagType {
  IMAGE = 'imagen',
  FILE = 'archivo',
}

export enum FieldsCodeBudgetItems {
  L = '_list_',
  C = '_cantidad_',
  V = '_valor_',
  VU = '_valor_unitario_',
  D = '_dcto_',
  I = '_impuestos_',
  VI = '_valor_impuesto_',
  VD = '_valor_dcto_',
  VCD = '_valor_con_dcto_',
  VT = '_valor_total_',
  A = '_aceptado_',
}

export enum FieldsPaymentWayItems {
  L = '_list_',
  DD = '_due_date_',
  V = '_valor_',
}

export type DataSheet = {
  id: UUID
  status?: StatusDataSheet
  type: OptionType
  date: DataTableDate
  professional: string
  professionalDocument: string
  profesionalFirma: {
    id: string
    title: string
  }
  profesionalNumReg: string
  sucursal: string
  data: JSON
}

export type Commercial = {
  name: string
  value: UUID
}

export type InvoiceSiigoDirectus = {
  id?: UUID
  document: Record<string, any>
  date: string
  customer: Record<string, any>
  cost_center?: number
  currency?: Record<string, any>
  seller: number
  stamp: { send: boolean }
  mail: { send: boolean }
  observations: string
  items: Record<string, any>[]
  payments: Record<string, any>[]
  additional_fields?: Record<string, any>
  id_siigo?: UUID
  paciente: { id: number }
  comercial: { id: UUID }
  total_bruto: number
  total_descuentos: number
  sub_total: number
  total_iva: number
  total_formas_pago: number
  total_neto: number
  fecha_hora: string
}
