export type AppointmentDirectus = {
  title: string
  start: string
  end: string
  client_id: number
  box_id: number
  professional_id: number
  service_id: number[]
  data_sheet: string
  identification_type: string
  identification: string
  first_name: string
  middle_name: string
  last_name: string
  last_name_2: string
  dialling: string
  phone: string
  dialling_2: string
  phone_2: string
  email: string
  sent_email: boolean
  description: string
  state_id: number
  pay_id: number
}

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
  tiempo: number
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

export type ProfileAvatar = {
  id: string
  directus_files_id: {
    id: string
    title: string
  }
}

export type ClientPhoto = {
  directus_files_id: {
    id: string
    title: string
    description: string
  }
}

export type ClientDirectus = {
  id: number
  full_name: string
  tipo_documento: string
  documento: string
  primer_nombre: string
  segundo_nombre: string
  apellido_paterno: string
  apellido_materno: string
  genero: string
  fecha_nacimiento: string
  correo: string
  indicativo: string
  telefono: string
  indicativo_2: string
  telefono_2: string
  estado_civil: string
  avatar: ProfileAvatar[]
  galeria: {
    galeria_id: {
      descripcion: string
      date_created: string
      fotos: ClientPhoto[]
    }
  }[]
}

export enum StatusDirectus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}
