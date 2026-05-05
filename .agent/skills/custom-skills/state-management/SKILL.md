Document: /SKILL.md
Version: v1.2
Purpose: Advanced Client & Server State Management
When to Use: State management architecture, store creation, API data handling
Last Updated: 2026-03-23
Last Update Summary: Added strict boundary definitions between Urql (Graphcache) and Zustand, including WebSocket constraints.

> **Handoffs:** [Logic Rules -> STATE_MANAGEMENT_CONSTITUTION.md] | [Implementation Recipes -> STATE_MANAGEMENT_PLAYBOOK.md] | [Scanning Logic -> STATE_MANAGEMENT_CONTEXT_PROTOCOL.md]

## Architecture Summary
- **Zustand** = Global Client State (Auth, Theme, Multi-step forms, UI Filters).
- **React In-House** = Local UI State (Open/Close, Input values).
- **Urql (Graphcache)** = Server State & WebSockets (Never mirror API data in Zustand).

## The State Boundary (Urql vs. Zustand)
To prevent infinite render loops, stale data, and cache invalidation issues, you MUST adhere to the following integration patterns:

1. **The Golden Rule (No Mirroring):** Never copy Urql `useQuery` or `useSubscription` data into a Zustand store. Urql's Graphcache is a highly optimized, normalized caching engine. Copying its data to Zustand destroys its performance benefits and creates conflicting sources of truth.
2. **Pattern 1: The Strict Boundary:** Urql owns the data rendering; Zustand owns the UI layout. They run parallel and do not intersect (e.g., Urql renders a list of projects; Zustand controls if the sidebar is open).
3. **Pattern 2: The Filter Driver:** Zustand controls the queries. Store filter parameters (e.g., `status: 'active'`, `page: 2`) in Zustand, then pass them as `variables` into Urql. Urql will automatically react and refetch when the Zustand state changes.
4. **Pattern 3: The Draft Handoff:** The *only* time data crosses the boundary is for mutations. Fetch an entity with Urql, inject it into Zustand to act as a temporary "draft" for user edits, and clear the draft upon firing the Urql `useMutation` to save.
5. **The WebSocket Danger Zone:** When Supabase pushes data via WebSockets, Urql's Graphcache handles the cache updates silently in the background. **Do not save WebSocket payloads to Zustand.** Only trigger a Zustand action from a subscription if it requires a physical UI layout change (e.g., `openNotificationDrawer()`).

## Testing Philosophy
- **Vitest (Unit/Integration):** Test store logic directly. We use a global reset helper to prevent state leakage.
- **Playwright (E2E):** Test user outcomes. Use "State Seeding" to bypass manual setup steps.

## Schema Awareness
 - do not guess my database structure to write Urql quietly
 - do not write a single Urql query until you have first imported the Supabase GraphQL schema that I select, or until after you have forced me the human to manually provide you with it
 - Urql queries should be based off of and/or reference my exact Supabase schema