"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

// ────────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────────
interface SimStep {
  title: string;
  explanation: string;
  technicalKeyword?: string;
  actor: string;
  whyItMatters?: string;
}

interface SimCase {
  id: string;
  project: string;
  title: string;
  prompt: string;
  caseType: "happy" | "state-read" | "validation" | "rubric" | "failure" | "fallback" | string;
  steps: SimStep[];
  outputType: string;
  outputContent: React.ReactNode | null;
}

// ────────────────────────────────────────────────────────────────
// OUTPUT RENDERERS — project-specific visual output panels
// ────────────────────────────────────────────────────────────────

function TripOutput({ caseId }: { caseId: string }) {
  if (caseId === "TP-01") {
    return (
      <div className="sim-output-trip">
        <div className="sim-output-label">Lịch trình · 3 ngày Huế</div>
        <div className="sim-trip-days">
          <div className="sim-trip-day">
            <strong>Ngày 1</strong>
            <ul>
              <li>Sáng: Thăm Đại Nội, Cửa Ngọ Môn</li>
              <li>Trưa: Cơm hến Đông Ba</li>
              <li>Chiều: Lăng Tự Đức</li>
              <li>Tối: Phố đi bộ Nguyễn Đình Chiểu</li>
            </ul>
          </div>
          <div className="sim-trip-day">
            <strong>Ngày 2</strong>
            <ul>
              <li>Sáng: Chùa Thiên Mụ, sông Hương</li>
              <li>Trưa: Bánh khoái Lạc Thiện</li>
              <li>Chiều: Làng Phước Tích</li>
              <li>Tối: Nhà hàng bè nổi</li>
            </ul>
          </div>
          <div className="sim-trip-day">
            <strong>Ngày 3</strong>
            <ul>
              <li>Sáng: Bãi biển Lăng Cô</li>
              <li>Trưa: Hải sản địa phương</li>
              <li>Chiều: Đèo Hải Vân</li>
            </ul>
          </div>
        </div>
        <div className="sim-state-ticket">
          <span className="sim-state-label">Agent đã ghi nhớ</span>
          <dl>
            <div><dt>destination</dt><dd>Huế</dd></div>
            <div><dt>duration</dt><dd>3 ngày</dd></div>
            <div><dt>priority</dt><dd>văn hóa, ẩm thực</dd></div>
            <div><dt>budget</dt><dd>vừa phải</dd></div>
          </dl>
        </div>
      </div>
    );
  }
  if (caseId === "TP-02") {
    return (
      <div className="sim-output-trip">
        <div className="sim-output-label">Thông tin đã lưu</div>
        <div className="sim-state-ticket">
          <span className="sim-state-label">Đọc từ session state</span>
          <dl>
            <div><dt>destination</dt><dd>Huế</dd></div>
            <div><dt>duration</dt><dd>3 ngày</dd></div>
            <div><dt>priority</dt><dd>văn hóa, ẩm thực</dd></div>
          </dl>
        </div>
        <p className="sim-output-note">Agent chỉ trả lại thông tin đã xác nhận. Ngân sách chưa được cung cấp nên không hiển thị.</p>
      </div>
    );
  }
  return (
    <div className="sim-output-trip">
      <div className="sim-output-label">Câu hỏi làm rõ</div>
      <div className="sim-clarification">
        <p>Bạn muốn đi Huế mấy ngày? Ngân sách dự kiến khoảng bao nhiêu?</p>
        <p className="sim-output-note">Agent không tự bịa lịch trình khi thiếu thông tin.</p>
      </div>
    </div>
  );
}

function ScriptOutput({ caseId }: { caseId: string }) {
  const [tab, setTab] = useState<"draft" | "critique" | "revision">("draft");
  if (caseId === "ST-03") {
    return (
      <div className="sim-output-script">
        <div className="sim-output-label">Handoff thất bại — xử lý lỗi</div>
        <div className="sim-error-card">
          <span className="sim-error-icon">⚠</span>
          <p>Critic không nhận được bản nháp từ Drafter.</p>
          <p className="sim-output-note">Coordinator ghi nhận lỗi và yêu cầu Drafter chạy lại trước khi tiếp tục.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="sim-output-script">
      <div className="sim-output-tabs" role="tablist">
        <button role="tab" aria-selected={tab === "draft"} onClick={() => setTab("draft")}>Bản nháp</button>
        <button role="tab" aria-selected={tab === "critique"} onClick={() => setTab("critique")}>Phản biện</button>
        <button role="tab" aria-selected={tab === "revision"} onClick={() => setTab("revision")}>Bản sửa</button>
      </div>
      {tab === "draft" && (
        <div className="sim-manuscript">
          <p><strong>Mở đầu:</strong> "Bạn có bao giờ tự hỏi một AI agent thực sự làm gì khác một chatbot thông thường?"</p>
          <p><strong>Thân bài:</strong> Hệ thống gồm 6 agent — mỗi agent giải quyết một bài toán kiến trúc khác nhau...</p>
          <p><strong>CTA:</strong> "Khám phá case study đầy đủ tại [link]."</p>
        </div>
      )}
      {tab === "critique" && (
        <div className="sim-critique">
          <div className="sim-critique-item"><span className="sim-score">7/10</span><p>Mở đầu chưa đủ cụ thể — chưa nêu được kết quả thực tế.</p></div>
          <div className="sim-critique-item"><span className="sim-critique-pass">✓</span><p>CTA rõ ràng, có hành động cụ thể.</p></div>
          <div className="sim-critique-item"><span className="sim-critique-fail">✗</span><p>Thân bài thiếu ví dụ output mẫu — người xem không hình dung được.</p></div>
        </div>
      )}
      {tab === "revision" && (
        <div className="sim-manuscript sim-revision">
          <p><strong>Mở đầu (đã sửa):</strong> "Tôi xây 6 agent AI — từ agent biết ghi nhớ thông tin đến cả mạng agent tự tìm và gọi nhau."</p>
          <p><strong>Thân bài (đã sửa):</strong> Trip Planner nhớ tên, điểm đến và ngân sách bạn cung cấp. Script Team chia vai Drafter, Critic và Reviser...</p>
          <p><strong>CTA (giữ nguyên):</strong> "Khám phá case study đầy đủ tại [link]."</p>
        </div>
      )}
    </div>
  );
}

function WorldCupOutput({ caseId }: { caseId: string }) {
  return (
    <div className="sim-output-worldcup">
      <div className="sim-output-label">Báo cáo phân tích</div>
      <div className="sim-source-card">
        <span className="sim-source-label">Nguồn · Wikipedia</span>
        <p>Argentina 3–3 Pháp (pen. 4–2) — Chung kết World Cup 2022, Lusail, Qatar</p>
        <a className="sim-source-link" href="https://vi.wikipedia.org/wiki/Chung_k%E1%BA%BFt_FIFA_World_Cup_2022" target="_blank" rel="noopener noreferrer">↗ Xem nguồn</a>
      </div>
      <div className="sim-formula-tape">
        <span className="sim-formula-label">Tính toán (Python)</span>
        <pre className="sim-formula-code">{`bàn_thắng_arg = 3
bàn_thắng_phap = 3
hiệu_số = bàn_thắng_arg - bàn_thắng_phap
# → 0 (hòa, đá penalty)
tỷ_lệ_thắng_arg_wc22 = 7/7  # 7 trận thắng/7 trận`}</pre>
      </div>
      <div className="sim-report-excerpt">
        <p><strong>Kết luận:</strong> Argentina vô địch World Cup 2022. Trận chung kết kết thúc 3–3 sau 120 phút, Argentina thắng penalty 4–2.</p>
        <p className="sim-output-note">Số liệu từ Wikipedia — cập nhật đến ngày truy cập.</p>
      </div>
    </div>
  );
}

function LoveOutput({ caseId }: { caseId: string }) {
  const [lane, setLane] = useState<"both" | "appearance" | "personality">("both");
  return (
    <div className="sim-output-love">
      <div className="sim-output-label">Phân tích song song</div>
      <div className="sim-dual-lane-tabs" role="tablist">
        <button role="tab" aria-selected={lane === "both"} onClick={() => setLane("both")}>Cả hai</button>
        <button role="tab" aria-selected={lane === "appearance"} onClick={() => setLane("appearance")}>Ngoại hình</button>
        <button role="tab" aria-selected={lane === "personality"} onClick={() => setLane("personality")}>Tính cách</button>
      </div>
      <div className="sim-dual-lane">
        {(lane === "both" || lane === "appearance") && (
          <div className="sim-lane sim-lane-a">
            <strong>Nhánh A · Ngoại hình</strong>
            <p>Kibbe: Gợi ý Natural/Dramatic — trang phục có cấu trúc, đường nét rõ ràng.</p>
            <p>Seasonal Color: Mùa Đông — màu tương phản cao.</p>
          </div>
        )}
        {(lane === "both" || lane === "personality") && (
          <div className="sim-lane sim-lane-b">
            <strong>Nhánh B · Tính cách</strong>
            <p>Big Five: Openness cao, Agreeableness trung bình — cần đối tác tự chủ.</p>
            <p>Attachment: Secure — phù hợp nhất với Secure hoặc recovered Anxious.</p>
          </div>
        )}
      </div>
      {lane === "both" && (
        <div className="sim-synthesis-gate">
          <span className="sim-gate-label">Tổng hợp</span>
          <p>Đối tác lý tưởng: tự lập, giá trị sống rõ ràng, thích trải nghiệm mới, phong cách chỉn chu.</p>
          <p className="sim-output-note">Phân tích dựa trên framework học thuật — không phải dự đoán xác suất.</p>
        </div>
      )}
    </div>
  );
}

function DashboardOutput({ caseId }: { caseId: string }) {
  return (
    <div className="sim-output-dashboard">
      <div className="sim-output-label">Báo cáo insights</div>
      <div className="sim-data-preview">
        <table className="sim-data-table">
          <thead><tr><th>Tháng</th><th>Doanh thu</th><th>Đơn hàng</th><th>Tỷ lệ lỗi</th></tr></thead>
          <tbody>
            <tr><td>T6/2025</td><td>1.2 tỷ</td><td>4,200</td><td>2.1%</td></tr>
            <tr className="sim-anomaly-row"><td>T7/2025</td><td>0.8 tỷ</td><td>2,900</td><td>8.4%</td></tr>
          </tbody>
        </table>
        <div className="sim-anomaly-marker">
          <span>⚠ Bất thường T7</span>
          <p>Tỷ lệ lỗi tăng 4× so với T6. Doanh thu giảm 33%.</p>
        </div>
      </div>
      <div className="sim-qa-verdict">
        <span className="sim-qa-stamp">QA · Đã xem xét</span>
        <p>Insight đã được kiểm tra lại trước khi đưa vào báo cáo. Số liệu khớp với nguồn gốc.</p>
      </div>
      <details className="sim-technical-drawer">
        <summary>Xem chi tiết kỹ thuật</summary>
        <p className="sim-output-note">Pipeline: framework_agent → insight_writer → QA loop (max 2 vòng) → formatter. RAG so sánh với báo cáo T6 trong archive.</p>
      </details>
    </div>
  );
}

function A2AOutput({ caseId }: { caseId: string }) {
  const agents = [
    { name: "Trip Planner", port: 8001, selected: caseId === "A2A-01" },
    { name: "Script Team", port: 8002, selected: false },
    { name: "World Cup Analyst", port: 8003, selected: false },
    { name: "Love Advisor", port: 8004, selected: false },
    { name: "Dashboard Insights", port: 8005, selected: false },
  ];
  if (caseId === "A2A-03") {
    return (
      <div className="sim-output-a2a">
        <div className="sim-output-label">Fallback — yêu cầu không rõ</div>
        <div className="sim-agent-map">
          {agents.map(a => (
            <div key={a.name} className="sim-agent-card sim-agent-uncertain">
              <span className="sim-agent-port">:{a.port}</span>
              <strong>{a.name}</strong>
            </div>
          ))}
        </div>
        <div className="sim-error-card">
          <span className="sim-error-icon">?</span>
          <p>Không thể xác định agent phù hợp. Orchestrator hỏi lại thay vì chọn bừa.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="sim-output-a2a">
      <div className="sim-output-label">Routing · Agent Card</div>
      <div className="sim-agent-map">
        {agents.map(a => (
          <div key={a.name} className={`sim-agent-card${a.selected ? " sim-agent-selected" : ""}`}>
            <span className="sim-agent-port">:{a.port}</span>
            <strong>{a.name}</strong>
            {a.selected && <span className="sim-agent-badge">Đã chọn</span>}
          </div>
        ))}
      </div>
      <div className="sim-route-reason">
        <strong>Lý do routing:</strong>
        <p>Yêu cầu "lên lịch đi Đà Nẵng" → keyword "lịch" + "đi" + địa điểm → Trip Planner (port 8001).</p>
      </div>
      <div className="sim-agent-card-detail">
        <span className="sim-state-label">Agent Card · /.well-known/agent.json</span>
        <dl>
          <div><dt>name</dt><dd>trip_planner_agent</dd></div>
          <div><dt>capabilities</dt><dd>trip planning, session state, itinerary</dd></div>
          <div><dt>url</dt><dd>http://localhost:8001</dd></div>
        </dl>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// SIMULATOR DATA — embedded from handoff data/simulator/simulator-cases.vi.json
// ────────────────────────────────────────────────────────────────

function buildCases(locale: Locale): Record<string, SimCase[]> {
  const vi = locale === "vi";
  return {
    "trip-planner": [
      {
        id: "TP-01", project: "trip-planner", caseType: "happy",
        title: vi ? "Lập lịch Huế ba ngày" : "Plan a 3-day Hue trip",
        prompt: vi ? "Lên lịch Huế ba ngày, ưu tiên văn hóa và ẩm thực, ngân sách vừa phải." : "Plan a 3-day trip to Hue, cultural and food focus, moderate budget.",
        outputType: "trip",
        outputContent: null,
        steps: [
          { title: vi ? "Đọc yêu cầu" : "Read request", explanation: vi ? "Agent nhận ra điểm đến (Huế), số ngày (3), ngân sách (vừa phải) và sở thích (văn hóa, ẩm thực). Đủ thông tin để bắt đầu." : "Agent identifies destination, duration, budget and preference. Enough to proceed.", technicalKeyword: "input validation", actor: "Trip Planner", whyItMatters: vi ? "Agent không đoán — phải xác nhận đủ thông tin trước khi hành động." : "Agent doesn't guess — confirms info before acting." },
          { title: vi ? "Lưu thông tin" : "Save details", explanation: vi ? "Agent gọi công cụ save_trip_detail để ghi điểm đến, số ngày, ngân sách và sở thích vào bộ nhớ phiên. Như viết vào sổ tay." : "Agent calls save_trip_detail to store destination, days, budget, preference into session memory.", technicalKeyword: "tool call · session state", actor: "save_trip_detail", whyItMatters: vi ? "Công cụ đảm bảo dữ liệu thực sự được lưu — không chỉ là lời nói của model." : "Tool ensures data is actually saved — not just model's claim." },
          { title: vi ? "Tạo lịch trình" : "Build itinerary", explanation: vi ? "Agent đọc lại thông tin đã lưu và sắp xếp hoạt động theo từng ngày, ưu tiên địa điểm văn hóa và nhà hàng địa phương." : "Agent reads saved info and arranges activities by day, prioritizing cultural sites and local restaurants.", technicalKeyword: "planning", actor: "Trip Planner", whyItMatters: vi ? "Lịch trình dựa trên dữ liệu đã xác nhận, không phải giả định." : "Itinerary is based on confirmed data, not assumptions." },
          { title: vi ? "Trả kết quả" : "Return result", explanation: vi ? "Người dùng nhận lịch trình 3 ngày và phiếu xác nhận những gì agent đã ghi nhớ." : "User receives 3-day itinerary and a receipt confirming what the agent remembered.", technicalKeyword: "artifact", actor: "Trip Planner", whyItMatters: vi ? "Phiếu ghi nhớ giúp user kiểm tra agent thực sự lưu đúng thông tin." : "Memory receipt lets user verify agent actually stored the right info." },
        ],
      },
      {
        id: "TP-02", project: "trip-planner", caseType: "state-read",
        title: vi ? "Hỏi lại thông tin đã nhớ" : "Ask what the agent remembers",
        prompt: vi ? "Bạn đang nhớ những gì về chuyến đi của tôi?" : "What do you currently remember about my trip?",
        outputType: "trip",
        outputContent: null,
        steps: [
          { title: vi ? "Hiểu câu hỏi" : "Understand intent", explanation: vi ? "Agent nhận ra người dùng không yêu cầu lịch trình mới — họ muốn kiểm tra xem agent đang giữ thông tin gì." : "Agent recognizes user isn't requesting a new itinerary — they want to check stored data.", technicalKeyword: "intent", actor: "Trip Planner" },
          { title: vi ? "Đọc trạng thái" : "Read state", explanation: vi ? "Agent gọi công cụ get_trip_details để lấy toàn bộ thông tin đang lưu trong phiên hiện tại." : "Agent calls get_trip_details to retrieve all information stored in the current session.", technicalKeyword: "state read", actor: "get_trip_details" },
          { title: vi ? "Tóm tắt trung thực" : "Honest summary", explanation: vi ? "Agent chỉ liệt kê những trường thực sự có dữ liệu. Không bịa thêm thông tin chưa được cung cấp." : "Agent only lists fields that actually have data. Doesn't fabricate missing information.", technicalKeyword: "grounded response", actor: "Trip Planner", whyItMatters: vi ? "Agent trả lời dựa trên dữ liệu thật, không đoán mò." : "Agent responds based on real data, not guessing." },
        ],
      },
      {
        id: "TP-03", project: "trip-planner", caseType: "validation",
        title: vi ? "Thiếu thông tin — hỏi lại" : "Missing info — clarification",
        prompt: vi ? "Tôi muốn đi Huế và thích ẩm thực." : "I want to go to Hue and I like food.",
        outputType: "trip",
        outputContent: null,
        steps: [
          { title: vi ? "Kiểm tra thông tin" : "Check info", explanation: vi ? "Agent thấy có điểm đến (Huế) và sở thích (ẩm thực) nhưng thiếu số ngày và ngân sách — chưa đủ để lập lịch trình." : "Agent sees destination and preference but missing duration and budget — not enough to plan.", technicalKeyword: "validation", actor: "Trip Planner" },
          { title: vi ? "Hỏi phần còn thiếu" : "Ask for missing info", explanation: vi ? "Agent đặt câu hỏi ngắn gọn để lấy đúng phần còn thiếu. Không tự đoán hoặc lập lịch trình với thông tin không đầy đủ." : "Agent asks a short question to get exactly what's missing. Doesn't guess or plan with incomplete info.", technicalKeyword: "clarification", actor: "Trip Planner", whyItMatters: vi ? "Agent tốt không đoán mò — hỏi để đảm bảo chất lượng kết quả." : "A good agent doesn't guess — asks to ensure quality output." },
        ],
      },
    ],
    "script-team": [
      {
        id: "ST-01", project: "script-team", caseType: "happy",
        title: vi ? "Kịch bản video 60 giây" : "60-second video script",
        prompt: vi ? "Viết kịch bản video 60 giây giới thiệu portfolio AI Agent của tôi." : "Write a 60-second video script introducing my AI Agent portfolio.",
        outputType: "script",
        outputContent: null,
        steps: [
          { title: vi ? "Phân tích yêu cầu" : "Analyze request", explanation: vi ? "Coordinator xác định video cần: ngắn (60 giây), rõ vấn đề agent giải quyết, giải pháp cụ thể, và lời kêu gọi hành động." : "Coordinator identifies: short (60s), clear problem statement, specific solution, call to action.", technicalKeyword: "routing", actor: "Coordinator" },
          { title: vi ? "Viết bản nháp" : "Write draft", explanation: vi ? "Drafter viết phiên bản đầu tiên dựa trên brief. Tạo mở đầu, thân bài và CTA." : "Drafter writes first version based on brief. Creates opening, body and CTA.", technicalKeyword: "handoff · draft", actor: "Drafter" },
          { title: vi ? "Phản biện có cấu trúc" : "Structured critique", explanation: vi ? "Critic chấm theo tiêu chí: slide có quá nhiều chữ không, lời thoại có tự nhiên không, văn phong có phù hợp không. Trả kết quả dạng JSON." : "Critic scores by rubric: too wordy?, natural speech?, appropriate tone? Returns structured JSON.", technicalKeyword: "structured feedback", actor: "Critic", whyItMatters: vi ? "Feedback có cấu trúc giúp Reviser biết chính xác cần sửa gì." : "Structured feedback tells Reviser exactly what to fix." },
          { title: vi ? "Sửa theo góp ý" : "Revise per feedback", explanation: vi ? "Reviser nhận cả bản nháp gốc và góp ý của Critic, tạo bản cuối có thể so sánh với bản đầu." : "Reviser receives both original draft and Critic's feedback, creates final version comparable to the first.", technicalKeyword: "revision", actor: "Reviser" },
        ],
      },
      {
        id: "ST-02", project: "script-team", caseType: "rubric",
        title: vi ? "Phản biện mở đầu và CTA" : "Critique opening and CTA",
        prompt: vi ? "Hãy phản biện riêng phần mở đầu và CTA của kịch bản." : "Critique just the opening and CTA of the script.",
        outputType: "script",
        outputContent: null,
        steps: [
          { title: vi ? "Giới hạn phạm vi" : "Scope limit", explanation: vi ? "Coordinator giới hạn phạm vi phản biện ở đúng hai phần: mở đầu và CTA. Phần thân bài không bị động." : "Coordinator limits critique scope to exactly two parts: opening and CTA. Body section untouched.", technicalKeyword: "rubric", actor: "Coordinator" },
          { title: vi ? "Đánh giá có cấu trúc" : "Structured review", explanation: vi ? "Critic chỉ xem xét mở đầu và CTA — liệt kê điểm mạnh, điểm chưa rõ và đề xuất cụ thể." : "Critic reviews only opening and CTA — lists strengths, unclear points and specific suggestions.", technicalKeyword: "structured feedback", actor: "Critic" },
          { title: vi ? "Sửa đúng hai phần" : "Revise exactly two parts", explanation: vi ? "Reviser chỉ thay đổi mở đầu và CTA, giữ nguyên phần thân bài. Điều này xác minh agent hiểu đúng giới hạn phạm vi." : "Reviser only changes opening and CTA, keeps body intact. This verifies agent understood the scope constraint.", technicalKeyword: "bounded revision", actor: "Reviser", whyItMatters: vi ? "Xác minh agent thực sự tuân theo giới hạn được giao, không sửa lung tung." : "Verifies agent actually followed the scope constraint, didn't over-edit." },
        ],
      },
      {
        id: "ST-03", project: "script-team", caseType: "failure",
        title: vi ? "Handoff thất bại" : "Handoff failure",
        prompt: vi ? "Chạy lại quy trình khi Critic không nhận được bản nháp." : "Run the pipeline when Critic doesn't receive the draft.",
        outputType: "script",
        outputContent: null,
        steps: [
          { title: vi ? "Drafter chạy" : "Drafter runs", explanation: vi ? "Drafter tạo bản nháp và đánh dấu hoàn thành handoff." : "Drafter creates draft and marks handoff complete.", technicalKeyword: "draft", actor: "Drafter" },
          { title: vi ? "Handoff thất bại" : "Handoff fails", explanation: vi ? "Critic không nhận được bản nháp — output_key bị thiếu hoặc trống. Critic báo lỗi thay vì tiếp tục với dữ liệu trống." : "Critic doesn't receive draft — output_key missing or empty. Critic reports error instead of proceeding with empty data.", technicalKeyword: "error · missing output_key", actor: "Critic", whyItMatters: vi ? "System fail-safe quan trọng hơn tiếp tục sai." : "System fail-safe is more important than continuing incorrectly." },
          { title: vi ? "Coordinator xử lý" : "Coordinator handles", explanation: vi ? "Coordinator ghi nhận lỗi và yêu cầu Drafter chạy lại trước khi Critic tiếp tục." : "Coordinator records error and requests Drafter to re-run before Critic continues.", technicalKeyword: "error handling", actor: "Coordinator" },
        ],
      },
    ],
    "worldcup-analyst": [
      {
        id: "WC-01", project: "worldcup-analyst", caseType: "happy",
        title: vi ? "Tìm và tính hiệu số bàn thắng" : "Find and calculate goal difference",
        prompt: vi ? "Lấy tỉ số chung kết World Cup 2022 và tính hiệu số bàn thắng." : "Get the 2022 World Cup final score and calculate the goal difference.",
        outputType: "worldcup",
        outputContent: null,
        steps: [
          { title: vi ? "Nhận câu hỏi" : "Receive question", explanation: vi ? "Root agent xác định câu hỏi cần: tìm dữ kiện (tỉ số) và tính toán (hiệu số). Cần dùng cả hai công cụ." : "Root agent identifies question needs: fact-finding (score) and calculation (difference). Both tools needed.", technicalKeyword: "routing", actor: "World Cup Analyst" },
          { title: vi ? "Tìm dữ kiện" : "Find facts", explanation: vi ? "Search Agent dùng Wikipedia API tìm thông tin trận chung kết. Lấy tỉ số thực tế: Argentina 3–3 Pháp (pen. 4–2)." : "Search Agent uses Wikipedia API to find the final match info. Gets actual score: Argentina 3–3 France (pen. 4–2).", technicalKeyword: "tool call · Wikipedia API", actor: "Search Agent", whyItMatters: vi ? "Dữ kiện từ nguồn thực, không phải do model đoán." : "Facts from real source, not model guessing." },
          { title: vi ? "Tính toán chính xác" : "Precise calculation", explanation: vi ? "Stats Calculator tự viết code Python để tính hiệu số (3–3=0), tỷ lệ thắng và chạy kết quả. Không nhẩm trong đầu." : "Stats Calculator writes Python code to calculate difference (3–3=0), win rate and runs it. Doesn't do mental math.", technicalKeyword: "code executor · Python", actor: "Stats Calculator", whyItMatters: vi ? "Code chạy thật đảm bảo tính toán chính xác 100% — không phải ước lượng." : "Real code execution ensures 100% accurate calculation — not estimation." },
          { title: vi ? "Tổng hợp báo cáo" : "Synthesize report", explanation: vi ? "Root agent kết hợp dữ kiện và kết quả tính toán thành báo cáo phân tích có nguồn rõ ràng." : "Root agent combines facts and calculation results into an analysis report with clear sources.", technicalKeyword: "synthesis", actor: "World Cup Analyst" },
        ],
      },
      {
        id: "WC-02", project: "worldcup-analyst", caseType: "happy",
        title: vi ? "Phân tích phong độ đội tuyển" : "Analyze team form",
        prompt: vi ? "Phân tích phong độ của Argentina ở World Cup 2022." : "Analyze Argentina's form at the 2022 World Cup.",
        outputType: "worldcup",
        outputContent: null,
        steps: [
          { title: vi ? "Xác định phạm vi" : "Define scope", explanation: vi ? "Analyst xác định cần tìm thành tích từng trận và tính toán chỉ số phong độ." : "Analyst identifies need: per-match results and form metrics calculation.", technicalKeyword: "scope", actor: "World Cup Analyst" },
          { title: vi ? "Thu thập dữ kiện" : "Gather facts", explanation: vi ? "Search Agent tìm kiếm kết quả từng trận Argentina ở World Cup 2022 qua Wikipedia." : "Search Agent finds Argentina's match-by-match results at 2022 World Cup via Wikipedia.", technicalKeyword: "search", actor: "Search Agent" },
          { title: vi ? "Tính chỉ số" : "Calculate metrics", explanation: vi ? "Calculator tính: số trận thắng/thua/hòa, hiệu số, tỷ lệ giữ sạch lưới, v.v." : "Calculator computes: wins/losses/draws, goal difference, clean sheet rate, etc.", technicalKeyword: "metrics calculation", actor: "Stats Calculator" },
          { title: vi ? "Báo cáo phong độ" : "Form report", explanation: vi ? "Analyst tổng hợp thành báo cáo phong độ với số liệu cụ thể và nhận định." : "Analyst synthesizes into form report with specific metrics and assessment.", technicalKeyword: "report", actor: "World Cup Analyst" },
        ],
      },
      {
        id: "WC-03", project: "worldcup-analyst", caseType: "validation",
        title: vi ? "Trận đang diễn ra" : "Live match",
        prompt: vi ? "Tỉ số hiện tại của trận Pháp đang đá là bao nhiêu?" : "What's the current score of France's ongoing match?",
        outputType: "worldcup",
        outputContent: null,
        steps: [
          { title: vi ? "Tìm kiếm thông tin" : "Search", explanation: vi ? "Search Agent tìm trên Wikipedia — nhưng Wikipedia không cập nhật tỉ số trực tiếp theo thời gian thực." : "Search Agent searches Wikipedia — but Wikipedia doesn't update live scores in real time.", technicalKeyword: "search · data limitation", actor: "Search Agent" },
          { title: vi ? "Cảnh báo rõ ràng" : "Clear warning", explanation: vi ? "Analyst thông báo rõ: dữ liệu search có độ trễ, không thể cung cấp tỉ số trực tiếp. Đề xuất nguồn live thay thế." : "Analyst clearly states: search data has lag, cannot provide live score. Suggests live sources instead.", technicalKeyword: "honesty · limitation", actor: "World Cup Analyst", whyItMatters: vi ? "Agent trung thực về giới hạn quan trọng hơn cố trả lời sai." : "Agent honesty about limitations is more important than giving a wrong answer." },
        ],
      },
    ],
    "love-advisor": [
      {
        id: "LA-01", project: "love-advisor", caseType: "happy",
        title: vi ? "Phân tích gu người yêu" : "Analyze partner preferences",
        prompt: vi ? "Tôi thích người tự lập, thẳng thắn, phong cách chỉn chu và thích khám phá." : "I like someone independent, direct, well-dressed and adventurous.",
        outputType: "love",
        outputContent: null,
        steps: [
          { title: vi ? "Nhận mô tả" : "Receive description", explanation: vi ? "Agent tiếp nhận mô tả sở thích về cả ngoại hình (phong cách chỉn chu) và tính cách (tự lập, thẳng thắn, thích khám phá)." : "Agent receives preference description covering both appearance (well-dressed) and personality (independent, direct, adventurous).", technicalKeyword: "input parsing", actor: "Love Advisor Pipeline" },
          { title: vi ? "Phân tích song song" : "Parallel analysis", explanation: vi ? "Hai nhánh chạy đồng thời: Nhánh A phân tích gu ngoại hình theo Kibbe và Seasonal Color. Nhánh B phân tích gu tính cách theo Big Five và Attachment Theory." : "Two branches run simultaneously: Branch A analyzes appearance preferences via Kibbe & Seasonal Color. Branch B analyzes personality preferences via Big Five & Attachment Theory.", technicalKeyword: "parallel agents", actor: "Appearance Agent + Personality Agent", whyItMatters: vi ? "Chạy song song tiết kiệm thời gian vì hai phân tích hoàn toàn độc lập nhau." : "Parallel execution saves time since the two analyses are completely independent." },
          { title: vi ? "Tổng hợp kết quả" : "Synthesize", explanation: vi ? "Synthesis Agent đọc cả hai kết quả và tạo bản tư vấn tổng hợp, kết nối gu ngoại hình và tính cách lại với nhau." : "Synthesis Agent reads both results and creates a combined recommendation connecting appearance and personality preferences.", technicalKeyword: "synthesis", actor: "Synthesis Agent" },
          { title: vi ? "Trả báo cáo" : "Return report", explanation: vi ? "Người dùng nhận bản phân tích cá nhân hóa dựa trên framework học thuật — không phải lời khuyên cảm tính." : "User receives personalized analysis based on academic frameworks — not subjective advice.", technicalKeyword: "PartnerPlan", actor: "Love Advisor Pipeline" },
        ],
      },
      {
        id: "LA-02", project: "love-advisor", caseType: "happy",
        title: vi ? "Chỉ phân tích tính cách" : "Personality-only analysis",
        prompt: vi ? "Tôi muốn biết kiểu gắn bó và ngôn ngữ tình yêu phù hợp nhất với tôi. Tôi hay lo lắng quá mức trong mối quan hệ." : "I want to know the best attachment style and love language match for me. I tend to over-worry in relationships.",
        outputType: "love",
        outputContent: null,
        steps: [
          { title: vi ? "Phân tích đầu vào" : "Analyze input", explanation: vi ? "Agent nhận ra từ 'lo lắng quá mức' — dấu hiệu của Anxious Attachment. Tập trung vào phân tích tính cách." : "Agent recognizes 'over-worry' — indicator of Anxious Attachment. Focuses on personality analysis.", technicalKeyword: "intent · attachment cue", actor: "Love Advisor Pipeline" },
          { title: vi ? "Nghiên cứu gắn bó" : "Attachment research", explanation: vi ? "Personality Agent tìm tài liệu về Anxious Attachment và các kiểu gắn bó tương thích theo Attachment Theory." : "Personality Agent researches Anxious Attachment and compatible attachment styles per Attachment Theory.", technicalKeyword: "attachment theory", actor: "Personality Agent" },
          { title: vi ? "Tổng hợp tư vấn" : "Synthesize advice", explanation: vi ? "Synthesis Agent đưa ra: kiểu gắn bó phù hợp nhất (Secure), ngôn ngữ tình yêu ưu tiên (Words of Affirmation, Quality Time) và các dấu hiệu cần tránh." : "Synthesis Agent outputs: best attachment style match (Secure), priority love languages (Words of Affirmation, Quality Time) and red flags to avoid.", technicalKeyword: "synthesis · Love Languages", actor: "Synthesis Agent" },
        ],
      },
      {
        id: "LA-03", project: "love-advisor", caseType: "validation",
        title: vi ? "Mô tả mâu thuẫn" : "Contradictory description",
        prompt: vi ? "Tôi muốn người vừa hướng nội hoàn toàn vừa rất thích tụ tập đông người." : "I want someone who is completely introverted but also loves large gatherings.",
        outputType: "love",
        outputContent: null,
        steps: [
          { title: vi ? "Phát hiện mâu thuẫn" : "Detect contradiction", explanation: vi ? "Agent nhận ra 'hướng nội hoàn toàn' và 'thích tụ tập đông người' là hai đặc điểm mâu thuẫn nhau theo định nghĩa Big Five." : "Agent recognizes 'completely introverted' and 'loves large gatherings' are contradictory per Big Five definition.", technicalKeyword: "contradiction · Big Five", actor: "Personality Agent" },
          { title: vi ? "Phản hồi trung thực" : "Honest response", explanation: vi ? "Agent không cố tư vấn bất khả thi. Giải thích mâu thuẫn và đề xuất cách diễn đạt lại sở thích." : "Agent doesn't try to advise on the impossible. Explains the contradiction and suggests ways to re-frame preferences.", technicalKeyword: "honesty · reframing", actor: "Synthesis Agent", whyItMatters: vi ? "Tư vấn tốt không cố tư vấn những điều không thực tế." : "Good advice doesn't try to advise on unrealistic scenarios." },
        ],
      },
    ],
    "dashboard-insights": [
      {
        id: "DI-01", project: "dashboard-insights", caseType: "happy",
        title: vi ? "Phân tích file CSV tháng 7" : "Analyze July CSV file",
        prompt: vi ? "Đọc file data/testcase.csv và phân tích chỉ số tháng 7/2025." : "Read data/testcase.csv and analyze July 2025 metrics.",
        outputType: "dashboard",
        outputContent: null,
        steps: [
          { title: vi ? "MCP đọc file" : "MCP reads file", explanation: vi ? "Trước khi gọi model, callback tự động kết nối MCP filesystem server để đọc file CSV. Người dùng không cần upload thủ công." : "Before calling model, callback automatically connects MCP filesystem server to read the CSV. User doesn't need to manually upload.", technicalKeyword: "before_model_callback · MCP", actor: "Callback", whyItMatters: vi ? "MCP giúp agent kết nối trực tiếp với hệ thống file — không cần trung gian thủ công." : "MCP lets agent connect directly to file systems — no manual intermediary needed." },
          { title: vi ? "Phân tích khung" : "Framework analysis", explanation: vi ? "Framework Agent phân tích cấu trúc dữ liệu, xác định các cột chỉ số, chuỗi thời gian và bất thường trong CSV." : "Framework Agent analyzes data structure, identifies metric columns, time series and anomalies in the CSV.", technicalKeyword: "data analysis", actor: "Framework Agent" },
          { title: vi ? "Viết insights" : "Write insights", explanation: vi ? "Insight Writer tạo bản nháp báo cáo với nhận định từ dữ liệu. So sánh với báo cáo tháng 6 từ archive (RAG)." : "Insight Writer drafts report with data-driven observations. Compares with June report from archive (RAG).", technicalKeyword: "RAG · insight writing", actor: "Insight Writer" },
          { title: vi ? "QA loop" : "QA loop", explanation: vi ? "QA Agent kiểm tra từng claim trong báo cáo. Nếu có claim không có nguồn trong data, Loop Agent yêu cầu Reviser sửa. Tối đa 2 vòng." : "QA Agent checks each claim in report. If a claim has no data source, Loop Agent requests Reviser to fix. Max 2 rounds.", technicalKeyword: "LoopAgent · QA", actor: "QA Loop", whyItMatters: vi ? "Kết luận được kiểm tra trước khi dùng — giảm rủi ro báo cáo sai sự thật." : "Conclusions verified before use — reduces risk of reporting false information." },
          { title: vi ? "Định dạng báo cáo" : "Format report", explanation: vi ? "Formatter tạo báo cáo Markdown cuối cùng với các section rõ ràng, bảng dữ liệu và phần so sánh lịch sử." : "Formatter creates final Markdown report with clear sections, data tables and historical comparison.", technicalKeyword: "report formatting", actor: "Formatter" },
        ],
      },
      {
        id: "DI-02", project: "dashboard-insights", caseType: "validation",
        title: vi ? "Claim không có nguồn" : "Unsupported claim",
        prompt: vi ? "Phân tích và đảm bảo mọi kết luận đều có nguồn từ dữ liệu thực." : "Analyze and ensure all conclusions are supported by actual data.",
        outputType: "dashboard",
        outputContent: null,
        steps: [
          { title: vi ? "Viết insights ban đầu" : "Initial insights", explanation: vi ? "Insight Writer tạo báo cáo bao gồm một nhận định về xu hướng chưa có trong CSV (dữ liệu không đủ để xác nhận)." : "Insight Writer creates report including an observation about a trend not in the CSV (insufficient data to confirm).", technicalKeyword: "insight writing", actor: "Insight Writer" },
          { title: vi ? "QA phát hiện lỗi" : "QA detects error", explanation: vi ? "QA Agent so sánh claim 'xu hướng tăng trong 6 tháng' với dữ liệu CSV — chỉ có dữ liệu 2 tháng. Đánh dấu claim không có nguồn." : "QA Agent compares 'upward trend over 6 months' claim with CSV data — only 2 months available. Flags unsupported claim.", technicalKeyword: "claim verification · QA fail", actor: "QA Agent", whyItMatters: vi ? "QA ngăn không cho báo cáo chứa kết luận không có dữ liệu hỗ trợ." : "QA prevents report from containing conclusions without data support." },
          { title: vi ? "Sửa claim" : "Fix claim", explanation: vi ? "Reviser xóa claim về xu hướng 6 tháng, thay bằng: 'Dữ liệu hiện tại chỉ bao gồm 2 tháng — cần thêm dữ liệu để xác nhận xu hướng dài hạn.'" : "Reviser removes 6-month trend claim, replaces with: 'Current data covers only 2 months — more data needed to confirm long-term trends.'", technicalKeyword: "revision · grounded report", actor: "Reviser" },
        ],
      },
      {
        id: "DI-03", project: "dashboard-insights", caseType: "happy",
        title: vi ? "So sánh với lịch sử" : "Historical comparison",
        prompt: vi ? "Phân tích doanh thu tháng 7 và so sánh với cùng kỳ tháng 6." : "Analyze July revenue and compare with June.",
        outputType: "dashboard",
        outputContent: null,
        steps: [
          { title: vi ? "Đọc dữ liệu hiện tại" : "Read current data", explanation: vi ? "Framework Agent đọc số liệu tháng 7 từ file CSV." : "Framework Agent reads July data from CSV.", technicalKeyword: "data ingestion", actor: "Framework Agent" },
          { title: vi ? "RAG tìm lịch sử" : "RAG retrieves history", explanation: vi ? "RAG system tự động tìm báo cáo tháng 6 trong archive/. Không cần người dùng cung cấp file cũ." : "RAG system automatically finds June report in archive/. User doesn't need to provide old files.", technicalKeyword: "RAG · ChromaDB", actor: "Insight Writer", whyItMatters: vi ? "RAG cho phép so sánh lịch sử mà không cần người dùng tự tìm và cung cấp dữ liệu cũ." : "RAG enables historical comparison without requiring user to manually provide old data." },
          { title: vi ? "Phân tích so sánh" : "Comparative analysis", explanation: vi ? "Insight Writer tạo báo cáo so sánh: doanh thu T7 giảm 33% so với T6, tỷ lệ lỗi tăng 4×." : "Insight Writer creates comparison report: July revenue down 33% vs June, error rate up 4×.", technicalKeyword: "trend analysis", actor: "Insight Writer" },
          { title: vi ? "QA và định dạng" : "QA and format", explanation: vi ? "QA kiểm tra claim so sánh có nguồn từ cả hai tháng. Formatter tạo báo cáo với bảng so sánh." : "QA verifies comparison claims sourced from both months. Formatter creates report with comparison table.", technicalKeyword: "QA · report", actor: "QA Loop → Formatter" },
        ],
      },
    ],
    "a2a-orchestrator": [
      {
        id: "A2A-01", project: "a2a-orchestrator", caseType: "happy",
        title: vi ? "Routing đến Trip Planner" : "Route to Trip Planner",
        prompt: vi ? "Lên lịch đi Đà Nẵng 2 ngày cuối tuần này." : "Plan a 2-day Da Nang trip for this weekend.",
        outputType: "a2a",
        outputContent: null,
        steps: [
          { title: vi ? "Nhận yêu cầu" : "Receive request", explanation: vi ? "Orchestrator nhận yêu cầu và xác định đây là về lập kế hoạch du lịch — cần chuyển đến agent chuyên về trip planning." : "Orchestrator receives request and identifies this is about travel planning — needs to route to the trip planning specialist.", technicalKeyword: "intent classification", actor: "Master Orchestrator" },
          { title: vi ? "Đọc Agent Cards" : "Read Agent Cards", explanation: vi ? "Orchestrator đọc Agent Card của tất cả 5 agent từ endpoint /.well-known/agent.json. Mỗi card liệt kê khả năng của agent đó." : "Orchestrator reads Agent Cards of all 5 agents from their /.well-known/agent.json endpoints. Each card lists that agent's capabilities.", technicalKeyword: "Agent Card · A2A discovery", actor: "Master Orchestrator", whyItMatters: vi ? "Agent tự khai báo khả năng của mình — Orchestrator không cần biết trước cứng về từng agent." : "Agents declare their own capabilities — Orchestrator doesn't need hard-coded knowledge of each agent." },
          { title: vi ? "Quyết định routing" : "Routing decision", explanation: vi ? "So sánh yêu cầu với capabilities trong Agent Cards → Trip Planner (port 8001) có khả năng 'trip planning' và 'session state' phù hợp nhất." : "Compares request with Agent Card capabilities → Trip Planner (port 8001) has 'trip planning' and 'session state' capabilities — best match.", technicalKeyword: "capability matching", actor: "Master Orchestrator" },
          { title: vi ? "Gửi và nhận kết quả" : "Send and receive", explanation: vi ? "Orchestrator gửi HTTP POST đến Trip Planner. Agent xử lý độc lập và trả kết quả về. Orchestrator hiển thị kết quả cho user." : "Orchestrator sends HTTP POST to Trip Planner. Agent processes independently and returns result. Orchestrator displays result to user.", technicalKeyword: "HTTP · A2A protocol", actor: "Trip Planner (remote)" },
        ],
      },
      {
        id: "A2A-02", project: "a2a-orchestrator", caseType: "happy",
        title: vi ? "Routing đến Script Team" : "Route to Script Team",
        prompt: vi ? "Viết kịch bản cho video YouTube về AI agents." : "Write a script for a YouTube video about AI agents.",
        outputType: "a2a",
        outputContent: null,
        steps: [
          { title: vi ? "Phân tích yêu cầu" : "Analyze request", explanation: vi ? "Orchestrator xác định yêu cầu liên quan đến viết kịch bản — cần chuyển đến Script Team." : "Orchestrator identifies request is about script writing — needs Script Team.", technicalKeyword: "intent classification", actor: "Master Orchestrator" },
          { title: vi ? "So khớp Agent Card" : "Match Agent Card", explanation: vi ? "Script Team Agent Card liệt kê 'script writing', 'review', 'revision' — khớp với yêu cầu." : "Script Team Agent Card lists 'script writing', 'review', 'revision' — matches request.", technicalKeyword: "capability matching · Agent Card", actor: "Master Orchestrator" },
          { title: vi ? "Chuyển yêu cầu" : "Forward request", explanation: vi ? "Orchestrator gửi HTTP POST đến Script Team (port 8002). Agent xử lý quy trình Drafter → Critic → Reviser và trả kết quả." : "Orchestrator sends HTTP POST to Script Team (port 8002). Agent runs Drafter → Critic → Reviser pipeline and returns result.", technicalKeyword: "A2A protocol", actor: "Script Team (remote)" },
        ],
      },
      {
        id: "A2A-03", project: "a2a-orchestrator", caseType: "fallback",
        title: vi ? "Yêu cầu không rõ ràng" : "Ambiguous request",
        prompt: vi ? "Giúp tôi với." : "Help me please.",
        outputType: "a2a",
        outputContent: null,
        steps: [
          { title: vi ? "Nhận yêu cầu mơ hồ" : "Receive ambiguous request", explanation: vi ? "Orchestrator nhận 'Giúp tôi với' — không đủ thông tin để xác định agent phù hợp từ 5 lựa chọn." : "Orchestrator receives 'Help me please' — insufficient information to identify which of the 5 agents fits.", technicalKeyword: "ambiguity detection", actor: "Master Orchestrator" },
          { title: vi ? "Không routing bừa" : "Don't guess", explanation: vi ? "Orchestrator không chọn agent ngẫu nhiên. Yêu cầu quá mơ hồ để đảm bảo kết quả chất lượng từ bất kỳ agent nào." : "Orchestrator doesn't randomly select an agent. Request too ambiguous to ensure quality result from any agent.", technicalKeyword: "safety · no guess routing", actor: "Master Orchestrator", whyItMatters: vi ? "Chọn sai agent gây ra kết quả vô dụng. Tốt hơn là hỏi lại." : "Wrong agent selection produces useless results. Better to ask for clarification." },
          { title: vi ? "Hỏi lại user" : "Ask for clarification", explanation: vi ? "Orchestrator hỏi user muốn làm gì cụ thể: lập lịch đi, viết nội dung, phân tích số liệu, tư vấn tình cảm hay phân tích dashboard?" : "Orchestrator asks user what specifically they want: travel planning, content writing, data analysis, relationship advice or dashboard analysis?", technicalKeyword: "clarification", actor: "Master Orchestrator" },
        ],
      },
    ],
  };
}

// ────────────────────────────────────────────────────────────────
// OUTPUT DISPATCHER
// ────────────────────────────────────────────────────────────────
function OutputPanel({ caseData }: { caseData: SimCase }) {
  switch (caseData.outputType) {
    case "trip": return <TripOutput caseId={caseData.id} />;
    case "script": return <ScriptOutput caseId={caseData.id} />;
    case "worldcup": return <WorldCupOutput caseId={caseData.id} />;
    case "love": return <LoveOutput caseId={caseData.id} />;
    case "dashboard": return <DashboardOutput caseId={caseData.id} />;
    case "a2a": return <A2AOutput caseId={caseData.id} />;
    default: return <p className="sim-output-empty">Không có output mẫu cho case này.</p>;
  }
}

// ────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────────
export function AgentInteractionSimulator({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const vi = locale === "vi";
  const allCases = buildCases(locale);
  const cases = allCases[slug] ?? [];

  const [caseIndex, setCaseIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(-1); // -1 = not started
  const [playing, setPlaying] = useState(false);
  const [sent, setSent] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeCase = cases[caseIndex];
  if (!activeCase) return null;

  const displayPrompt = customPrompt.trim() || activeCase.prompt;
  const isStarted = stepIndex >= 0;
  const isFinished = stepIndex >= activeCase.steps.length - 1;
  const currentStep = stepIndex >= 0 ? activeCase.steps[stepIndex] : null;

  function handleSend() {
    setSent(true);
    setStepIndex(0);
    setPlaying(false);
  }

  function handleReset() {
    setSent(false);
    setStepIndex(-1);
    setPlaying(false);
    setCustomPrompt("");
    if (intervalRef.current) clearTimeout(intervalRef.current);
  }

  function handleCaseChange(newIndex: number) {
    setCaseIndex(newIndex);
    handleReset();
  }

  function handlePlay() {
    if (!sent) handleSend();
    setPlaying(true);
  }

  function handlePause() {
    setPlaying(false);
    if (intervalRef.current) clearTimeout(intervalRef.current);
  }

  // Auto-advance on playing
  useEffect(() => {
    if (!playing) return;
    if (isFinished) { setPlaying(false); return; }
    const timeout = setTimeout(() => {
      setStepIndex(prev => Math.min(prev + 1, activeCase.steps.length - 1));
    }, 900);
    intervalRef.current = timeout;
    return () => clearTimeout(timeout);
  }, [playing, stepIndex, activeCase, isFinished]);

  return (
    <section className="sim-shell" aria-label={vi ? "Simulator tương tác agent" : "Agent interaction simulator"} id={`${slug}-simulator`}>
      <div className="sim-notice" role="note">
        {vi
          ? "Mô phỏng từ kiến trúc repository — không phải request đang chạy trực tiếp."
          : "Simulated from repository architecture — not a live request."}
      </div>

      <div className="sim-case-bar">
        <span className="sim-case-label mono">{vi ? "Kịch bản" : "Scenario"}</span>
        <div className="sim-case-pills" role="tablist" aria-label={vi ? "Chọn kịch bản" : "Select scenario"}>
          {cases.map((c, i) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={caseIndex === i}
              className={`sim-case-pill${caseIndex === i ? " is-active" : ""}${c.caseType === "failure" || c.caseType === "fallback" ? " sim-case-failure" : c.caseType === "validation" ? " sim-case-warning" : ""}`}
              onClick={() => handleCaseChange(i)}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      <div className="sim-three-col">
        {/* COL 1: INPUT */}
        <div className="sim-col sim-col-input">
          <div className="sim-col-header">
            <span className="sim-col-label mono">{vi ? "Đầu vào" : "Input"}</span>
          </div>
          <div className="sim-prompt-area">
            <div className={`sim-chat-bubble${sent ? " sim-chat-sent" : ""}`}>
              <textarea
                className="sim-prompt-input"
                value={customPrompt || activeCase.prompt}
                onChange={(e) => !sent && setCustomPrompt(e.target.value)}
                readOnly={sent}
                rows={3}
                aria-label={vi ? "Nhập prompt" : "Enter prompt"}
                placeholder={vi ? "Hoặc nhập câu hỏi của bạn..." : "Or type your own prompt..."}
              />
            </div>
            <div className="sim-prompt-actions">
              {!sent ? (
                <button className="sim-send-btn" onClick={handleSend}>
                  {vi ? "Gửi →" : "Send →"}
                </button>
              ) : (
                <button className="sim-reset-btn" onClick={handleReset}>
                  {vi ? "Thử lại" : "Reset"}
                </button>
              )}
            </div>
            <div className="sim-controls" role="group" aria-label={vi ? "Điều khiển" : "Controls"}>
              <button onClick={() => setStepIndex(prev => Math.max(0, prev - 1))} disabled={stepIndex <= 0} aria-label={vi ? "Bước trước" : "Previous step"}>‹</button>
              {playing
                ? <button onClick={handlePause} aria-label={vi ? "Tạm dừng" : "Pause"}>⏸</button>
                : <button onClick={handlePlay} aria-label={vi ? "Phát" : "Play"}>▶</button>
              }
              <button onClick={() => { if (!sent) handleSend(); setStepIndex(prev => Math.min(activeCase.steps.length - 1, prev + 1)); }} disabled={isFinished} aria-label={vi ? "Bước sau" : "Next step"}>›</button>
              <button onClick={handleReset} aria-label={vi ? "Chạy lại" : "Restart"}>↺</button>
            </div>
            {sent && (
              <div className="sim-step-counter mono" aria-live="polite">
                {vi ? "Bước" : "Step"} {Math.max(1, stepIndex + 1)} / {activeCase.steps.length}
              </div>
            )}
          </div>
        </div>

        {/* COL 2: PROCESS */}
        <div className="sim-col sim-col-process">
          <div className="sim-col-header">
            <span className="sim-col-label mono">{vi ? "Quy trình" : "Process"}</span>
          </div>
          <ol className="sim-step-list" aria-label={vi ? "Các bước xử lý" : "Processing steps"}>
            {activeCase.steps.map((step, i) => {
              const state = !sent ? "pending" : i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
              return (
                <li key={i} className={`sim-step sim-step-${state}`} aria-current={state === "active" ? "step" : undefined}>
                  <button
                    type="button"
                    className="sim-step-btn"
                    onClick={() => { if (!sent) handleSend(); setStepIndex(i); setPlaying(false); }}
                    aria-label={`${vi ? "Bước" : "Step"} ${i + 1}: ${step.title}`}
                  >
                    <span className="sim-step-num mono">{String(i + 1).padStart(2, "0")}</span>
                    <div className="sim-step-body">
                      <strong className="sim-step-title">{step.title}</strong>
                      <span className="sim-step-actor mono">{step.actor}</span>
                      {state === "active" && (
                        <div className="sim-step-detail" aria-live="polite">
                          <p className="sim-step-explanation">{step.explanation}</p>
                          {step.whyItMatters && <p className="sim-step-why"><em>{vi ? "Tại sao điều này quan trọng:" : "Why this matters:"} {step.whyItMatters}</em></p>}
                          {step.technicalKeyword && (
                            <span className="sim-step-keyword mono">{step.technicalKeyword}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="sim-step-indicator" aria-hidden="true">
                      {state === "done" ? "✓" : state === "active" ? "●" : "○"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {!sent && (
            <p className="sim-process-hint">{vi ? "Nhấn Gửi hoặc ▶ để bắt đầu." : "Press Send or ▶ to begin."}</p>
          )}
        </div>

        {/* COL 3: OUTPUT */}
        <div className="sim-col sim-col-output">
          <div className="sim-col-header">
            <span className="sim-col-label mono">{vi ? "Kết quả" : "Output"}</span>
          </div>
          <div className="sim-output-area" aria-live="polite">
            {!sent ? (
              <div className="sim-output-placeholder">
                <span>{vi ? "Kết quả sẽ xuất hiện sau khi agent hoàn tất." : "Output appears after agent completes."}</span>
              </div>
            ) : !isFinished ? (
              <div className="sim-output-in-progress">
                <div className="sim-spinner" aria-hidden="true" />
                <span>{vi ? "Đang xử lý..." : "Processing..."}</span>
              </div>
            ) : (
              <OutputPanel caseData={activeCase} />
            )}
          </div>
        </div>
      </div>

      {/* Static fallback for no-JS */}
      <noscript>
        <div className="sim-noscript">
          <h4>{activeCase.title}</h4>
          <p><strong>{vi ? "Prompt:" : "Prompt:"}</strong> {activeCase.prompt}</p>
          <ol>
            {activeCase.steps.map((step, i) => (
              <li key={i}><strong>{step.title}</strong> ({step.actor}) — {step.explanation}</li>
            ))}
          </ol>
        </div>
      </noscript>
    </section>
  );
}
