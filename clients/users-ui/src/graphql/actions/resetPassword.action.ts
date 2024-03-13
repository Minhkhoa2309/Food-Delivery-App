"use client";
import { gql, DocumentNode } from "@apollo/client";

export const RESET_PASSWORD: DocumentNode = gql`
  mutation ResetPassword($activationToken: String!, $password: String!) {
    resetPassword(
        resetPasswordInput: {
            activationToken: $activationToken
            password: $password
        }
    ) {
      user {
        name
        email
        phone_number
      }
    }
  }
`;