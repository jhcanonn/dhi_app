import { gql } from '@apollo/client'

export const GET_PROFESSIONALS = gql`
  query {
    profesionales {
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
    salas {
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
      avatar {
        id
      }
      status
    }
  }
`

export const GET_EVENT_STATE = gql`
  query {
    estado_citas {
      id
      nombre
      color
      estado
    }
  }
`

export const PAYS = gql`
  query {
    estado_pago {
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
    pacientes(
      filter: { estado: { _eq: "published" } }
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
      registrado
      fecha_nacimiento
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
        galeria_id {
          descripcion
          date_created
          fotos {
            directus_files_id {
              id
              title
              description
            }
          }
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
