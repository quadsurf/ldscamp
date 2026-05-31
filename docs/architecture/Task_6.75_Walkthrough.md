# Youth Roles Architecture (Task 6.75)

We have successfully implemented the backend architecture for our **Dedicated Youth Roles (Option 2)**. This completely segregates youth camp organizational roles from authenticated adult system permissions while still allowing stakeholders to assign multiple roles to individual teenagers.

## What Was Accomplished

### 1. Database Schema Additions
- **`youth_roles` Table**: A new standalone table designed specifically to hold youth organizational roles.
- **`youth_attendee_roles` Table**: A junction table that links youth from `camp_attendees` to `youth_roles`, supporting a many-to-many relationship where a teenager can stack multiple roles simultaneously.

### 2. Pre-seeded Data & Adult Capabilities
- Inserted `adult_team_captain` as a new base system role inside the `roles` table. This protects `non_parent_volunteer` from getting conflated.
- Pre-seeded 11 "System" youth roles (e.g., `camp president`, `ycl`, `team captain`) into the `youth_roles` table so they are available globally right out of the box.

### 3. Opt-in Role Inheritance
- Updated the `create_new_stake` RPC function. When Camp Directors create a brand new stake, the RPC dynamically grabs all of the global system youth roles and physically copies them into the new stake (if the `p_copy_youth_roles` flag is true). This grants every stake isolated CRUD powers over their *own* specific youth role records.

### 4. Row-Level Security
- Strictly defined Row Level Security (RLS) such that anyone can *read* youth roles for UI badging.
- Strictly isolated the ability to **Link/Unlink** youth roles to only: `super_admin`, `admin`, `camp_director`, `assistant_camp_director`, `ward_camp_director`, and the new `adult_team_captain`.

## Verification Steps
- ✅ Applied the SQL migration via the Supabase tool natively.
- ✅ Successfully regenerated `src/lib/supabase/database.types.ts` to include the new tables.
- ✅ Next.js Typescript checker (`npx tsc --noEmit`) passes with 0 errors.
- ✅ `vitest` test suite passes with a 100% success rate.

> [!NOTE]  
> The "1 per group limit" for the Camp President and Councilor roles is NOT enforced in the database to prevent migration locks. As discussed, this will be strictly handled by your frontend UI validation layer when assigning those specific roles!
