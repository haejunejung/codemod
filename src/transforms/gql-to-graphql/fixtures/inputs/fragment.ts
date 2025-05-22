import { gql } from "@apollo/client";

export const simpleFragment = gql`
  fragment User on User {
    id
    name
    email
  }
`;

export const complexFragment = gql`
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
  ${simpleFragment}
`;
