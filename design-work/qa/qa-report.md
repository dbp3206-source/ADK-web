# QA Report — Interactive V2

## Summary

Version 2.0.0 implements the approved Tier 1 interactive portfolio and selected Tier 2 features in the existing Next.js 16 static-export architecture. Vietnamese is the default; English has structural dictionary parity. The result does not add a live AI backend or invent owner, repository, commit, screenshot, test, metric, latency, uptime or testimonial evidence.

## Inputs and route

- Read all 82 files in the V2 revision package before implementation.
- Verified all 81 manifest-listed resources by SHA-256; the manifest itself is the only additional package file.
- Read and visually reviewed both supplied PDFs.
- Primary visual workflow: Hallmark (`Signal Editorial V3`, Workbench + Split Diptych).
- Supporting workflow: PDF inspection.
- Target environment: Next.js App Router, TypeScript strict mode, npm, static export.

## Implemented surface

- Root Vietnamese home plus `/vi/...` and `/en/...`.
- Projects index, six localized case studies, System, Learn, four lessons, Evidence, About, Contact and 404.
- Legacy route fallback redirects.
- Three discovery modes, progress rail, audience switcher and capability inspector.
- Five-preset System Explorer with seven steps and complete contract inspector.
- Six deterministic micro-labs.
- User-initiated Voice Guide with feature detection, transport controls, section navigation, locale voice preference and visible transcript.
- Accessible Ctrl/Cmd+K Command Deck.
- Artifact gallery, pattern comparator, project comparison view, sticky TOCs, copy deep link and print/paper mode.
- Conditional owner/CV/GitHub/LinkedIn/contact actions.

## Verification result

- TypeScript strict typecheck: pass.
- Unit tests: 14/14 pass across 5 files.
- Production build and 55-page static generation: pass.
- Playwright: 64/64 pass in one final run across desktop Chromium and mobile Chromium.
- Responsive widths: 320, 375, 414, 768, 1024 and 1440 px; no page-level overflow on tested core routes.
- axe-core: no serious or critical findings on core pages and all six case studies.
- Keyboard: mobile drawer focus trap/restore, Command Deck, filters, trace controls and labs verified.
- Reduced motion: information and controls preserved.
- Direct localized route refresh, old-route fallback and custom 404: pass.
- Console checks: no uncaught errors on acceptance routes.
- Placeholder external links: absent.

## Lighthouse mobile baseline

Stable audit using a dedicated Chrome debugging session:

- Performance: 66
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- FCP: 3.0 s
- simulated LCP: 7.0 s
- TBT: 250 ms
- CLS: 0
- Speed Index: 3.0 s

The observed LCP trace breakdown recorded about 16 ms time-to-first-byte and about 1.12 s element render delay for the hero H1. Lighthouse’s throttled simulation still reports 7.0 s, so the performance budget is not claimed as met. Micro-labs below the fold load through an IntersectionObserver boundary.

## Visual review

Rendered screenshots cover Home at all six approved widths and Home/System/Dashboard/A2A at 375 and 1440. Fixes made after visual and axe review include mobile lab min-width handling, focusable horizontal scroll regions, paper/dark contrast corrections, footer eager rendering, removal of duplicate System voice controls and desktop menu simplification.

## Trust and evidence

- Every trace visibly displays the localized simulation notice.
- Every lab states that it is a local simulation without a model or live service.
- Evidence uses: Documented in supplied material, Located in repository, Verified locally, Proposed upgrade and Needs verification.
- Source excerpt remains pending without a verified path and commit.
- Love Advisor avoids appearance scoring, diagnosis and sensitive-trait inference.
- No “production-ready” status is used.

## Benchmark

Official V2 score: **87/100**.

The package defines a hard cap of roughly 86–88 when owner identity/contact/CV and verified project repository evidence are absent. The implemented technical surface passes its functional and accessibility acceptance suite, but the overall portfolio cannot honestly reach the 96 target until those owner inputs are supplied. Mobile Lighthouse performance is also an explicit technical limitation.

## Remaining owner inputs

- Name and approved professional headline.
- Real email or another real contact action.
- GitHub and LinkedIn URLs.
- CV URL.
- Six project repository URLs.
- At least two verified repository paths, commits, source excerpts, tests and screenshots.

## Delivery state

- Static preview artifact is ready.
- Public preview may be shared.
- Production deployment is intentionally not created before owner preview approval.
