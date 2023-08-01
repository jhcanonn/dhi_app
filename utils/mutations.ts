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

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refresh_token: String!) {
    auth_refresh(refresh_token: $refresh_token, mode: json) {
      access_token
      refresh_token
      expires
    }
  }
`
