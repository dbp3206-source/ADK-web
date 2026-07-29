# Design — ADK Agent Ecosystem V3.6

A locked system for the bilingual Interactive Agent Field Guide. Every route shares
the same typography, signal language, accessibility rules and interaction
voice; project pages vary through their approved macro-compositions.

## Genre

Signal Editorial Field Guide: editorial hierarchy and restraint applied to a
technical ecosystem that beginners can follow and engineers can inspect.

## Macrostructure families

- Marketing / Home: Field Guide path. A concise cover leads into one horizontal
  ecosystem route on desktop and one vertical route on mobile.
- App / System / Labs: Workbench. Controls and inspectable artifacts are the
  primary content.
- Content / Learn / Contact: long-form paper sections and task-led workbenches
  with bounded tables, progressive disclosure and restrained rules.

## Theme

- Dark control plane: `#080B14`, `#0E1526`, `#131C33`.
- Paper evidence: `#F6F7F3`, `#FFFFFF`, `#ECEFE8`.
- Ink: near-black / cool off-white according to surface.
- Active signal and focus: cyan `#22D3EE`.
- Project accents: teal, editorial red, deep green, muted plum, audit amber and
  cobalt. Project accents never replace the global focus signal.

## Typography

- Display: Space Grotesk, 700.
- Body and UI: Inter, 400.
- Code and metadata: JetBrains Mono, 500.
- Display tracking: `-0.035em`.
- Hero cap: `clamp(2.7rem, 6.2vw, 5.5rem)`.

These families are explicitly approved by the source package. System fallbacks
remain available through the same `next/font` strategy.

## Spacing

A named 4-point scale drives every page. Section rhythm deliberately alternates
between compact control-plane bands and generous evidence-paper passages.

## Motion

- State transitions use `cubic-bezier(.16, 1, .3, 1)`.
- Field Guide and trace autoplay advance at approximately 1100 ms.
- Only active signal paths travel; content does not perform decorative scroll
  reveals.
- Reduced motion removes traveling lines and preserves immediate highlights,
  information and controls.

## Microinteractions stance

- Success is shown in the changed control or artifact, not celebratory toasts.
- Copy actions swap to concise text feedback.
- Tooltips appear immediately on focus and with a pointer delay.
- Focus rings appear instantly.

## CTA voice

- Primary: dark/cyan rectangular control with a 4–7 px radius.
- Secondary: hairline outline or typographic link with arrow.
- All important actions remain single-line and at least 44 px high.

## Per-page allowances

- Home uses one lightweight ecosystem infographic; the full topology belongs
  only on `/system`.
- System and labs prioritize control density over decoration.
- Case studies use six project motifs and the shared Input → Process → Output
  simulator contract.
- Evidence and print views use the paper surface.

## What pages must share

- Wordmark and navigation behavior.
- Cyan active signal and visible focus.
- Display/body/mono families.
- Simulation disclosure appears at the relevant simulator, not globally.
- Mobile drawer, Command Deck, locale behavior and voice controls.

## What pages may differ on

- Project-specific accent and macro-composition.
- Internal timeline shape, lab controls and artifact presentation.
- Density and paper/control-plane ratio.

## V3.3 Field Guide rules

- Audience: recruiters, collaborators, engineers and practical AI learners.
- Primary use: identify a relevant project, inspect its process/output and learn
  the underlying technique.
- Tone: technical, editorial and approachable.
- Home enrichment: Tier B code-native infographic with semantic signal motion.
- App pages: Workbench.
- Content pages: Long Document with task-led entry points.
- Navigation: information-rich edge-aligned bar.
- Footer: statement close without a public preview version string.

## V3.6 case and learning rules

- Project pages begin with one RealWorldCaseFrame before the existing analysis.
- The frame uses six project accents and six code-native scene motifs; it never
  relies on a fabricated photograph, fixed height or nested scroll.
- Artifact previews close the visual column and link to a matching simulator
  scenario through a stable case id.
- System Atlas keeps the dark five-layer workbench but teaches the practical
  definition, recognition signals, examples and application steps first.
- Dependency, enablement and design questions live in a Deep Dive disclosure.
- Tuner controls use natural questions and explain why each concept enters the
  stack. Failure Studio starts with user impact. Passport always offers a next
  learning action.

## Hallmark record

- Previous macrostructure: Map / Diagram.
- V2 macrostructure: Workbench with Split Diptych thesis.
- Previous navigation: N6 masthead.
- V2 navigation: information-rich edge-aligned bar with Command Deck trigger;
  it keeps required destinations rather than imitating N9’s one-link silence.
- Previous footer: Ft4 dense colophon.
- V2 footer: Ft5 statement close.
- V3.3 scope: multi-page system refinement under the existing locked theme.

