# Testing Protocol
- When generating a new utility function or component, always generate an accompanying `.test.ts` or `.test.tsx` file beforehand.
- Use Vitest as the test runner.
- Tests must assert on user-visible behavior (e.g., text on screen, aria-roles) rather than implementation details.
- Always mock external network calls and database queries. Never hit live endpoints in tests.

# Strictly Enforce the TDD "Red" Phase Strategy for Forms
When implementing a new feature (for example, an intake form), the "Red" phase of the TDD cycle should focus on the Zod schema's failure points.
Because React Hook Form relies on the schema for the "Source of Truth," the agent can write a Vitest suite that validates the schema independently of the UI first. This ensures that the business logic is locked in before any Tailwind or shadcn code is even generated. This separation of concerns makes the subsequent "Green" phase (writing the actual React component) much faster for the agent to complete successfully.