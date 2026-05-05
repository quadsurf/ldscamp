// File: .agent/skills/custom-skills/environment-variables/examples/zod-syntax.ts
// Purpose: Demonstrate the required standard Zod method chaining API.
// Agents MUST use standard Zod method chaining. Do NOT use the deprecated zod/mini .check() syntax.

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// ❌ ANTI-PATTERN: zod/mini Functional API (FORBIDDEN)
/*
export const badEnv = createEnv({
  server: {
    // WRONG: The .check() method is from zod/mini and is no longer supported in this codebase.
    DATABASE_URL: z.string().check(z.url(), z.minLength(5)),
  },
  client: {},
  experimental__runtimeEnv: {}
});
*/

// ✅ CORRECT PATTERN: Standard Zod Method Chaining
export const env = createEnv({
  server: {
    // CORRECT: Chain validation methods directly off the initial Zod type
    DATABASE_URL: z.string().url().min(5),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  }
});