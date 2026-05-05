---
name: vitest
decription: Vite-powered unit testing framework with Jest-compatible API and native ESM support.
---

Summary:
 - Shares Vite's config, transformers, and plugins; supports TypeScript, JSX, and ESM without extra setup
 - Smart watch mode reruns only affected tests based on module graph; multi-threaded workers enable parallel execution
 - Comprehensive testing utilities: test/describe/expect API, mocking (functions, modules, timers), snapshots, and fixtures
 - Built-in code coverage via V8 or Istanbul; test filtering by name, file patterns, and tags
 - Advanced features include type-level testing, custom environments (node, jsdom, happy-dom), and multi-project workspaces