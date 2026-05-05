# Security and Error Handling
- Never hardcode API keys, secrets, or passwords. Always use `process.env`.
- Validate all incoming API request payloads using Zod schemas before processing them.
- Catch blocks must log errors to internal logger (`import { logger } from '@/lib/logger'`), not just `console.log`.