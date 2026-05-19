import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en', 'es'],
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    output: 'public/locales/{{language}}/{{namespace}}.json',
  },
  // This connects the CLI to Google for "sync" commands
  // @ts-ignore - The i18next-cli types might be outdated or missing this property
  translation: {
    provider: 'google-cloud',
    apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
  }
});