import { gql } from "@apollo/client";

export const mutationWithVariables = gql`
  mutation UpdateUser($id: ID!, $name: String!) {
    updateUser(id: $id, name: $name) {
      id
      name
      email
    }
  }
`;

export const mutationWithFragment = gql`
  mutation UpdateUserWithPosts {
    updateUser(id: "1", name: "New Name") {
      ...UserWithPosts
    }
  }
  ${mutationWithVariables}
`;
