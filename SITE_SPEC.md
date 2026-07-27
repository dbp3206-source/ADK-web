# SITE SPEC — ADK Agent Ecosystem Portfolio

## Vision
Create a technical editorial portfolio that proves architectural progression rather than presenting six equal chatbot demos.

> I built one agent, then kept adding the missing engineering layer: tools, state, roles, workflow, data quality, and finally A2A.

## Product type
Hybrid technical portfolio, interactive case-study system, knowledge layer and evidence archive.

## Audience
- **Recruiter:** scope, role, stack, maturity and contact path.
- **Engineer/hiring manager:** diagrams, traces, decisions, contracts, limitations and evidence.
- **Learner:** plain-language definitions beside technical concepts.

## Core jobs
1. Understand the six-step progression in under seven minutes.
2. Inspect one or more case studies deeply.
3. Trace a request through the A2A ecosystem.
4. Verify claims against source, tests and limitations.
5. Open CV, GitHub, dossier or contact when available.

## Primary journey
Home thesis → run a simulated system trace → inspect specialist → open case study → review evidence and limitations → open CV/GitHub/contact.

## Goals
- Communicate growth from tool use to distributed agents.
- Make architecture understandable without repository reading.
- Give recruiters memorable visual evidence.
- Preserve technical honesty.
- Work without a live backend.
- Be fully usable on mobile and by keyboard.

## Non-goals for MVP
- No real-time agent execution.
- No authentication or accounts.
- No persistent visitor data or public file upload.
- No production-readiness claim.
- No fabricated live metrics or evidence.
- No CMS, bilingual switch or complex WebGL dependency.

## Approved scope

### Must
Home; project index and filters; six case studies; simulated A2A System Explorer; Evidence; About; Contact; Learn/glossary; responsive navigation; accessibility; config-driven links; SEO metadata; QA plan.

### Should
Step inspector; architecture legend and text alternative; copy-code control; evidence badges; conditional downloads; print-friendly case studies.

### Could
Generated dossier; restrained page transitions; reading progress.

### Later
Live backend; file upload; real service health/latency; analytics; Notion embed route; Vietnamese localization.

## Visual concept
**Cobalt Technical Editorial**
- Near-white cool background and near-black type.
- Cobalt for action, focus, selected system nodes and active signal path.
- Small radii, light borders, minimal shadow.
- Large editorial numbers and asymmetric macro-layouts.
- No gradient, glow, glassmorphism, AI orb or equal-card project grid.

Every project has its own supporting accent, visual metaphor, layout rhythm and interaction grammar.

## Signature interaction
The A2A System Explorer supports five presets, keyboard controls, play/pause, step navigation and inspector. All MVP traces are labeled simulated.

## Trust policy
Allowed states:
- Implemented in source.
- Verified locally.
- Proposed upgrade.
- Needs verification.

Unknown evidence stays empty or pending. Never infer repository paths, tests or deployment.

## Responsive contract
Test 320, 375, 414, 768, 1024 and 1440 px.
- Desktop: diagram + inspector.
- Tablet: inspector below.
- Mobile: vertical trace.
- No page-level horizontal overflow.
- Code may scroll internally.
- Touch targets at least 44×44 px.

## Accessibility contract
Semantic landmarks; one H1; visible cobalt focus; WCAG AA body contrast; diagram text alternatives; no color-only signals; focusable tooltips; `aria-live`; reduced motion.

## Technical architecture
Static-first Next.js App Router + TypeScript, static routes, JSON/TypeScript data, SVG diagrams and no client secrets. Future backend isolated behind a server-side proxy.

## Success signals
- Recruiter can explain the progression after a short visit.
- Every project exposes architecture, decisions, limitations and evidence.
- Keyboard-only user completes the main journey.
- Critical acceptance tests pass.
- No fabricated claims appear.
