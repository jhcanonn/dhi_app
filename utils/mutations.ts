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
