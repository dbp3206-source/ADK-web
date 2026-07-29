# QA Report - V3.3 Lite Revision

## Summary

The existing Next.js portfolio was revised in place. The visual direction remains the locked technical-editorial system, extended with a Field Guide, problem-led project discovery, complete case studies, detailed deterministic simulators, an easy/technical System Explorer, and three Learning tracks.

## Inputs and route

- Revision resources: `ADK_Web_ChatGPT_Work_V3_3_Lite_Revision`.
- Source authority: existing website source plus the six local ADK agent project source trees.
- Primary design workflow: Hallmark, using the existing design system as the source of truth.
- Target environment: Next.js App Router, TypeScript strict mode, static export.
- Rollback baseline: branch `main` at commit `234d39f`.
- Working branch: `codex/v3.3-lite-revision`.

## Implemented surface

- Home: ecosystem Field Guide, capability workbench and labelled Discovery Desk with honest no-match and tied-match handling.
- Projects: problem-led index and six output-first case studies with VI/EN parity.
- Simulators: operational trace questions for every step and six distinct artifact renderers.
- Safety and time scope: fixed 2022 World Cup public dataset; Love Advisor public scenarios limited to communication and planning preferences.
- System: default easy vertical trace plus the existing full technical explorer.
- Learning: Track A practical AI library, Track B project-by-project architecture learning, and Track C for 17 AI system concepts.
- Track C: five-layer dependency atlas, constraint-based Architecture Tuner, Failure Injection Studio and locally persisted Mastery Passport.
- Contact: real email copy action, owner role, featured projects, GitHub repository and a five-color click interaction on the primary links.
- Follow-up fixes: wrapped capability labels, distinct input/output per simulator scenario, non-overlapping Dashboard QA verdict, reliable System mode tabs and readable 01–07 technical headings.
- P0: removed global simulation banner, stale public version labels, nested main landmarks, vertical nested scrolling and mobile overflow risks.

## Verification

- TypeScript strict typecheck: pass.
- Unit tests: 18/18 pass across 6 files.
- Production build: pass; 76 static pages generated.
- Sites packaging: the cross-platform postbuild preserves the verified Next.js static export in `dist/client`, adds the required Cloudflare Worker pass-through entry point in `dist/server/index.js`, and copies hosting metadata into `dist/.openai`.
- Browser route audit: 26 VI/EN routes at 1440 px and 320 px, 52 rendered combinations.
- Browser findings after fixes: no horizontal overflow, broken images, failed requests, console errors, nested vertical scrollers or duplicate `main` landmarks.
- English parity check: no Vietnamese diacritic leakage above the audit threshold on the tested EN routes.
- Interactions verified: Field Guide selection, Discovery no-match and preset match, simulator trace, World Cup out-of-scope handling, Love Advisor safe presets, System mode switch, Learning search/filter, workflow failure state, checklist state and project switching.
- Follow-up simulator matrix: 18/18 scenarios across six projects have distinct inputs and distinct outputs within each project.
- Follow-up responsive checks: capability labels at 541 px, Dashboard QA at 430 px, System tabs at 390 px and Track C at 390/1440 px all pass without horizontal overflow.
- Track C interactions verified: concept selection, mastery persistence, scenario selection, range controls and diagnostic feedback.
- Contact link interaction verified: five click-triggered colors cycle in order and remain readable after visited state.
- Final screenshots: desktop 1440 x 900, tablet 768 x 1024 and mobile 320 x 720.

## Visual review and fixes

- Removed `content-visibility` placeholders from user-facing sections that produced blank full-page captures.
- Expanded condensed source views and simulator prompt fields to remove vertical nested scrolling.
- Confirmed stable page width and readable content at 320, 768 and 1440 px.
- Hallmark pre-emit critique: Philosophy 5, Hierarchy 5, Execution 4, Specificity 5, Restraint 4, Variety 5.
- Quality score: **92/100**.

## Asset and license notes

No new external visual asset, stock image, generated image or third-party template was added. The revision uses repository-owned UI, data resources and source snapshots.

## Limitations

1. Public demos are deterministic and do not call live agents or live sports services.
2. Historical source snapshots remain visible with explicit warnings where needed.
3. No unprovided CV or LinkedIn URL was invented.
4. No new Lighthouse audit was run.
5. ChatGPT Sites rejected the requested `public` access mode because internet publishing is not enabled for this workspace. The saved/deployed version can be completed, but "anyone with the link" remains blocked by workspace policy until an administrator enables public Sites publishing.
