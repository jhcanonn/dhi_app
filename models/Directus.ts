export type ProfessionalDirectus = {
  id: number
  identificacion: string
  nombre: string
  avatar: {
    filename_download: string
  }
  telefono: string
  sexo: string
  cargo: string
  especialidad: string
  correo: string
  disponible_agenda: boolean
  estado: string
}

export type ServiceDirectus = {
  id: number
  nombre: string
  estado: string
}

export type EventStateDirectus = {
  id: number
  nombre: string
  color: string
  estado: string
}

export type PaysDirectus = {
  id: number
  code: string
  nombre: string
  estado: string
}

export type BoxDirectus = {
  id: number
  nombre: string
  color: string
  estado: string
  services: {
    id: number
    servicios_id: ServiceDirectus
  }[]
}

export enum StatusDirectus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}
