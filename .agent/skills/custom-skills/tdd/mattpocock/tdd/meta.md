---
name: matt's tdd
author: mattpocock/skills
description: Test-driven development with vertical slices, behavior-focused tests, and incremental red-green-refactor cycles.
---

Summary:
 - Emphasizes integration-style tests that verify behavior through public APIs, not implementation details; tests should survive refactors unchanged
 - Requires vertical slicing (one test → one implementation → repeat) instead of horizontal slicing (all tests first, then all code), preventing brittle, behavior-insensitive test suites
 - Includes planning phase to confirm interface changes, prioritize behaviors to test, and design for testability before writing code
 - Provides refactoring guidelines covering duplication extraction, module deepening, and SOLID principles, applied only after all tests pass