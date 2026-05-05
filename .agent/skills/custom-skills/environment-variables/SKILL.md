---
name: env-vars
description: Environment Variable Architecture and Validation for Next.js SDLC Projects
---

## Purpose
Guide AI agents in correctly scaffolding, typing, referencing, and managing environment variable files across all stages of a software development lifecycle (SDLC) project, specifically within a Next.js, T3 Env, and Vercel ecosystem.

---

## Core Concepts

- Environment files (`.env.*`) separate configuration from code.
- Different environments (dev, test, staging, prod) require different values for the same variables.
- **Secrets must never be committed to source control** — not in any `.env` file.
- A `.env.example` file is the canonical way to document required variables without leaking values.

---

## Next.js & Strict Type Safety (T3 Env + Zod)

Agents must NEVER access `process.env.YOUR_VAR` directly within application code. All environment variables must be strictly typed and validated at runtime using `@t3-oss/env-nextjs` and Zod.

1. **The `src/env.ts` File (in the root directory of this project):** Upon scaffolding, the project must contain a `src/env.ts` file using `createEnv()`. All variables must be defined here.
2. **Server vs. Client Separation:** - Backend/Node variables belong in the `server` object.
   - Frontend/Browser variables belong in the `client` object.
3. **The `NEXT_PUBLIC_` Prefix:** Any variable exposed to the client bundle MUST be prefixed with `NEXT_PUBLIC_`. If an agent defines a client-side variable without this prefix, Next.js will silently fail to expose it to the browser.
4. **Usage:** Within application code, agents must import the validated environment object: `import { env } from "@/env";` and use `env.NEXT_PUBLIC_YOUR_VAR`.
5. **Syntax Enforcement:** Before writing any validation logic, you MUST read examples/zod-syntax.ts. Agents must strictly use standard Zod method chaining (e.g., z.string().url().min(5)). The zod/mini functional API (using .check()) is strictly forbidden.

---

## E2E Testing & Playwright Environment Variables

When configuring `playwright.config.ts`, or when generating E2E tests, adhere to the following architecture:

1. **Dynamic `baseURL` Assignment:** Never hardcode local host ports or staging URLs as the primary target in test scripts. The configuration must dynamically assign the `baseURL` property using `process.env.BASE_URL`.
   ```typescript
   export default defineConfig({
     use: {
       baseURL: process.env.BASE_URL || 'http://localhost:3000',
       trace: 'on-first-retry',
     },
   });
   ```
2. **CI/CD Awareness (Vercel + GitHub Actions):** During the automated CI workflow, the pipeline dynamically fetches the Vercel Preview Deployment URL and injects it as `process.env.BASE_URL`. Do not attempt to override, mock, or redefine this variable within the test files themselves.

---

## Required Files and Their Purpose

| File | Commit? | Purpose |
|------|---------|---------|
| `.env` | ✅ Yes | Default/fallback values shared across all environments. Loaded first, overridden by specifics. |
| `.env.example` | ✅ Yes | Sanitized template with all variable names and dummy/blank values. |
| `.env.development` | ✅ Yes | Dev environment config — local service URLs, verbose logging. |
| `.env.test` | ✅ Yes | Automated test config — test DBs, mock API keys. |
| `.env.local` | ❌ No | Personal local overrides, never committed. Overrides `.env` on the developer's machine only. |

---

## Vercel Environment Mapping

When instructing deployment or discussing remote environments, map local files to Vercel's strict UI terminology:
- **Development:** Corresponds to local `.env.development`.
- **Preview:** Corresponds to staging/testing environments. Vercel uses this for all PRs.
- **Production:** Corresponds to the live `.env.production`. 
*Note: Do not attempt to push `.env.staging` files to Vercel; configure those variables natively in the Vercel Dashboard under the "Preview" environment tab.*

---

## Load Priority

When multiple files exist locally, Next.js resolves values in this order (highest to lowest priority):

    .env.{NODE_ENV}.local   <- highest priority (most specific + personal)
    .env.local
    .env.{NODE_ENV}
    .env                    <- lowest priority (most generic)

---

## .gitignore Rules

When scaffolding a project, always ensure the following patterns are present in `.gitignore`:

    # Local env overrides — never commit
    .env.local
    .env.*.local

---

## Scaffolding Checklist

When setting up a new project, execute these steps in order:

1. Install `@t3-oss/env-nextjs` and `zod`.
2. Generate `src/env.ts` with server/client schemas.
3. Create `.env.example` — define all variable names with dummy values and inline comments.
4. Create `.env` — add safe, non-secret defaults.
5. Create `.env.development` — add dev-specific values (local ports).
6. Create `.env.test` — add test-specific values (test DB URL).
7. Instruct the developer to manually create `.env.local` based on `.env.example`.
8. Update `.gitignore` to exclude all `.local` files.
9. Preserve all `.env.*` files at the file system level BUT hide them at the editor level by using the `files.exclude` setting in the workspace configuration.

---

## Secrets Management Rules

Agents must enforce the following rules without exception:

- ✅ Real secrets (API keys, DB passwords, tokens) belong in a **secrets manager** (e.g., Supabase Vault, Vercel Env UI).
- ✅ CI/CD secrets belong in the **platform's secret store** (e.g., GitHub Actions Secrets).
- ❌ Never write a real secret value into any committed `.env.*` file.
- ❌ Never log or print env variable values in application output.
- ❌ Never hardcode fallback secrets in application source code.