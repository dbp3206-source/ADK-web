import type { Locale } from "@/lib/i18n";

export interface VoiceSection {
  id: string;
  label: string;
  text: string;
}

const home = {
  vi: [
    { id: "thesis", label: "Luận điểm chính", text: "Đây không phải sáu chatbot giống nhau. Website theo dõi sáu bước kiến trúc, từ một agent biết gọi công cụ đến một hệ sinh thái nhiều agent phối hợp qua A2A." },
    { id: "ladder", label: "Sáu bước năng lực", text: "Trip Planner thêm tool và trạng thái phiên. Script Team thêm chuyển giao vai trò. World Cup Analyst tách tìm kiếm và tính toán. Love Advisor ghép luồng song song và tuần tự. Dashboard Insights thêm dữ liệu và vòng kiểm chứng. A2A Orchestrator kết nối các service độc lập." },
    { id: "evidence", label: "Nguyên tắc bằng chứng", text: "Mọi claim được phân biệt giữa tài liệu được cung cấp, phần đã tìm thấy trong repository, phần đã xác minh cục bộ và đề xuất nâng cấp. Mô phỏng không được trình bày như request trực tiếp." }
  ],
  en: [
    { id: "thesis", label: "Core thesis", text: "These are not six versions of the same chatbot. The portfolio follows six architectural steps, from one tool-using agent to an ecosystem of agents collaborating through A2A." },
    { id: "ladder", label: "Six capability steps", text: "Trip Planner adds tools and session state. Script Team adds role transfer. World Cup Analyst separates retrieval and computation. Love Advisor composes parallel and sequential work. Dashboard Insights adds data and quality loops. A2A Orchestrator connects independent services." },
    { id: "evidence", label: "Evidence policy", text: "Every claim is separated into supplied documentation, repository evidence, local verification or proposed work. A simulation is never presented as a live request." }
  ]
} satisfies Record<Locale, VoiceSection[]>;

const system = {
  vi: [
    { id: "input", label: "Input boundary", text: "Người dùng chọn một tình huống mẫu. Hệ thống hiển thị loại input, giả định và giới hạn dữ liệu trước khi routing." },
    { id: "routing", label: "Routing decision", text: "Orchestrator phân tích intent và chọn capability phù hợp. Inspector giải thích vì sao specialist được chọn." },
    { id: "contract", label: "Capability contract", text: "Agent Card mô tả tên agent, capability, endpoint, input, output và trạng thái bằng chứng." },
    { id: "workflow", label: "Workflow nội bộ", text: "Sau khi request đi qua ranh giới service, specialist chạy workflow riêng với tool, dữ liệu và bước kiểm chứng." },
    { id: "artifact", label: "Artifact", text: "Kết quả quay về dưới dạng artifact hoặc fallback. Trace này là mô phỏng từ kiến trúc repository." }
  ],
  en: [
    { id: "input", label: "Input boundary", text: "The visitor chooses a request preset. The interface displays its assumptions and data boundary before routing." },
    { id: "routing", label: "Routing decision", text: "The orchestrator interprets intent and selects a capability. The inspector explains why the specialist was selected." },
    { id: "contract", label: "Capability contract", text: "The Agent Card describes the agent name, capability, endpoint, input, output and evidence state." },
    { id: "workflow", label: "Internal workflow", text: "After crossing the service boundary, the specialist runs its own workflow with tools, data and validation." },
    { id: "artifact", label: "Artifact", text: "The result returns as an artifact or fallback. This trace is simulated from repository architecture." }
  ]
} satisfies Record<Locale, VoiceSection[]>;

const projectSummary: Record<string, Record<Locale, VoiceSection[]>> = {
  "trip-planner": {
    vi: [{ id: "summary", label: "Tóm tắt", text: "Trip Planner dùng tool để lưu lịch trình vào trạng thái phiên và đọc lại ở lượt sau." }, { id: "risk", label: "Giới hạn", text: "Trạng thái nằm trong bộ nhớ nên mất khi chương trình khởi động lại." }],
    en: [{ id: "summary", label: "Summary", text: "Trip Planner uses tools to save an itinerary into session state and retrieve it later." }, { id: "risk", label: "Limitation", text: "The state is held in memory and disappears after restart." }]
  },
  "script-team": {
    vi: [{ id: "summary", label: "Tóm tắt", text: "Script Team chia workflow viết thành Drafter, Critic và Reviser với handoff rõ." }, { id: "risk", label: "Giới hạn", text: "Routing và output key phải khớp để agent sau nhận đúng dữ liệu." }],
    en: [{ id: "summary", label: "Summary", text: "Script Team divides writing into Drafter, Critic and Reviser roles with explicit handoffs." }, { id: "risk", label: "Limitation", text: "Routing and output keys must align for downstream agents." }]
  },
  "worldcup-analyst": {
    vi: [{ id: "summary", label: "Tóm tắt", text: "World Cup Analyst giao tìm kiếm cho specialist, số học cho code và giữ tổng hợp ở root." }, { id: "risk", label: "Giới hạn", text: "Nguồn tổng quan không đủ cho mọi thống kê và code cần sandbox." }],
    en: [{ id: "summary", label: "Summary", text: "World Cup Analyst delegates retrieval to a specialist, arithmetic to code and keeps synthesis at the root." }, { id: "risk", label: "Limitation", text: "General sources are insufficient for every statistic and code needs a sandbox." }]
  },
  "love-advisor": {
    vi: [{ id: "summary", label: "Tóm tắt", text: "Love Advisor minh họa hai nhánh độc lập chạy song song trước khi hội tụ." }, { id: "risk", label: "Giới hạn", text: "Lab không chấm điểm con người, chẩn đoán hoặc suy luận thuộc tính nhạy cảm." }],
    en: [{ id: "summary", label: "Summary", text: "Love Advisor demonstrates two independent branches running in parallel before converging." }, { id: "risk", label: "Limitation", text: "The lab does not score people, diagnose or infer sensitive traits." }]
  },
  "dashboard-insights": {
    vi: [{ id: "summary", label: "Tóm tắt", text: "Dashboard Insights ingest dữ liệu, chọn framework, tính metric, QA, sửa tối đa hai vòng và archive." }, { id: "risk", label: "Giới hạn", text: "Claim chưa được tự động truy ngược đến mọi cell hoặc row nguồn." }],
    en: [{ id: "summary", label: "Summary", text: "Dashboard Insights ingests data, selects a framework, computes metrics, reviews, revises at most twice and archives." }, { id: "risk", label: "Limitation", text: "Claims are not automatically traced to every source cell or row." }]
  },
  "a2a-orchestrator": {
    vi: [{ id: "summary", label: "Tóm tắt", text: "A2A Orchestrator đọc capability contract, route request và nhận artifact qua ranh giới mạng." }, { id: "risk", label: "Giới hạn", text: "Website không hiển thị latency, health hoặc success rate giả." }],
    en: [{ id: "summary", label: "Summary", text: "A2A Orchestrator reads capability contracts, routes requests and receives artifacts across network boundaries." }, { id: "risk", label: "Limitation", text: "The site does not show fabricated latency, health or success rates." }]
  }
};

export function getVoiceSections(scope: "home" | "system" | string, locale: Locale): VoiceSection[] {
  if (scope === "home") return home[locale];
  if (scope === "system") return system[locale];
  return projectSummary[scope]?.[locale] ?? [];
}
