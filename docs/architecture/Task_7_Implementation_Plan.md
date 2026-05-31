# Task 7: Adult Leader Registration Form

This plan outlines the implementation for the new Adult Leader Registration flow. This form serves as the onboarding portal for adult leaders who have been invited to a stake by a camp director.

## Resolved Decisions

- **Terminology**: We are strictly using `stakeSlug` instead of `groupSlug`. 
- **Routing Structure**: In Next.js App Router, the `app/` folder is purely structural and does NOT appear in the browser URL. Therefore, the physical file `src/app/[stakeSlug]/dash/leader-signup/page.tsx` will render to the user as `domain.com/[stakeSlug]/dash/leader-signup`.
- **Invitation Mechanism**: We will use Supabase's native `auth.admin.inviteUserByEmail()`. 
- **Role Assignment**: The intended `profile_roles` will be passed as URL parameters in the invite link (e.g., `?role=adult_team_captain&role=ward_camp_director`).
- **Camp Director Invite UI**: We will build a new UI in the Camp Director's dashboard to select roles, enter the invitee's name and email, and fire off the email.
- **Camp Attendees Table**: Submitting the registration form WILL create a record in `camp_attendees` with `attendee_type = 'adult_leader'`.
- **ImageKit Integration**: 
  *Recommendation:* For end-users uploading photos directly from their browsers, the official **ImageKit Client SDK** (`imagekitio-react`) is the industry standard. It allows secure, direct-to-cloud uploads bypassing our server bandwidth. We will use the SDK for the frontend upload button. We will utilize your `imagekitio` Membrane skill for any backend admin/management tasks (like bulk deletions or purging caches) later on!

## Proposed Changes

### 1. Camp Director Invitation UI
**`src/app/[stakeSlug]/dash/invite-leaders/page.tsx`** [NEW]
- A dashboard page for Camp Directors.
- Form inputs: Invitee Name, Invitee Email, and a multi-select for Roles.
- Server Action: Calls `auth.admin.inviteUserByEmail()` and embeds the selected roles into the redirect URL parameter. 
- *Note: We will need to use the Supabase Admin client on the server to send this invite, as it requires Service Role privileges.*

### 2. Leader Registration Page
**`src/app/[stakeSlug]/dash/leader-signup/page.tsx`** [NEW]
- Hosts the adult leader signup flow.
- Reads `stakeSlug` and URL parameters (for the assigned roles).
- Presents the choice between **Social Login** and **Email/Password**.

### 3. Registration Form Component
**`src/components/forms/AdultLeaderRegistrationForm.tsx`** [NEW]
- **Fields**: First Name, Last Name, Email, Cell Phone, Profile Pic.
- **State Management**: 
  - *If Social*: Pre-fill the form with `user_meta_data` (Name, Email, Avatar URL).
  - *If Email/Password*: Start with blank fields and render an ImageKit uploader for the profile picture.
- **Submission Logic**: 
  - Updates the `profiles` table with the new fields and profile picture URL.
  - Parses the URL parameters and inserts the granted roles into `profile_roles`.
  - Creates a new record in `camp_attendees` linking to this `profile_id` with `attendee_type = 'adult_leader'`.
  - Redirects to `/[stakeSlug]/dash/`.

### 4. ImageKit Component
**`src/components/ui/ImageKitUploader.tsx`** [NEW]
- A reusable component wrapping the ImageKit SDK to handle direct uploads and return the URL.

## Verification Plan

### Automated Tests
- Create `src/components/forms/AdultLeaderRegistrationForm.test.tsx` using `vitest`.
- Mock Social Auth provider to test pre-filling of values.

### Manual Verification
- Navigate to the Camp Director dashboard and send a test invite to an email address with multiple roles selected.
- Click the link in the email (it will direct to `/test-stake/dash/leader-signup?roles=...`).
- Complete the form via Email/Password to verify ImageKit uploads the profile picture successfully.
- Verify `profiles`, `profile_roles`, and `camp_attendees` records are accurately created in the database.
