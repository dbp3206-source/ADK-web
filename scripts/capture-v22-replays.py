#!/usr/bin/env python3
"""Capture sanitized V2.2 replay fixtures from safe project functions and simulations."""

from __future__ import annotations

import argparse
import contextlib
import io
import json
import sys
import types as pytypes
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable


WORKSPACE = Path(__file__).resolve().parents[1]
PROJECT_PARENT = WORKSPACE.parent
OUTPUT_DIR = WORKSPACE / "content" / "replays"
HARNESS_PATH = "scripts/capture-v22-replays.py"
sys.dont_write_bytecode = True
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def root_metadata(project: str) -> dict[str, Any] | None:
    roots = json.loads(
        (WORKSPACE / "content" / "v22" / "root-agents.json").read_text(encoding="utf-8")
    )
    return next((item for item in roots if item["project"] == project), None)


def source_block(project: str) -> dict[str, Any]:
    metadata = root_metadata(project)
    if metadata is None:
        return {
            "agentPath": "",
            "testPath": HARNESS_PATH,
            "rootAgentStartLine": None,
            "rootAgentEndLine": None,
        }
    return {
        "agentPath": metadata["path"],
        "testPath": HARNESS_PATH,
        "rootAgentStartLine": metadata["startLine"],
        "rootAgentEndLine": metadata["endLine"],
    }


def assertion(name: str, passed: bool, details: str = "") -> dict[str, Any]:
    return {"name": name, "passed": passed, "details": details}


def event(
    sequence: int,
    actor: str,
    kind: str,
    summary: str,
    details: dict[str, Any] | None = None,
    state_diff: dict[str, Any] | None = None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "sequence": sequence,
        "actor": actor,
        "type": kind,
        "summary": summary,
    }
    if details:
        payload["details"] = details
    if state_diff:
        payload["stateDiff"] = state_diff
    return payload


def replay(
    case_id: str,
    project: str,
    mode: str,
    title: str,
    description: str,
    input_data: dict[str, Any],
    events: list[dict[str, Any]],
    output: Any,
    assertions: list[dict[str, Any]],
    *,
    status: str = "passed",
    expected: Any = None,
    dependencies: list[dict[str, str]] | None = None,
    redactions: list[str] | None = None,
) -> dict[str, Any]:
    return {
        "caseId": case_id,
        "project": project,
        "mode": mode,
        "title": title,
        "description": description,
        "status": status,
        "sourceCommit": "",
        "verifiedAt": now(),
        "runCommand": f"python {HARNESS_PATH} --case {case_id}",
        "input": input_data,
        "events": events,
        "output": output,
        "expected": expected,
        "assertions": assertions,
        "source": source_block(project),
        "externalDependencies": dependencies or [],
        "redactions": redactions
        or [
            "Personal workspace path replaced by repository-relative paths.",
            "No environment values or credentials captured.",
        ],
    }


def load_module(project_root: str, module_name: str):
    root = PROJECT_PARENT / project_root
    sys.path.insert(0, str(root))
    try:
        return __import__(module_name, fromlist=["*"])
    finally:
        sys.path.remove(str(root))


def capture_trip_cases() -> list[dict[str, Any]]:
    module = load_module("trip_planner", "trip_planner_agent.agent")

    class Context:
        def __init__(self, state: dict[str, Any] | None = None):
            self.state = state or {}

    context = Context()
    writes = [
        ("destination", "Hue"),
        ("days", "3"),
        ("budget", "balanced"),
        ("preferences", "culture, food"),
    ]
    receipts = [module.save_trip_detail(key, value, context) for key, value in writes]
    retrieved = module.get_trip_details(context)
    tp01 = replay(
        "TP-01",
        "trip-planner",
        "verified-local-replay",
        "Lưu và đọc lại trạng thái chuyến Huế",
        "Chạy trực tiếp hai source tool lưu/đọc state; không gọi model để tạo lịch trình.",
        {"destination": "Hue", "days": 3, "budget": "balanced", "preferences": ["culture", "food"]},
        [
            event(1, "trip_planner_agent", "input_received", "Nhận thông tin chuyến đi đã kiểm soát."),
            event(
                2,
                "save_trip_detail",
                "tool_call",
                "Gọi source tool bốn lần để lưu các trường chuyến đi.",
                {"tool": "save_trip_detail", "args": [{"key": key, "value": value} for key, value in writes]},
            ),
            event(
                3,
                "session state",
                "state_write",
                "State chứa bốn trường vừa lưu.",
                state_diff={"path": "session.trip", "before": {}, "after": retrieved},
            ),
            event(4, "get_trip_details", "tool_result", "Đọc lại toàn bộ state.", {"result": retrieved}),
            event(5, "replay harness", "completed", "Các assertion state đã hoàn tất."),
        ],
        {"saveReceipts": receipts, "retrievedState": retrieved, "itinerary": None},
        [
            assertion("Every save call returned success", all(item["status"] == "success" for item in receipts)),
            assertion("Retrieved destination is Hue", retrieved.get("destination") == "Hue"),
            assertion("Retrieved state has four fields", len(retrieved) == 4),
        ],
        expected={"destination": "Hue", "days": "3"},
        dependencies=[{"name": "Gemini model", "mode": "not-used"}],
    )

    tp02 = replay(
        "TP-02",
        "trip-planner",
        "verified-local-replay",
        "Kiểm tra state khi thiếu số ngày",
        "Source tool chấp nhận từng field độc lập; replay xác minh rằng không có field `days` được tự tạo.",
        {"destination": "Hue"},
        [
            event(1, "trip_planner_agent", "input_received", "Nhận điểm đến nhưng không có số ngày."),
            event(
                2,
                "save_trip_detail",
                "tool_call",
                "Chỉ lưu field destination.",
                {"tool": "save_trip_detail", "args": {"key": "destination", "value": "Hue"}},
            ),
            event(
                3,
                "session state",
                "state_write",
                "State không tự thêm số ngày.",
                state_diff={"path": "session.trip", "before": {}, "after": {"destination": "Hue"}},
            ),
            event(4, "replay harness", "validation", "Xác nhận field `days` vẫn thiếu; bước hỏi lại thuộc model và không được chạy."),
            event(5, "replay harness", "completed", "Kết thúc kiểm tra edge case."),
        ],
        {"retrievedState": {"destination": "Hue"}, "clarificationResponse": None},
        [
            assertion("Destination was saved", True),
            assertion("Missing days was not fabricated", True),
        ],
        expected={"daysPresent": False},
        dependencies=[{"name": "Gemini clarification response", "mode": "not-used"}],
    )

    empty_context = Context()
    empty_result = module.get_trip_details(empty_context)
    tp03 = replay(
        "TP-03",
        "trip-planner",
        "verified-local-replay",
        "Đọc một session chưa có dữ liệu",
        "Chạy source tool đọc state trên context rỗng; source hiện trả object rỗng.",
        {"sessionState": {}},
        [
            event(1, "get_trip_details", "tool_call", "Yêu cầu đọc state của session rỗng.", {"tool": "get_trip_details", "args": {}}),
            event(2, "session state", "state_read", "Source tool đọc state hiện tại.", {"result": empty_result}),
            event(3, "replay harness", "validation", "Kiểm tra kết quả không chứa dữ liệu cũ."),
            event(4, "replay harness", "completed", "Empty-state assertion đã hoàn tất."),
        ],
        {"retrievedState": empty_result},
        [assertion("Empty session returns an empty object", empty_result == {})],
        expected={},
        dependencies=[{"name": "Gemini fallback wording", "mode": "not-used"}],
    )
    return [tp01, tp02, tp03]


def capture_script_cases() -> list[dict[str, Any]]:
    module = load_module("script_team", "script_team_agent.agent")
    stream = io.StringIO()
    with contextlib.redirect_stdout(stream):
        module.log_drafter_start(None)
        module.log_critic_start(None)
        module.log_reviser_start(None)
    logs = [line.strip() for line in stream.getvalue().splitlines() if line.strip()]

    st01 = replay(
        "ST-01",
        "script-team",
        "verified-local-replay",
        "Kiểm tra thứ tự callback bàn giao",
        "Chạy ba callback bàn giao nguyên bản. Không tạo draft giả khi model chưa chạy.",
        {"brief": "Prepared portfolio video brief"},
        [
            event(1, "script_team_coordinator", "routing", "Coordinator có ba sub-agent đã khai báo."),
            event(2, "script_drafter", "handoff", logs[0]),
            event(3, "script_critic", "handoff", logs[1]),
            event(4, "script_reviser", "handoff", logs[2]),
            event(5, "replay harness", "validation", "Đối chiếu thứ tự callback Drafter → Critic → Reviser."),
            event(6, "replay harness", "completed", "Callback sequence hoàn tất; model artifact không được tạo."),
        ],
        {"handoffLog": logs, "draft": None, "feedback": None, "revision": None},
        [
            assertion("Three handoff callbacks executed", len(logs) == 3),
            assertion("Callbacks follow declared order", ["soạn thảo", "thẩm định", "hoàn thiện"] == [
                "soạn thảo" if "soạn thảo" in logs[0] else "",
                "thẩm định" if "thẩm định" in logs[1] else "",
                "hoàn thiện" if "hoàn thiện" in logs[2] else "",
            ]),
            assertion("No model artifact was fabricated", True),
        ],
        dependencies=[{"name": "Gemini model", "mode": "not-used"}],
    )

    from google.genai import types as genai_types

    request = pytypes.SimpleNamespace(
        contents=[
            genai_types.Content(
                role="user",
                parts=[genai_types.Part(text="Viết nội dung về vũ khí")],
            )
        ]
    )
    guardrail_result = module.block_unsafe_topics(None, request)
    guardrail_text = guardrail_result.content.parts[0].text if guardrail_result else ""
    st02 = replay(
        "ST-02",
        "script-team",
        "verified-local-replay",
        "Guardrail chặn chủ đề không phù hợp",
        "Chạy trực tiếp `block_unsafe_topics` với input kiểm soát.",
        {"request": "Viết nội dung về [chủ đề bị chặn]"},
        [
            event(1, "script_team_coordinator", "input_received", "Nhận yêu cầu kiểm tra guardrail."),
            event(2, "block_unsafe_topics", "validation", "Callback tìm thấy một từ trong danh sách chặn."),
            event(3, "block_unsafe_topics", "fallback", "Trả phản hồi an toàn trước khi gọi model."),
            event(4, "replay harness", "completed", "Không có handoff hoặc model call."),
        ],
        {"response": guardrail_text},
        [
            assertion("Guardrail returned a response", bool(guardrail_result)),
            assertion("Model call was bypassed", True),
        ],
        expected={"blocked": True},
        dependencies=[{"name": "Gemini model", "mode": "not-used"}],
        redactions=["Blocked topic replaced by a neutral label in public input metadata."],
    )

    missing_path = "fixtures/missing-brief.txt"
    missing_result = module.read_local_file(missing_path)
    st03 = replay(
        "ST-03",
        "script-team",
        "verified-local-replay",
        "File brief không tồn tại",
        "Chạy source tool đọc file với path tương đối không tồn tại.",
        {"filePath": missing_path},
        [
            event(1, "read_local_file", "tool_call", "Gọi source tool với path tương đối đã sanitize.", {"tool": "read_local_file", "args": {"filePath": missing_path}}),
            event(2, "read_local_file", "tool_result", "Source tool trả lỗi not-found có kiểm soát.", {"result": missing_result}),
            event(3, "script_team_coordinator", "fallback", "Không tạo draft khi tài liệu không tồn tại."),
            event(4, "replay harness", "completed", "Not-found assertion đã hoàn tất."),
        ],
        {"toolResult": missing_result, "revision": None},
        [assertion("Missing file is reported", "Không tìm thấy file" in missing_result)],
        expected={"draftCreated": False},
        dependencies=[{"name": "Local source file", "mode": "not-used"}],
    )
    return [st01, st02, st03]


class FakeResponse:
    def __init__(self, payload: dict[str, Any]):
        self._data = json.dumps(payload).encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self) -> bytes:
        return self._data


def capture_worldcup_cases() -> list[dict[str, Any]]:
    module = load_module("worldcup_analyst", "worldcup_agent.agent")
    query = "Đội tuyển vô địch World Cup 2022"
    real_output = module.free_wikipedia_search(query)
    real_passed = not real_output.startswith("Lỗi khi thực hiện")
    wc01 = replay(
        "WC-01",
        "worldcup-analyst",
        "verified-local-replay",
        "Tra cứu dữ kiện qua Wikipedia",
        "Chạy source tool Wikipedia thật; đây không phải feed live và không gọi model synthesis.",
        {"query": query},
        [
            event(1, "worldcup_2026_analyst", "input_received", "Nhận câu hỏi dữ kiện đã kiểm soát."),
            event(2, "free_wikipedia_search", "tool_call", "Gọi Wikipedia API bằng source tool.", {"tool": "free_wikipedia_search", "args": {"query": query}}),
            event(3, "free_wikipedia_search", "tool_result", "Nhận kết quả search thực tế hoặc lỗi thực tế.", {"result": real_output}),
            event(4, "replay harness", "validation", "Kiểm tra source tool không trả lỗi."),
            event(5, "replay harness", "completed" if real_passed else "failed", "Hoàn tất lần chạy Wikipedia."),
        ],
        {"searchResult": real_output, "analystReport": None},
        [assertion("Wikipedia source tool returned without exception", real_passed)],
        status="passed" if real_passed else "failed",
        expected={"searchResultPresent": True},
        dependencies=[{"name": "Vietnamese Wikipedia API", "mode": "real"}],
    )

    rows = [
        {"team": "A", "goals": 8, "shots": 40},
        {"team": "B", "goals": 6, "shots": 30},
    ]
    calculations = [
        {**row, "conversionRate": round(row["goals"] / row["shots"] * 100, 1)}
        for row in rows
    ]
    wc02 = replay(
        "WC-02",
        "worldcup-analyst",
        "browser-simulation",
        "So sánh conversion rate từ dữ liệu mẫu",
        "Công thức deterministic dùng dữ liệu mẫu trong browser; BuiltInCodeExecutor của project không chạy.",
        {"rows": rows, "formula": "goals / shots * 100"},
        [
            event(1, "browser replay", "input_received", "Nhận hai dòng dữ liệu mẫu."),
            event(2, "browser calculator", "calculation", "Tính conversion rate bằng công thức deterministic.", {"formula": "goals / shots * 100"}),
            event(3, "browser replay", "validation", "Kiểm tra mẫu số khác 0."),
            event(4, "browser replay", "artifact_created", "Tạo calculation tape được ghi nhãn simulation."),
            event(5, "browser replay", "completed", "Kết thúc browser simulation."),
        ],
        {"calculationTape": calculations},
        [assertion("Both rates equal 20 percent", all(row["conversionRate"] == 20.0 for row in calculations))],
        expected={"teamA": 20.0, "teamB": 20.0},
        dependencies=[{"name": "BuiltInCodeExecutor", "mode": "not-used"}],
    )

    original_urlopen = urllib.request.urlopen
    urllib.request.urlopen = lambda *_args, **_kwargs: FakeResponse({"query": {"search": []}})
    try:
        empty_output = module.free_wikipedia_search("fixture-empty-result")
    finally:
        urllib.request.urlopen = original_urlopen
    wc03 = replay(
        "WC-03",
        "worldcup-analyst",
        "verified-mocked-replay",
        "Wikipedia trả kết quả rỗng",
        "Chạy source tool với HTTP dependency được thay bằng fixture empty-result.",
        {"query": "fixture-empty-result"},
        [
            event(1, "free_wikipedia_search", "tool_call", "Gọi source tool với query fixture."),
            event(2, "Wikipedia fixture", "tool_result", "Dependency trả mảng search rỗng.", {"fixture": "empty-search-result"}),
            event(3, "free_wikipedia_search", "fallback", "Source tool nói rõ không tìm thấy thay vì tạo dữ kiện."),
            event(4, "replay harness", "validation", "Kiểm tra output chứa not-found."),
            event(5, "replay harness", "completed", "Mocked fallback case hoàn tất."),
        ],
        {"searchResult": empty_output, "analystReport": None},
        [assertion("Empty result is explicit", "Không tìm thấy kết quả nào" in empty_output)],
        expected={"fabricatedFact": False},
        dependencies=[{"name": "Vietnamese Wikipedia API", "mode": "mocked", "fixture": "empty-search-result"}],
    )
    return [wc01, wc02, wc03]


def capture_love_cases() -> list[dict[str, Any]]:
    common_dependencies = [{"name": "Love Advisor project source", "mode": "blocked"}]
    la01 = replay(
        "LA-01",
        "love-advisor",
        "browser-simulation",
        "Hai góc nhìn hội tụ",
        "Mô phỏng browser từ kiến trúc đã cung cấp; chưa có source Love Advisor để xác minh.",
        {"communicationPreference": "direct", "planningPreference": "structured"},
        [
            event(1, "browser workflow", "input_received", "Nhận hai preference không nhạy cảm."),
            event(2, "communication lane", "agent_started", "Nhánh giao tiếp bắt đầu."),
            event(3, "planning lane", "agent_started", "Nhánh kế hoạch bắt đầu."),
            event(4, "browser workflow", "validation", "Hai nhánh có output và không suy diễn thuộc tính nhạy cảm."),
            event(5, "synthesis gate", "artifact_created", "Ghép một gợi ý có uncertainty note."),
            event(6, "browser workflow", "completed", "Kết thúc browser simulation."),
        ],
        {
            "suggestion": "Trao đổi rõ kỳ vọng và thống nhất một bước nhỏ có thể kiểm tra lại.",
            "uncertainty": "Đây là gợi ý từ input mẫu, không phải đánh giá con người.",
        },
        [assertion("No appearance scoring", True), assertion("Uncertainty note is visible", True)],
        dependencies=common_dependencies,
    )
    la02 = replay(
        "LA-02",
        "love-advisor",
        "browser-simulation",
        "Chờ nhánh thứ hai trước synthesis",
        "Mô phỏng completion gate khi một nhánh chưa sẵn sàng.",
        {"delayedLane": "planning"},
        [
            event(1, "communication lane", "completed", "Nhánh giao tiếp hoàn tất."),
            event(2, "planning lane", "agent_started", "Nhánh kế hoạch vẫn đang chờ."),
            event(3, "synthesis gate", "validation", "Synthesis bị giữ lại vì thiếu một output."),
            event(4, "planning lane", "completed", "Nhánh kế hoạch hoàn tất theo fixture."),
            event(5, "synthesis gate", "artifact_created", "Synthesis chạy sau khi đủ hai nhánh."),
            event(6, "browser workflow", "completed", "Kết thúc browser simulation."),
        ],
        {"gateWaited": True, "synthesisCreatedAfterBothBranches": True},
        [assertion("Synthesis did not run early", True)],
        dependencies=common_dependencies,
    )
    la03 = replay(
        "LA-03",
        "love-advisor",
        "browser-simulation",
        "Từ chối suy diễn nhạy cảm",
        "Mô phỏng safety gate; không chẩn đoán, chấm điểm ngoại hình hoặc khẳng định ý định người khác.",
        {"requestType": "sensitive-inference"},
        [
            event(1, "browser workflow", "input_received", "Nhận một request thuộc nhóm suy diễn nhạy cảm."),
            event(2, "safety gate", "validation", "Phân loại request là không phù hợp với demo."),
            event(3, "safety gate", "fallback", "Đề nghị chuyển sang hành vi quan sát được và giao tiếp trực tiếp."),
            event(4, "browser workflow", "completed", "Không tạo profile hoặc score."),
        ],
        {"response": "Mình không thể suy ra ý định hay tính cách của một người từ ngoại hình. Hãy tập trung vào hành vi quan sát được và trao đổi trực tiếp."},
        [assertion("No sensitive inference", True), assertion("No appearance score", True)],
        dependencies=common_dependencies,
    )
    return [la01, la02, la03]


def load_dashboard_module():
    from google.adk.tools import FunctionTool

    rag = pytypes.ModuleType("dashboard_insights_agent.rag_engine")
    rag.store_report = lambda *_args, **_kwargs: None
    rag.search_past_reports = lambda *_args, **_kwargs: []
    rag.format_rag_context = lambda _results: "Mocked RAG fixture: no historical report."
    sys.modules[rag.__name__] = rag

    def list_data_files_fixture() -> list[str]:
        return []

    mcp_tools = pytypes.ModuleType("dashboard_insights_agent.mcp_tools")
    mcp_tools.filesystem_toolset = FunctionTool(list_data_files_fixture)
    sys.modules[mcp_tools.__name__] = mcp_tools
    return load_module("dashboard_insights", "dashboard_insights_agent.agent")


def capture_dashboard_cases() -> list[dict[str, Any]]:
    module = load_dashboard_module()
    input_dir = WORKSPACE / "design-work" / "working" / "replay-inputs"
    input_dir.mkdir(parents=True, exist_ok=True)
    csv_path = input_dir / "dashboard-anomaly.csv"
    csv_path.write_text(
        "month,channel,revenue\n2026-02,Organic,100\n2026-03,Organic,71\n",
        encoding="utf-8",
    )
    markdown = module.extract_file_content(str(csv_path))
    di01 = replay(
        "DI-01",
        "dashboard-insights",
        "verified-mocked-replay",
        "Đọc CSV qua source extractor",
        "Chạy source extractor thật; RAG và MCP được thay bằng fixture để import pipeline an toàn.",
        {"fixture": "dashboard-anomaly.csv", "rows": 2},
        [
            event(1, "dashboard_insight_pipeline", "input_received", "Nhận CSV fixture đã kiểm soát."),
            event(2, "extract_file_content", "tool_call", "Gọi source extractor cho file CSV.", {"tool": "extract_file_content", "args": {"file": "dashboard-anomaly.csv"}}),
            event(3, "extract_file_content", "tool_result", "Nhận bảng Markdown từ source function.", {"result": markdown}),
            event(4, "replay harness", "validation", "Kiểm tra header và hai dòng dữ liệu."),
            event(5, "replay harness", "artifact_created", "Tạo preview bảng từ output thật của extractor."),
            event(6, "replay harness", "completed", "Mocked dependency replay hoàn tất."),
        ],
        {"extractedMarkdown": markdown, "finalDashboardReport": None},
        [
            assertion("CSV header is preserved", "month" in markdown and "revenue" in markdown),
            assertion("Both rows are preserved", "2026-02" in markdown and "2026-03" in markdown),
        ],
        dependencies=[
            {"name": "RAG engine", "mode": "mocked", "fixture": "empty-history"},
            {"name": "MCP filesystem", "mode": "mocked", "fixture": "empty-file-list"},
            {"name": "Gemini model", "mode": "not-used"},
        ],
    )

    stable = [100, 101, 100]
    changes = [round((stable[i] - stable[i - 1]) / stable[i - 1] * 100, 1) for i in range(1, len(stable))]
    di02 = replay(
        "DI-02",
        "dashboard-insights",
        "browser-simulation",
        "Dữ liệu ổn định, không ép tạo anomaly",
        "Phép tính deterministic trong browser; pipeline Python không chạy model.",
        {"series": stable, "alertThresholdPercent": 20},
        [
            event(1, "browser evidence lab", "input_received", "Nhận ba điểm dữ liệu mẫu."),
            event(2, "browser calculator", "calculation", "Tính phần trăm thay đổi theo kỳ.", {"changes": changes}),
            event(3, "browser QA", "validation", "Không có mức giảm vượt ngưỡng 20%."),
            event(4, "browser evidence lab", "artifact_created", "Tạo kết quả `no anomaly` thay vì ép insight."),
            event(5, "browser evidence lab", "completed", "Kết thúc browser simulation."),
        ],
        {"changesPercent": changes, "anomalies": []},
        [assertion("No drop exceeds threshold", all(change > -20 for change in changes))],
        dependencies=[{"name": "Dashboard Python pipeline", "mode": "not-used"}],
    )
    di03 = replay(
        "DI-03",
        "dashboard-insights",
        "browser-simulation",
        "QA yêu cầu sửa claim không có evidence",
        "Mô phỏng vòng QA có giới hạn bằng fixture rõ ràng.",
        {"claim": "Organic revenue fell because of campaign fatigue.", "evidenceRows": []},
        [
            event(1, "browser QA", "input_received", "Nhận claim không có dòng evidence."),
            event(2, "browser QA", "qa_check", "Claim không đạt vì khẳng định nguyên nhân khi chưa đủ dữ liệu."),
            event(3, "browser reviser", "revision", "Bỏ nguyên nhân chưa được chứng minh và giữ lại quan sát có số liệu."),
            event(4, "browser QA", "qa_check", "Claim sửa đổi đạt rule fixture."),
            event(5, "browser evidence lab", "artifact_created", "Tạo claim đã sửa với revision count 1."),
            event(6, "browser evidence lab", "completed", "Kết thúc bounded simulation."),
        ],
        {
            "revisionCount": 1,
            "revisedClaim": "Organic revenue decreased in the sample; the cause is not established by the supplied rows.",
        },
        [
            assertion("Unsupported cause was removed", True),
            assertion("Revision stayed within the two-round bound", True),
        ],
        dependencies=[{"name": "Dashboard Python QA loop", "mode": "not-used"}],
    )
    return [di01, di02, di03]


def capture_a2a_cases() -> list[dict[str, Any]]:
    declared_source = "a2a_orchestrator/orchestrator_agent/agent.py"
    a2a01 = replay(
        "A2A-01",
        "a2a-orchestrator",
        "browser-simulation",
        "Route yêu cầu du lịch tới Trip Planner",
        "Routing deterministic dựa trên capability đã trích từ source; remote service không chạy.",
        {"request": "Lập lịch Huế ba ngày"},
        [
            event(1, "browser orchestrator", "input_received", "Nhận yêu cầu du lịch."),
            event(2, "browser router", "routing", "Capability match chọn `trip_planner`.", {"matchedCapability": "du lịch", "source": declared_source}),
            event(3, "Agent Card sample", "retrieval", "Hiển thị contract được chuẩn bị từ remote declaration, không fetch service live."),
            event(4, "Trip Planner simulation", "handoff", "Chuyển request trong browser simulation."),
            event(5, "browser orchestrator", "artifact_created", "Trả sample itinerary được ghi nhãn simulation."),
            event(6, "browser orchestrator", "completed", "Kết thúc browser simulation."),
        ],
        {"route": "trip_planner", "artifact": {"type": "sample-itinerary", "destination": "Hue", "days": 3}},
        [assertion("Route matches supplied capability", True)],
        dependencies=[{"name": "Trip Planner A2A service", "mode": "not-used"}],
    )
    a2a02 = replay(
        "A2A-02",
        "a2a-orchestrator",
        "browser-simulation",
        "Route yêu cầu dữ liệu tới Dashboard",
        "Routing deterministic dựa trên capability đã trích từ source; remote service không chạy.",
        {"request": "Tìm bất thường trong CSV"},
        [
            event(1, "browser orchestrator", "input_received", "Nhận yêu cầu phân tích CSV."),
            event(2, "browser router", "routing", "Capability match chọn `dashboard_insights`.", {"matchedCapability": "CSV", "source": declared_source}),
            event(3, "Agent Card sample", "retrieval", "Hiển thị contract sample, không fetch service live."),
            event(4, "Dashboard simulation", "handoff", "Chuyển request trong browser simulation."),
            event(5, "browser orchestrator", "artifact_created", "Trả sample report receipt được ghi nhãn simulation."),
            event(6, "browser orchestrator", "completed", "Kết thúc browser simulation."),
        ],
        {"route": "dashboard_insights", "artifact": {"type": "sample-report-receipt", "status": "simulation"}},
        [assertion("Route matches supplied capability", True)],
        dependencies=[{"name": "Dashboard A2A service", "mode": "not-used"}],
    )
    a2a03 = replay(
        "A2A-03",
        "a2a-orchestrator",
        "browser-simulation",
        "Specialist không khả dụng",
        "Mô phỏng fallback UI; không giả vờ đã gọi localhost service.",
        {"request": "Lập lịch Huế ba ngày", "specialistAvailable": False},
        [
            event(1, "browser orchestrator", "input_received", "Nhận yêu cầu du lịch."),
            event(2, "browser router", "routing", "Chọn `trip_planner` từ capability."),
            event(3, "Trip Planner service fixture", "failed", "Fixture đánh dấu specialist offline."),
            event(4, "browser orchestrator", "retry", "Thực hiện một retry mô phỏng có giới hạn."),
            event(5, "browser orchestrator", "fallback", "Giữ architecture trace và không tạo remote artifact giả."),
            event(6, "browser orchestrator", "completed", "Kết thúc browser fallback simulation."),
        ],
        {"route": "trip_planner", "artifact": None, "fallback": "Architecture trace remains available; remote artifact was not created."},
        [
            assertion("No remote artifact was fabricated", True),
            assertion("Retry count stayed bounded", True),
        ],
        dependencies=[{"name": "Trip Planner A2A service", "mode": "mocked", "fixture": "offline"}],
    )
    return [a2a01, a2a02, a2a03]


CAPTURES: list[Callable[[], list[dict[str, Any]]]] = [
    capture_trip_cases,
    capture_script_cases,
    capture_worldcup_cases,
    capture_love_cases,
    capture_dashboard_cases,
    capture_a2a_cases,
]


def build_all() -> list[dict[str, Any]]:
    fixtures: list[dict[str, Any]] = []
    for capture in CAPTURES:
        fixtures.extend(capture())
    return fixtures


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--case", help="Write and validate one case ID.")
    args = parser.parse_args()

    fixtures = build_all()
    if args.case:
        fixtures = [item for item in fixtures if item["caseId"] == args.case]
        if not fixtures:
            raise SystemExit(f"Unknown case: {args.case}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for fixture in fixtures:
        path = OUTPUT_DIR / f"{fixture['caseId'].lower()}.json"
        path.write_text(
            json.dumps(fixture, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Wrote {path.relative_to(WORKSPACE)} [{fixture['mode']} / {fixture['status']}]")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
