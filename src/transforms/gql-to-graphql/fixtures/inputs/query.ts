import { gql } from "@apollo/client";

export const queryWithVariables = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

export const queryWithFragment = gql`
  query GetUserWithPosts {
    user(id: "1") {
      ...UserWithPosts
    }
  }
  ${queryWithVariables}
`;
