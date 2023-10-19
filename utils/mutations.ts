import { gql } from '@apollo/client'

export const GET_TOKEN = gql`
  mutation Login($email: String!, $password: String!) {
    auth_login(email: $email, password: $password) {
      access_token
      refresh_token
      expires
    }
  }
`

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: ID!) {
    delete_citas_item(id: $id) {
      id
    }
  }
`

export const UPDATE_PATIENT = gql`
  mutation UpdatePatient($id: ID!, $data: update_pacientes_input!) {
    update_pacientes_item(id: $id, data: $data) {
      id
      documento
    }
  }
`

export const CREATE_ATTENTION = gql`
  mutation CreateAttention(
    $fichaId: ID!
    $panelCode: ID!
    $userId: ID!
    $sucursal: String
    $valores: JSON
  ) {
    create_historico_atenciones_item(
      data: {
        panel_id: { code: $panelCode }
        ficha_id: { id: $fichaId }
        user_created: { id: $userId }
        sucursal: $sucursal
        valores: $valores
      }
    ) {
      id
      date_created
      sucursal
      valores
      user_created {
        profesional {
          nombre
        }
      }
      panel_id {
        code
        nombre
      }
    }
  }
`

export const UPDATE_ATTENTION = gql`
  mutation UpdateAttention($atentionId: ID!, $valores: JSON, $status: String) {
    update_historico_atenciones_item(
      id: $atentionId
      data: { valores: $valores, status: $status }
    ) {
      id
      valores
      status
    }
  }
`
