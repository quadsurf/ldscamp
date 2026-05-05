---
name: graphql-to-zod-schema-skill
description: mandatory skill to use when setting up zod mini's schema
---

Rule #1:
Do not write zod schemas. After the GraphQL schema has been written, use @graphql-codegen/typescript-validation-schema to automatically generate the corresponding zod schema, then plug those auto-generated zod schemas where needed, like for example: directly into React Hook Form.