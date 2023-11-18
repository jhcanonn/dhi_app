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
  D = '_dcto_',
  VD = '_valor_con_dcto_',
  VT = '_valor_total_',
  A = '_aceptado_',
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
