# ADK Agent Ecosystem Portfolio — Build Handoff

## Release

Current release: **3.5.0**.

The footer exposes the release version, source commit, build date and environment. V3.5 must be reviewed as a preview before any production deployment.

## Objective
Turn six Google ADK / Python projects into a polished technical portfolio that a recruiter can understand in 3–7 minutes and an engineer can inspect in depth.

> Not six chatbots. Six architectural steps toward an agent ecosystem.

## Package map
- `BUILD_PROMPT.md` — copy-ready master prompt for GPT Work.
- `SITE_SPEC.md` — frozen product, UX and technical scope.
- `PRODUCT_REQUIREMENTS.md` — requirements, priorities and non-goals.
- `SITEMAP.md`, `USER_FLOWS.md`, `PAGE_SPECIFICATIONS.md` — IA and journeys.
- `PROJECT_VIBE_SPECS.md` — unique frontend art direction for every project.
- `INTERACTION_SPEC.md` — exact controls and behavior.
- `COMPONENT_INVENTORY.md` — component responsibilities.
- `CONTENT_COPY.md` — production-ready core copy.
- `content/*.json` — project, glossary, navigation and trace data.
- `DESIGN_TOKENS.json`, `DATA_MODEL.json` — frontend system and content schema.
- `FEATURE_BACKLOG.csv`, `CONTENT_INVENTORY.csv`, `TRACEABILITY_MATRIX.csv` — implementation tracking.
- `ACCEPTANCE_TESTS.md`, `QA_RELEASE_CHECKLIST.md` — release gates.
- `DEPLOYMENT_PLAN.md`, `NOTION_EMBED_CHECKLIST.md` — environments and future embed.
- `references/` — core PDFs and design reference links.

## Recommended stack
- Next.js App Router + TypeScript.
- Static generation.
- JSON/TypeScript or MDX content.
- SVG architecture diagrams.
- Tailwind with custom tokens or CSS Modules.
- Motion only for meaningful signal-path feedback and with reduced-motion support.
- Vitest, Playwright, axe-core and Lighthouse.

## Build boundary
Approved build:
1. Evidence-first static site.
2. Interactive simulated architecture.
3. Responsive, accessibility and browser verification.

A live agent backend is a later phase and must not block the portfolio.
