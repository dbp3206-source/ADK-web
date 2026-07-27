import type { Locale } from "@/lib/i18n";

export interface TraceStepV2 {
  id: number;
  stage: "input" | "route" | "contract" | "workflow" | "tool" | "validation" | "artifact";
  title: string;
  detail: string;
}

export interface TracePresetV2 {
  id: string;
  targetProject: string;
  port: string;
  label: string;
  request: string;
  routingReason: string;
  capability: string;
  inputContract: string;
  outputContract: string;
  workflow: string[];
  toolContract: string;
  validation: string;
  artifact: string;
  fallback: string;
  steps: TraceStepV2[];
}

type PresetSeed = Omit<TracePresetV2, "steps">;

const en: PresetSeed[] = [
  {
    id: "trip", targetProject: "trip-planner", port: ":8001", label: "Plan a 3-day trip to Hue",
    request: "Plan a 3-day trip to Hue and remember it.",
    routingReason: "Travel, itinerary and destination terms match the Trip Planner capability contract.",
    capability: "Create and retrieve a session-scoped itinerary.",
    inputContract: "{ destination, days, budgetTier, preferences[] }",
    outputContract: "{ itinerary[], stateReceipt, persistence }",
    workflow: ["Collect constraints", "Draft itinerary", "Save state", "Retrieve state"],
    toolContract: "save_trip_detail(input) → state receipt; get_trip_details() → stored itinerary | not-found",
    validation: "Required fields are present; days are positive; no live price or booking claim is introduced.",
    artifact: "Three-day itinerary plus a session-state receipt.",
    fallback: "Return a clear not-found or storage-unavailable state."
  },
  {
    id: "script", targetProject: "script-team", port: ":8002", label: "Critique this short script",
    request: "Draft, critique and revise this prepared product brief.",
    routingReason: "Brief, draft and critique terms match the Script Team role-handoff contract.",
    capability: "Move ownership through Drafter, Critic and Reviser roles.",
    inputContract: "{ briefId, rubric[] }",
    outputContract: "{ draft, feedback[], revision, handoffTrail[] }",
    workflow: ["Drafter owns", "Critic owns", "Reviser owns"],
    toolContract: "Prepared brief → named output keys; no arbitrary user file is processed.",
    validation: "Feedback is structured and the revision resolves selected rubric items.",
    artifact: "Prepared draft, margin critique and readable revision diff.",
    fallback: "Keep the prepared artifacts and show which handoff could not continue."
  },
  {
    id: "worldcup", targetProject: "worldcup-analyst", port: ":8003", label: "Compare two World Cup teams",
    request: "Compare two synthetic teams with facts and reproducible calculations.",
    routingReason: "Football, comparison and statistics terms match the analyst capability.",
    capability: "Separate fact retrieval, code calculation and synthesis.",
    inputContract: "{ datasetId, metric }",
    outputContract: "{ facts[], formula, result, synthesis, sourceScope }",
    workflow: ["Build evidence ledger", "Run calculation", "Synthesize within scope"],
    toolContract: "Synthetic dataset → deterministic arithmetic; no live score service is called.",
    validation: "Formula inputs are finite and the report keeps fact, calculation and synthesis separate.",
    artifact: "Analyst report with an evidence ledger and calculation tape.",
    fallback: "Return an unsupported-metric or insufficient-evidence state."
  },
  {
    id: "love", targetProject: "love-advisor", port: ":8004", label: "Compose two preference lenses",
    request: "Compare two safe preference dimensions and synthesize a structured result.",
    routingReason: "Communication and planning-style terms match the bounded composition workflow.",
    capability: "Run two non-sensitive branches and merge them behind a safety gate.",
    inputContract: "{ lensA, lensB } using non-sensitive prepared dimensions",
    outputContract: "{ observations[], sharedPatterns[], uncertainty, safetyNote }",
    workflow: ["Run lens A", "Run lens B", "Wait for both", "Validate schema"],
    toolContract: "Prepared dimensions only; no image, diagnosis or sensitive-trait input.",
    validation: "Both branches complete and the result includes uncertainty and safety notes.",
    artifact: "Structured synthesis schema with visible uncertainty.",
    fallback: "Keep branches separate until both are complete."
  },
  {
    id: "dashboard", targetProject: "dashboard-insights", port: ":8005", label: "Find anomalies in a synthetic CSV",
    request: "Find revenue anomalies in the bundled synthetic sales sample.",
    routingReason: "CSV, revenue, anomaly and insight terms match Dashboard Insights.",
    capability: "Compute metrics, trace claims, run bounded QA and archive an artifact.",
    inputContract: "{ datasetId, framework, thresholdPercent }",
    outputContract: "{ metrics, claims[], evidenceRows[], qaReceipt, archiveReceipt }",
    workflow: ["Ingest", "Validate", "Frame", "Write", "QA / revise ≤2", "Format", "Archive"],
    toolContract: "Bundled rows → deterministic revenue-drop calculation; no upload endpoint.",
    validation: "Every claim references sample rows and the revision count never exceeds two.",
    artifact: "Versioned sample report with claim-evidence matrix and archive receipt.",
    fallback: "Return an explicit no-anomaly or failed-rubric result without inventing a KPI."
  }
];

const vi: PresetSeed[] = [
  {
    id: "trip", targetProject: "trip-planner", port: ":8001", label: "Lập lịch trình Huế 3 ngày",
    request: "Lập lịch trình Huế ba ngày và nhớ lại trong phiên.",
    routingReason: "Các từ về chuyến đi, lịch trình và điểm đến khớp capability contract của Trip Planner.",
    capability: "Tạo và truy xuất lịch trình trong phạm vi session.",
    inputContract: "{ destination, days, budgetTier, preferences[] }",
    outputContract: "{ itinerary[], stateReceipt, persistence }",
    workflow: ["Thu thập ràng buộc", "Tạo lịch trình", "Lưu state", "Đọc lại state"],
    toolContract: "save_trip_detail(input) → state receipt; get_trip_details() → itinerary | not-found",
    validation: "Đủ trường bắt buộc, số ngày dương và không phát sinh claim giá/booking trực tiếp.",
    artifact: "Lịch trình ba ngày kèm session-state receipt.",
    fallback: "Trả trạng thái không tìm thấy hoặc storage không khả dụng."
  },
  {
    id: "script", targetProject: "script-team", port: ":8002", label: "Phản biện một kịch bản ngắn",
    request: "Viết, phản biện và sửa brief sản phẩm đã chuẩn bị.",
    routingReason: "Brief, draft và critique khớp hợp đồng chuyển giao vai trò của Script Team.",
    capability: "Chuyển quyền sở hữu qua Drafter, Critic và Reviser.",
    inputContract: "{ briefId, rubric[] }",
    outputContract: "{ draft, feedback[], revision, handoffTrail[] }",
    workflow: ["Drafter sở hữu", "Critic sở hữu", "Reviser sở hữu"],
    toolContract: "Brief đã chuẩn bị → output key có tên; không xử lý file tùy ý của người dùng.",
    validation: "Feedback có cấu trúc và revision giải quyết rubric đã chọn.",
    artifact: "Draft mẫu, margin critique và revision diff.",
    fallback: "Giữ artifact mẫu và chỉ rõ handoff nào không thể tiếp tục."
  },
  {
    id: "worldcup", targetProject: "worldcup-analyst", port: ":8003", label: "So sánh hai đội World Cup",
    request: "So sánh hai đội tổng hợp bằng dữ kiện và phép tính tái lập.",
    routingReason: "Bóng đá, so sánh và thống kê khớp capability của analyst.",
    capability: "Tách fact retrieval, code calculation và synthesis.",
    inputContract: "{ datasetId, metric }",
    outputContract: "{ facts[], formula, result, synthesis, sourceScope }",
    workflow: ["Lập evidence ledger", "Chạy phép tính", "Tổng hợp trong phạm vi nguồn"],
    toolContract: "Dataset tổng hợp → số học deterministic; không gọi live score.",
    validation: "Input công thức hữu hạn và report giữ fact, calculation, synthesis tách biệt.",
    artifact: "Analyst report có evidence ledger và calculation tape.",
    fallback: "Trả trạng thái metric không hỗ trợ hoặc thiếu evidence."
  },
  {
    id: "love", targetProject: "love-advisor", port: ":8004", label: "Ghép hai góc nhìn sở thích",
    request: "So sánh hai chiều sở thích an toàn và tổng hợp kết quả có cấu trúc.",
    routingReason: "Giao tiếp và cách lập kế hoạch khớp workflow composition có giới hạn.",
    capability: "Chạy hai nhánh không nhạy cảm và hợp nhất qua safety gate.",
    inputContract: "{ lensA, lensB } từ các chiều minh họa không nhạy cảm",
    outputContract: "{ observations[], sharedPatterns[], uncertainty, safetyNote }",
    workflow: ["Chạy lens A", "Chạy lens B", "Chờ cả hai", "Validate schema"],
    toolContract: "Chỉ dùng chiều đã chuẩn bị; không nhận ảnh, chẩn đoán hay thuộc tính nhạy cảm.",
    validation: "Hai nhánh hoàn tất và kết quả có uncertainty cùng safety note.",
    artifact: "Synthesis schema có uncertainty hiển thị rõ.",
    fallback: "Giữ hai nhánh tách biệt cho tới khi cả hai hoàn thành."
  },
  {
    id: "dashboard", targetProject: "dashboard-insights", port: ":8005", label: "Tìm bất thường trong CSV tổng hợp",
    request: "Tìm bất thường doanh thu trong sample sales tổng hợp.",
    routingReason: "CSV, doanh thu, anomaly và insight khớp Dashboard Insights.",
    capability: "Tính metric, truy claim, chạy QA có giới hạn và archive artifact.",
    inputContract: "{ datasetId, framework, thresholdPercent }",
    outputContract: "{ metrics, claims[], evidenceRows[], qaReceipt, archiveReceipt }",
    workflow: ["Ingest", "Validate", "Frame", "Write", "QA / revise ≤2", "Format", "Archive"],
    toolContract: "Bundled rows → phép tính giảm doanh thu deterministic; không có upload endpoint.",
    validation: "Mỗi claim tham chiếu sample row và revision không vượt quá hai vòng.",
    artifact: "Sample report có claim-evidence matrix và archive receipt.",
    fallback: "Trả trạng thái không có anomaly hoặc rubric fail mà không bịa KPI."
  }
];

function makeSteps(seed: PresetSeed, locale: Locale): TraceStepV2[] {
  const labels = locale === "vi"
    ? [
        ["input", "Input boundary", seed.request],
        ["route", "Quyết định điều phối", seed.routingReason],
        ["contract", "Capability contract", `${seed.capability} ${seed.inputContract} → ${seed.outputContract}`],
        ["workflow", "Workflow specialist", seed.workflow.join(" → ")],
        ["tool", "Tool / data", seed.toolContract],
        ["validation", "Validation", seed.validation],
        ["artifact", "Artifact / fallback", `${seed.artifact} ${seed.fallback}`]
      ]
    : [
        ["input", "Input boundary", seed.request],
        ["route", "Routing decision", seed.routingReason],
        ["contract", "Capability contract", `${seed.capability} ${seed.inputContract} → ${seed.outputContract}`],
        ["workflow", "Specialist workflow", seed.workflow.join(" → ")],
        ["tool", "Tool / data", seed.toolContract],
        ["validation", "Validation", seed.validation],
        ["artifact", "Artifact / fallback", `${seed.artifact} ${seed.fallback}`]
      ];
  return labels.map(([stage, title, detail], index) => ({
    id: index + 1,
    stage: stage as TraceStepV2["stage"],
    title,
    detail
  }));
}

export function getTracePresets(locale: Locale): TracePresetV2[] {
  const seeds = locale === "vi" ? vi : en;
  return seeds.map((seed) => ({ ...seed, steps: makeSteps(seed, locale) }));
}
