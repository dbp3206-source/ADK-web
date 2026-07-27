import type { Locale } from "@/lib/i18n";
import type { Project } from "@/lib/types";

export interface LocalizedProjectCopy {
  title: string;
  vibeName: string;
  thesis: string;
  lesson: string;
  whatItProves: string;
  problem: string;
  primaryTimeline: string[];
  artifact: string;
  decisions: string[];
  limitations: string[];
  roadmap: string[];
  safetyNote: string;
  maturity: string;
}

const provesEn: Record<string, string> = {
  "trip-planner": "An agent becomes more useful when it can perform an action and retrieve structured state.",
  "script-team": "Quality and control improve when each role has a clear instruction, input and output contract.",
  "worldcup-analyst": "Separating research, computation and synthesis reduces invented facts and mental arithmetic.",
  "love-advisor": "Parallel work reduces waiting while ordered synthesis preserves data dependencies.",
  "dashboard-insights": "A reliable pipeline needs data boundaries, computation, rubrics, revision, logging and artifact lifecycle.",
  "a2a-orchestrator": "A2A creates a contract between agent services while preserving independent deployment boundaries."
};

const safetyEn: Record<string, string> = {
  "trip-planner": "Do not show prices, bookings or live API data without real sources.",
  "script-team": "Do not claim that a revision is better without a rubric or test.",
  "worldcup-analyst": "Do not show fake live scores, team marks or unsourced statistics.",
  "love-advisor": "No appearance scoring, psychological diagnosis or sensitive-trait inference.",
  "dashboard-insights": "Do not show live upload, KPIs or charts as real without a backend and dataset.",
  "a2a-orchestrator": "Do not show fake online status, latency or success rates."
};

const vi: Record<string, LocalizedProjectCopy> = {
  "trip-planner": {
    title: "Trip Planner",
    vibeName: "Cartographic State",
    thesis: "Bước đầu vượt khỏi chatbot: model có thể lưu và truy xuất trạng thái chuyến đi thông qua tool.",
    lesson: "Tool + trạng thái phiên",
    whatItProves: "Agent trở nên hữu ích hơn khi có hành động thực thi được và trạng thái có thể truy xuất.",
    problem: "Người dùng cần một lịch trình hữu ích và kỳ vọng hệ thống nhớ lại nó trong cùng phiên làm việc.",
    primaryTimeline: ["Thu thập ràng buộc chuyến đi", "Tạo lịch trình nháp", "Gọi tool lưu dữ liệu", "Kiểm tra session state", "Truy xuất ở lượt sau", "Trả lịch trình hoặc trạng thái không tìm thấy"],
    artifact: "Lịch trình ba ngày kèm tool receipt và trạng thái phiên.",
    decisions: ["Giữ một agent vì phạm vi nhiệm vụ hẹp.", "Dùng tool cho state mutation để phân biệt hành động với văn bản sinh ra.", "Xem in-memory state là giới hạn prototype, không phải bộ nhớ bền vững."],
    limitations: ["Dữ liệu trong bộ nhớ mất sau khi restart.", "Chưa xác nhận API thời tiết, bản đồ, chuyến bay, khách sạn hoặc giá.", "Trip object chưa có schema end-to-end mạnh.", "Chưa có confirmation cho hành động có thể phát sinh chi phí."],
    roadmap: ["Thêm session storage bền vững.", "Thêm schema, timezone và validation ngân sách.", "Thêm weather/map tool phía server.", "Xuất artifact PDF hoặc calendar đã xác minh."],
    safetyNote: "Không hiển thị giá, booking hoặc API live nếu chưa có nguồn thật.",
    maturity: "Prototype học tập · cần xác minh source"
  },
  "script-team": {
    title: "Script Team",
    vibeName: "Editorial Redline Studio",
    thesis: "Một workflow viết trở thành đội agent khi quyền sở hữu được chuyển giữa các vai trò chuyên biệt.",
    lesson: "Transfer + chuyên môn hóa vai trò",
    whatItProves: "Chất lượng và khả năng kiểm soát tăng khi mỗi vai trò có instruction, input và output contract rõ.",
    problem: "Một brief cần được viết, phản biện và sửa mà không nhồi toàn bộ nhiệm vụ vào một prompt dài.",
    primaryTimeline: ["Nhận brief hoặc file nguồn", "Chuyển cho Drafter", "Tạo draft artifact", "Chuyển cho Critic", "Tạo structured feedback", "Chuyển cho Reviser", "Trả revision artifact"],
    artifact: "Draft, feedback có cấu trúc và bản revision có thể so sánh.",
    decisions: ["Dùng transfer khi vai trò tiếp theo cần sở hữu lượt xử lý.", "Dùng structured feedback thay cho đoạn văn không giới hạn.", "Dùng callback cho rule an toàn cần thực thi bằng code."],
    limitations: ["Routing phụ thuộc mô tả vai trò và quyết định model.", "Output key sai có thể làm hỏng handoff.", "File dài có thể bị cắt theo context limit.", "Chưa có evaluator tự động cho cấu trúc cảnh và tính nhất quán nhân vật."],
    roadmap: ["Thêm evaluator với rubric cụ thể.", "Version hóa từng draft thành artifact.", "Thêm diff thật giữa draft và revision.", "Tách source ingestion khỏi writing workflow."],
    safetyNote: "Không trình bày revision tốt hơn nếu chưa có rubric hoặc test chứng minh.",
    maturity: "Prototype học tập · cần xác minh source"
  },
  "worldcup-analyst": {
    title: "World Cup Analyst",
    vibeName: "Match Intelligence Desk",
    thesis: "Dữ kiện giao cho search specialist, số liệu giao cho code, còn root agent chịu trách nhiệm tổng hợp.",
    lesson: "Agent as Tool + tính toán",
    whatItProves: "Tách research, computation và synthesis giúp giảm việc model tự bịa hoặc tự nhẩm.",
    problem: "Một câu hỏi bóng đá có thể cần cả dữ kiện bên ngoài và phép tính tái lập trước khi kết luận.",
    primaryTimeline: ["Nhận câu hỏi", "Tách fact và calculation", "Gọi Search Agent", "Lập evidence ledger", "Gọi code executor", "Tổng hợp có giới hạn nguồn", "Trả analyst report"],
    artifact: "Báo cáo có phần bằng chứng và phép tính tách biệt.",
    decisions: ["Root agent giữ quyền điều khiển vì specialist chỉ là năng lực giới hạn.", "Dùng code cho số học thay vì model mental math.", "Hiển thị source scope vì Wikipedia không phải nguồn chính thức cho mọi claim."],
    limitations: ["Wikipedia không đủ cho mọi thống kê.", "Chưa xác nhận pipeline kiểm tra chéo nhiều nguồn.", "Code execution cần sandbox rõ trước production.", "Documentation và dependency có thể chưa đồng bộ."],
    roadmap: ["Thêm dataset chính thức.", "Gắn citation đến từng claim.", "Dùng report schema gồm evidence, calculation và confidence.", "Thêm unit test cho search và calculation."],
    safetyNote: "Không dùng điểm số live, logo đội hoặc số liệu không có nguồn.",
    maturity: "Prototype học tập · cần xác minh nguồn"
  },
  "love-advisor": {
    title: "Love Advisor",
    vibeName: "Dual-Lens Synthesis",
    thesis: "Hai phân tích độc lập chạy song song, sau đó hội tụ thành kết quả có cấu trúc.",
    lesson: "Parallel trong Sequential + schema",
    whatItProves: "Parallel workflow giảm chờ đợi ở các nhánh độc lập; synthesis tuần tự giữ đúng thứ tự dữ liệu.",
    problem: "Hai góc nhìn cần được xử lý riêng rồi hợp nhất mà không đánh mất cấu trúc hoặc thổi phồng độ chắc chắn.",
    primaryTimeline: ["Nhận input và áp dụng safety boundary", "Chạy nhánh A", "Chạy nhánh B", "Chờ cả hai hoàn thành", "Tổng hợp", "Validate schema", "Trả structured result"],
    artifact: "Kết quả có cấu trúc kèm uncertainty và safety note.",
    decisions: ["Dùng parallel cho phân tích độc lập.", "Synthesis chỉ bắt đầu khi cả hai nhánh hoàn thành.", "Dùng structured output để render và validate ổn định.", "Xem tone là quyết định sản phẩm và an toàn."],
    limitations: ["Chủ đề nhạy cảm, dễ tạo kết luận quá chắc chắn.", "Web search có thể đưa nguồn kém chất lượng.", "Persona mạnh có thể gây tổn thương.", "Schema hợp lệ không bảo đảm nội dung đúng."],
    roadmap: ["Thêm source, confidence và disclaimer.", "Chỉ thêm tone mode như feature được ghi nhãn rõ.", "Thêm guardrail cho harassment, self-harm và abuse.", "Không suy luận thuộc tính nhạy cảm từ ảnh hoặc dữ liệu thiếu."],
    safetyNote: "Không chấm điểm ngoại hình, không chẩn đoán tâm lý và không suy luận đặc điểm nhạy cảm.",
    maturity: "Prototype học tập · cần safety review"
  },
  "dashboard-insights": {
    title: "Dashboard Insights",
    vibeName: "Operations Evidence Lab",
    thesis: "Agent phân tích chỉ đáng tin khi claim có thể truy ngược, kiểm tra, sửa và lưu thành artifact.",
    lesson: "Ingestion + MCP + RAG + QA loop",
    whatItProves: "Một pipeline đáng tin cần data boundary, computation, rubric, revision, logging và artifact lifecycle.",
    problem: "File kinh doanh cần một đường xử lý lặp lại được từ ingestion đến báo cáo, QA và archive.",
    primaryTimeline: ["Ingest nguồn", "Validate dữ liệu", "Chọn framework", "Viết insight", "QA theo rubric", "Revision tối đa hai vòng", "Format", "Archive"],
    artifact: "Báo cáo versioned với claim ID, evidence link và QA receipt.",
    decisions: ["Dùng workflow vì thứ tự và quality gate phải rõ.", "Giới hạn QA loop tối đa hai vòng.", "Phân biệt MCP nối tool/data với A2A nối agent.", "RAG hỗ trợ retrieval nhưng không thay claim verification.", "Metric nên được code tính trước khi model diễn giải."],
    limitations: ["Report key theo period có thể ghi đè bản cũ.", "RAG collection chung có thể trộn domain/tenant.", "Báo cáo có thể biến giả thuyết thành kết luận.", "Cắt context cứng có thể bỏ dữ liệu.", "Chưa kiểm tra từng số đến cell/row nguồn.", "Path Chroma và docs có thể chưa đồng bộ."],
    roadmap: ["Dùng report ID duy nhất và versioning.", "Tách RAG collection theo tenant/project/domain.", "Gắn citation sheet/cell/row.", "Thêm claim–evidence evaluator.", "Thêm retention/deletion control.", "Tính metric bằng code trước narrative."],
    safetyNote: "Không hiển thị upload live, KPI hoặc chart như dữ liệu thật khi chưa có backend và dataset.",
    maturity: "Prototype cục bộ · case study nổi bật"
  },
  "a2a-orchestrator": {
    title: "A2A Orchestrator",
    vibeName: "Network Control Plane",
    thesis: "Bước cuối không phải một agent lớn hơn, mà là nhiều hệ agent độc lập có thể khám phá và gọi lẫn nhau.",
    lesson: "Remote agent + A2A routing",
    whatItProves: "A2A tạo hợp đồng giữa các service agent trong khi vẫn giữ ranh giới triển khai và dependency riêng.",
    problem: "Các specialist độc lập cần capability contract, routing và error handling qua ranh giới mạng.",
    primaryTimeline: ["Đọc Agent Card", "Nhận request", "Phân tích intent", "Chọn capability", "Gọi remote specialist", "Chạy workflow nội bộ", "Trả artifact hoặc fallback"],
    artifact: "Remote response/task artifact kèm route reason và service boundary.",
    decisions: ["Dùng A2A khi specialist là service độc lập.", "Xem Agent Card và description là routing contract.", "Hiển thị timeout/fallback thay vì che chi phí distributed system.", "Giữ website ở simulated mode cho đến khi backend được xác minh."],
    limitations: ["Network gây timeout và availability failure.", "Chưa xác nhận service-to-service authentication.", "Agent Card/protocol version cần compatibility test.", "Chưa xác nhận cross-service tracing.", "URL hard-code không phù hợp dynamic discovery.", "Không claim multi-domain orchestration nếu chưa test."],
    roadmap: ["Thêm health check.", "Thêm timeout, backoff, retry và circuit breaker.", "Thêm service auth và secret management.", "Truyền trace ID xuyên service.", "Dùng dynamic registry và capability evaluator.", "Giữ simulated fallback khi specialist offline."],
    safetyNote: "Không hiển thị trạng thái online, latency hoặc success rate giả.",
    maturity: "Prototype cục bộ · cần kiểm tra protocol"
  }
};

export function localizeProject(project: Project, locale: Locale): LocalizedProjectCopy {
  if (locale === "vi") return vi[project.slug];
  return {
    title: project.title,
    vibeName: project.vibe.name,
    thesis: project.thesis,
    lesson: project.lesson,
    whatItProves: provesEn[project.slug],
    problem: project.problem,
    primaryTimeline: project.requestTrace,
    artifact: project.sampleArtifact,
    decisions: project.designDecisions,
    limitations: project.limitations,
    roadmap: project.roadmap,
    safetyNote: safetyEn[project.slug],
    maturity: project.status
  };
}

export const patternByProject: Record<string, string> = {
  "trip-planner": "Tool + State",
  "script-team": "Transfer",
  "worldcup-analyst": "AgentTool",
  "love-advisor": "Parallel + Sequential",
  "dashboard-insights": "Workflow + Loop + MCP/RAG",
  "a2a-orchestrator": "Remote Agent + A2A"
};

export const controlOwnerByProject: Record<string, string> = {
  "trip-planner": "Single agent",
  "script-team": "Transferred specialist",
  "worldcup-analyst": "Root agent",
  "love-advisor": "Workflow",
  "dashboard-insights": "Workflow + QA gate",
  "a2a-orchestrator": "Orchestrator + protocol"
};
