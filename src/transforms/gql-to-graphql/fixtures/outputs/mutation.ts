import { graphql } from "@/gql/__generated__";

export const mutationWithVariables = graphql(`
  mutation UpdateUser($id: ID!, $name: String!) {
    updateUser(id: $id, name: $name) {
      id
      name
      email
    }
  }
`);

export const mutationWithFragment = graphql(`
  mutation UpdateUserWithPosts {
    updateUser(id: "1", name: "New Name") {
      ...UserWithPosts
    }
  }
`);
