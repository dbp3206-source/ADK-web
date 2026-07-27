# ADK Agent Ecosystem — V2.2 Baseline Report

Captured: 2026-07-27  
Baseline branch: `revision/interactive-v2-2`  
Baseline source version: `2.0.0`

## Runtime

- Framework: Next.js `16.2.12`, App Router.
- UI runtime: React `19.2.8`.
- Language: TypeScript `5.9.3`, strict mode.
- Package manager: npm `11.12.1`.
- Node.js: `24.15.0`.
- Deployment mode: static export via `output: "export"`.

## Production build

Result: pass.

- Next.js compiled successfully.
- TypeScript build stage passed.
- 55 static pages were generated.
- The first sandboxed attempt failed because `next/font` could not reach Google Fonts.
- A network-enabled retry completed successfully. No source change was required.

## Existing tests

- Typecheck: pass.
- Vitest: 5 files passed, 14/14 tests passed.
- Playwright: 63/64 passed.
- One existing mobile test timed out while waiting for the Trip Planner `Save state` control at `/en/projects/trip-planner/#lab`.
- Desktop version of the same six-lab test passed.
- Existing axe serious/critical checks passed on the covered routes.
- Existing direct-refresh and custom 404 checks passed.

## Route inventory

Public static routes before V2.2:

- `/`
- `/vi`, `/en`
- `/vi/projects`, `/en/projects`
- Six localized project routes under `/[locale]/projects/[slug]`
- `/vi/system`, `/en/system`
- `/vi/learn`, `/en/learn`
- Four localized lesson routes under `/[locale]/learn/[slug]`
- `/vi/evidence`, `/en/evidence`
- `/vi/about`, `/en/about`
- `/vi/contact`, `/en/contact`
- Legacy redirect/fallback routes without locale for projects, system, learn, evidence, about and contact
- Custom not-found routes

V2.2 migration requirement:

- Evidence routes must redirect to localized Projects.
- About routes must redirect to localized Home `#builder` or Contact.
- Learning Center must add paths, flashcards, question bank, practice and mock-exam routes.

## Responsive captures

Captured Home at:

- 320 × 900
- 375 × 900
- 414 × 900
- 768 × 1000
- 1024 × 1000
- 1440 × 1000

Files are stored in `design-work/qa/v2.2/baseline/screenshots/`.

## Browser findings

- Console errors: none on captured Home views.
- Runtime page errors: none on captured Home views.
- Page-level horizontal overflow: none at all six widths.
- Reduced-motion context was used for baseline screenshots.

Machine-readable findings:

`design-work/qa/v2.2/baseline/browser-findings.json`

## Baseline visual observations

- Strong editorial cover and clear six-step architecture ladder are already present.
- Home currently exposes Artifact Gallery and internal evidence-style language that V2.2 asks to replace.
- Existing labs visually prioritize deterministic browser simulation over source-backed replay.
- Mobile layout is readable, but the existing lazy lab boundary caused one automated mobile timeout.

## Package integrity note

All 54 entries listed by the V2.2 package manifest matched their SHA-256 hashes. The package contains 55 files on disk because `PACKAGE_MANIFEST.json` does not list itself.

