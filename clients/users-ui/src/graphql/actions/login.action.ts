"use client";
import { gql, DocumentNode } from "@apollo/client";

export const LOGIN_USER: DocumentNode = gql`
mutation LoginUser(
    $email: String!
    $password: String!
) {
    login(
        loginInput:{
        email: $email, 
        password: $password,
  }){
    user{
        name
        email
        password
      }
    accessToken
    refreshToken
    error{
        message
    }
  }
}
`