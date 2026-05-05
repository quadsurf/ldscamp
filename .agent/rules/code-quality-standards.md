# Front-End Excellence Checklist (2026 Edition)
> **Purpose:** This document defines the technical and quality constraints for AI agents and LLM-driven development.
> **Scope:** High-performance, accessible, and AI-maintainable web applications.

## 1. Architecture & AI-Friendliness
* **TypeScript by Default:** All logic must be type-safe. Avoid `any`. Use strict null checks.
* **Feature-Sliced Design (FSD):** Organize the codebase by business logic (Features, Entities, Pages) rather than just technical types (Components, Hooks). 
* **Explicit Public APIs:** Every module/slice must have an `index.ts` defining its public API. Agents must not reach into deep paths of other modules.
* **Schema-Driven Data:** Use Zod, Valibot, or TypeScript interfaces for all API responses and state shapes to ensure data integrity across the agent's context.

## 2. Document Head & Metadata
* **Semantic HTML5:** Use a proper DOCTYPE html and html lang="en" (or current locale).
* **Modern Favicons:** Use SVG for the main favicon. Provide a `favicon.ico` at the root only for legacy fallback.
* **Core Meta:** Viewport, Title (max 60 chars), and Description (max 155 chars) are mandatory.
* **Social Graph:** Include Open Graph (`og:`) and Twitter Card tags. Use high-res preview images (1200x630px).
* **Security Headers:** Ensure a Content-Security-Policy is defined or planned for server-side injection.

## 3. HTML & CSS Standard
* **Native Layouts:** Utilize CSS Grid and Flexbox exclusively, unless otherwise determined by me the human, ShadCN, Aceternity, and/or UI-UX-Pro-Max. Avoid utility-class bloat where native CSS (nesting, variables) is cleaner.
* **Accessibility (A11y):** Target WCAG 2.2 Level AA compliance.
    * Semantic elements (main, nav, header, footer) are non-negotiable.
    * Interactive elements must be keyboard-accessible and have visible focus states.
* **Typography:** Use `rem` for font sizes. Avoid "pixel-perfect" fixed widths to ensure fluid responsiveness.

## 4. Asset Optimization
* **Modern Formats:** Use **AVIF** as the primary image format with WebP as a fallback. 
* **Native Lazy Loading:** Use `loading="lazy"` on all off-screen images. Do not use external JS libraries for basic lazy loading.
* **Cumulative Layout Shift (CLS):** Always define `width` and `height` attributes (or `aspect-ratio` in CSS) to reserve space for media.
* **SVGs:** Inline SVGs for critical UI icons; use SVGO to strip metadata before committing.

## 5. Performance (Core Web Vitals)
* **LCP (Largest Contentful Paint):** Prioritize loading the hero image or main text. Use `fetchpriority="high"` for the primary LCP element.
* **INP (Interaction to Next Paint):** Minimize main-thread blocking. Offload heavy computations to WebWorkers or Wasm where necessary.
* **Zero-JS by Default:** For content-heavy pages, utilize Server Components (RSCs) or Static Site Generation (SSG) to minimize the initial JS bundle.

## 6. Security & Reliability
* **Sanitization:** All user-generated content must be sanitized before rendering.
* **HTTPS:** No mixed-content allowed. Force HTTPS.
* **Error Boundaries:** Implement robust error handling at the component and page levels to prevent application crashes during "vibe coding" iterations.

## 7. Writing Inner Functions Protocol
Keep a function nested if:
 - It is short (a few lines).
 - It relies heavily on variables in the parent function's scope.
 - It does not need to be reused anywhere else.
 - It does not require standalone unit testing.
Extract the function if:
 - It contains complex or testable logic that should be tested independently.
 - It makes the parent function difficult to read.
 - It could be useful to other parts of your codebase.

---
### ❌ Purged Items (Do Not Use)
* **Conditional Comments:** IE is deprecated; do not generate legacy Internet Explorer conditional comments.
* **Base64 Images:** Avoid Base64 for anything but tiny placeholders; it bloats the initial HTML.
* **Vendor Prefixes:** Modern build tools (PostCSS/Autoprefixer) handle this; do not write `-webkit-` or `-moz-` manually.
* **Polyfill Services:** Use "Baseline" browser features; avoid heavy polyfilling for features supported by >95% of modern browsers.