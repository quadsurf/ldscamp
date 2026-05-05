import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en', 'es'],
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    output: 'public/locales/{{language}}/{{namespace}}.json',
  },
  // This connects the CLI to Google for "sync" commands
  translation: {
    provider: 'google-cloud',
    apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
  }
});