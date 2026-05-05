# Project Tech Stack & Architectural Boundaries

This project strictly adheres to the following stack. Under NO circumstances should additional or alternative libraries or frameworks be introduced without explicit human approval.

## Core Framework
* **Framework:** Next.js (App Router)
* **Language:** TypeScript (Strict mode enabled)
* **UI Library:** React

## Styling & Components
* **CSS:** TailwindCSS
* **Component Libraries:** Shadcn UI, Aceternity UI, UI UX Pro Max
* **Animation:** Framer Motion (via Aceternity)
* **Constraint:** Do NOT install Material UI, Bootstrap, or write raw CSS modules.

## Data & State Management (refer to ./agent/skills/custom-skills/state-management/ for full state doctrine)
* **Data Fetching:** GraphQL via Supabase
* **GraphQL Client:** Urql with Graphcache
* **Global State:** Zustand
* **ORM:** Only use Drizzle when Supabase Edge Functions are needed AND when I the human authorize it.
* **Constraint:** Do NOT use Redux, MobX, Apollo Client, Axios, or native Fetch for primary data operations.

## Forms & Validation
* **Form Handling:** React Hook Form (RHF) OR TanStack [ask me if debouncing is needed... if needed, then TanStack, else RHF]
* **Schema Validation:** zod
* **Constraint:** Do NOT use Formik or Conform.

## Testing & Quality Assurance (refer to ./agent/skills/custom-skills/tdd/ for full testing doctrine)
* **Unit/Integration:** Vitest
* **UI Testing and Lite Browser Testing:** Playwright (Critically Important: no e2e tests are allowed to run in local dev environment, only in Github using Github-Actions/Jules/Docker/etc)
* **Linting:** ESLint with typescript-eslint
* **Constraint:** Do NOT use Jest or Cypress. Tests must strictly adhere to the Red-Green-Refactor TDD cycle outlined in .agent/skills/custom-skills/tdd/test-running/TESTING-CONSTITUTION.md