# Environment Requirements — V2.2

Internal build document.

## Required for website development

- Node.js and npm versions compatible with the existing lockfile.
- Network access during production build when `next/font` cache is empty.
- Chromium for browser and accessibility checks.

## Required for controlled agent runs

- Native Windows Python 3.12 runtime.
- Isolated virtual environment.
- Dependencies declared by the selected project.
- Approved Google ADK model credential for model-backed runs.

The project `.env` files were not read. Exact credential variable names are therefore not claimed.

## External services

- World Cup Wikipedia tool: outbound HTTPS to Vietnamese Wikipedia.
- Dashboard RAG: local ChromaDB storage and first-run embedding-model download.
- Dashboard MCP: Python stdio subprocess and access limited to the project `data/` directory.
- A2A: localhost ports 8001–8005 for five specialists and port 8000 for the orchestrator.

## Security boundary

- Never copy `.env`, secrets, credentials, raw environment dumps or personal absolute paths into fixtures.
- Public replay commands and paths must be sanitized and workspace-relative.
- Public browser code cannot execute local Python, shell commands or arbitrary file reads.
- Learning progress remains local browser storage only.

