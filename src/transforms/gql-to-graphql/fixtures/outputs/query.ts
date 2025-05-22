import { graphql } from "@/gql/__generated__";

export const queryWithVariables = graphql(`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`);

export const queryWithFragment = graphql(`
  query GetUserWithPosts {
    user(id: "1") {
      ...UserWithPosts
    }
  }
`);
