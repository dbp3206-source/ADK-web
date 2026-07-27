import { lessons } from "@/lib/lessons";
import type { Locale } from "@/lib/i18n";
import type { Lesson } from "@/lib/types";

const viLessons: Record<string, Lesson> = {
  "agent-vs-chatbot": {
    slug: "agent-vs-chatbot",
    title: "Agent khác chatbot ở đâu?",
    thesis: "Chatbot trả lời; agent có thể quyết định, hành động, quan sát kết quả và tiếp tục.",
    quick: [
      "Mô hình ngôn ngữ đọc và tạo ngôn ngữ.",
      "Agent thêm vòng lặp hành động: quan sát, quyết định, gọi tool, kiểm tra kết quả và tiếp tục.",
      "Trip Planner vượt qua ranh giới này bằng tool lưu và đọc trạng thái phiên."
    ],
    detail: [
      { heading: "Vòng lặp", body: "Agent quan sát request và context, quyết định thông tin còn thiếu, hành động qua tool hoặc handoff được phép, rồi quan sát kết quả cho tới khi tạo được đầu ra hữu ích." },
      { heading: "Ranh giới runtime", body: "Model chọn tool và đề xuất đối số có cấu trúc. Runtime kiểm tra đối số và gọi hàm Python thật. Model không được tuyên bố hành động đã xảy ra nếu runtime chưa trả bằng chứng." },
      { heading: "Điều gì thay đổi", body: "Tool xác định hệ thống có thể chạm tới đâu. State xác định phiên nhớ được gì. Guardrail xác định việc agent không được làm." }
    ],
    relatedProject: "trip-planner",
    checks: [
      { question: "Điều gì làm tool call trở thành hành động thật?", options: ["Model mô tả nó", "Runtime thực thi nó", "Người dùng lặp lại"], answer: 1, explanation: "Runtime kiểm tra đối số và thực thi hàm." },
      { question: "State là gì?", options: ["Database vĩnh viễn", "Dữ liệu phiên có cấu trúc", "Tham số model"], answer: 1, explanation: "State là dữ liệu tạm thời gắn với phiên làm việc." },
      { question: "Sau kết quả tool, agent làm gì?", options: ["Quan sát kết quả", "Reload trình duyệt", "Bỏ prompt"], answer: 0, explanation: "Kết quả trở thành context cho quyết định tiếp theo." }
    ]
  },
  "file-anatomy": {
    slug: "file-anatomy", title: "Giải phẫu file project", thesis: "Mỗi file cần trả lời được một câu hỏi: vì sao nó tồn tại?",
    quick: ["agent.py khai báo root agent, model, instruction, tool và sub-agent.", ".env giữ secret cục bộ; .env.example chỉ nêu biến cần thiết.", "Tool code, smoke test, dependency và run script giúp execution có thể kiểm tra."],
    detail: [
      { heading: "Khai báo agent", body: "Root agent là điểm vào. Description hỗ trợ routing; instruction đặt quy tắc bền vững; danh sách tool giới hạn hành động model có thể yêu cầu." },
      { heading: "Tool và schema", body: "Hàm tool chứa công việc thực thi. Type hint và schema giúp runtime từ chối input sai trước khi chạm file, data hoặc service." },
      { heading: "Cấu hình và test", body: "Secret nằm ngoài source control. Dependency phải khớp import thật. Smoke test chạy tool độc lập để không nhầm lỗi tool với lỗi instruction hoặc routing." }
    ],
    relatedProject: "script-team",
    checks: [
      { question: "API key nên nằm ở đâu?", options: [".env", "README.md", "agent.py"], answer: 0, explanation: "Secret cục bộ thuộc về .env và không được commit." },
      { question: "Tool schema bảo vệ gì?", options: ["Màu brand", "Cấu trúc input", "Thứ tự nav"], answer: 1, explanation: "Schema định nghĩa và kiểm tra contract input." },
      { question: "Vì sao test tool riêng?", options: ["Kéo dài prompt", "Cô lập lỗi", "Tạo screenshot"], answer: 1, explanation: "Test riêng phân biệt lỗi tool với lỗi model hoặc instruction." }
    ]
  },
  "multi-agent-patterns": {
    slug: "multi-agent-patterns", title: "Bốn pattern đa agent", thesis: "Chọn pattern theo quyền điều khiển, mức độc lập và độ chắc chắn của workflow.",
    quick: ["Transfer trao quyền sở hữu bước tiếp theo cho specialist.", "Agent as Tool giữ root agent trong vai trò điều khiển.", "Workflow agent mã hóa thứ tự, nhánh song song hoặc vòng lặp hữu hạn.", "A2A nối các agent service độc lập qua ranh giới mạng."],
    detail: [
      { heading: "Transfer", body: "Dùng transfer khi specialist tiếp theo nên sở hữu lượt hội thoại. Script Team làm rõ quyền sở hữu của Drafter, Critic và Reviser." },
      { heading: "Agent as Tool", body: "Dùng AgentTool khi root cần gọi năng lực specialist rồi nhận kết quả lại. World Cup Analyst tách tìm kiếm và tính toán theo cách này." },
      { heading: "Workflow và remote agent", body: "Dùng workflow agent khi thứ tự phải xác định. Dùng A2A khi collaborator là service độc lập có capability contract, endpoint và chi phí protocol." }
    ],
    relatedProject: "a2a-orchestrator",
    checks: [
      { question: "Ai điều khiển Agent as Tool?", options: ["Root agent", "Trình duyệt", "Data store"], answer: 0, explanation: "Root gọi specialist như một capability có biên." },
      { question: "Khi nào ParallelAgent hữu ích?", options: ["Các nhánh độc lập", "Mọi bước phụ thuộc bước trước", "Service offline"], answer: 0, explanation: "Công việc độc lập có thể chạy mà không chờ nhánh khác." },
      { question: "A2A thay đổi điều gì?", options: ["Font", "Ranh giới service", "Cú pháp JSON"], answer: 1, explanation: "A2A thêm các service độc lập và contract mạng." }
    ]
  },
  "mcp-vs-a2a": {
    slug: "mcp-vs-a2a", title: "MCP và A2A", thesis: "MCP nối agent với tool/data; A2A nối các agent độc lập.",
    quick: ["MCP là interface nhất quán cho tool và data.", "A2A là protocol discovery, message, task và artifact giữa các agent system.", "Dashboard Insights minh họa MCP; Orchestrator minh họa topology A2A."],
    detail: [
      { heading: "MCP", body: "Model Context Protocol cho agent cách nhất quán để gọi tool được phép và truy cập data. Ranh giới chính là agent-to-capability." },
      { heading: "A2A", body: "Agent2Agent Protocol cho hệ độc lập mô tả capability bằng Agent Card, nhận message/task và trả artifact. Ranh giới chính là service-to-service." },
      { heading: "Chi phí vận hành", body: "Remote call thêm yêu cầu versioning, auth, timeout, retry, fallback và cross-service trace. Đây là nâng cấp đề xuất, không phải hành vi live được tuyên bố." }
    ],
    relatedProject: "dashboard-insights",
    checks: [
      { question: "Protocol nào nối filesystem tool?", options: ["MCP", "A2A", "CSS"], answer: 0, explanation: "MCP nối agent với tool và nguồn dữ liệu." },
      { question: "Thứ gì mô tả capability A2A?", options: ["Agent Card", "Session state", "Font manifest"], answer: 0, explanation: "Agent Card công bố capability và endpoint." },
      { question: "Artifact là gì?", options: ["Đầu ra bền vững", "Hover state", "Secret key"], answer: 0, explanation: "Artifact là report, file hoặc kết quả có cấu trúc." }
    ]
  }
};

export function getLocalizedLessons(locale: Locale) {
  return locale === "vi" ? Object.values(viLessons) : lessons;
}

export function getLocalizedLesson(slug: string, locale: Locale) {
  return getLocalizedLessons(locale).find((lesson) => lesson.slug === slug);
}
