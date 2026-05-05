# GLOBAL DIRECTIVE: BATON State Management & Continuity

## I. Objective & Authority
You are operating within the Antigravity IDE (AIDE) ecosystem. Your primary global directive for maintaining project context, whether engaged in deep coding tasks or general architectural discussions, is the strict management of the `BATON.json` file located at the project root. 

The `BATON.json` file is the **Single Source of Truth (SSOT)** for the active session state. You must treat this file as your internal memory.

## II. The "Check-In" Protocol
Because interactions range from autonomous tool-use to conversational brainstorming, you must update the `BATON.json` `SCRATCHPAD` based on the following universal triggers:

* **For Agentic/Coding Tasks:** Update the `SCRATCHPAD` strictly every **3 tool calls**. (e.g., Read Context -> Execute Action -> Verify Result).
* **For Conversational Tasks:** Update the `SCRATCHPAD` every **5 conversational turns** if no tool calls are being made, summarizing the current trajectory of the discussion.

*Rule of Thumb: Never let the session advance so far that a sudden model handoff would result in lost context.*

## III. Compaction & Pruning Logic
To maintain a token-miserly architecture, you must prevent the `BATON.json` file from accumulating stale execution logs or chatty conversational history.

* **The 10-Step Rule:** Once the `HISTORY` array exceeds 10 entries (actions or conversational milestones), you must summarize them into a single `MILESTONE` object and purge the granular logs.
* **Resolution-Based Purging:** Purge strictly by **Resolution**, not time. If a feature is shipped, a question definitively answered, a task is completed, or a bug resolved, its granular logs are considered stale and therefore must be compacted. Active blockers or unresolved discussions must be retained.

## IV. Emergency Circuit Breaker (80% Threshold)
If a context window reaches or breaches **80% capacity**, you must execute the following emergency protocol to prevent an Out of Memory (OOM) collapse and preserve the `BATON`:
1. **Halt All Execution:** Immediately stop all feature development or conversational generation.
2. **Execute Emergency Context Trim & Save:** Update the `BATON.json` one final time. Dump all peripheral context and retain ONLY:
    * The specific "Rules" and/or "Checklist" section(s) of the active directive.
    * The approved Architecture Decision Record (ADR) or primary goal for the current task(s).
    * The current file(s) actively being edited (if applicable).
3. **Explicit User Warning:** After successfully writing the final `BATON.json` update to the file system, you must output the exact phrase:
    **"Hey, I'm at 80%, please kill this session and restart me."**
    Do not perform any further actions after outputting this warning.

## V. BATON.json Schema Structure
When creating or updating the `BATON.json` file, you must strictly adhere to the following machine-readable JSON schema:

```json
{
  "GLOBAL_ANCHOR": {
    "active_adr_or_goal": "string (path to ADR or high-level objective)",
    "definition_of_done": "string"
  },
  "ACTIVE_HORIZON": {
    "current_mode": "coding|brainstorming|debugging",
    "active_focus": "string",
    "recent_steps_or_turns": [
      {
        "action": "string (tool call or conversation summary)", 
        "status": "success|failed|blocked|ongoing"
      }
    ]
  },
  "SCRATCHPAD": {
    "interaction_count": "integer (tracking tool calls or chat turns)",
    "dirty_files": ["array of strings"],
    "immediate_blockers_or_questions": "string or null"
  },
  "MILESTONES": [
    {
      "resolution_summary": "string", 
      "artifacts_produced": ["array of strings (files changed or decisions made)"]
    }
  ]
}
```

## VI. Initial Things You Need to Ask Me Right Away when you first read this file
 - Will this be a SaaS app or an app that must have companion documentation?
 If I answer yes, then continuously use all or most of the nested skills in hidden-skills/docs-writer/ to create documentation/user-guide docs along the way, as we build the app. Add it persistently to ADRs if necessary. I should not have to remind you to maintain these docs ever. These docs should be updated every time a new, meaningful, significant feature is either completed and verified, or modified in a way that materially changes how it needs to be explained and/or presented.
 - If I answer no, then do not invoke/involve any hidden-skills/docs-writer/ skills at all