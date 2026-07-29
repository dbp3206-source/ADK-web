import type { Locale } from "@/lib/i18n";

type Text = { vi: string; en: string };

export type ConceptGuide = {
  plainTitle: Text;
  definition: Text;
  problemSolved: Text;
  needSignals: Text[];
  everydayExample: Text;
  workExample: Text;
  useCases: Text[];
  applySteps: Text[];
  failureSignal: Text;
  avoidTip: Text;
  relatedConcepts: string[];
};

const t = (vi: string, en: string): Text => ({ vi, en });

export const conceptGuides: Record<string, ConceptGuide> = {
  "SC-01": {
    plainTitle: t("Biến ý nghĩa thành tọa độ để tìm nội dung gần nhau.", "Turn meaning into coordinates so similar content can be found."),
    definition: t("Embedding model biến nội dung thành dãy số thể hiện mức gần nhau về ý nghĩa.", "An embedding model turns content into numbers that represent semantic similarity."),
    problemSolved: t("Tìm đúng ý dù người hỏi không dùng đúng từ trong tài liệu.", "Find the right meaning even when the query uses different words."),
    needSignals: [t("Tìm kiếm theo từ khóa bỏ sót kết quả.", "Keyword search misses useful results."), t("Nội dung có nhiều cách diễn đạt.", "The same idea has many phrasings."), t("Cần nhóm hoặc gợi ý nội dung tương tự.", "Content must be grouped or recommended by similarity.")],
    everydayExample: t("Xếp những món đồ có công dụng giống nhau vào cùng khu vực.", "Put items with similar uses in the same area."),
    workExample: t("Tìm “xin nghỉ phép” dù tài liệu dùng cụm “leave request”.", "Find “time off request” even when a document says “leave request”."),
    useCases: [t("Tìm kiếm ngữ nghĩa", "Semantic search"), t("Gợi ý nội dung", "Recommendations"), t("Phân cụm phản hồi", "Feedback clustering")],
    applySteps: [t("Chọn nội dung cần so sánh.", "Choose the content to compare."), t("Tạo embedding bằng cùng một model.", "Create embeddings with one model."), t("Đo độ gần và kiểm tra mẫu kết quả.", "Measure similarity and review sample results.")],
    failureSignal: t("Kết quả trông gần về từ nhưng sai ý.", "Results look lexically close but mean the wrong thing."),
    avoidTip: t("Dùng eval theo domain và không trộn embedding từ model khác nhau.", "Use domain-specific evals and do not mix vectors from different models."),
    relatedConcepts: ["SC-02", "SC-03"],
  },
  "SC-02": {
    plainTitle: t("Kho tìm kiếm nhanh cho các tọa độ ý nghĩa.", "A fast search store for semantic coordinates."),
    definition: t("Vector database lưu embedding cùng metadata để tìm nội dung liên quan nhanh.", "A vector database stores embeddings and metadata for fast similarity search."),
    problemSolved: t("Tìm vài đoạn phù hợp trong kho tài liệu lớn mà không quét toàn bộ.", "Retrieve a few relevant passages from a large corpus without scanning everything."),
    needSignals: [t("Kho tài liệu lớn dần.", "The document corpus keeps growing."), t("Cần lọc theo quyền hoặc nguồn.", "Results need permission or source filters."), t("Tìm kiếm phải phản hồi nhanh.", "Search must respond quickly.")],
    everydayExample: t("Kho hàng được chia khu để lấy đúng món nhanh hơn.", "A warehouse is organized so the right item can be retrieved quickly."),
    workExample: t("Tìm đúng đoạn trong hàng nghìn tài liệu nội bộ theo team và quyền xem.", "Find the right passage across thousands of internal documents with team and permission filters."),
    useCases: [t("RAG", "RAG"), t("Kho kiến thức", "Knowledge bases"), t("Tìm sản phẩm tương tự", "Similar-product search")],
    applySteps: [t("Chia tài liệu thành đoạn có nghĩa.", "Split documents into meaningful chunks."), t("Lưu embedding kèm nguồn và quyền.", "Store embeddings with source and permission metadata."), t("Kiểm tra recall và thời gian truy vấn.", "Test recall and query latency.")],
    failureSignal: t("Kết quả đúng ý nhưng sai phiên bản hoặc lộ tài liệu không được phép.", "Results are relevant but stale or expose unauthorized documents."),
    avoidTip: t("Bắt buộc metadata filter, version và chính sách xóa.", "Require metadata filters, versions and deletion policies."),
    relatedConcepts: ["SC-01", "SC-03", "SC-15"],
  },
  "SC-03": {
    plainTitle: t("Tìm tài liệu trước, rồi mới để AI trả lời.", "Retrieve evidence before asking AI to answer."),
    definition: t("RAG đưa các đoạn nguồn liên quan vào context để câu trả lời dựa trên bằng chứng.", "RAG puts relevant source passages into context so answers can use evidence."),
    problemSolved: t("Giảm câu trả lời dựa vào trí nhớ model khi kiến thức riêng hoặc thay đổi.", "Reduce reliance on model memory for private or changing knowledge."),
    needSignals: [t("Câu trả lời cần trích nguồn.", "Answers need citations."), t("Dữ liệu nằm ngoài training.", "Knowledge is outside model training."), t("Tài liệu cập nhật thường xuyên.", "Documents change frequently.")],
    everydayExample: t("Tra hướng dẫn mới nhất trước khi chỉ người khác làm.", "Check the latest instructions before advising someone."),
    workExample: t("Chatbot chính sách công ty lấy đúng trang đang có hiệu lực rồi mới trả lời.", "A policy assistant retrieves the currently effective page before answering."),
    useCases: [t("Chatbot nội bộ", "Internal assistant"), t("Hỗ trợ khách hàng", "Customer support"), t("Đọc hợp đồng", "Contract review")],
    applySteps: [t("Xác định nguồn đáng tin.", "Define trusted sources."), t("Retrieve ít đoạn nhưng đúng.", "Retrieve a small, relevant set."), t("Yêu cầu trả lời kèm citation và fallback.", "Require citations and a fallback.")],
    failureSignal: t("Câu trả lời trôi chảy nhưng citation không chứng minh claim.", "The answer is fluent but its citations do not support the claim."),
    avoidTip: t("Đánh giá retrieval riêng với generation và từ chối khi thiếu nguồn.", "Evaluate retrieval separately from generation and abstain without evidence."),
    relatedConcepts: ["SC-01", "SC-02", "SC-04", "SC-17"],
  },
  "SC-04": {
    plainTitle: t("Sắp đúng thông tin vào đúng bước.", "Put the right information into the right step."),
    definition: t("Context Engineering chọn, sắp xếp và giới hạn thông tin model nhận ở mỗi bước.", "Context Engineering selects, orders and limits what a model sees at each step."),
    problemSolved: t("Giữ yêu cầu quan trọng không bị chìm trong dữ liệu cũ, thừa hoặc mâu thuẫn.", "Keep critical instructions from being buried in stale, excessive or conflicting data."),
    needSignals: [t("Prompt dài nhưng bỏ sót yêu cầu.", "Long prompts still miss requirements."), t("Nhiều bước cần dữ liệu khác nhau.", "Different steps need different data."), t("Lịch sử hội thoại bắt đầu mâu thuẫn.", "Conversation history begins to conflict.")],
    everydayExample: t("Gửi danh sách cần mua hôm nay, không gửi lịch sử mua cả năm.", "Send today’s shopping list, not a year of purchase history."),
    workExample: t("Bước viết báo cáo chỉ nhận KPI hiện tại, định nghĩa KPI và kỳ trước.", "A reporting step receives current KPIs, their definitions and the previous period."),
    useCases: [t("Agent nhiều bước", "Multi-step agents"), t("Bộ nhớ hội thoại", "Conversation memory"), t("Tóm tắt cuộc họp", "Meeting summaries")],
    applySteps: [t("Viết rõ output cần tạo.", "Write the required output."), t("Chọn dữ liệu thật sự cần cho bước này.", "Select only data needed for this step."), t("Loại dữ liệu cũ, trùng hoặc mâu thuẫn.", "Remove stale, duplicate or conflicting data.")],
    failureSignal: t("Prompt càng dài nhưng kết quả càng bỏ sót yêu cầu chính.", "The prompt grows while the output misses more core requirements."),
    avoidTip: t("Dùng context budget, thứ tự ưu tiên và kiểm tra dữ liệu trước mỗi bước.", "Use a context budget, priority order and a pre-step data check."),
    relatedConcepts: ["SC-03", "SC-14", "SC-13"],
  },
  "SC-05": {
    plainTitle: t("Dùng lại kết quả cho câu hỏi có ý nghĩa gần nhau.", "Reuse results for semantically similar requests."),
    definition: t("Semantic cache trả lại kết quả cũ khi yêu cầu mới đủ gần và vẫn còn hợp lệ.", "A semantic cache reuses an earlier result when a new request is similar and still valid."),
    problemSolved: t("Giảm chi phí và thời gian cho những câu hỏi lặp lại theo cách diễn đạt khác.", "Reduce cost and latency for repeated intents phrased differently."),
    needSignals: [t("Nhiều câu hỏi lặp ý.", "Many requests repeat the same intent."), t("Model call tốn chi phí.", "Model calls are expensive."), t("Câu trả lời có thời hạn rõ.", "Answers have a clear validity window.")],
    everydayExample: t("Lưu sẵn câu trả lời cho những câu hỏi thường gặp.", "Keep a ready answer for frequently asked questions."),
    workExample: t("“Giờ mở cửa?” và “Mấy giờ hoạt động?” dùng chung kết quả còn hạn.", "“Opening hours?” and “When are you open?” reuse one valid result."),
    useCases: [t("FAQ", "FAQ"), t("Tóm tắt lặp lại", "Repeated summaries"), t("Tra cứu ổn định", "Stable lookups")],
    applySteps: [t("Chọn request được phép cache.", "Choose cacheable requests."), t("Gắn key với version, quyền và TTL.", "Key by version, permissions and TTL."), t("Đo hit đúng, không chỉ hit nhiều.", "Measure correct hits, not just hit rate.")],
    failureSignal: t("Người dùng nhận câu trả lời cũ sau khi nguồn đã cập nhật.", "Users receive an old answer after the source changed."),
    avoidTip: t("Invalidate theo version nguồn và tách cache theo quyền.", "Invalidate by source version and separate caches by permission."),
    relatedConcepts: ["SC-01", "SC-03", "SC-16"],
  },
  "SC-06": {
    plainTitle: t("Chọn model phù hợp cho từng việc.", "Choose the right model for each job."),
    definition: t("Model routing dùng đặc điểm task, rủi ro và chi phí để chọn model.", "Model routing selects a model using task needs, risk and cost."),
    problemSolved: t("Không dùng model mạnh cho mọi việc hoặc model yếu cho việc khó.", "Avoid using an expensive model for everything or a weak one for hard tasks."),
    needSignals: [t("Task có độ khó khác nhau.", "Tasks vary in difficulty."), t("Chi phí hoặc latency quan trọng.", "Cost or latency matters."), t("Có nhiều model/provider.", "Several models or providers are available.")],
    everydayExample: t("Việc đơn giản dùng công cụ đơn giản; việc khó nhờ chuyên gia.", "Use a simple tool for a simple job and a specialist for a hard one."),
    workExample: t("Tóm tắt ngắn dùng model nhanh; phân tích rủi ro dùng model mạnh hơn.", "Use a fast model for short summaries and a stronger one for risk analysis."),
    useCases: [t("Nền tảng AI", "AI platforms"), t("Fallback model", "Model fallback"), t("Tối ưu chi phí", "Cost optimization")],
    applySteps: [t("Phân nhóm task và rủi ro.", "Classify tasks and risk."), t("Đặt rule cùng confidence threshold.", "Set rules and confidence thresholds."), t("Eval router và fallback.", "Evaluate routing and fallback.")],
    failureSignal: t("Task khó bị chuyển sang model rẻ nhưng không đủ năng lực.", "A hard task is routed to a cheap but underpowered model."),
    avoidTip: t("Đo chất lượng theo từng nhóm task, không chỉ tổng chi phí.", "Measure quality per task class, not only total cost."),
    relatedConcepts: ["SC-07", "SC-17", "SC-16"],
  },
  "SC-07": {
    plainTitle: t("Một cổng chung để kiểm soát nhiều model.", "One control point for multiple models."),
    definition: t("AI gateway chuẩn hóa truy cập model và áp dụng policy, log, limit, fallback.", "An AI gateway standardizes model access and applies policy, logs, limits and fallback."),
    problemSolved: t("Tránh mỗi ứng dụng tự tích hợp và tự kiểm soát provider theo cách riêng.", "Prevent each application from integrating and governing providers differently."),
    needSignals: [t("Nhiều team gọi model.", "Several teams call models."), t("Cần quota và theo dõi chi phí.", "Quotas and cost tracking are needed."), t("Phải thay provider mà không sửa mọi app.", "Providers must change without rewriting every app.")],
    everydayExample: t("Mọi xe đi qua một trạm kiểm soát chung.", "All vehicles pass through one control station."),
    workExample: t("Một endpoint áp rate limit, log và fallback cho ba provider.", "One endpoint applies rate limits, logs and fallback across three providers."),
    useCases: [t("Platform nội bộ", "Internal platform"), t("Multi-provider", "Multi-provider"), t("Governance", "Governance")],
    applySteps: [t("Chuẩn hóa request và response.", "Normalize request and response."), t("Áp auth, quota và routing.", "Apply auth, quotas and routing."), t("Theo dõi lỗi, chi phí và version.", "Track errors, cost and versions.")],
    failureSignal: t("Gateway thành điểm lỗi duy nhất hoặc che mất lỗi provider.", "The gateway becomes a single point of failure or hides provider errors."),
    avoidTip: t("Có timeout, circuit breaker và log giữ nguyên nguyên nhân gốc.", "Use timeouts, circuit breakers and logs that preserve root causes."),
    relatedConcepts: ["SC-06", "SC-16", "SC-15"],
  },
  "SC-08": {
    plainTitle: t("Cho AI chọn một hàm đã được định nghĩa.", "Let AI choose a predefined function."),
    definition: t("Function calling yêu cầu model trả tên hàm và tham số theo schema.", "Function calling asks a model to return a function name and schema-valid arguments."),
    problemSolved: t("Chuyển ý định bằng ngôn ngữ tự nhiên thành lời gọi có cấu trúc.", "Turn natural-language intent into a structured call."),
    needSignals: [t("Cần input có schema.", "Inputs need a schema."), t("Có tập hành động rõ.", "There is a defined action set."), t("Text tự do khó validate.", "Free text is hard to validate.")],
    everydayExample: t("Bấm đúng nút trên máy để thực hiện một việc.", "Press the right machine button for a task."),
    workExample: t("Model chọn hàm kiểm tra tồn kho với mã sản phẩm đã validate.", "The model selects an inventory function with a validated product ID."),
    useCases: [t("Tra cứu", "Lookups"), t("Tạo ticket", "Ticket creation"), t("Lấy dữ liệu có cấu trúc", "Structured data retrieval")],
    applySteps: [t("Định nghĩa hàm nhỏ và rõ.", "Define small, clear functions."), t("Validate tham số ngoài model.", "Validate arguments outside the model."), t("Trả lỗi có cấu trúc để xử lý tiếp.", "Return structured errors for recovery.")],
    failureSignal: t("Model chọn đúng hàm nhưng truyền tham số thiếu hoặc nguy hiểm.", "The model selects the right function with missing or unsafe arguments."),
    avoidTip: t("Schema, allowlist và kiểm tra quyền phải nằm trong code.", "Keep schemas, allowlists and permission checks in code."),
    relatedConcepts: ["SC-09", "SC-11", "SC-15"],
  },
  "SC-09": {
    plainTitle: t("Dùng công cụ để làm việc ngoài khung chat.", "Use tools to act beyond the chat."),
    definition: t("Tool use bao gồm chọn, gọi, đọc kết quả và phục hồi lỗi từ công cụ.", "Tool use covers selecting, calling, reading and recovering from tools."),
    problemSolved: t("Giúp agent đọc file, tính toán hoặc tác động lên hệ thống thật.", "Let an agent read files, calculate or interact with real systems."),
    needSignals: [t("Model cần dữ liệu mới.", "The model needs fresh data."), t("Phép tính phải chính xác.", "A calculation must be exact."), t("Cần tạo thay đổi ngoài chat.", "Something outside chat must change.")],
    everydayExample: t("Dùng máy tính thay vì tự nhẩm.", "Use a calculator instead of mental arithmetic."),
    workExample: t("Agent đọc CSV, tính KPI bằng code rồi mới viết nhận xét.", "An agent reads a CSV, computes KPIs in code, then writes commentary."),
    useCases: [t("Đọc file", "File access"), t("Tính toán", "Calculation"), t("API action", "API actions")],
    applySteps: [t("Giới hạn tool theo task.", "Limit tools by task."), t("Kiểm tra input và hậu điều kiện.", "Validate inputs and postconditions."), t("Thiết kế retry không tạo tác dụng phụ lặp.", "Make retries idempotent.")],
    failureSignal: t("Tool timeout, agent retry và tạo tác dụng phụ hai lần.", "A tool times out, the agent retries and duplicates a side effect."),
    avoidTip: t("Dùng idempotency key, timeout và xác nhận cho hành động rủi ro.", "Use idempotency keys, timeouts and approval for risky actions."),
    relatedConcepts: ["SC-08", "SC-10", "SC-13", "SC-15"],
  },
  "SC-10": {
    plainTitle: t("Chuẩn chung để nối AI với công cụ và dữ liệu.", "A shared standard for connecting AI to tools and data."),
    definition: t("MCP mô tả cách client khám phá và gọi tool, resource, prompt qua contract chung.", "MCP defines how clients discover and call tools, resources and prompts through a shared contract."),
    problemSolved: t("Giảm tích hợp riêng lẻ giữa mỗi AI client và mỗi nguồn dữ liệu.", "Reduce one-off integrations between every AI client and data source."),
    needSignals: [t("Một nguồn cần phục vụ nhiều client.", "One source must serve several clients."), t("Tool cần được khám phá động.", "Tools need dynamic discovery."), t("Muốn tách connector khỏi agent.", "Connectors should be separate from agents.")],
    everydayExample: t("Một loại ổ cắm chung dùng cho nhiều thiết bị.", "One socket standard works with many devices."),
    workExample: t("Agent đọc filesystem hoặc database qua cùng kiểu contract.", "An agent accesses files or a database through one contract style."),
    useCases: [t("Developer tools", "Developer tools"), t("Data access", "Data access"), t("Enterprise connectors", "Enterprise connectors")],
    applySteps: [t("Xác định resource và tool cần mở.", "Define exposed resources and tools."), t("Giới hạn quyền ở server.", "Enforce permissions at the server."), t("Test capability và error contract.", "Test capabilities and error contracts.")],
    failureSignal: t("Client thấy tool nhưng gọi sai schema hoặc được cấp quyền quá rộng.", "A client sees a tool but calls the wrong schema or receives excessive access."),
    avoidTip: t("Version contract, least privilege và kiểm thử compatibility.", "Version contracts, apply least privilege and test compatibility."),
    relatedConcepts: ["SC-09", "SC-11", "SC-15"],
  },
  "SC-11": {
    plainTitle: t("Nối AI với hệ thống đang dùng trong công việc.", "Connect AI to systems already used at work."),
    definition: t("External integration nối agent với CRM, lịch, ticket hoặc dịch vụ bên ngoài.", "External integration connects an agent to CRMs, calendars, tickets or external services."),
    problemSolved: t("Biến câu trả lời thành hành động trong quy trình thật.", "Turn an answer into an action in a real workflow."),
    needSignals: [t("Dữ liệu nằm trong SaaS khác.", "Data lives in another SaaS."), t("Cần ghi thay đổi có kiểm soát.", "Controlled writes are required."), t("Phải đồng bộ trạng thái.", "State must stay synchronized.")],
    everydayExample: t("Kết nối lịch, danh bạ và nhắc việc.", "Connect calendars, contacts and reminders."),
    workExample: t("Agent tạo ticket và gắn đúng account trong CRM sau khi được duyệt.", "An agent creates a ticket and links the correct CRM account after approval."),
    useCases: [t("CRM", "CRM"), t("Calendar", "Calendar"), t("Ticketing", "Ticketing")],
    applySteps: [t("Chọn action nhỏ nhất cần thiết.", "Choose the smallest needed action."), t("Thiết kế auth và approval.", "Design authentication and approval."), t("Theo dõi sync, retry và rollback.", "Track sync, retry and rollback.")],
    failureSignal: t("Agent cập nhật nhầm record hoặc lặp action sau timeout.", "The agent updates the wrong record or repeats an action after timeout."),
    avoidTip: t("Xác nhận object ID, dùng idempotency và ghi audit log.", "Confirm object IDs, use idempotency and keep an audit log."),
    relatedConcepts: ["SC-08", "SC-09", "SC-10", "SC-15"],
  },
  "SC-12": {
    plainTitle: t("Bộ khung giới hạn agent được phép làm gì.", "The runtime frame that limits what an agent may do."),
    definition: t("Agent harness quản lý model, tool, quyền, số bước, state và chính sách chạy.", "An agent harness manages models, tools, permissions, steps, state and runtime policy."),
    problemSolved: t("Biến vòng lặp model thành một runtime có giới hạn và quan sát được.", "Turn model loops into a bounded, observable runtime."),
    needSignals: [t("Agent có nhiều tool.", "The agent has several tools."), t("Cần giới hạn bước hoặc budget.", "Steps or budget need limits."), t("Nhiều run phải theo cùng policy.", "Runs must follow the same policy.")],
    everydayExample: t("Luật chơi giới hạn hành động, lượt và điều kiện dừng.", "Game rules limit actions, turns and stopping conditions."),
    workExample: t("Harness chỉ cho agent bán hàng đọc CRM và tạo draft, không tự gửi email.", "A sales-agent harness can read CRM and draft text but cannot send email."),
    useCases: [t("Agent runtime", "Agent runtime"), t("Permission boundary", "Permission boundaries"), t("Execution policy", "Execution policy")],
    applySteps: [t("Khai báo goal và quyền.", "Declare goals and permissions."), t("Đặt step, cost và stop limit.", "Set step, cost and stop limits."), t("Ghi trace cho mỗi quyết định.", "Trace each decision.")],
    failureSignal: t("Agent có tool đúng nhưng không có giới hạn khi lặp hoặc chuyển quyền.", "The agent has valid tools but no limits on loops or delegation."),
    avoidTip: t("Dùng allowlist, budget cứng và escalation rõ.", "Use allowlists, hard budgets and clear escalation."),
    relatedConcepts: ["SC-13", "SC-09", "SC-15", "SC-16"],
  },
  "SC-13": {
    plainTitle: t("Hiểu → làm → xem kết quả → tiếp tục hoặc dừng.", "Understand → act → inspect → continue or stop."),
    definition: t("Execution loop lặp việc lập kế hoạch, gọi tool và quan sát cho tới điều kiện dừng.", "An execution loop repeats planning, tool calls and observation until a stop condition."),
    problemSolved: t("Cho agent xử lý nhiệm vụ cần nhiều bước và phản ứng với kết quả trung gian.", "Let an agent handle multi-step tasks and react to intermediate results."),
    needSignals: [t("Không biết trước mọi bước.", "Not every step is known upfront."), t("Kết quả tool quyết định bước sau.", "Tool results determine the next step."), t("Task cần phục hồi khi thiếu dữ liệu.", "The task must recover from missing data.")],
    everydayExample: t("Thử một cách, xem kết quả rồi điều chỉnh.", "Try an approach, inspect the result and adjust."),
    workExample: t("Agent tìm dữ liệu, thấy thiếu cột rồi yêu cầu file đúng trước khi phân tích.", "An agent inspects data, finds a missing column and requests a corrected file."),
    useCases: [t("Research agent", "Research agents"), t("Troubleshooting", "Troubleshooting"), t("Multi-step automation", "Multi-step automation")],
    applySteps: [t("Định nghĩa trạng thái tiến triển.", "Define progress states."), t("Đặt stop và retry condition.", "Set stop and retry conditions."), t("Escalate khi không tiến triển.", "Escalate when progress stalls.")],
    failureSignal: t("Agent tiếp tục gọi tool dù mục tiêu đã đạt hoặc không còn tiến triển.", "The agent keeps calling tools after success or without progress."),
    avoidTip: t("Giới hạn bước, budget và kiểm tra hậu điều kiện sau mỗi action.", "Limit steps and budget, then check postconditions after each action."),
    relatedConcepts: ["SC-12", "SC-09", "SC-14", "SC-16"],
  },
  "SC-14": {
    plainTitle: t("Giữ thông tin để dùng lại đúng lúc.", "Keep information so it can be reused at the right time."),
    definition: t("Memory system lưu, tìm lại, cập nhật và quên thông tin theo chính sách.", "A memory system stores, retrieves, updates and forgets information under policy."),
    problemSolved: t("Giữ continuity qua bước hoặc phiên mà không nhồi toàn bộ lịch sử vào prompt.", "Preserve continuity across steps or sessions without sending full history."),
    needSignals: [t("User phải lặp lại preference.", "Users repeat preferences."), t("Task kéo dài qua nhiều phiên.", "Tasks span sessions."), t("State trung gian cần dùng lại.", "Intermediate state must be reused.")],
    everydayExample: t("Ghi chú sở thích của một người và cập nhật khi họ đổi ý.", "Note someone’s preference and update it when it changes."),
    workExample: t("Agent nhớ format báo cáo của team nhưng không lưu dữ liệu nhạy cảm quá hạn.", "An agent remembers a team’s report format without retaining sensitive data too long."),
    useCases: [t("Personalization", "Personalization"), t("Session state", "Session state"), t("Long-running work", "Long-running work")],
    applySteps: [t("Phân loại dữ liệu được nhớ.", "Classify memory candidates."), t("Đặt owner, TTL và quyền sửa/xóa.", "Set owners, TTL and edit/delete rights."), t("Retrieve đúng phần cho bước hiện tại.", "Retrieve only what the current step needs.")],
    failureSignal: t("Thông tin sai tồn tại lâu, lan sang phiên sau hoặc không thể xóa.", "Bad information persists, spreads to later sessions or cannot be deleted."),
    avoidTip: t("Có provenance, expiry và thao tác xem/sửa/xóa cho user.", "Provide provenance, expiry and user controls to view, edit and delete."),
    relatedConcepts: ["SC-04", "SC-13", "SC-15"],
  },
  "SC-15": {
    plainTitle: t("Hàng rào giới hạn nội dung và hành động.", "Boundaries that constrain content and actions."),
    definition: t("Guardrails kiểm soát input, retrieval, tool, output và hành động rủi ro.", "Guardrails control inputs, retrieval, tools, outputs and risky actions."),
    problemSolved: t("Giảm khả năng hệ thống làm việc ngoài policy hoặc gây tác động không được duyệt.", "Reduce out-of-policy behavior and unapproved effects."),
    needSignals: [t("Agent có quyền ghi.", "The agent can write data."), t("Dữ liệu có nhạy cảm.", "Data is sensitive."), t("Sai sót gây hậu quả thật.", "Errors have real consequences.")],
    everydayExample: t("Cần xác nhận trước khi mua hàng.", "Require confirmation before a purchase."),
    workExample: t("Agent được tạo draft email nhưng chỉ người dùng mới được gửi.", "An agent may draft an email but only the user can send it."),
    useCases: [t("Approval", "Approval"), t("Content safety", "Content safety"), t("Tool permissions", "Tool permissions")],
    applySteps: [t("Liệt kê hành động và mức rủi ro.", "List actions and risk levels."), t("Đặt kiểm soát trước, trong và sau.", "Place controls before, during and after."), t("Test cách bypass và fallback.", "Test bypass attempts and fallback.")],
    failureSignal: t("Chỉ dựa vào system prompt trong khi tool vẫn có quyền quá rộng.", "The system relies on a prompt while tools retain excessive permissions."),
    avoidTip: t("Đưa quyền và validation vào code, không giao cho model tự tuân thủ.", "Enforce permissions and validation in code, not model discretion."),
    relatedConcepts: ["SC-09", "SC-11", "SC-12", "SC-17"],
  },
  "SC-16": {
    plainTitle: t("Biết hệ thống đã làm gì và lỗi ở đâu.", "Know what the system did and where it failed."),
    definition: t("Observability dùng metrics, logs và traces để tái hiện một run.", "Observability uses metrics, logs and traces to reconstruct a run."),
    problemSolved: t("Tìm nguyên nhân khi output sai, chậm hoặc tốn chi phí.", "Find causes when outputs are wrong, slow or expensive."),
    needSignals: [t("Không tái hiện được lỗi.", "Failures cannot be reproduced."), t("Nhiều model và tool tham gia.", "Several models and tools participate."), t("Cần nối output tới version.", "Outputs need version traceability.")],
    everydayExample: t("Xem lịch sử đơn hàng để biết nó dừng ở bước nào.", "Inspect order history to see where it stopped."),
    workExample: t("Trace nối request tới model, context, tool, latency và output.", "A trace links a request to its model, context, tool, latency and output."),
    useCases: [t("Debug", "Debugging"), t("Cost tracking", "Cost tracking"), t("Audit", "Auditing")],
    applySteps: [t("Gắn correlation ID.", "Attach a correlation ID."), t("Log sự kiện có cấu trúc và redaction.", "Log structured, redacted events."), t("Tạo dashboard theo failure quan trọng.", "Build views around important failures.")],
    failureSignal: t("Trace thiếu ID nối bước hoặc log làm lộ dữ liệu cá nhân.", "Traces lack correlation IDs or logs expose personal data."),
    avoidTip: t("Redact theo trường, phân quyền xem và đặt retention.", "Redact by field, control access and set retention."),
    relatedConcepts: ["SC-17", "SC-07", "SC-13", "SC-15"],
  },
  "SC-17": {
    plainTitle: t("Kiểm tra hệ thống có làm đúng không.", "Test whether the system does the job correctly."),
    definition: t("Evaluation đo task thật, failure case và regression bằng tiêu chí lặp lại.", "Evaluation measures real tasks, failures and regressions with repeatable criteria."),
    problemSolved: t("Biết thay đổi prompt, model hoặc architecture có thực sự tốt hơn.", "Know whether a prompt, model or architecture change is actually better."),
    needSignals: [t("Team tranh luận bằng cảm giác.", "The team debates by intuition."), t("Sửa một lỗi làm hỏng task khác.", "Fixing one issue breaks another task."), t("Cần release gate.", "A release gate is needed.")],
    everydayExample: t("Làm cùng một bài kiểm tra theo cùng tiêu chí trước và sau khi học.", "Take the same test with the same rubric before and after learning."),
    workExample: t("Chạy bộ câu hỏi chuẩn trước và sau khi đổi prompt, gồm cả tool error.", "Run a standard set before and after a prompt change, including tool failures."),
    useCases: [t("Regression test", "Regression tests"), t("Model comparison", "Model comparison"), t("Release gate", "Release gates")],
    applySteps: [t("Chọn task và failure thật.", "Choose real tasks and failures."), t("Viết rubric đo được.", "Write measurable rubrics."), t("Chạy lặp lại và xem theo segment.", "Run repeatedly and inspect segments.")],
    failureSignal: t("Eval chỉ chấm câu trả lời đẹp, bỏ qua routing, tool error và chi phí.", "Evals reward polished answers while ignoring routing, tool errors and cost."),
    avoidTip: t("Dùng nhiều lớp metric và giữ một tập regression cố định.", "Use layered metrics and keep a stable regression set."),
    relatedConcepts: ["SC-16", "SC-15", "SC-06", "SC-03"],
  },
};

export type LocalizedConceptGuide = Omit<
  ConceptGuide,
  "plainTitle" | "definition" | "problemSolved" | "needSignals" | "everydayExample" | "workExample" | "useCases" | "applySteps" | "failureSignal" | "avoidTip"
> & {
  plainTitle: string;
  definition: string;
  problemSolved: string;
  needSignals: string[];
  everydayExample: string;
  workExample: string;
  useCases: string[];
  applySteps: string[];
  failureSignal: string;
  avoidTip: string;
};

export function localizeConceptGuide(id: string, locale: Locale): LocalizedConceptGuide {
  const item = conceptGuides[id];
  const language = locale === "vi" ? "vi" : "en";
  return {
    ...item,
    plainTitle: item.plainTitle[language],
    definition: item.definition[language],
    problemSolved: item.problemSolved[language],
    needSignals: item.needSignals.map((value) => value[language]),
    everydayExample: item.everydayExample[language],
    workExample: item.workExample[language],
    useCases: item.useCases.map((value) => value[language]),
    applySteps: item.applySteps.map((value) => value[language]),
    failureSignal: item.failureSignal[language],
    avoidTip: item.avoidTip[language],
  };
}
