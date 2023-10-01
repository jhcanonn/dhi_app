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
