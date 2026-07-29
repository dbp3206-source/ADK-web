# CHANGELOG

## v3.6 final revision - 2026-07-29

- Added six bilingual, project-specific real-world case openings with constraints, artifact previews and simulator deep links.
- Expanded all 17 System Concepts with beginner-first explanations, examples, practical steps and failure guidance.
- Reworked Architecture Tuner, Failure Studio and Mastery Passport around natural-language decisions and actionable feedback.
- Verified 20 unit tests, 32 desktop browser tests, 32 mobile browser tests and a 76-page production build.

## v2.0 interactive preview — 2026-07-27

- Added complete Vietnamese-default and English route trees under `/vi/...` and `/en/...`; locale switching preserves route, query and hash.
- Added safe client-side fallback redirects for the previous non-locale routes.
- Replaced the static home composition with an interactive thesis cover, audience switcher, discovery modes, local progress, capability inspector, artifact gallery and pattern comparator.
- Rebuilt System Explorer with five presets, seven inspectable macro steps, topology changes, routing reason, Agent Card, internal workflow, tool/data contract, validation, artifact/fallback, deep links, text alternative and voice guide.
- Added six deterministic client-side micro-labs with explicit simulation labels, static fallback, reset, empty/error/fallback states and no live model/backend calls.
- Added browser voice narration, Command Deck, project-local timelines, sticky case-study TOCs, paper/print mode and deep-link copy.
- Preserved all six project identities with different case-study macro-compositions and artifact treatments.
- Added V2 evidence taxonomy and hid every owner/external action without a real configured value.
- Added dictionary parity, routing and lab calculation unit tests.
- Final verification: strict typecheck pass; 14/14 unit tests pass; production static build pass; 64/64 Playwright desktop/mobile tests pass, including axe, keyboard, reduced motion, direct refresh, legacy redirects and six responsive widths.
- Stable Lighthouse mobile audit: Performance 66, Accessibility 100, Best Practices 100, SEO 100. The throttled performance score remains a known limitation; observed LCP trace breakdown was approximately 1.14 s while Lighthouse’s simulated metric displayed 7.0 s.
- Official package benchmark: 87/100, capped by missing owner identity/contact/CV and verified project repository evidence. No production deployment was created.

## v0.1 baseline before V2 revision — 2026-07-27

- Framework: Next.js 16.2.12 App Router, React 19.2.8, TypeScript 5.9.3 strict mode.
- Package manager: npm 11.12.1 on Node.js 24.15.0.
- Deployment mode: fully static export (`output: "export"`, trailing slashes).
- Routes: `/`, `/projects`, six `/projects/[slug]`, `/system`, `/learn`, four `/learn/[slug]`, `/evidence`, `/about`, `/contact`, `/not-found`.
- Typecheck: passed.
- Unit tests: 8/8 passed.
- Production build: passed; the sandboxed first attempt could not fetch Google Font metadata, and the permitted network retry succeeded.
- Playwright desktop/mobile: 64/64 passed, including axe and reduced-motion coverage.
- Browser network: all 14 initial requests returned 200.
- Browser console: no uncaught errors; DevTools reported one issue for a form control missing `id` or `name`.
- Responsive screenshots captured at 1440, 1024, 768, 414, 375 and 320 px under `design-work/qa/baseline-v0.1/screenshots/`.
- No page-level horizontal overflow at the six required widths.
- Visual baseline finding: the home page contains very large empty vertical regions, especially on mobile, despite passing automated overflow tests.

## v0.1 — Build handoff
- Froze evidence-first static scope.
- Added six structured project models.
- Added distinct frontend art direction for each project.
- Added A2A System Explorer contract.
- Added requirements, page specs, tests, deployment and trust rules.
- Added copy-ready GPT Work prompt.
- Added source and blueprint PDFs.

## Pending owner inputs
Profile, contact, CV, repository URLs, source paths, screenshots, tests and commit hashes.
