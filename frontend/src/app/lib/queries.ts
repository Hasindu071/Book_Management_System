import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(data: { username: $username, password: $password })
  }
`

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(data: { username: $username, password: $password })
  }
`