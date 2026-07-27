# QA Report

## Summary

Version 0.1.0 implements the approved Phase 1–3 static portfolio as a 21-route Next.js App Router export. The result uses the package-defined Cobalt Technical Editorial system, six distinct case-study macro-compositions and five repository-architecture trace presets. No live agent backend, owner facts, code excerpts, external links or product evidence were invented.

## Inputs

All Markdown, JSON, CSV and PDF files listed in `run-manifest.json` were read before implementation. Both PDFs were text-extracted page by page and visually inspected as rendered contact sheets.

## Route and tools

- Primary visual route: Hallmark, `C:\Users\Bao Phuc\.agents\skills\hallmark\SKILL.md`
- Supporting inspection route: PDF skill, `C:\Users\Bao Phuc\.codex\plugins\cache\openai-primary-runtime\pdf\26.723.12215\skills\pdf\SKILL.md`
- Browser verification: Playwright Chromium with axe-core
- Performance baseline: Lighthouse mobile preset
- Hosting preparation: Sites project created, exact source commit pushed and a saved source version created; no production deployment performed

Hallmark affected the work through its Map / Diagram macrostructure, editorial masthead, dense typographic footer, hand-built SVG enrichment, custom OKLCH tokens, reduced-motion policy and completed 58-gate anti-template audit.

## Generated outputs

- Editable application: repository root
- Static export: `out/`
- Screenshots: `design-work/qa/screenshots/`
- Playwright HTML report: `design-work/qa/validation/playwright-report/`
- Lighthouse HTML report: `design-work/qa/validation/lighthouse-home-final.report.html`
- Lighthouse JSON: `design-work/qa/validation/lighthouse-home-final.report.json`

## Structural checks

- TypeScript strict mode: pass
- Next.js production build: pass
- Static generation: 21 routes, including favicon and six case studies
- Unit tests: 8/8 pass across 3 files
- Production dependency audit: 0 known vulnerabilities
- Complete dependency audit: 0 known vulnerabilities
- Placeholder external actions: not rendered
- Custom 404 and direct route refresh: pass
- Print stylesheet present for case-study readability
- Below-fold architecture diagrams: code-split and use `content-visibility`

## Rendered-output checks

- Playwright: 64/64 pass across desktop Chromium and mobile Chromium
- Approved widths: 320, 375, 414, 768, 1024 and 1440 px; no page-level overflow
- Accessibility: all core, learning and case-study routes have no serious or critical axe findings
- Keyboard: trace controls, glossary tooltip, filters and mobile drawer verified
- Mobile drawer: focus trap, Escape close and trigger-focus restoration verified
- Reduced motion: moving trace signal removed while controls and information remain
- Console: no uncaught errors on tested routes
- Final visual inspection: home at 1280×800 and 1440; System Explorer at 1440 and 320; Dashboard Insights at 1440; home at 375

## Lighthouse baseline

Final mobile baseline:

- Performance: 84
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- FCP: 1.3 s
- LCP: 3.2 s
- TBT: 340 ms
- CLS: 0

The 2.5 s LCP value is a target and was not met in this local throttled run. The Lighthouse report was written successfully; the CLI then returned an `EPERM` warning while deleting its Windows temporary profile. This cleanup warning does not invalidate the saved report, but it is preserved in `command-log.txt`.

## Findings and fixes

- Replaced Next static-export prefetch navigation with full-page static links to eliminate local RSC prefetch 404s.
- Reused the approved Trip Planner request preset on the A2A case study so the orchestrator page has a trace without adding a sixth System Explorer preset.
- Corrected ambiguous Playwright selectors without weakening assertions.
- Added keyboard focus to horizontally scrollable SVG diagrams.
- Removed invalid SVG `listitem` roles and corrected A2A button/list semantics.
- Code-split below-fold architecture diagrams.
- Added a static favicon and deferred mono-font preload.
- Replaced the vulnerable third-party preview server with a read-only Node static server.

## Content fidelity and trust

- Every trace visibly states “Simulated trace from repository architecture.”
- Love Advisor keeps safety and uncertainty visible and contains no appearance scoring.
- Code evidence stays in a pending state until a real path, commit and excerpt are supplied.
- Evidence badges use only: Implemented in source, Verified locally, Proposed upgrade and Needs verification.
- No production-ready status, fabricated metrics, live latency, uptime, users, testimonials, screenshots, commits or source paths are presented.

## Asset and license notes

No external photographs, illustrations, screenshots, logos or stock assets are used. Diagrams and interface miniatures are original SVG/CSS representations derived from the approved architecture data. Fonts load through `next/font`; no font files were manually added to source. Runtime licenses inspected: Next.js and React (MIT), Playwright (Apache-2.0), Vitest (MIT), axe Playwright integration (MPL-2.0). Hallmark and the PDF skill were used as local workflows and are not redistributed in the output.

## Quality score

91/100.

- Content fidelity and factual correctness: 20/20
- Visual specificity: 19/20
- Structural originality: 14/15
- Typography and readability: 14/15
- Composition, spacing and hierarchy: 14/15
- Technical finish, editability and verification: 10/15

The technical score reflects the LCP target miss, pending owner evidence and lack of an approved production deployment.

## Blocked owner inputs

- Owner name and approved headline/background
- Contact email
- GitHub and LinkedIn URLs
- CV and dossier URLs
- Six repository URLs
- Verified source paths and implementation statuses
- Code excerpts, screenshots, test artifacts and commit hashes

## Deployment status

Sites contains a saved source version for the exact pushed commit. Sites reports no preview URL and no live URL. The specification requires preview approval and Critical acceptance-test completion before production deployment. Critical tests are complete; production remains intentionally blocked on preview approval.
