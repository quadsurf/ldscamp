# Agent Instructions
- Always what tell me what skills are about to be loaded into the prompt before sending it off to the LLM model.
- Do not delete comments from existing code unless the comment is explicitly rendered obsolete by your changes.
- When outputting code blocks, only output the specific functions or blocks that need changing. Do not output the entire file unless asked.
- If you are unsure about a dependency's version, check `package.json` before suggesting an import.