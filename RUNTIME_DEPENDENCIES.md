# Runtime Dependencies — V2.2

Internal build document.

## Website

- Node.js 24.15.0
- npm 11.12.1
- Next.js 16.2.12
- React 19.2.8
- TypeScript 5.9.3
- Vitest 4.1.10
- Playwright 1.62.0

## Agent replay environment

Installed in the ignored `.agent-replay-venv`:

- Python 3.12
- google-adk 2.5.0
- google-genai 2.14.0
- a2a-sdk 1.1.2
- python-dotenv 1.2.2
- pydantic 2.13.4
- uvicorn 0.51.0

The project requirements files do not pin Google ADK versions. The installed versions describe this verification environment only.

## Declared per project

Trip Planner:

- `google-adk`
- `python-dotenv`

Script Team:

- `google-adk`
- `python-dotenv`
- `pydantic`

World Cup Analyst:

- No `requirements.txt` was supplied.
- Source imports Google ADK and Google GenAI.
- Standard-library Wikipedia access requires outbound HTTPS.

Dashboard Insights:

- `google-adk`
- `python-dotenv`
- `pydantic`
- `markitdown`
- `chromadb>=0.5.0`
- `sentence-transformers>=3.0.0`
- `mcp>=1.0.0`
- Source also attempts to use `openpyxl` for Excel input.

A2A Orchestrator:

- `google-adk[a2a]`
- `python-dotenv`
- `uvicorn`

## Build-time only

- Python AST is used for exact `root_agent` extraction.
- JSON Schema validation uses `jsonschema`.
- Replay fixtures are static, sanitized build inputs; the public website does not execute Python or local commands.

