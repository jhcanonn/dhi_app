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

export const GET_INFO_CLIENT = gql`
  query ($id: String!) {
    pacientes(filter: { documento: { _starts_with: $id } }) {
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
      genero
    }
  }
`
