export type AppointmentQuery = {
  id: string
  inicio: string
  fin: string
  titulo: string
  enviar_correo: boolean
  comentario: string
  profesional: {
    id: string
  }
  servicios: {
    salas_servicios_id: {
      id: string
      servicios_id: {
        id: string
        nombre: string
        tiempo: string
        estado: string
      }
      salas_id: {
        id: string
        nombre: string
        color: string
      }
    }
  }[]
  paciente: {
    id: string
    tipo_documento: string
    documento: string
    primer_nombre: string
    segundo_nombre: string
    apellido_paterno: string
    apellido_materno: string
    telefono: string
    telefono_2: string
    indicativo: string
    indicativo_2: string
    correo: string
    datos_extra: any
    ficha_id: {
      id: string
    }
  }
  estado: {
    id: string
    nombre: string
    color: string
  }
  estado_pago: {
    id: string
    code: string
    nombre: string
  }
}
