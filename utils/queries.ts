import { gql } from '@apollo/client'

export const GET_PROFESSIONALS = gql`
  query {
    profesionales(filter: { estado: { _eq: "published" } }) {
      id
      identificacion
      nombre
      avatar {
        filename_download
      }
      telefono
      sexo
      cargo
      especialidad
      correo
      disponible_agenda
      estado
    }
  }
`

export const GET_BOXES = gql`
  query {
    salas(filter: { estado: { _eq: "published" } }) {
      id
      nombre
      color
      estado
      services {
        id
        servicios_id {
          id
          nombre
          tiempo
          estado
        }
      }
    }
  }
`

export const GET_USER_ME = gql`
  query {
    users_me {
      id
      email
      first_name
      last_name
      role {
        id
        name
      }
      profesional {
        id
        nombre
        no_registro_medico
        cargo
      }
      user_siigo {
        id
        identification
        username
        email
        first_name
        last_name
      }
      avatar {
        id
      }
      status
    }
  }
`

export const GET_SCHEDULES = gql`
  query ($patientId: GraphQLStringOrFloat) {
    citas(filter: { paciente: { id: { _eq: $patientId } } }) {
      id
      inicio
      fin
      comentario
      estado {
        id
        nombre
        color
      }
      estado_pago {
        id
        code
        nombre
      }
      profesional {
        id
        identificacion
        nombre
      }
      servicios {
        id
        salas_servicios_id {
          id
          salas_id {
            id
            nombre
            color
          }
          servicios_id {
            id
            nombre
            precio
          }
        }
      }
      date_created
    }
  }
`

export const GET_COMMERCIALS = gql`
  query ($roleId: String) {
    users(
      filter: { status: { _eq: "active" }, role: { id: { _eq: $roleId } } }
    ) {
      id
      first_name
      last_name
      email
    }
  }
`

export const GET_BUDGETS = gql`
  query ($patientId: GraphQLStringOrFloat) {
    presupuesto(filter: { paciente: { id: { _eq: $patientId } } }) {
      id
      nombre
      panel_id {
        code
      }
      comercial {
        id
      }
      servicios {
        id
        cantidad
        valor_unitario
        descuento
        valor_con_descuento
        valor_total
        aceptado
        salas_servicios_id {
          id
          salas_id {
            id
            nombre
            color
          }
          servicios_id {
            id
            nombre
            precio
          }
        }
      }
      terapias {
        id
        cantidad
        valor_unitario
        descuento
        valor_con_descuento
        valor_total
        aceptado
        terapias_salas_servicios_id {
          id
          sesiones
          terapias_id {
            id
            nombre
            valor
            descripcion
            costo
          }
        }
      }
      productos {
        id
        cantidad
        valor_unitario
        descuento
        valor_con_descuento
        valor_total
        aceptado
        productos_id {
          id
          nombre
          valor
          marca
          contenido
          descripcion
        }
      }
      data_form
      valor_total
      date_created
      estado
    }
    presupuesto_estado(
      filter: { status: { _eq: "published" } }
      sort: ["sort"]
    ) {
      id
      codigo
      nombre
      color
    }
    presupuesto_estado_pago(
      filter: { status: { _eq: "published" } }
      sort: ["sort"]
    ) {
      id
      codigo
      nombre
      color
    }
  }
`

export const GET_BUDGET_STATES = gql`
  query {
    presupuesto_estado(
      filter: { status: { _eq: "published" } }
      sort: ["sort"]
    ) {
      id
      codigo
      nombre
      color
    }
    presupuesto_estado_pago(
      filter: { status: { _eq: "published" } }
      sort: ["sort"]
    ) {
      id
      codigo
      nombre
      color
    }
  }
`

export const GET_BUDGET_ITEMS = gql`
  query {
    salas_servicios(
      filter: {
        salas_id: { estado: { _eq: "published" } }
        servicios_id: { estado: { _eq: "published" } }
      }
    ) {
      id
      salas_id {
        id
        nombre
        color
      }
      servicios_id {
        id
        nombre
        precio
      }
    }
    productos(filter: { estado: { _eq: "published" } }) {
      id
      nombre
      valor
      marca
      contenido
      descripcion
    }
    terapias_salas_servicios(
      filter: {
        terapias_id: { estado: { _eq: "published" } }
        salas_servicios_id: {
          salas_id: { estado: { _eq: "published" } }
          servicios_id: { estado: { _eq: "published" } }
        }
      }
    ) {
      id
      sesiones
      terapias_id {
        id
        nombre
        valor
        descripcion
        costo
      }
    }
  }
`

export const GET_EVENT_STATE = gql`
  query {
    estado_citas(filter: { estado: { _eq: "published" } }) {
      id
      nombre
      color
      estado
    }
  }
`

export const PAYS = gql`
  query {
    estado_pago(filter: { estado: { _eq: "published" } }) {
      id
      code
      nombre
      estado
    }
  }
`

export const GET_CIE_10 = gql`
  query {
    cie_10(filter: { estado: { _eq: "published" } }, limit: 13000) {
      code
      descripcion
    }
  }
`

export const GET_INFO_CLIENT = gql`
  query ($text: String!) {
    pacientes(
      filter: {
        _or: [
          { documento: { _contains: $text } }
          { full_name: { _icontains: $text } }
        ]
      }
    ) {
      id
      documento
      tipo_documento
      primer_nombre
      segundo_nombre
      apellido_paterno
      apellido_materno
      correo
      telefono
      indicativo
      telefono_2
      indicativo_2
      estado_civil
      registrado
      fecha_nacimiento
    }
  }
`

export const GET_CLIENTS = gql`
  query {
    pacientes(filter: { estado: { _eq: "published" } }) {
      avatar {
        id
        directus_files_id {
          id
          title
        }
      }
      id
      documento
      tipo_documento
      primer_nombre
      segundo_nombre
      apellido_paterno
      apellido_materno
      correo
      telefono
      indicativo
      registrado
      fecha_nacimiento
    }
  }
`

export const GET_TAGS = gql`
  query ($type: String) {
    tags(
      filter: { estado: { _eq: "published" }, tipo: { _eq: $type } }
      sort: "id"
    ) {
      id
      nombre
      tipo
    }
  }
`

export const GET_DATASHEETS_BY_ID = gql`
  query ($fichaId: GraphQLStringOrFloat) {
    historico_atenciones(filter: { ficha_id: { id: { _eq: $fichaId } } }) {
      id
      status
      sucursal
      valores
      panel_id {
        code
        nombre
      }
      date_created
      user_created {
        profesional {
          nombre
          identificacion
          no_registro_medico
          firma {
            id
            title
          }
        }
      }
    }
  }
`

export const GET_CLIENT_BY_ID = gql`
  query ($id: ID!) {
    pacientes_by_id(id: $id) {
      id
      full_name
      tipo_documento
      documento
      primer_nombre
      segundo_nombre
      apellido_paterno
      apellido_materno
      fecha_nacimiento
      correo
      indicativo
      telefono
      indicativo_2
      telefono_2
      estado_civil
      datos_extra
      ficha_id {
        id
      }
      avatar {
        id
        directus_files_id {
          id
          title
        }
      }
      galeria {
        id
        galeria_id {
          id
          descripcion
          date_created
          user_created {
            id
            first_name
            last_name
            profesional {
              id
              nombre
            }
          }
          fotos {
            id
            directus_files_id {
              id
              title
              description
            }
          }
          tags {
            id
            order
            tags_id {
              nombre
              tipo
              estado
            }
          }
        }
      }
      archivos {
        id
        directus_files_id {
          id
          title
          description
          uploaded_on
          uploaded_by {
            id
            first_name
            last_name
            profesional {
              id
              nombre
            }
          }
        }
        tag {
          nombre
          tipo
          estado
        }
      }
    }
  }
`

export const GET_APPOINTMENTS = gql`
  query ($start: GraphQLStringOrFloat!, $end: GraphQLStringOrFloat!) {
    citas(filter: { inicio: { _between: [$start, $end] } }) {
      id
      inicio
      fin
      titulo
      enviar_correo
      comentario
      profesional {
        id
      }
      servicios {
        salas_servicios_id {
          id
          servicios_id {
            id
            nombre
            tiempo
            estado
          }
          salas_id {
            id
            nombre
            color
          }
        }
      }
      paciente {
        id
        tipo_documento
        documento
        primer_nombre
        segundo_nombre
        apellido_paterno
        apellido_materno
        telefono
        telefono_2
        indicativo
        indicativo_2
        correo
        datos_extra
        ficha_id {
          id
        }
      }
      estado {
        id
        nombre
        color
      }
      estado_pago {
        id
        code
        nombre
      }
    }
  }
`

export const GET_TEMPLATES_RECIPES_EXAMS_BY_FICHAID = gql`
  query ($fichaId: GraphQLStringOrFloat) {
    plantillas(filter: { estado: { _eq: "published" } }) {
      id
      estado
      orden
      tipo
      nombre
      cantidad
      descripcion
      examenes {
        id
        examenes_id {
          id
          orden
          nombre
          codigo
          cantidad
          categoria
        }
      }
      recetas {
        id
        Recetas_id {
          id
          diagnostico
          nombre
          receta
        }
      }
      diagnostico {
        code
        descripcion
      }
    }
    complementos_medicos(filter: { ficha_id: { id: { _eq: $fichaId } } }) {
      id
      estado
      orden
      date_updated
      tipo
      user_created {
        id
        first_name
        last_name
        profesional {
          nombre
          identificacion
          especialidad
          cargo
          no_registro_medico
          firma {
            id
            filename_disk
          }
        }
      }
      date_created
      cantidad
      descripcion
      diagnostico {
        code
        descripcion
      }
      ficha_id {
        id
      }
      examenes {
        id
        examenes_id {
          id
          orden
          nombre
          codigo
          cantidad
          categoria
        }
        cantidad
        descripcion
      }
      recetas {
        id
        Recetas_id {
          id
          nombre
          diagnostico
          receta
          orden
        }
        formula
      }
    }
    examenes(filter: { estado: { _eq: "published" } }, sort: "orden") {
      id
      nombre
      codigo
      cantidad
      categoria
    }
    Recetas(filter: { estado: { _eq: "published" } }, sort: "orden") {
      id
      orden
      nombre
      receta
      diagnostico
    }
  }
`

export const GET_INVOICES = gql`
  query {
    siigo_tdocumentos(filter: { estado: { _eq: "published" } }) {
      id
      codigo
      homologo_app
      nombre
    }
    siigo_voucher_types(filter: { active: { _eq: true } }) {
      id
      code
      name
      type
      description
      consecutive
      electronic_type
    }
    siigo_payment_types(filter: { active: { _eq: true } }) {
      id
      name
      type
      due_date
    }
    siigo_services: productos_siigo(
      filter: { active: { _eq: true }, type: { _eq: "Service" } }
      limit: 1000
    ) {
      id
      code
      name
      type
      description
      taxes
      tax_included
      prices
    }
    siigo_productos: productos_siigo(
      filter: { active: { _eq: true }, type: { _eq: "Product" } }
      limit: 1000
    ) {
      id
      code
      name
      type
      description
      taxes
      tax_included
      prices
    }
  }
`
