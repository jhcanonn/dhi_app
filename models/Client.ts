import { Country, IdType } from './Calendar'

export type DhiPatient = {
  id?: number
  tipo_documento?: IdType
  documento?: string
  primer_nombre?: string
  segundo_nombre?: string
  apellido_paterno?: string
  apellido_materno?: string
  genero?: Gender
  fecha_nacimiento?: Date | null
  correo?: string
  indicativo?: Country
  telefono?: string | null
  indicativo_2?: Country
  telefono_2?: string | null
  estado_civil?: CivilState
} & Record<string, any>

export type Gender = {
  type: string
  name: string
}

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
