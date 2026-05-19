# SKILL: Supabase No-Redirect Authentication Flows

## Context
This skill defines the implementation pattern for integrating social login (OAuth/OIDC) into a Supabase application without triggering full-page browser redirects. This approach utilizes native popups or FedCM (Federated Credential Management) prompts to provide a seamless user experience, bridging the gap between third-party identity SDKs and Supabase's authentication session management.

## Core Mechanism
Instead of `supabase.auth.signInWithOAuth()`, which relies on server-side redirects, this pattern uses `supabase.auth.signInWithIdToken()`. 

The architectural flow is:
1. **Initialize Provider Library:** Load the identity provider's native frontend library (Google Identity Services, Apple JS, or Facebook SDK).
2. **Trigger Native UI:** Invoke the ephemeral pop-up or FedCM prompt over the application.
3. **Capture Credential:** Upon user consent, the provider's callback receives a cryptographic token (an OIDC ID Token or a proprietary Access Token).
4. **Establish Session:** Pass the captured token directly to Supabase via `signInWithIdToken`. Supabase verifies the signature on the backend and establishes the active user session.

## Supported Providers & Required Libraries

| Provider | Mechanism | Required Library | Token Type Returned |
| :--- | :--- | :--- | :--- |
| **Google** | FedCM / One-Tap | Google Identity Services (`https://accounts.google.com/gsi/client`) | OIDC ID Token |
| **Apple** | Native JS Popup | Sign in with Apple JS (`https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js`) | OIDC ID Token |
| **Facebook** | Native JS Popup | Facebook JS SDK (`https://connect.facebook.net/en_US/sdk.js`) | Access Token |

## Implementation Rules
1. **Environment:** Examples assume a React/Next.js environment utilizing the `@supabase/supabase-js` client.
2. **Fallback Strategy:** Always implement a standard redirect-based login fallback (`signInWithOAuth()`). Browsers enforce strict cooldown periods on FedCM prompts; if a user dismisses a prompt, they must have a manual way to initiate authentication.
3. **Security (Nonces):** For OIDC providers (Google/Apple), generate a cryptographic nonce on initialization and pass the raw nonce to `signInWithIdToken` to prevent replay attacks.
4. **Token Translation:** Supabase abstracts the difference between OIDC ID Tokens (Google/Apple) and standard Access Tokens (Facebook). Both are passed to the `token` parameter of `signInWithIdToken`.

## Example Implementations
Reference the `examples/` directory for syntax specific to each provider.