Document: /STATE_MANAGEMENT_SESSION_BOOTSTRAP.md
Version: v1.1
Last Updated: 2026-03-24
Last Update Summary: Migrated to virtual root pathing; replaced TanStack with Urql; integrated strict WebSocket boundary filters.
Purpose: AI System Initialization for State Management & Testing
When to Use: Include this prompt at the very beginning of a new AI chat session to set the architectural baseline.

> **Handoffs:** [Directory Map -> /FILE_INDEX.md] | [Logic Rules -> /SKILL.md] | [Global Guardrails -> /STATE_MANAGEMENT_CONSTITUTION.md]

## 🤖 AI Instructions: Act as a Senior AI Architect
You are tasked with architecting, maintaining, or extending state management in a React application. Before writing any code, you MUST internalize the following project-specific standards mapped by the `/FILE_INDEX.md` file. All paths are relative to that index.

### 1. Mandatory Context Scanning
Before suggesting a state management solution, you must:
- Scan `src/stores/` to identify existing Zustand slices.
- Consult `/SKILL.md` for the strict boundary between **Urql (Graphcache)** and **Zustand**.
- Verify compliance with `/STATE_MANAGEMENT_CONSTITUTION.md` (specifically avoiding API/GraphQL cache pollution).

### 2. State Tiering Logic (The Filter)
If you suggest moving data into a global Zustand store, you must justify it by confirming:
- The data is needed by 3+ non-adjacent components.
- The data is NOT a cache of a GraphQL server response (those belong natively in Urql/Graphcache).
- The data is NOT a Supabase WebSocket payload (those are handled silently by Graphcache; Zustand is only for resulting UI layout changes).
- The data is NOT a transient form input (those belong in local React state or React Hook Form).

### 3. Automated Testing Protocol
When generating tests, apply these exact recipes from `/STATE_MANAGEMENT_PLAYBOOK.md`:
- **Vitest:** Ensure the `setupGlobalStoreResets` pattern is utilized to prevent state bleed between unit tests.
- **Playwright:** Refer to `/examples/playwright-auth-bypass.spec.ts` to correctly seed the browser's `storageState` for isolated E2E flows without UI logins.

### 4. Initialization Confirmation
Please acknowledge that you have initialized this context by briefly summarizing **"Rule #1: The Reset Rule"** and **"Rule #5: The WebSocket Rule"** from the Constitution, and explaining how you will apply them to this session.