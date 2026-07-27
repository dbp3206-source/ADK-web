#!/usr/bin/env python3
"""Build sanitized V2.2 source evidence without importing project code."""

from __future__ import annotations

import ast
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


WORKSPACE = Path(__file__).resolve().parents[1]
PROJECT_PARENT = WORKSPACE.parent

PROJECTS = [
    {
        "slug": "trip-planner",
        "root": PROJECT_PARENT / "trip_planner",
        "publicRoot": "trip_planner",
        "agent": Path("trip_planner_agent/agent.py"),
        "tests": [Path("test_memory.py")],
        "runCommands": ["python test_memory.py"],
    },
    {
        "slug": "script-team",
        "root": PROJECT_PARENT / "script_team",
        "publicRoot": "script_team",
        "agent": Path("script_team_agent/agent.py"),
        "tests": [Path("test_agent.py")],
        "runCommands": ["python test_agent.py"],
    },
    {
        "slug": "worldcup-analyst",
        "root": PROJECT_PARENT / "worldcup_analyst",
        "publicRoot": "worldcup_analyst",
        "agent": Path("worldcup_agent/agent.py"),
        "tests": [Path("test_agent.py")],
        "runCommands": ["python test_agent.py"],
    },
    {
        "slug": "dashboard-insights",
        "root": PROJECT_PARENT / "dashboard_insights",
        "publicRoot": "dashboard_insights",
        "agent": Path("dashboard_insights_agent/agent.py"),
        "tests": [Path("test_agent.py")],
        "runCommands": ["python test_agent.py"],
    },
    {
        "slug": "a2a-orchestrator",
        "root": PROJECT_PARENT / "a2a_orchestrator",
        "publicRoot": "a2a_orchestrator",
        "agent": Path("orchestrator_agent/agent.py"),
        "tests": [],
        "runCommands": ["adk web --port 8000"],
    },
]


def file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dotted_name(node: ast.AST | None) -> str:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        left = dotted_name(node.value)
        return f"{left}.{node.attr}" if left else node.attr
    return ""


def root_assignment(tree: ast.AST) -> ast.Assign | ast.AnnAssign:
    matches: list[ast.Assign | ast.AnnAssign] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            if any(isinstance(target, ast.Name) and target.id == "root_agent" for target in node.targets):
                matches.append(node)
        elif isinstance(node, ast.AnnAssign):
            if isinstance(node.target, ast.Name) and node.target.id == "root_agent":
                matches.append(node)
    if len(matches) != 1:
        raise RuntimeError(f"Expected one root_agent assignment, found {len(matches)}")
    return matches[0]


def constants(tree: ast.Module) -> dict[str, Any]:
    values: dict[str, Any] = {}
    for node in tree.body:
        if not isinstance(node, (ast.Assign, ast.AnnAssign)):
            continue
        targets = node.targets if isinstance(node, ast.Assign) else [node.target]
        value = node.value
        if value is None:
            continue
        try:
            literal = ast.literal_eval(value)
        except (ValueError, TypeError):
            continue
        for target in targets:
            if isinstance(target, ast.Name):
                values[target.id] = literal
    return values


def static_value(node: ast.AST, known: dict[str, Any]) -> Any:
    try:
        return ast.literal_eval(node)
    except (ValueError, TypeError):
        if isinstance(node, ast.Name) and node.id in known:
            return known[node.id]
        return None


def list_names(node: ast.AST) -> list[str] | None:
    if not isinstance(node, (ast.List, ast.Tuple)):
        return None
    values: list[str] = []
    for item in node.elts:
        if isinstance(item, ast.Name):
            values.append(item.id)
        elif isinstance(item, ast.Call):
            agent_kw = next((kw.value for kw in item.keywords if kw.arg == "agent"), None)
            values.append(dotted_name(agent_kw) or dotted_name(item.func))
        else:
            values.append(dotted_name(item) or ast.unparse(item))
    return values


def parsed_structure(call: ast.Call, known: dict[str, Any]) -> dict[str, Any]:
    fields: dict[str, Any] = {
        "className": dotted_name(call.func),
        "workflowType": dotted_name(call.func),
    }
    callbacks: list[dict[str, str]] = []

    for keyword in call.keywords:
        if keyword.arg is None:
            continue
        key = keyword.arg
        if key in {"name", "model", "description", "instruction", "output_key"}:
            value = static_value(keyword.value, known)
            if value is not None:
                fields["outputKey" if key == "output_key" else key] = value
        elif key in {"tools", "sub_agents"}:
            value = list_names(keyword.value)
            if value is not None:
                fields["subAgents" if key == "sub_agents" else key] = value
        elif key.endswith("_callback"):
            value = dotted_name(keyword.value)
            if value:
                callbacks.append({"hook": key, "callable": value})

    if callbacks:
        fields["callbacks"] = callbacks
    return fields


def read_requirements(root: Path) -> list[str]:
    path = root / "requirements.txt"
    if not path.is_file():
        return []
    return [
        line.strip()
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    ]


def extract_project(project: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    agent_path = project["root"] / project["agent"]
    source = agent_path.read_text(encoding="utf-8")
    lines = source.splitlines()
    tree = ast.parse(source, filename=str(agent_path))
    assignment = root_assignment(tree)
    if assignment.end_lineno is None:
        raise RuntimeError("Python AST did not provide end_lineno")
    value = assignment.value
    if not isinstance(value, ast.Call):
        raise RuntimeError("root_agent is not assigned from a constructor call")

    relative_agent = f"{project['publicRoot']}/{project['agent'].as_posix()}"
    snippet = "\n".join(lines[assignment.lineno - 1 : assignment.end_lineno])
    structure = parsed_structure(value, constants(tree))
    tests = [
        f"{project['publicRoot']}/{path.as_posix()}"
        for path in project["tests"]
        if (project["root"] / path).is_file()
    ]

    root_evidence = {
        "project": project["slug"],
        "sourceStatus": "located-in-supplied-project",
        "sourceCommit": None,
        "path": relative_agent,
        "startLine": assignment.lineno,
        "endLine": assignment.end_lineno,
        "sha256": file_hash(agent_path),
        "source": snippet,
        "structure": structure,
        "tests": tests,
    }
    source_map = {
        "slug": project["slug"],
        "discoveryStatus": "confirmed",
        "projectRoot": project["publicRoot"],
        "agentFile": relative_agent,
        "rootAgentAssignments": [
            {
                "path": relative_agent,
                "startLine": assignment.lineno,
                "endLine": assignment.end_lineno,
                "className": structure["className"],
                "sha256": file_hash(agent_path),
            }
        ],
        "tests": tests,
        "runCommands": project["runCommands"],
        "dependencies": read_requirements(project["root"]),
        "environmentNeeds": [
            "Google ADK model credential for model-backed runs; variable name not verified because .env was not read."
        ],
        "blockers": [
            "No Git metadata in the supplied project folder; source commit is unavailable.",
            "No README.md, pyproject.toml or .env.example was supplied.",
        ],
    }
    return root_evidence, source_map


def main() -> int:
    root_agents: list[dict[str, Any]] = []
    source_projects: list[dict[str, Any]] = []
    for project in PROJECTS:
        evidence, source_map = extract_project(project)
        root_agents.append(evidence)
        source_projects.append(source_map)

    source_projects.append(
        {
            "slug": "love-advisor",
            "discoveryStatus": "blocked",
            "projectRoot": "",
            "agentFile": "",
            "rootAgentAssignments": [],
            "tests": [],
            "runCommands": [],
            "dependencies": [],
            "environmentNeeds": [],
            "blockers": [
                "No Love Advisor project path was supplied in the approved source-discovery scope."
            ],
        }
    )

    generated_at = datetime.now(timezone.utc).isoformat()
    output_dir = WORKSPACE / "content" / "v22"
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "root-agents.json").write_text(
        json.dumps(root_agents, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    (WORKSPACE / "PROJECT_SOURCE_MAP.json").write_text(
        json.dumps(
            {
                "generatedAt": generated_at,
                "workspaceRoot": "<WORKSPACE>",
                "projects": source_projects,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(root_agents)} exact root-agent extracts and {len(source_projects)} source-map entries.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
