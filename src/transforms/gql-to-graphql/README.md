# gql-to-graphql

A tool that automatically transforms GraphQL code from gql tagged templates to graphql function calls, designed for migrating from Apollo Client to GraphQL Codegen.

## Features

- <p>Converts gql tagged templates to graphql() function calls</p>
- <p>Update imports from @apollo/client to @/gql/\__generated__</p>
- <p>Properly handles complex templates with variable substitutions</p>

## Examples

### Basic Example
**AS-IS** 
```typescript
import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserInfo on User {
    id
    name
    email
  }
`;
```

**TO-BE**
```typescript
import { graphql } from "@/gql/__generated__";

export const GET_USER = graphql(`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`);

export const USER_FRAGMENT = graphql(`  
  fragment UserInfo on User {
    id
    name
    email
  }
`);
```

### Complex Templates with Substitutions

**AS-IS**
```typescript
import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment User on User {
    id
    name
  }
`;

export const GET_USER_WITH_POSTS = gql`
  query GetUserWithPosts($id: ID!) {
    user(id: $id) {
      ...User
      posts {
        id
        title
      }
    }
  }
  ${USER_FRAGMENT}
`;
```

**TO-BE**
```typescript
import { graphql } from "@/gql/__generated__";

const USER_FRAGMENT = graphql(`
  fragment User on User {
    id
    name
  }
`);

export const GET_USER_WITH_POSTS = graphql(`
  query GetUserWithPosts($id: ID!) {
    user(id: $id) {
      ...User
      posts {
        id
        title
      }
    }
  }
`);
```