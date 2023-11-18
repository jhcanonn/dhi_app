import { UUID } from 'crypto'
import { StatusDataSheet } from './Client'

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
  data_extra: JSON
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

export type DirectusTag = {
  id: number
  nombre: string
  tipo: string
}

export type ProfileAvatar = {
  id: string
  directus_files_id: {
    id: string
    title: string
  }
}

export type ClientPhoto = {
  id: number
  directus_files_id: {
    id: string
    title: string
    description: string
  } | null
}

export type ClientPhotoTag = {
  id: number
  order: number
  tags_id: {
    nombre: string
    tipo: string
    estado: string
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
  fecha_nacimiento: string
  correo: string
  indicativo: string
  telefono: string
  indicativo_2: string
  telefono_2: string
  estado_civil: string
  datos_extra: JSON
  ficha_id: {
    id: number
  }
  avatar: ProfileAvatar[]
  galeria: {
    id: number
    galeria_id: {
      id: number
      descripcion: string
      date_created: string
      user_created: {
        id: UUID
        first_name: string
        last_name: string
        profesional: {
          id: number
          nombre: string
        }
      }
      fotos: ClientPhoto[]
      tags: ClientPhotoTag[]
    }
  }[]
  archivos: {
    id: number
    directus_files_id: {
      id: UUID
      title: string
      description: string
      uploaded_on: string
      uploaded_by: {
        id: UUID
        first_name: string
        last_name: string
        profesional: {
          id: number
          nombre: string
        }
      }
    }
    tag: {
      nombre: string
      tipo: string
      estado: string
    }
  }[]
}

export type DisenioResponsivoDirectus = {
  desktop: {
    columnas: number
  }
  tablet: {
    columnas: number
  }
  mobile: {
    columnas: number
  }
}

export type CamposValidacionesDirectus = {
  required: boolean
  regex: string
}

export type CamposOpcionesDirectus = {
  name: string
  value: string
}

export enum CamposFuenteDatos {
  LOCAL_STORAGE = 'local_storage',
  CONTEXT = 'context',
  CMS = 'cms',
  FETCH = 'fetch',
  OPTIONS_JSON = 'json',
}

type DefaultFieldsDirectus = {
  estado: string
  orden: number | null
  user_created: string
  date_created: string
  user_updated: string | null
  date_updated: string | null
}

export type CamposDirectus = {
  id: number
  tipo: string
  codigo: string
  etiqueta: string
  descripcion: string | null
  validaciones: CamposValidacionesDirectus | null
  opciones: CamposOpcionesDirectus[] | null
  filas_por_defecto: number
  filas_grilla: number
  valor_predeterminado: any
  valor_accionado: any
  deshabilitado: boolean
  fuente_datos: CamposFuenteDatos
  variable_datos: string
  ancho_completo: boolean
  sin_autoresize: boolean
  es_decimal: boolean
  sufijo: string
  solo_anio: boolean
} & DefaultFieldsDirectus

export type CamposRelDirectus = {
  id: number
  orden: number
  agrupadores_code: string
  campos_id: CamposDirectus
}

export type AgrupadoresDirectus = {
  code: string
  etiqueta: string | null
  descripcion: string | null
  diseno_responsivo: DisenioResponsivoDirectus
  campos_id: CamposRelDirectus[]
  etiqueta_boton_extra: string | null
  es_personalizado: boolean
} & DefaultFieldsDirectus

export type AgrupadoresRelDirectus = {
  id: number
  orden: number
  paneles_code: string
  agrupadores_code: AgrupadoresDirectus
}

export type PanelsDirectus = {
  code: string
  orden: number
  nombre: string
  descripcion: string
  agrupadores_id: AgrupadoresRelDirectus[]
  bloque_de_firma: boolean
  view_forms: string[]
  budget_items: string[]
  cargo: string[]
} & DefaultFieldsDirectus

export type DataSheetDirectus = {
  id: UUID
  status: StatusDataSheet
  sucursal: string
  valores: JSON
  panel_id: {
    code: string
    nombre: string
  }
  date_created: string
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
}

export type CommercialDirectus = {
  id: string
  first_name: string
  last_name: string
  email: string
}

export type BudgetItemsBoxService = {
  id: number
  salas_id: {
    id: number
    nombre: string
    color: string
  }
  servicios_id: {
    id: number
    nombre: string
    precio: number
  }
}

export type BudgetItemsProducts = {
  id: number
  nombre: string
  valor: number
  marca: string
  contenido: string
  descripcion: string
}

export type BudgetItemsTherapies = {
  id: number
  sesiones: number
  terapias_id: {
    id: number
    nombre: string
    valor: number
    descripcion: string
    costo: number
  }
}

export type BudgetItemsDirectus = {
  salas_servicios: BudgetItemsBoxService[]
  productos: BudgetItemsProducts[]
  terapias_salas_servicios: BudgetItemsTherapies[]
}

export type BudgetRelationProps = {
  id: number
  cantidad: number
  valor_unitario: number
  descuento: number
  valor_con_descuento: number
  valor_total: number
  aceptado: boolean
}

export type BudgetExtraData = {
  panel_id: {
    code: string
  }
  comercial: {
    id: UUID
  }
  servicios: (BudgetRelationProps & {
    salas_servicios_id: BudgetItemsBoxService
  })[]
  terapias: (BudgetRelationProps & {
    terapias_salas_servicios_id: BudgetItemsTherapies
  })[]
  productos: (BudgetRelationProps & {
    productos_id: BudgetItemsProducts
  })[]
}

export type BudgetsDirectus = {
  id: UUID
  nombre: string
  data_form: {
    presupuesto_fecha_vencimiento: string
    presupuesto_incluye: string
    presupuesto_formas_pago: string
    presupuesto_observaciones: string
  }
  valor_total: number
  date_created: string
  estado: string
} & BudgetExtraData

export type BudgetCreateRelServices = {
  presupuesto_id: {
    id: UUID
  }
  salas_servicios_id: {
    id: number
  }
} & Omit<BudgetRelationProps, 'id'>

export type BudgetCreateRelProducts = {
  presupuesto_id: {
    id: UUID
  }
  productos_id: {
    id: number
  }
} & Omit<BudgetRelationProps, 'id'>

export type BudgetCreateRelTherapies = {
  presupuesto_id: {
    id: UUID
  }
  terapias_salas_servicios_id: {
    id: number
  }
} & Omit<BudgetRelationProps, 'id'>

export type BudgetCreateRelationsDirectus = {
  dataServices: BudgetCreateRelServices[]
  dataProducts: BudgetCreateRelProducts[]
  dataTherapies: BudgetCreateRelTherapies[]
}

export type BudgetEditRelationsDirectus = {
  servicios: (BudgetRelationProps | BudgetCreateRelServices)[]
  productos: (BudgetRelationProps | BudgetCreateRelProducts)[]
  terapias: (BudgetRelationProps | BudgetCreateRelTherapies)[]
}

export type BudgetForm = {
  presupuesto_id: UUID
  presupuesto_planilla: string
  presupuesto_comercial: UUID
  presupuesto_total: number
} & Record<string, any>

export enum BudgetItem {
  SERVICES = 'Servicios',
  PRODUCTS = 'Productos',
  THERAPIES = 'Terapias',
}

export enum BudgetState {
  ACEPTADO = 'aceptado',
  ACEPTADO_PARCIAL = 'aceptado_parcial',
  NO_ACEPTADO = 'no_aceptado',
  DECLINADO = 'declinado',
}

export enum BudgetPanelCodes {
  NAME = 'nombre',
  DUE_DATE = 'fecha_vencimiento',
  STATE = 'estado',
  INCLUDES = 'incluye',
  PAYMENT_METHODS = 'formas_pago',
  GENERAL_OBS = 'observaciones',
}

export enum StatusDirectus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

export enum FieldTypeDirectus {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DROPDOWN = 'dropdown',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',
  PHONE = 'phone',
  AUTOCOMPLETE = 'autocomplete',
}

export type SchedulesServices = {
  id: number
  salas_servicios_id: BudgetItemsBoxService
}

export type SchedulesState = {
  id: number
  nombre: string
  color: string
}

export type PaymentsState = {
  id: number
  code: string
  nombre: string
}

export type SchedulesDirectus = {
  id: number
  inicio: string
  fin: string
  comentario: string
  estado: SchedulesState
  estado_pago: PaymentsState
  profesional: {
    id: number
    identificacion: string
    nombre: string
  }
  servicios: SchedulesServices[]
  date_created: string
}
