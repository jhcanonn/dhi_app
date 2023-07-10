import { gql } from '@apollo/client';

export const GET_PROFESSIONALS = gql`
  query {
    profesionales {
      id
      identificacion
      nombre
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUser($id: ID!) {
    users_by_id(id: $id) {
      first_name
      last_name
      email
      avatar {
        id
      }
    }
  }
`;
