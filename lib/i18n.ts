export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localeFromPath(pathname: string | null | undefined): Locale {
  const first = pathname?.split("/").filter(Boolean)[0];
  return isLocale(first ?? "") ? first as Locale : defaultLocale;
}

export function localizedPath(locale: Locale, path = "") {
  const withoutLocale = path.replace(/^\/(vi|en)(?=\/|$)/, "");
  const normalized = withoutLocale === "/" ? "" : withoutLocale.startsWith("/") ? withoutLocale : `/${withoutLocale}`;
  return `/${locale}${normalized}`;
}

export type EvidenceState = "documented" | "located" | "verified" | "proposed" | "pending";

const vi = {
  common: {
    siteName: "ADK Agent Ecosystem",
    skip: "Bỏ qua điều hướng",
    menu: "Menu",
    close: "Đóng",
    copy: "Sao chép liên kết",
    copied: "Đã sao chép",
    reset: "Đặt lại",
    simulation: "Mô phỏng từ kiến trúc repository — không phải request đang chạy trực tiếp.",
    localSimulation: "Mô phỏng tương tác cục bộ — không gọi model hoặc service thật.",
    openProject: "Mở case study",
    readAsText: "Đọc toàn bộ luồng dạng văn bản",
    noContact: "Chỉ những kênh liên hệ đã được cấu hình mới xuất hiện.",
    paperMode: "Chế độ giấy",
    print: "In trang"
  },
  nav: {
    home: "Trang chủ",
    projects: "Dự án",
    system: "Hệ thống",
    learn: "Học & Ôn",
    evidence: "Bằng chứng",
    about: "Giới thiệu",
    contact: "Liên hệ",
    command: "Lệnh nhanh",
    primary: "Điều hướng chính",
    footer: "Điều hướng chân trang"
  },
  hero: {
    eyebrow: "GOOGLE ADK · A2A · PYTHON",
    title: "Từ một agent biết gọi công cụ đến một hệ sinh thái agent phân tán.",
    subtitle: "Sáu project lần lượt bổ sung trạng thái, vai trò chuyên biệt, workflow, truy xuất dữ liệu, vòng kiểm chứng chất lượng, khả năng quan sát và điều phối A2A.",
    ctaPrimary: "Khám phá luồng hệ thống",
    ctaSecondary: "Xem 6 project",
    stats: [
      ["6", "Case study kiến trúc", "Từ tool/state đến A2A"],
      ["4", "Mô hình điều khiển", "Transfer · AgentTool · Workflow · Remote"],
      ["8000–8005", "Cổng dịch vụ A2A", "Kiến trúc local được mô tả"]
    ]
  },
  home: {
    ladderEyebrow: "CAPABILITY LADDER",
    ladderTitle: "Mỗi project bổ sung một lớp kỹ thuật còn thiếu.",
    ladderBody: "Không chỉ tăng số lượng agent; mỗi bước thay đổi quyền điều khiển, dữ liệu có thể truy cập và cách kiểm chứng kết quả.",
    layer: "Lớp mới",
    owner: "Quyền điều khiển",
    artifact: "Artifact",
    risk: "Rủi ro chính",
    evidence: "Trạng thái bằng chứng",
    tryLab: "Mở verified replay",
    recruiterTitle: "Đọc nhanh năng lực, sau đó kiểm tra bằng chứng.",
    recruiterCopy: "Google ADK, Python, tool calling, state, workflow, MCP, RAG và A2A được đặt trong một lộ trình có giới hạn rõ.",
    featuredDashboard: "Dashboard Evidence Lab",
    featuredA2A: "A2A Routing Lab",
    artifacts: "Artifact gallery",
    comparator: "So sánh mô hình điều khiển",
    evidenceBridge: "Bằng chứng trước tính từ",
    contact: "Trao đổi về AI Agent, Python và Applied AI."
  },
  system: {
    eyebrow: "A2A CONTROL PLANE",
    title: "Theo dõi một request đi qua toàn hệ sinh thái.",
    subtitle: "Xem lý do routing, capability contract, workflow nội bộ, tool/data, validation và artifact.",
    preset: "Chọn tình huống",
    play: "Chạy",
    pause: "Tạm dừng",
    previous: "Bước trước",
    next: "Bước tiếp",
    restart: "Chạy lại",
    step: "Bước",
    routing: "Lý do điều phối",
    card: "Agent Card",
    workflow: "Workflow nội bộ",
    contract: "Tool/Data contract",
    validation: "Kiểm chứng",
    artifact: "Artifact / fallback",
    stepList: "Danh sách bước",
    deepLink: "Sao chép liên kết bước này"
  },
  projects: {
    eyebrow: "PROJECT INDEX · VIỆC CẦN LÀM → OUTPUT",
    title: "Bắt đầu từ vấn đề bạn muốn giải quyết.",
    subtitle: "Sáu project cho thấy sáu cách biến một yêu cầu thành output có thể kiểm tra.",
    search: "Tìm project hoặc công nghệ",
    filters: "Lọc theo pattern",
    ladder: "Dạng lộ trình",
    table: "Dạng so sánh",
    clear: "Xóa bộ lọc",
    empty: "Không có project khớp mọi bộ lọc. Hãy bỏ bớt một điều kiện.",
    pattern: "Pattern",
    maturity: "Mức hoàn thiện",
    evidence: "Bằng chứng"
  },
  caseStudy: {
    proves: "Project này chứng minh điều gì",
    problem: "Bài toán người dùng",
    architecture: "Kiến trúc",
    trace: "Luồng xử lý nội bộ",
    artifact: "Artifact đầu ra",
    decisions: "Quyết định thiết kế",
    evidence: "Bằng chứng",
    limitations: "Giới hạn",
    roadmap: "Lớp nâng cấp tiếp theo",
    source: "Source đã xác minh",
    sourcePending: "Chưa có file path và commit đã xác minh. Không hiển thị pseudocode như source thật.",
    toc: "Mục lục case study",
    previous: "Project trước",
    next: "Project tiếp theo",
    sample: "Mẫu được chuẩn bị trước"
  },
  evidence: {
    eyebrow: "TRUST LAYER",
    title: "Bằng chứng trước tính từ.",
    subtitle: "Mỗi claim được phân biệt theo bằng chứng thực tế, không theo mức độ tự tin của giao diện.",
    labels: {
      documented: "Có trong tài liệu được cung cấp",
      located: "Đã tìm thấy trong repository",
      verified: "Đã xác minh cục bộ",
      proposed: "Đề xuất nâng cấp",
      pending: "Cần xác minh"
    },
    matrix: "Ma trận xác minh",
    limitations: "Giới hạn đã biết",
    mismatches: "Điểm lệch tài liệu cần kiểm tra",
    hardening: "Lộ trình gia cố hệ thống",
    accessibility: "Khả năng tiếp cận",
    privacy: "Quyền riêng tư"
  },
  learn: {
    eyebrow: "LEARNING LAYER",
    title: "Kiến trúc agent, giải thích bằng hệ thống cụ thể.",
    subtitle: "Đọc bản 60 giây, xem bản 5 phút và nối khái niệm với project.",
    quick: "60 giây",
    deep: "5 phút",
    glossary: "Thuật ngữ",
    search: "Tìm thuật ngữ",
    noResult: "Không tìm thấy thuật ngữ phù hợp.",
    quiz: "Tự kiểm tra",
    related: "Mở project liên quan"
  },
  about: {
    eyebrow: "ABOUT",
    title: "Tôi khảo sát sáu nấc kiến trúc agent.",
    body: "Tôi bắt đầu với một agent dùng công cụ, sau đó lần lượt thêm trạng thái, vai trò chuyên biệt, workflow, dữ liệu, vòng kiểm chứng và điều phối A2A. Portfolio này tập trung vào quyết định kiến trúc, artifact và giới hạn có thể kiểm tra.",
    explored: "Những lớp kỹ thuật đã khảo sát",
    capabilities: "Nhóm năng lực"
  },
  contact: {
    eyebrow: "CONTACT",
    title: "Trao đổi về AI Agent, Python và Applied AI.",
    body: "Website chỉ hiển thị hành động liên hệ khi có URL hoặc email thật trong cấu hình."
  },
  voice: {
    title: "Thuyết minh",
    unsupported: "Trình duyệt này chưa hỗ trợ đọc văn bản bằng giọng nói. Nội dung chữ vẫn có đầy đủ.",
    play: "Nghe",
    pause: "Tạm dừng",
    resume: "Tiếp tục",
    stop: "Dừng",
    previous: "Phần trước",
    next: "Phần tiếp",
    speed: "Tốc độ",
    voice: "Giọng đọc",
    section: "Nội dung"
  },
  lab: {
    start: "Bắt đầu mô phỏng",
    reset: "Đặt lại",
    empty: "Hãy chọn input để bắt đầu.",
    error: "Mô phỏng không thể cập nhật trạng thái. Hãy đặt lại và thử lại.",
    artifact: "Artifact mẫu",
    staticFallback: "Luồng tĩnh vẫn mô tả đầy đủ kiến trúc khi interaction không khả dụng."
  },
  command: {
    title: "Command Deck",
    open: "Mở Command Deck",
    short: "Lệnh",
    startTrace: "Bắt đầu trace hệ thống",
    startVoice: "Bắt đầu hoặc dừng thuyết minh",
    resetProgress: "Đặt lại tiến độ khám phá",
    search: "Tìm trang, project hoặc hành động",
    empty: "Không tìm thấy lệnh phù hợp."
  },
  footer: {
    statement: "Không phải sáu chatbot. Sáu bước kiến trúc hướng tới một hệ sinh thái agent.",
    thesis: "Không phải sáu chatbot. Sáu bước kiến trúc hướng tới một hệ sinh thái agent.",
    trace: "Theo dõi một request qua hệ thống",
    colophon: "Việt / Anh · mô phỏng deterministic · source nằm trong chi tiết kỹ thuật"
  }
};

const en: Dictionary = {
  common: {
    siteName: "ADK Agent Ecosystem", skip: "Skip to content", menu: "Menu", close: "Close",
    copy: "Copy link", copied: "Copied", reset: "Reset",
    simulation: "Simulated from repository architecture — not a live request.",
    localSimulation: "Local interactive simulation — no model or live service is called.",
    openProject: "Open case study", readAsText: "Read the complete trace as text",
    noContact: "Only configured contact channels are shown.", paperMode: "Paper mode", print: "Print page"
  },
  nav: { home: "Home", projects: "Projects", system: "System", learn: "Learn & Review", evidence: "Evidence", about: "About", contact: "Contact", command: "Quick commands", primary: "Primary navigation", footer: "Footer navigation" },
  hero: {
    eyebrow: "GOOGLE ADK · A2A · PYTHON",
    title: "From one tool-using agent to a distributed agent ecosystem.",
    subtitle: "Six projects progressively add state, specialist roles, workflows, retrieval, quality loops, observability and A2A orchestration.",
    ctaPrimary: "Explore the system trace", ctaSecondary: "View six projects",
    stats: [
      ["6", "Architecture case studies", "From tool/state to A2A"],
      ["4", "Control models", "Transfer · AgentTool · Workflow · Remote"],
      ["8000–8005", "A2A service ports", "Described local architecture"]
    ]
  },
  home: {
    ladderEyebrow: "CAPABILITY LADDER", ladderTitle: "Each project adds one missing engineering layer.",
    ladderBody: "The progression changes control, data access and verification—not merely the number of agents.",
    layer: "New layer", owner: "Control owner", artifact: "Artifact", risk: "Primary risk", evidence: "Evidence state",
    tryLab: "Open verified replay", recruiterTitle: "Scan the capability story, then inspect the evidence.",
    recruiterCopy: "Google ADK, Python, tool calling, state, workflows, MCP, RAG and A2A are arranged as an inspectable progression.",
    featuredDashboard: "Dashboard Evidence Lab", featuredA2A: "A2A Routing Lab", artifacts: "Artifact gallery",
    comparator: "Compare control models", evidenceBridge: "Evidence before adjectives",
    contact: "Let’s talk about AI agents, Python and applied AI."
  },
  system: {
    eyebrow: "A2A CONTROL PLANE", title: "Follow one request across the ecosystem.",
    subtitle: "Inspect routing reasons, capability contracts, internal workflows, tools/data, validation and artifacts.",
    preset: "Choose a scenario", play: "Play", pause: "Pause", previous: "Previous step", next: "Next step",
    restart: "Restart", step: "Step", routing: "Routing reason", card: "Agent Card", workflow: "Internal workflow",
    contract: "Tool/Data contract", validation: "Validation", artifact: "Artifact / fallback",
    stepList: "Step list", deepLink: "Copy a link to this step"
  },
  projects: {
    eyebrow: "PROJECT INDEX · JOB → OUTPUT", title: "Start with the problem you need to solve.",
    subtitle: "Six projects show six ways to turn a request into an inspectable output.", search: "Search a problem, project or technology",
    filters: "Filter by pattern", ladder: "Ladder view", table: "Comparison view", clear: "Clear filters",
    empty: "No project matches all selected patterns. Clear one filter.", pattern: "Pattern", maturity: "Maturity", evidence: "Evidence"
  },
  caseStudy: {
    proves: "What this project proves", problem: "User job", architecture: "Architecture",
    trace: "Internal request trace", artifact: "Output artifact", decisions: "Design decisions", evidence: "Evidence",
    limitations: "Limitations", roadmap: "Next engineering layer", source: "Verified source",
    sourcePending: "No verified file path and commit are available. Pseudocode is not presented as source.",
    toc: "Case-study contents", previous: "Previous project", next: "Next project", sample: "Prepared sample"
  },
  evidence: {
    eyebrow: "TRUST LAYER", title: "Evidence before adjectives.",
    subtitle: "Claims are separated by actual evidence, not by interface confidence.",
    labels: { documented: "Documented in supplied material", located: "Located in repository", verified: "Verified locally", proposed: "Proposed upgrade", pending: "Needs verification" },
    matrix: "Verification matrix", limitations: "Known limitations", mismatches: "Documentation mismatches",
    hardening: "System-hardening roadmap", accessibility: "Accessibility", privacy: "Privacy"
  },
  learn: {
    eyebrow: "LEARNING LAYER", title: "Agent architecture explained through concrete systems.",
    subtitle: "Read the 60-second version, inspect the 5-minute version and connect each concept to a project.",
    quick: "60 seconds", deep: "5 minutes", glossary: "Glossary", search: "Search terms",
    noResult: "No matching term.", quiz: "Self-check", related: "Open the related project"
  },
  about: {
    eyebrow: "ABOUT", title: "I explored six levels of agent architecture.",
    body: "I began with one tool-using agent and progressively added state, specialist roles, workflows, data, quality loops and A2A orchestration. This portfolio focuses on inspectable architecture decisions, artifacts and limitations.",
    explored: "Engineering layers explored", capabilities: "Capability areas"
  },
  contact: {
    eyebrow: "CONTACT", title: "Let’s talk about AI agents, Python and applied AI.",
    body: "The site renders a contact action only when a real URL or email exists in configuration."
  },
  voice: {
    title: "Voice guide", unsupported: "This browser does not support text-to-speech. The complete text remains available.",
    play: "Listen", pause: "Pause", resume: "Resume", stop: "Stop", previous: "Previous section",
    next: "Next section", speed: "Speed", voice: "Voice", section: "Section"
  },
  lab: {
    start: "Start simulation", reset: "Reset", empty: "Choose an input to begin.",
    error: "The simulation could not update state. Reset it and try again.", artifact: "Sample artifact",
    staticFallback: "The static flow still explains the complete architecture when interaction is unavailable."
  },
  command: { title: "Command Deck", open: "Open Command Deck", short: "Commands", startTrace: "Start a system trace", startVoice: "Start or stop voice guide", resetProgress: "Reset exploration progress", search: "Search pages, projects or actions", empty: "No matching command." },
  footer: {
    statement: "Not six chatbots. Six architectural steps toward an agent ecosystem.",
    thesis: "Not six chatbots. Six architectural steps toward an agent ecosystem.",
    trace: "Follow a request across the system",
    colophon: "Vietnamese / English · deterministic simulations · source inside technical details"
  }
};

export type Dictionary = typeof vi;

export function getDictionary(locale: Locale): Dictionary {
  return locale === "vi" ? vi : en;
}
