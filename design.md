# Design — ADK Agent Ecosystem V2

A locked system for the bilingual interactive portfolio. Every V2 route shares
the same typography, signal language, accessibility rules and interaction
voice; project pages vary through their approved macro-compositions.

## Genre

Signal Editorial: editorial hierarchy and restraint applied to a technical
control-plane interface.

## Macrostructure families

- Marketing / Home: asymmetric Split Diptych thesis with an interactive
  architecture proof, followed by varied editorial and workbench sections.
- App / System / Labs: Workbench. Controls and inspectable artifacts are the
  primary content.
- Content / Evidence / Learn / About: long-form paper sections with bounded
  tables, visible source states and restrained rules.

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
- Trace autoplay advances at approximately 1100 ms.
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

- Home may pair one thesis statement with a live architecture canvas.
- System and labs prioritize control density over decoration.
- Case studies use the six approved macro-compositions and one internal
  timeline each.
- Evidence and print views use the paper surface.

## What pages must share

- Wordmark and navigation behavior.
- Cyan active signal and visible focus.
- Display/body/mono families.
- Evidence taxonomy, simulation disclosure and interaction labels.
- Mobile drawer, Command Deck, locale behavior and voice controls.

## What pages may differ on

- Project-specific accent and macro-composition.
- Internal timeline shape, lab controls and artifact presentation.
- Density and paper/control-plane ratio.

## Hallmark record

- Previous macrostructure: Map / Diagram.
- V2 macrostructure: Workbench with Split Diptych thesis.
- Previous navigation: N6 masthead.
- V2 navigation: information-rich edge-aligned bar with Command Deck trigger;
  it keeps required destinations rather than imitating N9’s one-link silence.
- Previous footer: Ft4 dense colophon.
- V2 footer: Ft5 statement close.

