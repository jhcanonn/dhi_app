import { UUID } from 'crypto'
import { Country, IdType } from './Calendar'
import { ProfileAvatar } from './Directus'

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

export type DataSheetType = {
  code: string
  name: string
}

export type DataSheetDate = {
  date: Date
  timestamp: number
  formated: string
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
  date: DataSheetDate
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
