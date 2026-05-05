---
name: rules for using workflows and skills
decription: rules that must be followed when utilizing any skill or file found inside this skills/ subdir (nested subdirs/skills/files included)
---

### RULE #1: Invoke Skill Gating, as follows...

## STEP 1
Reminder: vudovn/antigravity-kit (a.k.a. agkit) has roughly 37 skills.

agkit WORKFLOWS...
COMMAND	| DESCRIPTION
/brainstorm |	Explore options before implementation
/create	| Create new features or apps
/debug	| Systematic debugging
/deploy	| Deploy application
/enhance	| Improve existing code
/orchestrate	| Multi-agent coordination
/plan	| Create task breakdown
/preview	| Preview changes locally
/status	| Check project status
/test	| Generate and run tests
/ui-ux-pro-max	| Design with 50 styles

Before shipping off to an LLM model any of my prompts that contain an agkit workflows command (see command list above), you must first execute this exact sequence:

 - scan only the names of those ~37 agkit skills to semantically determine (based on skill name only) which skills are relevant to my prompt's text, and then present those skill names to me as key-value pairs, like so:
 00: core-skills/agkit/{{skill-name}}
 01: core-skills/agkit/{{skill-name}}
 02: core-skills/agkit/{{skill-name}}
 (example list length/count above is 3, but can be any amount/length for this list batch and all list batches below)

 - scan only the names of all skills found in custom-skills/ (nested skill names too) to semantically determine (based on skill name only) which skills are relevant to my prompt's text, and then present those skill names to me as key-value pairs, like so:
 03: custom-skills/{{skill-name}}/
 04: custom-skills/{{skill-name}}/
 05: custom-skills/{{skill-name}}/
 (note the iterated key number for custom-skills/ continues right where the core-skills/agkit/ batch left off)

 - scan the names of all skills found in hidden-skills/ (nested skill names too) to semantically determine (based on skill name only) which skills are relevant to my prompt's text, and then present those skill names to me as key-value pairs, like so:
 06: hidden-skills/{{skill-name}}/
 07: hidden-skills/{{skill-name}}/
 08: hidden-skills/{{skill-name}}/
 (note the iterated key number for hidden-skills/ continues right where the custom-skills/ batch left off)

 - scan the names of all skills found in public-skills/ (nested skill names too) to semantically determine (based on skill name only) which skills are relevant to my prompt's text, and then present those skill names to me as key-value pairs, like so:
 09: public-skills/{{skill-name}}/
 10: public-skills/{{skill-name}}/
 11: public-skills/{{skill-name}}/
 (note the iterated key number for public-skills/ continues right where the hidden-skills/ batch left off)

 pls also critically note that nested {{skill-name}}s should include any subdirs as a prefix, e.g. custom-skills/{{skill-name}} could be rendered as custom-skills/tdd/superpowers/systematic-debugging/ so perhaps a better way of me conveying this, is: custom-skills/{{path-to-skill-name}}

 ## STEP 2
 allow me to select from the combined batch list above as many skills as i want, simply by entering in the numeric key that was temporarily assigned to each skill
 allow me to also manually append/add in skills that you considered non-relevant or that you were blind to because of .agentignore, simply by pasting in its path/ or the skill's text itself
 (note that selection actions can be directly in the CLI, or in an Implementation Plan Artifact generated in Step 1, any way you prefer handling this actually)

 ## STEP 3
 Read all the skills that I selected, and perform this mandatory pre-flight clean-up recipe:
1. **The DRY & Diff Analysis (Crucial Step):** perform a strict semantic comparison between all the selected skills, as follows:
    * **Prune Redundancy (DRY):** Silently drop any instructions, checklists, or rules that are duplicative, leaving behind only one instance of the instruction, checklist, or rule.
    * **Detect Conflicts:** Actively scan for instructional contradictions (e.g., one skill says "Use standard CSS", another skill says "Strictly use Tailwind"; or conflicting folder structure directives).
2. **The Conflict Resolution Gate:** * If NO conflicts are found, proceed silently to Step 7.
    * If ANY conflicts are found, you MUST look at the big picture, consider my objectives, consider path of least resistance but also lazy shortcut avoidance, evaluate success criteria, decipher intended outcome, then based on all those thought processes combined, you must silently declare the winning instruction, checklist, or rule (I am trusting you, so DON'T LET ME DOWN)
3. **Execution:** Once conflicts are resolved (or if none existed), synthesize the now-harmonious and non-redundant instructions, checklists, and/or rules into a "unified working context".

## STEP 4
based on this synthesized logic, send off the "unified working context" prompt to the selected LLM model to execute the workflow

## BONUS
based on the mission's outcome, provide feedback on how you and I (the human) can work together to improve this custom 4-step directive