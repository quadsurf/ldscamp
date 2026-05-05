---
name: rules
decription: stricts rules for applying schema to React Hook Forms
---

Rule #1: Do not write zod schemas. After the GraphQL schema has been written, use @graphql-codegen/typescript-validation-schema to automatically generate the corresponding zod schema, then plug those auto-generated zod schemas directly into React Hook Form.
FLOW:
1. Define the rule in GraphQL (or database).
2. Auto-generate the zod schema using @graphql-codegen/typescript-validation-schema
3. React Hook Form uses zod to validate instantly.
4. urql sends the perfectly validated data to the server.