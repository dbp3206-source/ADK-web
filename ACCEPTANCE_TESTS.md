# ACCEPTANCE TESTS

## Critical functional
- **AT-001:** Home shows six capability steps in order with correct links.
- **AT-002:** Empty CV/GitHub/dossier/repository URLs render no clickable placeholder.
- **AT-003:** Every project renders thesis, problem, architecture, trace, decisions, limitations, roadmap and evidence.
- **AT-004:** Every static trace keeps the simulation label visible.
- **AT-005:** Preset, Play/Pause, Previous, Next and Restart update step and inspector.
- **AT-006:** Keyboard-only user controls the trace and opens the case study.
- **AT-007:** Filters update results; clear restores all projects.
- **AT-008:** No-match state offers a clear reset.
- **AT-009:** No page-level overflow at 320, 375, 414, 768, 1024 and 1440 px.
- **AT-010:** Mobile System Explorer becomes a complete vertical trace.
- **AT-011:** Reduced motion removes moving paths but preserves functionality.
- **AT-012:** Only allowed evidence labels appear.
- **AT-013:** Love Advisor shows safety/uncertainty and has no aggressive copy or appearance scoring.
- **AT-014:** Interactive failure leaves static architecture and content available.

## Accessibility
- **AT-015:** All controls show visible 2 px cobalt focus with offset.
- **AT-016:** One H1 and logical heading order per page.
- **AT-017:** Every diagram has a text alternative.
- **AT-018:** Color is not the only signal.
- **AT-019:** Glossary tooltips work by keyboard focus.
- **AT-020:** Trace and filter updates are announced through `aria-live`.

## Content and trust
- **AT-021:** Missing code, screenshots, commits and tests remain pending.
- **AT-022:** No “production-ready” badge.
- **AT-023:** No unverified accuracy, revenue, usage, latency or performance result.
- **AT-024:** Evidence page explains implemented, verified, proposed and pending states.

## Performance and deployment
- **AT-025:** Below-fold diagrams are lazy-loaded or code-split.
- **AT-026:** Font loading respects the defined budget.
- **AT-027:** Raster previews use correct dimensions and modern formats.
- **AT-028:** All routes survive direct refresh on the chosen host.
- **AT-029:** Production preview has no uncaught console errors.
- **AT-030:** Case studies remain readable in print.
