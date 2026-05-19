# Overview
Summer Camp SaaS application for multiple religious groups to manage their camps. The system supports a super admin managing global templates and forms, and camp directors managing their respective groups (`group-slug`).

# Project Type
**WEB** (Next.js Application)

## Architecture Decisions
1. **Dynamic Forms Schema**: We will store form submissions as `JSONB` in Supabase to allow for flexible schema-less data that works well with GraphQL mutations and Realtime broadcasts.
2. **Digital Signatures**: A simple PNG image capture using `react-signature-canvas` is sufficient for the MVP.
3. **Database RLS**: We will use a hidden UUID `group_id` as the primary tenant identifier for Row-Level Security (RLS) for better resilience if a group renames their slug.

# Success Criteria
- Super admin can log in, access dashboard, and build forms using a dynamic form generator UI.
- Camp directors can sign up, create groups, instantiate with templates, manage Wards/Branches, and view people.
- Forms include specific fields, conditional logic, file uploads (ImageKit.io), and digital signatures (`react-signature-canvas`).
- Multi-tenancy achieved with proper routing (`/main`, `/admin`, `/{{group-slug}}`).
- No-redirect social auth flows functioning correctly.

# Tech Stack
- **Framework**: Next.js (App Router)
- **Database & Auth**: Supabase (utilizing no-redirect auth flow skill)
- **API & Realtime**: GraphQL (`pg_graphql`) and WebSockets (Supabase Realtime)
- **File Uploads**: ImageKit.io
- **Forms & Signatures**: React Hook Form, Zod, `react-signature-canvas`
- **Styling**: Tailwind CSS, shadcn/ui

# File Structure
```text
src/
  app/
    (marketing)/
      main/
        camp-director-signup/
        new-group-registration/
    (admin)/
      admin/
        page.tsx (admin login)
        dash/
          page.tsx
          forms-manager/
          wards-manager/
    [groupSlug]/
      page.tsx (Group home page)
      dash/
        parent-signup/
        register-for-camp/
        leader-signup/
  components/
    forms/
      FormGenerator.tsx
      SignaturePad.tsx
  lib/
    supabase/
      client.ts
      server.ts
```

# Task Breakdown

### Task 1: Setup Supabase Database Schema & Multi-Tenancy Roles
- **Agent**: `database-architect`
- **Skills**: `database-design`
- **Priority**: P0
- **Dependencies**: None
- **INPUT**: User roles, youth levels, entity relationships, form structures.
- **OUTPUT**: Supabase migration files setting up RLS policies, tables (Users, Groups, Forms, Fields, Wards/Branches, etc).
- **VERIFY**: Database migrations run successfully, and RLS policies correctly isolate group data.

### Task 2: Implement Supabase No-Redirect Auth Flow
- **Agent**: `frontend-specialist`
- **Skills**: `supabase-no-redirect-auth-flows`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: Auth flow requirements for admin, camp director, parent, leader.
- **OUTPUT**: Next.js auth utilities, login pages at `/admin` and signup pages.
- **VERIFY**: User can authenticate and session is persisted without a full page redirect.

### Task 3: Admin Form Generator UI
- **Agent**: `frontend-specialist`
- **Skills**: `form-cro`, `imagekitio`
- **Priority**: P1
- **Dependencies**: Task 1
- **INPUT**: 5 pre-existing default forms, advanced capabilities (signature, upload, conditional logic).
- **OUTPUT**: `FormGenerator` component and `/admin/forms-manager` page.
- **VERIFY**: Admin can create, edit, and save complex forms to the database.

### Task 4: Camp Director Onboarding Flow
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `form-cro`
- **Priority**: P2
- **Dependencies**: Task 2, Task 3
- **INPUT**: `camp-director-signup` and `new-group-registration` forms.
- **OUTPUT**: Pages at `/main/camp-director-signup` and `/main/new-group-registration`.
- **VERIFY**: Camp director can sign up and successfully create a new group.

### Task 5: Camp Director Dashboard & Ward Manager
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P2
- **Dependencies**: Task 4
- **INPUT**: Requirements for managing Wards/Branches and viewing people.
- **OUTPUT**: Pages for Ward/Branch creation, people table view with filtering.
- **VERIFY**: Camp director can add a Ward/Branch and view group members.

### Task 6: Parent & Youth Registration Flow
- **Agent**: `frontend-specialist`
- **Skills**: `form-cro`
- **Priority**: P2
- **Dependencies**: Task 1, Task 4
- **INPUT**: Parent signup form and Camp registration form requirements (signature, medical info).
- **OUTPUT**: `/dash/parent-signup` and `/dash/register-for-camp` under `[groupSlug]`.
- **VERIFY**: Parent can sign up and register a youth, rendering a successful digital signature.

### Task 7: Leader Registration Flow
- **Agent**: `frontend-specialist`
- **Skills**: `form-cro`
- **Priority**: P2
- **Dependencies**: Task 1, Task 4
- **INPUT**: Adult leadership registration form requirements.
- **OUTPUT**: `/dash/leader-signup` under `[groupSlug]`.
- **VERIFY**: Leader can access the form via encoded link and sign up.

# Phase X: Verification
- [ ] Run Lint & Type Check: `npm run lint && npx tsc --noEmit`
- [ ] Security Scan: Ensure no RLS leakage across multi-tenant groups.
- [ ] Manual E2E test for Admin Journey (Login -> Dashboard -> Create Form).
- [ ] Manual E2E test for Camp Director Journey (Signup -> Create Group -> Create Ward).
- [ ] Manual E2E test for Parent Journey (Signup -> Register Youth).
- [ ] Build Check: `npm run build`
