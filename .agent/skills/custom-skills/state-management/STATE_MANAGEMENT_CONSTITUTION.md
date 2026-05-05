Document: /STATE_MANAGEMENT_CONSTITUTION.md
Version: v1.4
Purpose: Absolute Laws for State Management and AI Code Generation
When to Use: Mandatory validation check before writing any state-related code, integrating APIs, or writing tests.
Last Updated: 2026-03-24
Last Update Summary: Added the Cleanup Rule for memory leak prevention.

> **Handoffs:** [Architectural Principles -> /SKILL.md]

## Strict Guardrails
1. **The Reset Rule:** Every test suite MUST reset the Zustand store state. No exceptions. Leakage causes flaky AI agents.
2. **The Selector Rule:** Components MUST NOT consume the whole store. Use: `const user = useStore(s => s.user)`.
3. **The Local-First Rule:** If state is only used by one component and its immediate children, it MUST stay in `useState`.
4. **No API Caching:** Do not use Zustand to cache `GET` requests or GraphQL queries. Use Urql.
5. **The WebSocket Rule:** NEVER save Supabase WebSocket data payloads to a Zustand store. Urql's Graphcache handles data silently. If a subscription fires, Zustand may ONLY be used to trigger physical UI layout changes (e.g., opening a notification sidebar).
6. **The Cleanup Rule:** Any manual subscription (e.g., `useStore.subscribe`) created inside a React component MUST be cleaned up in a `useEffect` return block to prevent memory leaks and stale execution.