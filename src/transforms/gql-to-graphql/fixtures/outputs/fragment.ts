import { graphql } from "@/gql/__generated__";

export const simpleFragment = graphql(`
  fragment User on User {
    id
    name
    email
  }
`);

export const complexFragment = graphql(`
  fragment UserWithPosts on User {
    ...User
    posts {
      id
      title
      content
      comments {
        id
        text
      }
    }
  }
`);
