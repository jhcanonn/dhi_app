import { UUID } from 'crypto'
import { Country, IdType } from './Calendar'

export type DhiPatient = {
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

export type CreatedAttention = {
  id: UUID
  date_created: string
  sucursal: string
  valores: JSON
  user_created: {
    profesional: {
      nombre: string
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

export type DataSheetType = {
  code: string
  name: string
}

export enum StatusDataSheet {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  ANNULLED = 'annulled',
}

export type DataSheet = {
  id: UUID
  status?: StatusDataSheet
  type: DataSheetType
  date: string
  professional: string
  sucursal: string
  data: JSON
}
