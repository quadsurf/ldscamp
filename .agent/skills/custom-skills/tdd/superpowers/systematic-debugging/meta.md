---
name: systematic-debugging
author: obra/superpowers
decription: Structured debugging methodology that mandates root cause investigation before attempting any fixes.
---

Summary:
- Four-phase process: root cause investigation, pattern analysis, hypothesis testing, and implementation with mandatory test cases
- Requires completing Phase 1 (evidence gathering, error analysis, data flow tracing) before proposing any fixes; blocks symptom-based patching
- Includes diagnostic instrumentation guidance for multi-component systems and backward call-stack tracing techniques to isolate failure points
- Enforces stopping and questioning architecture after three failed fix attempts, treating repeated failures as a sign of fundamental design problems rather than implementation issues