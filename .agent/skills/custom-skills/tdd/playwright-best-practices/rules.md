---
name: playwright-best-practices
author: currents-dev
decription: Comprehensive reference guide for writing, debugging, and maintaining Playwright tests across all testing types and scenarios.
---

Summary:
 - Covers 50+ testing patterns including E2E, component, API, GraphQL, visual regression, accessibility, security, mobile, and Electron app testing
 - Includes activity-based lookup tables for writing new tests, debugging failures, fixing flaky tests, and infrastructure setup
 - Provides decision trees for test type selection, architecture patterns (POM vs fixtures), framework-specific guidance (React, Next.js), and error scenario handling
 - Addresses advanced topics: multi-user collaboration, WebSocket/real-time testing, OAuth/SSO mocking, third-party service integration, performance budgeting, and console error monitoring

for reference, this skill = this playwright-best-practices

Rule #0: ensure that playwright uses the expect(page).toHaveScreenshot() method for visual comparisons and/or regression testing.
Rule #1: this skill extends capabilities for all skills located in the two subdirectories listed below, aka "Core-TDD".
Rule #2: this skill must never overwrite or replace Core-TDD.
Rule #3: by default, this skill may never supercede doctrine and/or protocols and/or procedures found in Core-TDD, unless I the human authorize it.
Rule #4: you will find conflicts, and when you do, you must prompt me with a decision tree and short analysis of the conflict plus critical considerations, so that I the human can:
 - choose who or which side wins
 - decide how to improve/modify either this skill, or my Core-TDD skills
 - increase my understanding of SDLC and TDD best practices

Core-TDD Skills:
 - projectRoot/.agent/skills/custom-skills/tdd/test-creation/
 - projectRoot/.agent/skills/custom-skills/tdd/test-running/