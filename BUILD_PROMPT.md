# MASTER BUILD PROMPT FOR GPT WORK

Build the website described in the uploaded `adk_agent_ecosystem_portfolio_build_package`.

## Operating rule
Read all package files before implementation. The package is the approved specification. Do not add product features outside it. Report contradictions or missing owner inputs instead of guessing.

## Objective
Create a polished, English-first technical portfolio for six Google ADK / Python AI-agent projects.

**Not six chatbots. Six architectural steps toward an agent ecosystem.**

Ordered ladder:
1. ACT — Trip Planner
2. DELEGATE — Script Team
3. COMPUTE — World Cup Analyst
4. COMPOSE — Love Advisor
5. VERIFY — Dashboard Insights
6. CONNECT — A2A Orchestrator

A recruiter should understand the progression in 3–7 minutes. An engineer should inspect architecture, request traces, decisions, failure modes and evidence.

## Build scope

### Phase 1 — Evidence-first static portfolio
Home; Projects; six case studies; System; Learn; Evidence; About; Contact; 404; static diagrams; conditional external links.

### Phase 2 — Interactive architecture
Five request presets; Play/Pause/Previous/Next/Restart; step inspector; routing reason; specialist focus; workflow reveal; tool/data step; artifact return; pattern filters; glossary tooltips; project-specific interactions.

### Phase 3 — Verification
Responsive behavior; keyboard accessibility; reduced motion; automated tests; production build; shareable preview.

Do not build a live AI-agent backend. All request traces are simulations derived from repository architecture.

## Trust behavior
Every playback must visibly display:

**Simulated trace from repository architecture**

Do not hide it in a tooltip.

Do not invent live latency, uptime, accuracy, users, repository paths, commits, tests, screenshots, code excerpts, production deployment or testimonials.

Render external actions only when a real URL exists in config.

Allowed evidence:
- Implemented in source.
- Verified locally.
- Proposed upgrade.
- Needs verification.

Never use “production-ready” as a status.

## Frontend direction
Name: **Cobalt Technical Editorial**

### Global rules
- Near-white cool canvas.
- Near-black typography.
- Cobalt for actions, focus, selected nodes and active signal.
- Small 4–8 px radii.
- Light blue-gray borders.
- Minimal shadow.
- Strong editorial typography and large index numbers.
- Asymmetric layouts and varied section rhythm.
- SVG diagrams.
- No gradient, glow, glassmorphism, AI orb or robot illustration.
- Do not make every label a pill.
- No 3×2 equal project-card grid as the primary composition.

Use Hallmark and high-quality Awwwards technical portfolios as principle references only. Do not copy layouts, content, code or assets.

### Typography
- Space Grotesk for display through `next/font` when available.
- Inter for body/UI.
- JetBrains Mono for code/metadata.
- Provide system fallbacks.
- Do not package font files.

## Project individuality
Implement `PROJECT_VIBE_SPECS.md`. The six pages need genuinely different macro-compositions:

1. **Trip Planner — Cartographic Utility**
   - itinerary canvas;
   - route/state trace;
   - state drawer;
   - teal supporting accent.

2. **Script Team — Editorial Redline Studio**
   - manuscript panel;
   - margin critique;
   - handoff timeline;
   - revision comparison;
   - editorial red accent.

3. **World Cup Analyst — Match Intelligence Desk**
   - evidence ledger;
   - calculation tape;
   - analyst report;
   - deep green accent.

4. **Love Advisor — Dual-Lens Synthesis**
   - mirrored parallel lanes;
   - synthesis merge;
   - structured schema;
   - visible safety/uncertainty;
   - muted plum accent.
   - No appearance scoring, aggressive tone or romantic clichés.

5. **Dashboard Insights — Operations Evidence Lab**
   - dominant report canvas;
   - ingestion/framework rail;
   - QA loop;
   - claim-evidence matrix;
   - archive receipt;
   - amber audit accent.
   - Largest featured case study.

6. **A2A Orchestrator — Network Control Plane**
   - interactive topology;
   - ports;
   - Agent Card inspector;
   - routing reason;
   - fallback;
   - cobalt signal path.

Use one coherent system while preserving these identities.

## Home composition
Do not build a generic marketing hero.

1. Asymmetric 42/58 thesis section: copy left, simulated architecture right.
2. Proof strip.
3. Capability ladder.
4. Featured Dashboard Insights.
5. Tall A2A Orchestrator panel.
6. Four remaining projects as editorial rows with unique mini-visuals.
7. Request anatomy.
8. Engineering honesty.
9. Compact contact terminal.

## System Explorer
Use `content/traces.json`.

Desktop: topology + inspector.  
Tablet: inspector below.  
Mobile: vertical trace.

Controls:
- preset;
- Play/Pause;
- Previous;
- Next;
- Restart;
- step counter;
- text alternative;
- related case study.

Auto-play about 1100 ms per step. Preserve manual controls.

With `prefers-reduced-motion`, remove traveling lines and use immediate highlights. Keep all information and controls. Use `aria-live`.

## Architecture language
Distinguish by shape/icon and text:
agent, tool, workflow, store, remote service, contract and artifact. No meaning by color alone.

## Content
Use `CONTENT_COPY.md` and all `content/*.json`.

Do not replace detailed content with filler. Preserve every project’s problem, architecture, flow, decisions, limitations and roadmap.

### Code evidence
Show only verified excerpts. Until provided, render a pending state. Do not create pseudocode that looks like repository source.

### Owner data
Use config placeholders internally and hide missing links. About may use the approved generic journey paragraph, but do not invent education or employment.

## Technical implementation
Use:
- Next.js App Router;
- TypeScript strict mode;
- static generation;
- Tailwind with custom tokens or CSS Modules;
- SVG architecture components;
- MDX only when useful;
- lightweight motion only where required;
- Vitest;
- Playwright;
- axe-core;
- Lighthouse baseline.

Content must be data-driven.

Recommended structure:
```text
app/
  page.tsx
  projects/
  system/
  learn/
  evidence/
  about/
  contact/
components/
  architecture/
  case-study/
  evidence/
  layout/
  projects/
  trace/
content/
lib/
styles/
tests/
```

## Required states
Where meaningful: default, hover, focus-visible, active, disabled, loading, error and empty.

Approved copy:
- Filter empty: “No project matches all selected patterns. Clear one filter.”
- Future live offline: “The live specialist is unavailable. The architecture trace is still available; live execution has been paused.”

## Responsive
Test 320, 375, 414, 768, 1024 and 1440 px.

- No page-level overflow.
- Mobile navigation drawer.
- 44 px minimum touch targets.
- Code scrolls internally.
- Important buttons do not wrap awkwardly.
- Architecture becomes vertical on mobile.

## Accessibility
- Semantic landmarks.
- One H1 per page.
- Logical H2/H3.
- Visible 2 px cobalt focus with 2 px offset.
- WCAG AA body contrast.
- Keyboard operation for all core interactions.
- Tooltips open on focus.
- Diagram text alternatives.
- `aria-live` for trace and filters.
- Reduced motion.
- Text feedback for copy-code.
- Drawer focus trap and restoration.

## Performance budgets
These are targets, not claimed results:
- mobile LCP below 2.5 s;
- lazy-load below-fold diagrams;
- no autoplay video;
- no unnecessary motion library in initial bundle;
- optimized WebP/AVIF;
- no more than two web font families plus mono through the same loading strategy.

## Testing and delivery
Implement `ACCEPTANCE_TESTS.md`.

Before reporting completion:
1. Run production build.
2. Run core unit tests.
3. Run Playwright desktop/mobile.
4. Run accessibility checks.
5. Check console and direct route refresh.
6. Verify placeholder external links do not render.
7. Verify no fabricated metrics/evidence.
8. Create a shareable preview.

## Required build report
Return:
- pages and features implemented;
- version;
- responsive coverage;
- tests and pass/fail;
- blocked owner inputs;
- known limitations;
- real preview URL only if provided by the environment;
- no production URL unless actually deployed.

Do not deploy production before preview approval and Critical acceptance tests.
