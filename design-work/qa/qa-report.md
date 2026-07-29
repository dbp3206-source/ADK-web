# QA Report - V3.5.0 Preview

## Summary

The existing Next.js portfolio was revised in place against the mandatory V3.5 plan. This pass produces a verified preview and Sites-compatible package. The owner approved production deployment after reviewing the preview.

## Route and authority

- Release authority: `ADK AGENT ECOSYSTEM - FINAL MANDATORY REVISION PLAN V3.5`.
- Implementation authority: current Next.js source and repository content files.
- Visual route: existing technical-editorial design system.
- Working branch: `codex/v3.3-lite-revision`.
- Release: `3.5.0`.
- Preview: `http://127.0.0.1:4173/vi/`.

## Implemented surface

- Global: V3.5 dark/light tokens, stronger contrast, shared overflow protection and release metadata in the footer.
- Home: removed the static REQUEST/ACT/RESULT block and added a trip, revision and dashboard Artifact Preview Stack.
- Projects: seven human-need filters and five-field problem-first project records; technical filters moved into an advanced disclosure.
- Case studies: reordered to real situation, problem, why simple is insufficient, approach, simulator, result/value and technical detail.
- Simulator: 18 distinct scenarios, four public process blocks, six output renderers, public provenance badge and a raw technical drawer tied to the same case record.
- System: easy mode remains a seven-step vertical explanation; technical topology is retained on desktop and becomes inspector plus step cards on tablet/mobile.
- Learning: three tracks retained, including the 17-concept System Atlas; VI/EN route parity preserved.
- Safety: World Cup uses a fixed 2022 scope with a review date and no live claim; Love Advisor retains the bounded preference-only public behavior.

## Verification

- TypeScript strict check: pass.
- Unit tests: 18/18 pass across 6 files.
- Production build: pass; 76 static pages generated.
- Sites package: pass; output generated in `dist/`.
- Desktop Playwright suite: 31/31 pass.
- Mobile Playwright suite: 31/31 pass.
- Final targeted regression after visual fixes: 10/10 pass.
- Responsive overflow checks: pass at 320, 375, 414, 768, 1024 and 1440 px.
- Accessibility: no serious or critical axe findings on core routes, all six case studies and the three learning tracks.
- Console checks: no errors on audited routes.
- Browser interactions: project filters, three scenario inputs, four process blocks, output switching, provenance drawer, System mode switching and 17-concept track verified.

## Visual review

- Dashboard Simulator mobile: process and output remain inside their columns; claim text is readable on the dark panel.
- System at 768 px: desktop topology is replaced by a readable technical inspector and step cards.
- Case Study paper surfaces use paper text tokens; subtitles and decision labels no longer fade into the background.
- Contact, Field Guide and learning labels use darker ink variants on light surfaces while retaining bright accents on dark surfaces.

## Screenshots

- `design-work/qa/screenshots/v35-home-1440.png`
- `design-work/qa/screenshots/v35-projects-1024.png`
- `design-work/qa/screenshots/v35-dashboard-simulator-375.png`
- `design-work/qa/screenshots/v35-system-768.png`

## Quality gate

Score: **94/100**.

Content fidelity 19/20; visual specificity 19/20; information architecture 15/15; typography/readability 15/15; composition 13/15; technical finish 13/15.

## Limitations

1. Simulator cases are deterministic browser fixtures, not live agent requests.
2. No live sports feed, booking service, database or authentication was added.
3. Public Vercel access must be verified independently after the Git-triggered deployment completes.

## Asset and license notes

No new external visual asset, generated image, stock image or third-party template was introduced.
