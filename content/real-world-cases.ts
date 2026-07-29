import type { Locale } from "@/lib/i18n";

type LocalizedText = { vi: string; en: string };

export type RealWorldCase = {
  id: string;
  projectSlug: string;
  caseLabel: LocalizedText;
  headline: LocalizedText;
  persona: {
    role: LocalizedText;
    context: LocalizedText;
  };
  story: LocalizedText;
  contextChips: {
    icon: "person" | "time" | "budget" | "target" | "data" | "risk";
    label: LocalizedText;
    value: LocalizedText;
  }[];
  pains: LocalizedText[];
  constraints: LocalizedText[];
  expectedArtifacts: {
    type: "itinerary" | "script" | "memo" | "agreement" | "report" | "route";
    title: LocalizedText;
    previewData: { label: LocalizedText; value: LocalizedText }[];
  }[];
  addedCapability: LocalizedText;
  visualMotif: "hue-route" | "redline" | "evidence-desk" | "dual-lane" | "qa-sheet" | "control-tower";
  simulatorCaseId: string;
};

const cases: RealWorldCase[] = [
  {
    id: "case-group-travel",
    projectSlug: "trip-planner",
    caseLabel: { vi: "CASE 01 · DU LỊCH NHÓM", en: "CASE 01 · GROUP TRAVEL" },
    headline: {
      vi: "Lập chuyến đi Huế ba ngày cho nhóm bốn người khi yêu cầu thay đổi qua nhiều lượt.",
      en: "Plan a three-day Hue trip for four people while requirements change across turns.",
    },
    persona: {
      role: { vi: "Lan, người lập kế hoạch cho nhóm", en: "Lan, the group planner" },
      context: { vi: "Bốn người bạn chuẩn bị chuyến đi ngắn", en: "Four friends preparing a short trip" },
    },
    story: {
      vi: "Lan cung cấp ngày đi và ngân sách ở lượt đầu. Các thành viên sau đó bổ sung món ăn, địa điểm văn hóa và thời gian nghỉ. Khi quay lại cuộc trò chuyện, cô cần biết agent còn nhớ chính xác dữ liệu nào trước khi chốt lịch trình.",
      en: "Lan gives the dates and budget first. The group later adds food, cultural stops and rest preferences. When she returns, she needs to know exactly what the agent retained before finalizing the itinerary.",
    },
    contextChips: [
      { icon: "person", label: { vi: "Nhóm", en: "Group" }, value: { vi: "4 người", en: "4 people" } },
      { icon: "time", label: { vi: "Thời gian", en: "Duration" }, value: { vi: "3 ngày", en: "3 days" } },
      { icon: "budget", label: { vi: "Ngân sách", en: "Budget" }, value: { vi: "Khoảng 6.000.000 ₫", en: "About VND 6,000,000" } },
      { icon: "target", label: { vi: "Mục tiêu", en: "Goal" }, value: { vi: "Văn hóa và ẩm thực", en: "Culture and food" } },
    ],
    pains: [
      { vi: "Thông tin nằm rải rác qua nhiều lượt.", en: "Information is spread across several turns." },
      { vi: "Yêu cầu của nhóm thay đổi trước khi chốt.", en: "Group requirements change before approval." },
      { vi: "Agent có thể nói đã nhớ dù state chưa được lưu.", en: "The agent may claim memory without stored state." },
    ],
    constraints: [
      { vi: "Không bịa giá hoặc booking.", en: "Do not invent prices or bookings." },
      { vi: "Phải chỉ rõ dữ liệu đã lưu.", en: "Show exactly what was stored." },
      { vi: "Thiếu dữ liệu thì hỏi lại.", en: "Ask when required data is missing." },
    ],
    expectedArtifacts: [{
      type: "itinerary",
      title: { vi: "Lịch trình + state receipt", en: "Itinerary + state receipt" },
      previewData: [
        { label: { vi: "Ngày 1", en: "Day 1" }, value: { vi: "Đại Nội · chợ Đông Ba", en: "Imperial City · Dong Ba Market" } },
        { label: { vi: "Ngày 2", en: "Day 2" }, value: { vi: "Lăng Minh Mạng · món Huế", en: "Minh Mang Tomb · Hue cuisine" } },
        { label: { vi: "Đã lưu", en: "Stored" }, value: { vi: "4 người · 3 ngày · 6 triệu", en: "4 people · 3 days · VND 6m" } },
      ],
    }],
    addedCapability: {
      vi: "Project này thêm khả năng gọi công cụ và dùng lại dữ liệu đã lưu trong phiên.",
      en: "This project adds tool use and reusable session state.",
    },
    visualMotif: "hue-route",
    simulatorCaseId: "TP-01",
  },
  {
    id: "case-portfolio-video",
    projectSlug: "script-team",
    caseLabel: { vi: "CASE 02 · VIDEO PORTFOLIO", en: "CASE 02 · PORTFOLIO VIDEO" },
    headline: {
      vi: "Hoàn thiện kịch bản video portfolio 60 giây trước buổi phỏng vấn.",
      en: "Finish a 60-second portfolio video script before an interview.",
    },
    persona: {
      role: { vi: "Ứng viên kỹ thuật", en: "Technical candidate" },
      context: { vi: "Gửi video cho recruiter vào sáng hôm sau", en: "Sending a video to a recruiter the next morning" },
    },
    story: {
      vi: "Brief có nhiều chi tiết kỹ thuật nhưng quá dài, thiếu hook và CTA. Bản nháp phải được viết, phản biện theo tiêu chí rồi sửa lại, đồng thời cho thấy feedback nào đã được xử lý.",
      en: "The brief is technically dense but too long, with no hook or CTA. The draft must be written, critiqued against a rubric and revised with a visible account of what changed.",
    },
    contextChips: [
      { icon: "person", label: { vi: "Người xem", en: "Audience" }, value: { vi: "Recruiter", en: "Recruiter" } },
      { icon: "time", label: { vi: "Deadline", en: "Deadline" }, value: { vi: "Sáng hôm sau", en: "Next morning" } },
      { icon: "target", label: { vi: "Độ dài", en: "Length" }, value: { vi: "Tối đa 60 giây", en: "60 seconds max" } },
      { icon: "data", label: { vi: "Đầu vào", en: "Input" }, value: { vi: "Brief portfolio AI Agent", en: "AI Agent portfolio brief" } },
    ],
    pains: [
      { vi: "Một agent tự viết và tự chấm dễ bỏ qua lỗi.", en: "One agent writing and judging its own work misses issues." },
      { vi: "Feedback chung chung khó chuyển thành bản sửa.", en: "Vague feedback is hard to turn into revisions." },
      { vi: "Bản cuối có thể không phản ánh góp ý.", en: "The final version may ignore the critique." },
    ],
    constraints: [
      { vi: "Có hook, problem, solution và CTA.", en: "Include hook, problem, solution and CTA." },
      { vi: "Người xem không cần biết sâu về AI.", en: "Assume no deep AI knowledge." },
      { vi: "Chỉ rõ phần đã sửa.", en: "Show what was revised." },
    ],
    expectedArtifacts: [{
      type: "script",
      title: { vi: "Draft → critique → revision", en: "Draft → critique → revision" },
      previewData: [
        { label: { vi: "00–08s", en: "00–08s" }, value: { vi: "Hook: từ chatbot tới hệ agent", en: "Hook: from chatbot to agent system" } },
        { label: { vi: "08–48s", en: "08–48s" }, value: { vi: "Vấn đề · giải pháp · bằng chứng", en: "Problem · solution · evidence" } },
        { label: { vi: "Đã sửa", en: "Revised" }, value: { vi: "Rút 23 từ · làm rõ CTA", en: "23 words cut · CTA clarified" } },
      ],
    }],
    addedCapability: {
      vi: "Project này thêm khả năng chuyển việc giữa nhiều vai trò và giữ feedback có cấu trúc.",
      en: "This project adds role handoffs and structured feedback.",
    },
    visualMotif: "redline",
    simulatorCaseId: "ST-01",
  },
  {
    id: "case-sports-editorial",
    projectSlug: "worldcup-analyst",
    caseLabel: { vi: "CASE 03 · BIÊN TẬP THỂ THAO", en: "CASE 03 · SPORTS EDITORIAL" },
    headline: {
      vi: "Xác minh số liệu và phép tính trước khi xuất bản một bài phân tích thể thao.",
      en: "Verify evidence and calculations before publishing a sports analysis.",
    },
    persona: {
      role: { vi: "Biên tập viên thể thao", en: "Sports editor" },
      context: { vi: "Chuẩn bị bài tổng kết sau trận đấu", en: "Preparing a post-match analysis" },
    },
    story: {
      vi: "Trước khi xuất bản, người viết cần kiểm tra tỉ số, tách dữ kiện khỏi nhận định và tính một chỉ số bằng phép tính có thể tái lập. Nếu thiếu nguồn, hệ thống phải nói rõ thay vì tự nhớ số liệu.",
      en: "Before publication, the editor must verify the score, separate evidence from opinion and calculate a reproducible metric. If a source is missing, the system must say so rather than recall a number.",
    },
    contextChips: [
      { icon: "person", label: { vi: "Vai trò", en: "Role" }, value: { vi: "Biên tập viên", en: "Editor" } },
      { icon: "data", label: { vi: "Nguồn", en: "Source" }, value: { vi: "Dataset đã xác minh", en: "Verified dataset" } },
      { icon: "target", label: { vi: "Output", en: "Output" }, value: { vi: "Analyst memo", en: "Analyst memo" } },
      { icon: "risk", label: { vi: "Rủi ro", en: "Risk" }, value: { vi: "Số liệu không nguồn", en: "Unsourced statistics" } },
    ],
    pains: [
      { vi: "Dữ kiện đầu vào có thể sai.", en: "Input facts may be wrong." },
      { vi: "Model tự nhẩm không đáng tin.", en: "Model mental arithmetic is unreliable." },
      { vi: "Kết luận có thể trộn dữ kiện và suy đoán.", en: "Conclusions may mix evidence and inference." },
    ],
    constraints: [
      { vi: "Nguồn và phép tính phải tách biệt.", en: "Separate sources from calculations." },
      { vi: "Không dùng dữ liệu live nếu không có nguồn live.", en: "No live claims without a live source." },
      { vi: "Ghi rõ phạm vi nguồn.", en: "State the source scope." },
    ],
    expectedArtifacts: [{
      type: "memo",
      title: { vi: "Evidence ledger + analyst memo", en: "Evidence ledger + analyst memo" },
      previewData: [
        { label: { vi: "Dữ kiện", en: "Evidence" }, value: { vi: "3–3 sau hiệp phụ", en: "3–3 after extra time" } },
        { label: { vi: "Phép tính", en: "Calculation" }, value: { vi: "Hiệu số bàn thắng = 0", en: "Goal difference = 0" } },
        { label: { vi: "Phạm vi", en: "Scope" }, value: { vi: "World Cup 2022 cố định", en: "Fixed World Cup 2022 data" } },
      ],
    }],
    addedCapability: {
      vi: "Project này thêm specialist tìm nguồn và code tính toán trước khi root agent diễn giải.",
      en: "This project adds source retrieval and code-based calculation before synthesis.",
    },
    visualMotif: "evidence-desk",
    simulatorCaseId: "WC-01",
  },
  {
    id: "case-shared-planning",
    projectSlug: "love-advisor",
    caseLabel: { vi: "CASE 04 · LẬP KẾ HOẠCH CHUNG", en: "CASE 04 · SHARED PLANNING" },
    headline: {
      vi: "Hợp nhất hai cách giao tiếp và lập kế hoạch khác nhau mà không đánh giá con người.",
      en: "Combine two planning and communication styles without judging either person.",
    },
    persona: {
      role: { vi: "Hai người chuẩn bị chuyến đi chung", en: "Two people preparing a shared trip" },
      context: { vi: "Khác cách trao đổi và ra quyết định", en: "Different communication and decision styles" },
    },
    story: {
      vi: "Một người muốn trao đổi thẳng và chốt sớm; người còn lại cần thời gian suy nghĩ và muốn giữ sự linh hoạt. Họ cần một kế hoạch chung mà không biến khác biệt thành chẩn đoán hoặc kết luận ai đúng.",
      en: "One person prefers direct discussion and early decisions; the other needs reflection time and flexibility. They need a shared plan without turning differences into diagnosis or deciding who is right.",
    },
    contextChips: [
      { icon: "person", label: { vi: "Người dùng", en: "Users" }, value: { vi: "2 người", en: "2 people" } },
      { icon: "target", label: { vi: "Mục tiêu", en: "Goal" }, value: { vi: "Kế hoạch chung", en: "Shared plan" } },
      { icon: "data", label: { vi: "Dữ liệu", en: "Data" }, value: { vi: "Preference tự khai", en: "User-stated preferences" } },
      { icon: "risk", label: { vi: "Giới hạn", en: "Boundary" }, value: { vi: "Không chẩn đoán", en: "No diagnosis" } },
    ],
    pains: [
      { vi: "Một góc nhìn có thể lấn át góc còn lại.", en: "One perspective may dominate the other." },
      { vi: "Tổng hợp quá sớm làm mất dữ liệu.", en: "Early synthesis can discard useful input." },
      { vi: "Kết luận dễ trở nên quá chắc chắn.", en: "Conclusions can sound overly certain." },
    ],
    constraints: [
      { vi: "Chỉ dùng preference do user cung cấp.", en: "Use only stated preferences." },
      { vi: "Không diagnosis hoặc appearance scoring.", en: "No diagnosis or appearance scoring." },
      { vi: "Luôn có uncertainty note.", en: "Always include an uncertainty note." },
    ],
    expectedArtifacts: [{
      type: "agreement",
      title: { vi: "Hai lens + thỏa thuận chung", en: "Two lenses + shared agreement" },
      previewData: [
        { label: { vi: "Lens A", en: "Lens A" }, value: { vi: "Trao đổi thẳng · chốt sớm", en: "Direct · decide early" } },
        { label: { vi: "Lens B", en: "Lens B" }, value: { vi: "Có thời gian · giữ linh hoạt", en: "Reflect · stay flexible" } },
        { label: { vi: "Điểm chung", en: "Agreement" }, value: { vi: "Chốt khung, để mở chi tiết", en: "Fix the frame, leave details open" } },
      ],
    }],
    addedCapability: {
      vi: "Project này thêm hai nhánh song song và một synthesis gate chỉ mở khi đủ dữ liệu.",
      en: "This project adds parallel analysis with a synthesis gate.",
    },
    visualMotif: "dual-lane",
    simulatorCaseId: "LA-01",
  },
  {
    id: "case-sales-report",
    projectSlug: "dashboard-insights",
    caseLabel: { vi: "CASE 05 · BÁO CÁO DOANH THU", en: "CASE 05 · SALES REPORT" },
    headline: {
      vi: "Kiểm tra một insight doanh thu trước cuộc họp sáng.",
      en: "Verify a revenue insight before the morning meeting.",
    },
    persona: {
      role: { vi: "Sales lead", en: "Sales lead" },
      context: { vi: "Nhận CSV theo tháng và kênh trước cuộc họp 9 giờ", en: "Receives monthly channel CSV before a 9:00 meeting" },
    },
    story: {
      vi: "Một kênh có vẻ giảm mạnh. Người quản lý cần biết con số được tính ra sao, kết luận dựa trên dòng dữ liệu nào và đã qua QA hay chưa trước khi đưa vào executive report.",
      en: "One channel appears to have dropped sharply. The lead needs to know how the number was calculated, which rows support the claim and whether QA approved it before the executive report.",
    },
    contextChips: [
      { icon: "person", label: { vi: "Người dùng", en: "User" }, value: { vi: "Sales lead", en: "Sales lead" } },
      { icon: "time", label: { vi: "Deadline", en: "Deadline" }, value: { vi: "Trước 9:00", en: "Before 9:00" } },
      { icon: "data", label: { vi: "Input", en: "Input" }, value: { vi: "CSV doanh thu", en: "Revenue CSV" } },
      { icon: "target", label: { vi: "Output", en: "Output" }, value: { vi: "Executive report", en: "Executive report" } },
    ],
    pains: [
      { vi: "File có thể thiếu hoặc sai cột.", en: "The file may have missing or invalid columns." },
      { vi: "Phép tính phải tái lập được.", en: "Calculations must be reproducible." },
      { vi: "Claim có thể không nối được tới dữ liệu.", en: "Claims may not trace back to source rows." },
    ],
    constraints: [
      { vi: "Kiểm tra schema trước khi phân tích.", en: "Validate schema before analysis." },
      { vi: "Metric phải tính bằng code.", en: "Calculate metrics in code." },
      { vi: "Không suy diễn nguyên nhân.", en: "Do not invent causal explanations." },
    ],
    expectedArtifacts: [{
      type: "report",
      title: { vi: "Executive report + QA receipt", en: "Executive report + QA receipt" },
      previewData: [
        { label: { vi: "T7/2025", en: "Jul 2025" }, value: { vi: "0,8 tỷ · 2.900 đơn", en: "VND 0.8b · 2,900 orders" } },
        { label: { vi: "Bất thường", en: "Anomaly" }, value: { vi: "Tỷ lệ lỗi 8,4%", en: "Error rate 8.4%" } },
        { label: { vi: "QA", en: "QA" }, value: { vi: "Claim nối tới row nguồn", en: "Claim linked to source row" } },
      ],
    }],
    addedCapability: {
      vi: "Project này thêm kiểm tra dữ liệu, tính toán và QA trước khi tạo báo cáo.",
      en: "This project adds data validation, computation and QA before reporting.",
    },
    visualMotif: "qa-sheet",
    simulatorCaseId: "DI-01",
  },
  {
    id: "case-multi-agent-portal",
    projectSlug: "a2a-orchestrator",
    caseLabel: { vi: "CASE 06 · CỔNG MULTI-AGENT", en: "CASE 06 · MULTI-AGENT PORTAL" },
    headline: {
      vi: "Điều phối một yêu cầu tới đúng agent mà người dùng không cần biết endpoint.",
      en: "Route a request to the right agent without exposing endpoints to the user.",
    },
    persona: {
      role: { vi: "Nhân viên công ty", en: "Company employee" },
      context: { vi: "Dùng cổng chung cho nhiều agent service", en: "Uses one portal for several agent services" },
    },
    story: {
      vi: "Khi nhân viên nhập yêu cầu lên lịch offsite Đà Nẵng hai ngày, họ không nên phải biết tên service hoặc endpoint. Orchestrator phải đọc capability, chọn specialist, giải thích lý do route và xử lý timeout.",
      en: "When an employee requests a two-day Da Nang offsite, they should not need a service name or endpoint. The orchestrator must read capabilities, choose a specialist, explain the route and handle timeout.",
    },
    contextChips: [
      { icon: "person", label: { vi: "Người dùng", en: "User" }, value: { vi: "Nhân viên", en: "Employee" } },
      { icon: "data", label: { vi: "Hệ thống", en: "System" }, value: { vi: "Nhiều agent độc lập", en: "Independent agents" } },
      { icon: "target", label: { vi: "Yêu cầu", en: "Request" }, value: { vi: "Offsite Đà Nẵng", en: "Da Nang offsite" } },
      { icon: "risk", label: { vi: "Rủi ro", en: "Risk" }, value: { vi: "Route sai · timeout", en: "Wrong route · timeout" } },
    ],
    pains: [
      { vi: "Nhiều specialist có capability khác nhau.", en: "Specialists expose different capabilities." },
      { vi: "Service có thể timeout.", en: "A service may time out." },
      { vi: "Người dùng cần biết vì sao agent được chọn.", en: "The user needs a route reason." },
    ],
    constraints: [
      { vi: "Đọc đúng Agent Card.", en: "Read the Agent Card contract." },
      { vi: "Có timeout và fallback.", en: "Provide timeout and fallback." },
      { vi: "Không giả health hoặc latency.", en: "Do not fabricate health or latency." },
    ],
    expectedArtifacts: [{
      type: "route",
      title: { vi: "Route receipt + artifact", en: "Route receipt + artifact" },
      previewData: [
        { label: { vi: "Intent", en: "Intent" }, value: { vi: "Lập kế hoạch offsite", en: "Plan an offsite" } },
        { label: { vi: "Đã chọn", en: "Selected" }, value: { vi: "Trip Planner", en: "Trip Planner" } },
        { label: { vi: "Lý do", en: "Reason" }, value: { vi: "Khớp travel planning", en: "Travel-planning capability match" } },
      ],
    }],
    addedCapability: {
      vi: "Project này thêm capability routing và xử lý lỗi qua ranh giới service.",
      en: "This project adds capability routing and cross-service failure handling.",
    },
    visualMotif: "control-tower",
    simulatorCaseId: "A2A-01",
  },
];

export type LocalizedRealWorldCase = Omit<
  RealWorldCase,
  "caseLabel" | "headline" | "persona" | "story" | "contextChips" | "pains" | "constraints" | "expectedArtifacts" | "addedCapability"
> & {
  caseLabel: string;
  headline: string;
  persona: { role: string; context: string };
  story: string;
  contextChips: { icon: RealWorldCase["contextChips"][number]["icon"]; label: string; value: string }[];
  pains: string[];
  constraints: string[];
  expectedArtifacts: { type: RealWorldCase["expectedArtifacts"][number]["type"]; title: string; previewData: { label: string; value: string }[] }[];
  addedCapability: string;
};

export function getRealWorldCase(projectSlug: string, locale: Locale): LocalizedRealWorldCase | undefined {
  const item = cases.find((entry) => entry.projectSlug === projectSlug);
  if (!item) return undefined;
  const language = locale === "vi" ? "vi" : "en";
  return {
    ...item,
    caseLabel: item.caseLabel[language],
    headline: item.headline[language],
    persona: { role: item.persona.role[language], context: item.persona.context[language] },
    story: item.story[language],
    contextChips: item.contextChips.map((chip) => ({ ...chip, label: chip.label[language], value: chip.value[language] })),
    pains: item.pains.map((pain) => pain[language]),
    constraints: item.constraints.map((constraint) => constraint[language]),
    expectedArtifacts: item.expectedArtifacts.map((artifact) => ({
      ...artifact,
      title: artifact.title[language],
      previewData: artifact.previewData.map((row) => ({ label: row.label[language], value: row.value[language] })),
    })),
    addedCapability: item.addedCapability[language],
  };
}
