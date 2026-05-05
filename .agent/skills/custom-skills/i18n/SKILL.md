# SKILL.md: Automated i18n Strategy (React/TypeScript)

## Objective
Implement a robust internationalization (i18n) system using `react-i18next` and `i18next-cli` that automates Spanish translations (via Google Cloud Translation API) for all UI text. Do not hardcode English strings in components.

## Tech Stack Context
* **Framework:** React / Next.js / TypeScript
* **UI/Styling:** TailwindCSS / shadcn/ui / Aceternity UI
* **Testing:** Vitest / Playwright (Follow Red-Green-Refactor TDD)
* **State/Data:** Zustand / Urql (Supabase GraphQL)

## 1. Interaction Protocol
* **NO HARDCODING:** Never render raw English strings in UI components. Use the `t()` hook from `react-i18next`.
* **USER PROMPT REQUIRED:** Before the first "Sync" operation, you **must** stop and prompt the user: "Please provide your Google Cloud Translation API Key and ensure it is added to your .env file as GOOGLE_TRANSLATE_API_KEY."
* **JSON SCHEMA:** Assume all English source strings live in `public/locales/en/common.json`. This file is generated automatically during the extraction phase.

## 2. Implementation Steps

### Phase 1: Environment Setup
1. Install core dependencies: `npm install i18next react-i18next i18next-http-backend i18next-browser-languagedetector`
2. Install dev dependencies: `npm install -D i18next-cli`

### Phase 2: Configuration Verification
The core configuration files are already included in the project scaffold. You must verify their existence and integrity:
1. **Verify i18n Plumbing:** Ensure `src/lib/i18n.ts` exists and utilizes `HttpBackend`, `LanguageDetector`, and `initReactI18next`.
2. **Verify CLI Config:** Ensure `i18next.config.ts` exists in the root directory and is configured for `google-cloud` translation with locales `['en', 'es']`.

### Phase 3: Development Workflow
1. **Component Creation:** When building components, use the `useTranslation()` hook. 
   * Example: `<span>{t('auth.login_button')}</span>`.
2. **Extraction:** Run `npx i18next-cli extract` to automatically sync keys to, parse components to, and build/update `public/locales/en/common.json`.
3. **Automation:** Run `npx i18next-cli sync --to es` to send new English keys to Google Cloud and generate Spanish translations.

## 3. Quality Control (TDD)
* **Red:** Write a Vitest test checking if a component renders the correct translation key output when the language is toggled.
* **Green:** Implement the component using `t()`.
* **Refactor:** Ensure the `common.json` keys are nested logically (e.g., `auth.login` instead of just `login`).

## 4. Maintenance
* Whenever new UI text is added, automatically run the `extract` and `sync` commands to keep the Spanish version up to date.