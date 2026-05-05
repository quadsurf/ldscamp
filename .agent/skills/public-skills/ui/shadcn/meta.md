---
name: shadcn
author: shadcn/ui
decription: Complete shadcn/ui component management for adding, searching, fixing, styling, and composing UI.
---

Summary:
- Manages the full component lifecycle: search registries, add components, view docs, preview changes with --dry-run and --diff, and intelligently merge upstream updates while preserving local modifications
- Enforces critical rules across forms (FieldGroup, Field, InputGroup, validation states), composition (Groups, overlays, Card structure), styling (semantic colors, gap spacing, size shorthand), and icons (data-icon attributes)
- Supports multiple registries (@shadcn, @magicui, @tailark, community presets) and provides component selection guidance via a reference table covering buttons, forms, overlays, navigation, charts, and layouts
- Injects project context automatically including aliases, framework, base library (radix vs base), icon library, Tailwind version, and resolved paths to ensure correct imports and APIs