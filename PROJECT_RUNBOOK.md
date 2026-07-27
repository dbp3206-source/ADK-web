# Project Runbook — V2.2

Internal build document. Do not render this file as public website content.

## Shared runtime

- Isolated interpreter: `.agent-replay-venv/Scripts/python.exe`
- Python: 3.12
- Installed for controlled runs: Google ADK 2.5.0 with A2A support, `python-dotenv`, Pydantic and Uvicorn.
- Never load, print or copy project `.env` files.
- Model-backed runs require an owner-provided Google ADK credential through an approved environment boundary.

## Trip Planner

Source:

- `trip_planner/trip_planner_agent/agent.py`
- `trip_planner/test_memory.py`

Declared command:

`python test_memory.py`

Safe controlled checks:

- Import exact `root_agent`.
- Call `save_trip_detail` with an in-memory test context.
- Call `get_trip_details` and compare the resulting state.
- Exercise a missing-key/read case without contacting a model.

Model-backed happy-path itinerary generation is blocked until an approved credential is available.

## Script Team

Source:

- `script_team/script_team_agent/agent.py`
- `script_team/test_agent.py`

Declared command:

`python test_agent.py`

The supplied runner is interactive:

- option 1 uses in-memory agentic memory;
- option 2 uses SQLite and additionally requires ADK database support.

Safe controlled checks:

- Import the coordinator and three sub-agents.
- Run `block_unsafe_topics` with a mocked callback/request.
- Run `read_local_file` against an approved fixture inside the replay harness.
- Inspect output keys and handoff structure.

Draft/critique/revision model output is blocked until an approved credential is available.

## World Cup Analyst

Source:

- `worldcup_analyst/worldcup_agent/agent.py`
- `worldcup_analyst/test_agent.py`

Declared command:

`python test_agent.py`

Safe controlled checks:

- Import root and both AgentTool specialists.
- Run Wikipedia search only when network use is explicitly permitted.
- Run deterministic calculation fixtures separately from model synthesis.
- Publish external search runs as mocked when a fixture replaces Wikipedia.

Model synthesis and BuiltInCodeExecutor orchestration require an approved credential.

## Dashboard Insights

Source:

- `dashboard_insights/dashboard_insights_agent/agent.py`
- `dashboard_insights/test_agent.py`
- referenced custom tools, callbacks, RAG and MCP modules under `dashboard_insights/`

Declared command:

`python test_agent.py`

Safe controlled checks:

- Parse the exact `SequentialAgent` declaration.
- Exercise CSV/TXT extractors with approved fixtures.
- Run computation/QA fixtures in a test harness.
- Treat mocked RAG/MCP/model dependencies as `verified-mocked-replay`.

Full import/runtime additionally requires ChromaDB, sentence-transformers, MCP and MarkItDown. Model-backed stages require an approved credential.

## A2A Orchestrator

Source:

- `a2a_orchestrator/orchestrator_agent/agent.py`

Suggested local command from the project architecture:

`adk web --port 8000`

Specialist service commands:

- Trip Planner: `uvicorn a2a_server:a2a_app --host localhost --port 8001`
- Script Team: `uvicorn a2a_server:a2a_app --host localhost --port 8002`
- World Cup Analyst: `uvicorn a2a_server:a2a_app --host localhost --port 8003`
- Dashboard Insights: `uvicorn a2a_server:a2a_app --host localhost --port 8005`

Port 8004 requires the missing Love Advisor project.

Safe controlled checks:

- Import with environment-file loading disabled.
- Inspect five `RemoteA2aAgent` declarations.
- Run routing/fallback through a mocked Agent Card/service boundary.

The full five-service run is blocked by the missing Love Advisor source and approved model credentials.

