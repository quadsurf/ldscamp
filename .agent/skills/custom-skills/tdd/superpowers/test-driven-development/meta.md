---
name: test-driven-development
author: obra/superpowers
decription: Write tests first, watch them fail, then implement minimal code to pass.
---

Summary:
- Follows the red-green-refactor cycle: write a failing test, verify it fails correctly, implement minimal code to pass, then refactor while keeping tests green
- Requires deleting any production code written before tests exist; no exceptions for "reference" or "adaptation"
- Emphasizes watching tests fail as proof they actually test the right thing; tests that pass immediately prove nothing
- Covers common rationalizations (testing after, manual verification, sunk cost) with concrete rebuttals and a verification checklist to confirm TDD was followed