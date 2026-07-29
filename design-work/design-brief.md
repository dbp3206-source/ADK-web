# Design Brief - V3.6

## Audience and viewing context

Recruiters and collaborators should recognize each project as a concrete case with a person, deadline, constraints and inspectable artifact. New AI learners need the 17 System Concepts explained through familiar work and everyday examples before technical dependencies appear.

## Core message

Six real cases show what each agent project changes, while the System Concepts track turns 17 technical terms into actions a beginner can apply.

## Desired reaction or action

Visitors should picture the user and stakes of a case, open its exact simulator scenario, then use the learning track to recognize, apply and explain a relevant system concept.

## Source authority

- `ADK AGENT ECOSYSTEM - FULL REVISION PLAN V3.6` is the release authority for this final scope.
- Current Next.js source in this repository is implementation truth.
- `ADK_Web_ChatGPT_Work_V3_3_Lite_Revision` is the approved V3.3 change package.
- `adk_agent_project` contains the supplied agent source and tests.
- Prepared JSON in `data/ai_practical` and `data/project_track` is the learning-content source.
- `AI_Cheatsheet_de_hieu_v4_17_AI_System_Concepts.xlsx` is the source authority for Track C's 17 AI system concepts.
- Public UI must distinguish deterministic samples from live execution.

## Content hierarchy

1. Preserve the approved Home, Field Guide, navigation and simulator.
2. Open each project with a RealWorldCaseFrame: scene, persona/context, story, pains, constraints, artifact and simulator CTA.
3. Keep the existing case-study analysis and technical evidence after that frame.
4. Preserve the five-layer Atlas while making its selected concept useful to a beginner first.
5. Turn Tuner, Failure Studio and Passport into scenario, explanation and next-action tools.

## Visual territory

Technical editorial field guide: dark execution surfaces, light evidence paper, restrained depth, semantic signal motion and artifact-first visuals. Cyan is a functional signal, not decoration.

## Brand and system constraints

Preserve Space Grotesk, Inter and JetBrains Mono; the cyan focus signal; six project accents; 4-point spacing; static export; VI/EN routes; visible focus; reduced motion; and honest simulation labels. Real-world scenes are code-native CSS compositions, not fabricated photographs.

## Anti-goals

- No generic AI gradients, glass cards, decorative motion, heavy WebGL, custom cursor or scroll hijacking.
- No static REQUEST / ACT / OUTPUT / RESULT hero diagram.
- No full System Explorer on Home.
- No chain-of-thought, fake live output, fake confidence or public `null`.
- No raw JSON or seven-question process wall in the public simulator.
- No appearance scoring, diagnosis or sensitive-trait inference.
- No time-sensitive World Cup claim without a fixed dataset or verification date.
- No nested scroll, fixed-height prose, repeated case illustration layout or technical-first concept definition.
- No edits outside the six project case openings and four named System Concepts surfaces.

## Output contract

Next.js static-export source on branch `codex/v3.3-lite-revision`; release `3.6.0`; responsive at 320, 375, 414, 768, 1024 and 1440 px; VI/EN parity; desktop/tablet/mobile screenshots; Vercel deployment through `main`; and a shareable ChatGPT Sites version from the existing project id.

## Reference interpretation

Keep the existing technical editorial identity and component ownership. V3.6 adds one reusable case-frame component with six visual motifs, then changes only the explanatory and practice surfaces named by the plan.

## Rollback

Baseline for V3.6 is commit `0faaa99` on `codex/v3.3-lite-revision`.
