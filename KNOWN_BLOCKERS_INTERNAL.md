# Known Blockers — V2.2

Internal only. Do not render on public pages.

## Source provenance

- None of the five supplied project folders contains Git metadata. Source commits cannot be verified.
- None contains `README.md`, `pyproject.toml` or `.env.example`.
- Love Advisor source path was not supplied, so exact source extraction and project execution are blocked.

## Test coverage

- Supplied Python files are interactive runners rather than automated assertion-based tests.
- A2A Orchestrator has no supplied test file.
- Existing project runners load local `.env` files. They cannot be executed unchanged because the approved process forbids reading those files.

## Runtime

- The first MSYS Python virtualenv attempt could not install `pydantic-core`; it was removed and replaced by a native Windows Python virtualenv.
- Google ADK 2.5.0 imports four project declarations successfully.
- A2A import requires environment loading to be disabled and reports `RemoteA2aAgent` as experimental.
- Dashboard full runtime dependencies are not yet installed; ChromaDB and sentence-transformers may trigger large downloads.
- Model-backed outputs remain blocked without an approved credential boundary.
- The A2A five-service topology cannot complete without the missing Love Advisor service on port 8004.

## Baseline website

- Existing Playwright baseline: 63/64 passed.
- One mobile six-lab test timed out waiting for the Trip Planner lab control.
- Production build requires Google Fonts network access when the font cache is empty.

## Package discrepancy

- The package manifest has 54 listed entries, while the package contains 55 files because `PACKAGE_MANIFEST.json` does not list itself.
