# Summer Camp SaaS - User Guide

## Authentication

The Summer Camp SaaS application uses a passwordless authentication flow via Google One-Tap/FedCM to provide a seamless login experience without redirecting you away from the app.

### Admin & Camp Director Login
1. Navigate to the `/admin/login` page.
2. If you are signed into Google on your browser, a prompt will appear asking you to continue with your Google account.
3. Click "Continue", and you will immediately be logged in and redirected to your dashboard.
4. If the automatic prompt does not appear or you dismiss it, you can manually click the "Continue with Google" fallback button.

### Multi-Tenancy & Access
- Your account is automatically associated with a **Group** (e.g., a specific camp or stakeholder group).
- **Row-Level Security (RLS)** is enforced at the database level so that you can only see or modify data (such as forms, wards, and youth) that belong to your Group.

*This guide will be updated as new features (Wards, Forms, Registration) are deployed.*
