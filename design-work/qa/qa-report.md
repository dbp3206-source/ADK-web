# QA Report - V3.6.0

## Summary

V3.6 revises the six case-study openings and the System Concepts learning track while preserving the established navigation, simulator contracts, three learning tracks and bilingual route structure.

## Route and authority

- Release authority: `ADK AGENT ECOSYSTEM - FULL REVISION PLAN V3.6`.
- Implementation authority: current Next.js source and repository content.
- Primary visual route: existing Signal Editorial design system.
- Specialist skill: `hallmark` at `C:/Users/Bao Phuc/.agents/skills/hallmark/SKILL.md`.
- Working branch: `codex/v3.3-lite-revision`.
- Release: `3.6.0`.
- Local preview: `http://127.0.0.1:4173/vi/`.

## Implemented surface

- Added six bilingual, project-specific real-world case openings with context, pain, constraints, artifact preview and direct simulator scenario links.
- Kept each case visually distinct through code-native scenes and project accents without introducing external decorative assets.
- Expanded all 17 System Atlas nodes with beginner-first definitions, need signals, examples, practical steps, failure signals and related concepts.
- Reworked Architecture Tuner into six presets and four natural-language decisions with an explanation for every stack choice.
- Expanded Failure Studio with impact, possible causes, diagnosis prompt and explanation.
- Added actionable next steps to Mastery Passport.
- Added mobile layer selection and responsive controls without nested scrolling.

## Verification

- TypeScript strict check: pass.
- Unit tests: 20/20 pass across 6 files.
- Production build: pass; 76 static pages generated and `dist/` prepared.
- Desktop Playwright suite: 32/32 pass.
- Mobile Playwright suite: 32/32 pass.
- Overflow audit: pass at 320, 375, 414, 768, 1024 and 1440 px.
- Accessibility: no serious or critical axe findings on core routes and all six case studies.
- Console audit: no errors on audited routes.
- Interaction coverage: case-to-simulator deep links, 17 concept nodes, 6 tuner presets, 4 tuner questions, Failure Studio and Passport actions.

## Findings and fixes

- Case labels initially had insufficient contrast on paper surfaces; changed to neutral ink with a restrained accent marker.
- The selected mobile layer label was too dark on the active surface; corrected the selected-state text token.
- Long layer names clipped on narrow screens; shortened the public labels without changing meaning.
- Architecture Tuner became cramped at 768 px; retained the single-column layout until 64 rem.
- Final browser regression passed after these fixes.

## Screenshots

- `design-work/qa/screenshots/v36-dashboard-case-1440.png`
- `design-work/qa/screenshots/v36-trip-case-375.png`
- `design-work/qa/screenshots/v36-system-concepts-1440.png`
- `design-work/qa/screenshots/v36-system-concepts-375.png`
- `design-work/qa/screenshots/v36-system-concepts-768.png`

## Quality gate

Score: **94/100**.

Content fidelity 19/20; visual specificity 19/20; information architecture 15/15; typography/readability 15/15; composition 13/15; technical finish 13/15.

Hallmark pre-emit critique: Philosophy 5, Hierarchy 5, Execution 4, Specificity 5, Restraint 4, Variety 5. Slop test passed after rendered contrast, clipping, mobile and interaction review.

## Limitations

1. Simulator cases remain deterministic browser fixtures rather than live agent requests.
2. No live sports feed, booking service, database or authentication was added.
3. Public deployment accessibility is verified separately after deployment.

## Asset and license notes

No external visual asset, generated image, stock image or third-party template was introduced. The new scenes are native HTML/CSS and use the repository's existing licensed dependencies.
