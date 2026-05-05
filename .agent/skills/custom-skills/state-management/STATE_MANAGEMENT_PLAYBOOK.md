Document: /STATE_MANAGEMENT_PLAYBOOK.md
Version: v1.2
Purpose: Zustand Implementation & Testing Recipes
When to Use: When actively writing code for a new store, feature, or testing flow.
Last Updated: 2026-03-24
Last Update Summary: Added Filter Driver and Draft Handoff recipes; migrated to virtual root pathing.

> **Handoffs:** [Boilerplate Files -> /examples/] | [Global Rules -> /STATE_MANAGEMENT_CONSTITUTION.md]

## Recipe: The Filter Driver (Zustand -> Urql)
> **Handoff:** [Complete Example -> /examples/urql-filter-driver.ts]

Use this pattern to drive GraphQL queries from global UI state. Zustand holds the "Filter", and Urql reacts automatically to the variable change.
```typescript
// 1. Zustand holds the UI state
const status = useFilterStore(s => s.status); 

// 2. Urql reacts automatically to the variable change
const [result] = useQuery({ 
  query: GetProjectsDocument, 
  variables: { status } 
});
```

## Recipe: The Draft Handoff (Urql -> Zustand -> Mutation)
Use this for complex multi-step editing to strictly protect Graphcache from mutable draft state.
1. **Fetch:** Get data via Urql `useQuery`.
2. **Draft:** On "Edit" click, call `useStore.setState({ draft: data })`.
3. **Edit:** The user edits the Zustand `draft` via standard React inputs.
4. **Save:** On "Save" click, pass the Zustand `draft` object to the Urql `useMutation` execution function.
5. **Clean:** On mutation success, clear the `draft` in Zustand. Graphcache will automatically update the UI with the new server data.
```typescript
// Conceptual Flow
const draft = useEditStore(s => s.draft);
const [, executeMutation] = useMutation(UpdateUserDocument);

const handleSave = async () => {
  const result = await executeMutation({ id: draft.id, input: draft.changes });
  if (!result.error) {
    useEditStore.getState().clearDraft();
  }
};
```

## Recipe: Creating a Store with Immer
For complex objects, use the Immer middleware to keep updates clean.
```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useAppStore = create()(immer((set) => ({
  user: { name: 'Guest', preferences: { theme: 'dark' } },
  setTheme: (theme) => set((state) => { state.user.preferences.theme = theme }),
})));
```

## Recipe: Vitest Automated Resets
Do not manually reset in every file. Ensure the helper at `/examples/store-reset-helper.ts` is running inside your `/resources/vitest.setup.ts`.

## Recipe: Playwright State Seeding
> **Handoff:** [Auth Bypass Example -> /examples/playwright-auth-bypass.spec.ts]

Inject state into `localStorage` before the page loads to force specific UI states without manually clicking through setup steps.
```typescript
test('user with items in cart', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('cart-storage', JSON.stringify({
      state: { items: [{ id: 'roof-leak-kit-1', qty: 1 }] }
    }));
  });
  await page.goto('/checkout');
});
```

## Recipe: DevTools Middleware (Standard)
> **Handoff:** [Example -> /examples/store-with-devtools.ts]

All global stores should be wrapped in the `devtools` middleware to enable time-travel debugging via the Redux DevTools extension. Name your store actions explicitly for cleaner debug logs.

## Recipe: subscribeWithSelector (CONDITIONAL)
> **Handoff:** [Example -> /examples/store-with-subscribe.ts]

⚠️ **AI AGENT INSTRUCTION - CONDITIONAL GATE:** ⚠️
DO NOT use `subscribeWithSelector` by default. Before writing any code that uses this middleware, you MUST pause and ask the user: 
*"Does this feature involve high-frequency updates (e.g., canvas/WebGL animations, or complex external analytics) that need to bypass React's render cycle?"*
- If the user says **YES**, proceed with the recipe below.
- If the user says **NO**, use standard `useEffect` or standard Zustand selectors.

**Usage:** Use this when a side-effect needs to occur based on a state change, but you want to avoid rendering a React component to handle it (e.g., syncing a WebGL canvas to a Zustand store). *Note: Standard WebSocket events are handled by Urql/Graphcache, not Zustand.*