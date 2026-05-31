# Task 6.75: Youth Roles Architecture (Option 2)

This plan outlines the implementation of a dedicated Youth Roles architecture. We will use a separate `youth_roles` table and a `youth_attendee_roles` junction table, ensuring clean separation from the authenticated adult permissions system.

## Proposed Architecture

### 1. Database Schema

**Table: `youth_roles`**
Stores the available leadership and organizational roles for youth.
- `id` (UUID)
- `stake_id` (UUID, nullable for global system defaults)
- `name` (TEXT)
- `is_system` (BOOLEAN, true for the default templates)

**Table: `youth_attendee_roles`**
Junction table allowing a many-to-many relationship (youth can stack multiple roles).
- `id` (UUID)
- `attendee_id` (UUID, references `camp_attendees.id`)
- `youth_role_id` (UUID, references `youth_roles.id`)

### 2. Pre-seeded Roles

**Youth Roles (`youth_roles` table):**
We will insert the following default roles as system-level (`is_system = true`, `stake_id = null`):
- none (default)
- camp president (1 per group limit logic enforced at UI validation layer)
- first councilor (1 per group)
- second councilor (1 per group)
- team captain (many)
- first mate (many)
- second mate (many)
- masterclass teacher (many)
- ycl (many)
- purser (many)
- fireside leader (many)

**Adult Roles (`roles` table addition):**
- Create a brand new adult system role called `adult_team_captain` to handle youth role assignment (this is entirely distinct from `non_parent_volunteer`).

### 3. Opt-in Template Inheritance Logic
By default, these global roles exist. To satisfy the requirement that a stake *only* gets these if the Camp Director "opts-in" during stake creation, we will update the `create_new_stake` RPC function. It will take a boolean `copy_youth_roles`. If true, it will physically copy these system roles into the new `stake_id`. Thus, stakes have full isolation and CRUD over their *own* copies of these roles.

### 4. Row-Level Security (RLS) Policies

**Youth Roles CRUD:**
- **Read:** All authenticated users can read all `youth_roles` globally (to see badging).
- **Create/Update/Delete:** Limited to `super_admin`, `admin`, `camp_director`, and `assistant_camp_director`.

**Youth Attendee Roles (Linking / Unlinking Roles):**
- **Read:** All authenticated users can read the junction table globally.
- **Link/Unlink (Assign/Revoke):** Limited to:
  - `super_admin`
  - `admin`
  - `camp_director`
  - `assistant_camp_director`
  - `ward_camp_director`
  - `adult_team_captain`
*(We will use the `profile_roles` junction table to verify these permissions before permitting inserts or deletes on the `youth_attendee_roles` junction table).*

## Verification Plan

### Database Migration
- Write and run the SQL migration (`20260519XXXXXX_create_youth_roles.sql`).
- Update `create_new_stake` RPC to handle the opt-in copying of youth roles.
- Verify RLS policies using the Supabase MCP tool.

### Codebase Updates
- Regenerate TypeScript types.
- Ensure `npx tsc --noEmit` and `npx vitest run` pass.
