# INTERACTION SPECIFICATION

## Global navigation
- Desktop inline links with a line-based active state.
- Mobile drawer traps focus, closes with Escape and restores focus.
- Current route uses `aria-current="page"`.

## Project filters
- Checkbox-like chips with default, hover, focus-visible, selected and disabled states.
- Multi-select behavior must be explained in UI.
- Clear action appears only with active filters.
- Result count uses `aria-live`.
- Empty state has one reset action.

## System Trace Player

### Controls
Preset, Play/Pause, Previous, Next, Restart, step count, related project and text alternative.

### Behavior
- New preset resets to step 1.
- Play advances about every 900–1400 ms; token default is 1100 ms.
- Pause preserves the step.
- Previous/Next always work.
- Active step updates path, node, inspector, text status and `aria-live`.
- Completion displays artifact and case-study action.

### Simulation label
Always visible; never tooltip-only.

### Reduced motion
No path travel. Use immediate node/edge highlights and keep every control.

## Architecture nodes
- Buttons only when details can be inspected.
- Focus exposes the same content as hover.
- Type is shown by shape/icon and written text.
- Agent: solid header; Tool: bracketed module; Workflow: container; Store: stacked symbol; Remote service: double border; Artifact: document shape.

## “Why this exists?” disclosure
Inline accordion with `aria-expanded`; opening one does not close others; explanation is 1–3 sentences.

## Code evidence
Only verified excerpts. Copy button returns text feedback. Mobile scroll is internal. Missing code uses a restrained pending panel.

## Evidence badges
Allowed states only: Implemented in source, Verified locally, Proposed upgrade, Needs verification. Icon + text required.

## Tooltips
Open on hover and focus; one sentence; mobile tap toggles safely.

## Project-specific interactions
- Trip: state drawer and key/value changes.
- Script: role handoff and revision comparison.
- World Cup: evidence/calculation/synthesis toggles.
- Love: parallel completion and schema merge.
- Dashboard: bounded QA loop and claim/evidence matrix.
- A2A: routing reason, Agent Card and fallback.

## Feedback states
Loading explains the active step. Error states what failed and what remains. Empty states suggest the next action. Permission state is reserved for a future backend.
