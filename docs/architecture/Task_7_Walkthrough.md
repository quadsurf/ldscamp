# Task 7: Adult Leader Registration Form

I have successfully implemented the Adult Leader Registration Form and the Camp Director Invitation UI.

## What was Changed

1. **Camp Director Invitation UI** (`src/app/[stakeSlug]/dash/invite-leaders/page.tsx`):
   - Created a dashboard page allowing the Camp Director to input a name, an email address, and select from a dynamically loaded list of available `roles` (excluding `super_admin` and `admin`).
   - Uses a new Server Action (`src/app/actions/invite-leader.ts`) which securely utilizes the `SUPABASE_SERVICE_ROLE_KEY` to fire `auth.admin.inviteUserByEmail`. This automatically sends an invite email containing the assigned roles embedded securely within the URL query parameters.

2. **Adult Leader Registration Flow** (`src/app/[stakeSlug]/dash/leader-signup/page.tsx`):
   - Created the Next.js page that captures the `stakeSlug` and reads the `role` query parameters from the invite link.
   - Built the `AdultLeaderRegistrationForm` component, enforcing Zod validation using `react-hook-form`.

3. **Form Logic & Database Persistence**:
   - The form offers **Social Login** options (Google, Facebook) which automatically pre-fills data if chosen.
   - For **Email/Password** users, it mandates the upload of a profile picture utilizing the official `ImageKit SDK`.
   - On submission, it:
     1. Updates the `first_name` and `last_name` in the `profiles` table.
     2. Assigns the embedded roles by inserting them into `profile_roles`.
     3. Creates the required row in `camp_attendees` with `attendee_type = 'adult_leader'` and links the generated `profilePicUrl` to the `registration_data` JSON blob.

4. **ImageKit.io Integration**:
   - Implemented a secure backend API endpoint (`src/app/api/imagekit/auth/route.ts`) to dispense signature tokens.
   - Built a reusable frontend `ImageKitUploader` component (`src/components/ui/ImageKitUploader.tsx`) utilizing `imagekitio-react`.

## Verification

### Automated Tests
- ✅ Created the `AdultLeaderRegistrationForm.test.tsx` Vitest suite.
- ✅ Created the `adultLeaderRegistration.test.ts` Zod schema test to strictly adhere to the **Red Phase** of TDD governance for form creation.
- ✅ `vitest` successfully verified the schema validation paths.

### Next Steps for You (Manual Verification)
1. Ensure your `.env.local` contains the following keys:
   ```env
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=...
   IMAGEKIT_PRIVATE_KEY=...
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
2. Navigate to `http://localhost:3000/test-stake/dash/invite-leaders`.
3. Send a test invitation to an email address you have access to.
4. Click the link in the received email and complete the Adult Leader Registration form!
