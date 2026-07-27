"use client";

import { useMemo, useState } from "react";

import {
  detectRevenueDrops,
  goalsPerMatch,
  parseTripState,
  routeWithVisibleRules,
  shotConversion,
  syntheticSalesRows,
  tripStorageKey,
  type TripDemoState
} from "@/lib/labs";
import { getDictionary, type Locale } from "@/lib/i18n";

export function ProjectLab({ slug, locale, featured = false }: { slug: string; locale: Locale; featured?: boolean }) {
  const dict = getDictionary(locale);
  return (
    <section className={`project-lab lab-${slug} ${featured ? "is-featured" : ""}`} aria-label={`${slug} lab`}>
      <p className="lab-notice" role="note"><span aria-hidden="true">◇</span>{dict.common.localSimulation}</p>
      {slug === "trip-planner" ? <TripLab locale={locale} /> : null}
      {slug === "script-team" ? <ScriptLab locale={locale} /> : null}
      {slug === "worldcup-analyst" ? <WorldCupLab locale={locale} /> : null}
      {slug === "love-advisor" ? <LoveLab locale={locale} /> : null}
      {slug === "dashboard-insights" ? <DashboardLab locale={locale} /> : null}
      {slug === "a2a-orchestrator" ? <A2ALab locale={locale} /> : null}
      <details className="lab-static-fallback">
        <summary>{dict.lab.staticFallback}</summary>
        <p>{dict.common.simulation}</p>
      </details>
      <noscript><p>{dict.lab.staticFallback}</p></noscript>
    </section>
  );
}

function LabHead({ code, title, copy }: { code: string; title: string; copy: string }) {
  return <header className="lab-head"><span className="mono">{code}</span><h2>{title}</h2><p>{copy}</p></header>;
}

function TripLab({ locale }: { locale: Locale }) {
  const isVi = locale === "vi";
  const [destination, setDestination] = useState("Hue");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(isVi ? "Cân bằng" : "Balanced");
  const [preferences, setPreferences] = useState<string[]>([isVi ? "Văn hóa" : "Culture"]);
  const [state, setState] = useState<TripDemoState | null>(null);
  const [message, setMessage] = useState(isVi ? "Chưa có state trong phiên." : "No session state yet.");
  const [error, setError] = useState("");
  const preferenceOptions = isVi ? ["Ẩm thực", "Văn hóa", "Đi bộ", "Cảnh quan"] : ["Food", "Culture", "Walking", "Scenery"];

  function save() {
    try {
      const next = { destination, days, budgetTier: budget, preferences, savedAt: new Date().toISOString() };
      window.sessionStorage.setItem(tripStorageKey, JSON.stringify(next));
      setState(next);
      setError("");
      setMessage(isVi ? "Đã lưu state vào sessionStorage của tab này." : "State saved to this tab’s sessionStorage.");
    } catch {
      setError(isVi ? "Session storage không khả dụng. State chưa được lưu." : "Session storage is unavailable. State was not saved.");
    }
  }

  function retrieve() {
    try {
      const next = parseTripState(window.sessionStorage.getItem(tripStorageKey));
      setState(next);
      setError("");
      setMessage(next ? (isVi ? "Đã truy xuất state." : "State retrieved.") : (isVi ? "Không tìm thấy state." : "State not found."));
    } catch {
      setError(isVi ? "Không thể đọc session storage." : "Session storage could not be read.");
    }
  }

  function clear() {
    try { window.sessionStorage.removeItem(tripStorageKey); } catch { /* bounded local failure */ }
    setState(null);
    setError("");
    setMessage(isVi ? "State đã được xóa. Không tìm thấy lịch trình." : "State cleared. No itinerary found.");
  }

  return (
    <>
      <LabHead code="ACT · TRIP STATE LAB" title={isVi ? "Điều khiển trạng thái phiên" : "Control session state"} copy={isVi ? "Thay đổi preset, lưu, truy xuất và xóa state ngay trong trình duyệt." : "Change a preset, then save, retrieve and clear browser session state."} />
      <div className="lab-grid trip-lab-grid">
        <form className="lab-controls" onSubmit={(event) => { event.preventDefault(); save(); }}>
          <label><span>{isVi ? "Điểm đến" : "Destination"}</span><select name="trip-destination" value={destination} onChange={(event) => setDestination(event.target.value)}><option>Hue</option><option>Da Nang</option><option>Hanoi</option></select></label>
          <label><span>{isVi ? "Số ngày" : "Days"}</span><input name="trip-days" type="number" min={1} max={14} value={days} onChange={(event) => setDays(Math.max(1, Number(event.target.value)))} /></label>
          <label><span>{isVi ? "Ngân sách" : "Budget tier"}</span><select name="trip-budget" value={budget} onChange={(event) => setBudget(event.target.value)}>{(isVi ? ["Tiết kiệm", "Cân bằng", "Thoải mái"] : ["Budget", "Balanced", "Comfort"]).map((item) => <option key={item}>{item}</option>)}</select></label>
          <fieldset><legend>{isVi ? "Sở thích" : "Preferences"}</legend>{preferenceOptions.map((item) => <label className="check-row" key={item}><input type="checkbox" name="trip-preference" checked={preferences.includes(item)} onChange={() => setPreferences((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} /><span>{item}</span></label>)}</fieldset>
          <div className="lab-actions"><button type="submit">{isVi ? "Lưu state" : "Save state"}</button><button type="button" onClick={retrieve}>{isVi ? "Truy xuất" : "Retrieve"}</button><button type="button" onClick={clear}>{isVi ? "Xóa" : "Clear"}</button></div>
        </form>
        <article className="lab-artifact state-artifact">
          <span className="mono">SESSION STATE · {state ? "FOUND" : "EMPTY"}</span>
          {error ? <p className="lab-error" role="alert">{error}</p> : <p role="status">{message}</p>}
          {state ? <dl><div><dt>destination</dt><dd>{state.destination}</dd></div><div><dt>days</dt><dd>{state.days}</dd></div><div><dt>budgetTier</dt><dd>{state.budgetTier}</dd></div><div><dt>preferences</dt><dd>{state.preferences.join(", ") || "[]"}</dd></div><div><dt>persistence</dt><dd>session only</dd></div></dl> : <p>{isVi ? "Lưu một preset để tạo artifact." : "Save a preset to create an artifact."}</p>}
        </article>
      </div>
    </>
  );
}

const scriptBriefs = {
  product: {
    en: ["AI tools often hide their workflow.", "Show the architecture, then invite the viewer to inspect evidence.", "AI tools should expose their workflow."],
    vi: ["Công cụ AI thường che luồng xử lý.", "Hãy cho thấy kiến trúc rồi mời người xem kiểm tra bằng chứng.", "Công cụ AI nên làm rõ luồng xử lý."]
  },
  education: {
    en: ["A chatbot talks. An agent acts.", "Explain the runtime and one real tool boundary.", "A chatbot answers; an agent can act through a runtime."],
    vi: ["Chatbot nói. Agent hành động.", "Giải thích runtime và một ranh giới tool.", "Chatbot trả lời; agent có thể hành động qua runtime."]
  },
  portfolio: {
    en: ["Six projects form one learning path.", "Name the missing layer at every step.", "Six systems document one architecture progression."],
    vi: ["Sáu project tạo thành một lộ trình.", "Gọi tên lớp kỹ thuật còn thiếu ở mỗi bước.", "Sáu hệ thống ghi lại một tiến trình kiến trúc."]
  }
};

function ScriptLab({ locale }: { locale: Locale }) {
  const isVi = locale === "vi";
  const [brief, setBrief] = useState<keyof typeof scriptBriefs>("product");
  const [role, setRole] = useState<0 | 1 | 2>(0);
  const [rubrics, setRubrics] = useState<string[]>([isVi ? "Độ rõ" : "Clarity"]);
  const rubricOptions = isVi ? ["Độ rõ", "Cấu trúc", "Tính nhất quán"] : ["Clarity", "Structure", "Consistency"];
  const artifact = scriptBriefs[brief][locale];
  const roles = ["Drafter", "Critic", "Reviser"];
  return (
    <>
      <LabHead code="DELEGATE · SCRIPT HANDOFF STUDIO" title={isVi ? "Chuyển quyền sở hữu bản thảo" : "Transfer manuscript ownership"} copy={isVi ? "Artifact được chuẩn bị trước, không phải output model trực tiếp." : "Artifacts are prepared samples, not live model output."} />
      <div className="lab-grid script-lab-grid">
        <div className="lab-controls">
          <label><span>{isVi ? "Brief mẫu" : "Prepared brief"}</span><select name="script-brief" value={brief} onChange={(event) => { setBrief(event.target.value as keyof typeof scriptBriefs); setRole(0); }}><option value="product">AI product</option><option value="education">Agent explainer</option><option value="portfolio">Technical portfolio</option></select></label>
          <fieldset><legend>Rubric</legend>{rubricOptions.map((item) => <label className="check-row" key={item}><input type="checkbox" name="script-rubric" checked={rubrics.includes(item)} onChange={() => setRubrics((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} /><span>{item}</span></label>)}</fieldset>
          <div className="handoff-timeline" role="tablist" aria-label="Role ownership">{roles.map((item, index) => <button type="button" role="tab" aria-selected={role === index} key={item} onClick={() => setRole(index as 0 | 1 | 2)}><span className="mono">0{index + 1}</span>{item}</button>)}</div>
          <button type="button" onClick={() => { setBrief("product"); setRole(0); setRubrics([isVi ? "Độ rõ" : "Clarity"]); }}>{isVi ? "Đặt lại" : "Reset"}</button>
        </div>
        <article className="lab-artifact manuscript-artifact">
          <span className="mono">{roles[role]} OWNS THIS STEP · {isVi ? "MẪU" : "PREPARED SAMPLE"}</span>
          <p>{role === 0 ? artifact[0] : role === 1 ? artifact[1] : artifact[2]}</p>
          <aside className="margin-notes"><strong>{isVi ? "Margin critique" : "Margin critique"}</strong><p>{rubrics.length ? rubrics.join(" · ") : (isVi ? "Chưa chọn rubric." : "No rubric selected.")}</p></aside>
          {role === 2 ? <div className="revision-diff"><del>{artifact[0]}</del><ins>{artifact[2]}</ins></div> : null}
        </article>
      </div>
    </>
  );
}

const teams = [
  { name: "Team Alpha", matches: 6, goals: 11, shots: 74, possession: 55 },
  { name: "Team Beta", matches: 6, goals: 8, shots: 61, possession: 49 }
];

function WorldCupLab({ locale }: { locale: Locale }) {
  const isVi = locale === "vi";
  const [metric, setMetric] = useState("goals");
  const [ran, setRan] = useState(false);
  const values = metric === "goals"
    ? teams.map((team) => goalsPerMatch(team.goals, team.matches))
    : metric === "conversion"
      ? teams.map((team) => shotConversion(team.goals, team.shots))
      : [teams[0].possession - teams[1].possession, teams[1].possession - teams[0].possession];
  const formula = metric === "goals" ? "goals / matches" : metric === "conversion" ? "(goals / shots) × 100" : "possessionA − possessionB";
  return (
    <>
      <LabHead code="COMPUTE · EVIDENCE & CALCULATION LAB" title={isVi ? "Tách dữ kiện, phép tính và tổng hợp" : "Separate facts, calculations and synthesis"} copy={isVi ? "Dataset tổng hợp không đại diện cho đội thật." : "The synthetic dataset does not represent real teams."} />
      <div className="lab-grid worldcup-lab-grid">
        <div className="lab-controls">
          <label><span>{isVi ? "Metric" : "Metric"}</span><select name="worldcup-metric" value={metric} onChange={(event) => { setMetric(event.target.value); setRan(false); }}><option value="goals">{isVi ? "Bàn thắng/trận" : "Goals per match"}</option><option value="conversion">{isVi ? "Tỷ lệ chuyển hóa" : "Shot conversion"}</option><option value="possession">{isVi ? "Chênh lệch kiểm soát bóng" : "Possession difference"}</option></select></label>
          <button type="button" onClick={() => setRan(true)}>{isVi ? "Tính bằng code" : "Calculate with code"}</button>
          <button type="button" onClick={() => { setMetric("goals"); setRan(false); }}>{isVi ? "Đặt lại" : "Reset"}</button>
        </div>
        <article className="lab-artifact analyst-artifact">
          <div><span className="mono">FACT · SYNTHETIC DATASET</span>{teams.map((team) => <p key={team.name}>{team.name}: {team.goals} goals · {team.matches} matches · {team.shots} shots · {team.possession}% possession</p>)}</div>
          <div><span className="mono">CALCULATION TAPE</span><code>{formula}</code>{ran ? <p>{teams[0].name}: {values[0].toFixed(2)} · {teams[1].name}: {values[1].toFixed(2)}</p> : <p>{isVi ? "Chạy phép tính để tạo kết quả." : "Run the calculation to create a result."}</p>}</div>
          <div><span className="mono">SYNTHESIS</span><p>{ran ? (values[0] > values[1] ? `${teams[0].name} ${isVi ? "cao hơn theo metric đã chọn." : "is higher for the selected metric."}` : `${teams[1].name} ${isVi ? "cao hơn theo metric đã chọn." : "is higher for the selected metric."}`) : (isVi ? "Chưa có kết luận." : "No conclusion yet.")}</p></div>
        </article>
      </div>
    </>
  );
}

function LoveLab({ locale }: { locale: Locale }) {
  const isVi = locale === "vi";
  const [lensA, setLensA] = useState("");
  const [lensB, setLensB] = useState("");
  const [doneA, setDoneA] = useState(false);
  const [doneB, setDoneB] = useState(false);
  const [synthesized, setSynthesized] = useState(false);
  const ready = doneA && doneB;
  function reset() { setLensA(""); setLensB(""); setDoneA(false); setDoneB(false); setSynthesized(false); }
  return (
    <>
      <LabHead code="COMPOSE · WORKFLOW COMPOSITION LAB" title={isVi ? "Hai lens độc lập, một synthesis gate" : "Two independent lenses, one synthesis gate"} copy={isVi ? "Chỉ dùng các chiều không nhạy cảm. Đây không phải tư vấn cá nhân hoặc chuyên môn." : "Only non-sensitive dimensions are used. This is not personal or professional advice."} />
      <div className="parallel-lab">
        <article className={`lens-panel ${doneA ? "is-complete" : ""}`}><span className="mono">LENS A · COMMUNICATION</span><label><span>{isVi ? "Phong cách giao tiếp" : "Communication style"}</span><select name="love-lens-a" value={lensA} onChange={(event) => { setLensA(event.target.value); setDoneA(false); setSynthesized(false); }}><option value="">{isVi ? "Chọn một preset" : "Choose a preset"}</option><option>{isVi ? "Trực tiếp" : "Direct"}</option><option>{isVi ? "Điềm tĩnh" : "Calm"}</option><option>{isVi ? "Phản hồi chậm" : "Slow response"}</option></select></label><button type="button" disabled={!lensA} onClick={() => setDoneA(true)}>{isVi ? "Hoàn thành lens A" : "Complete lens A"}</button></article>
        <div className={`synthesis-gate-v2 ${ready ? "is-ready" : ""}`}><span aria-hidden="true">⇢</span><strong>{ready ? (isVi ? "Sẵn sàng tổng hợp" : "Ready to synthesize") : (isVi ? "Chờ cả hai lens" : "Waiting for both lenses")}</strong><span aria-hidden="true">⇠</span><button type="button" disabled={!ready} onClick={() => setSynthesized(true)}>{isVi ? "Tổng hợp schema" : "Synthesize schema"}</button></div>
        <article className={`lens-panel ${doneB ? "is-complete" : ""}`}><span className="mono">LENS B · PLANNING</span><label><span>{isVi ? "Cách lập kế hoạch" : "Planning style"}</span><select name="love-lens-b" value={lensB} onChange={(event) => { setLensB(event.target.value); setDoneB(false); setSynthesized(false); }}><option value="">{isVi ? "Chọn một preset" : "Choose a preset"}</option><option>{isVi ? "Linh hoạt" : "Flexible"}</option><option>{isVi ? "Có cấu trúc" : "Structured"}</option><option>{isVi ? "Theo từng mốc" : "Milestone-based"}</option></select></label><button type="button" disabled={!lensB} onClick={() => setDoneB(true)}>{isVi ? "Hoàn thành lens B" : "Complete lens B"}</button></article>
      </div>
      <article className="lab-artifact schema-artifact"><span className="mono">STRUCTURED RESULT</span>{synthesized ? <dl><div><dt>observations</dt><dd>{lensA}; {lensB}</dd></div><div><dt>uncertainty</dt><dd>{isVi ? "Mẫu minh họa; không suy luận con người." : "Prepared sample; no inference about a person."}</dd></div><div><dt>safety</dt><dd>{isVi ? "Không appearance score, diagnosis hoặc sensitive-trait inference." : "No appearance score, diagnosis or sensitive-trait inference."}</dd></div></dl> : <p>{isVi ? "Schema chỉ mở khi cả hai nhánh hoàn tất." : "The schema opens only after both branches complete."}</p>}<button type="button" onClick={reset}>{isVi ? "Đặt lại" : "Reset"}</button></article>
    </>
  );
}

function DashboardLab({ locale }: { locale: Locale }) {
  const isVi = locale === "vi";
  const [framework, setFramework] = useState("Operations");
  const [threshold, setThreshold] = useState(20);
  const [ran, setRan] = useState(false);
  const [round, setRound] = useState(0);
  const [approved, setApproved] = useState(false);
  const results = useMemo(() => detectRevenueDrops(syntheticSalesRows, threshold), [threshold]);
  const anomalies = results.filter((item) => item.isAnomaly);
  function reset() { setFramework("Operations"); setThreshold(20); setRan(false); setRound(0); setApproved(false); }
  return (
    <>
      <LabHead code="VERIFY · DASHBOARD EVIDENCE LAB" title={isVi ? "Từ synthetic rows đến claim-evidence matrix" : "From synthetic rows to a claim-evidence matrix"} copy={isVi ? "Metric được tính bằng code trong browser; không có upload hoặc KPI trực tiếp." : "Metrics are computed in browser code; there is no live upload or business KPI."} />
      <div className="dashboard-lab-layout">
        <aside className="lab-controls">
          <label><span>{isVi ? "Framework" : "Framework"}</span><select name="dashboard-framework" value={framework} onChange={(event) => { setFramework(event.target.value); setApproved(false); }}><option>Funnel</option><option>Retention</option><option>Operations</option><option>Finance</option></select></label>
          <label><span>{isVi ? "Ngưỡng giảm" : "Drop threshold"}: {threshold}%</span><input name="dashboard-threshold" type="range" min={0} max={60} step={5} value={threshold} onChange={(event) => { setThreshold(Number(event.target.value)); setRan(true); setApproved(false); }} /></label>
          <button type="button" onClick={() => setRan(true)}>{isVi ? "Chạy phân tích" : "Run analysis"}</button>
          <button type="button" onClick={reset}>{isVi ? "Đặt lại" : "Reset"}</button>
          <div className="qa-rubric"><strong>QA rubric</strong><ul><li>{isVi ? "Claim có metric code" : "Claim has a computed metric"}</li><li>{isVi ? "Có evidence row" : "Evidence rows are linked"}</li><li>{isVi ? "Không suy diễn nguyên nhân" : "No unsupported causal claim"}</li></ul><p className="mono">REVISION {round}/2</p><button type="button" disabled={!ran || approved || round >= 2} onClick={() => setRound((value) => Math.min(2, value + 1))}>{isVi ? "Từ chối và sửa" : "Reject and revise"}</button><button type="button" disabled={!ran} onClick={() => setApproved(true)}>{isVi ? "Duyệt theo rubric" : "Approve against rubric"}</button></div>
        </aside>
        <article className="lab-artifact report-artifact">
          <header><span className="mono">SYNTHETIC SALES · {framework.toUpperCase()}</span><strong>{ran ? `${anomalies.length} ${isVi ? "anomaly" : "anomalies"}` : "EMPTY"}</strong></header>
          {!ran ? <p>{isVi ? "Chạy phân tích hoặc đổi threshold để tạo report." : "Run the analysis or change the threshold to create a report."}</p> : anomalies.length ? <div className="claim-matrix"><div className="matrix-row matrix-header"><span>Claim</span><span>Evidence rows</span><span>Calculated change</span></div>{anomalies.map((item) => <div className="matrix-row" key={`${item.channel}-${item.period}`}><strong>{item.channel} revenue drop</strong><span>{item.evidenceRows.join(" → ")}</span><span>{item.percentChange.toFixed(1)}%</span></div>)}</div> : <p>{isVi ? "Không có anomaly ở threshold này. Không tạo claim giả." : "No anomaly at this threshold. No claim is invented."}</p>}
          {approved ? <div className="archive-receipt"><span className="mono">SAMPLE ARCHIVE RECEIPT</span><p>dataset=synthetic-sales · framework={framework} · threshold={threshold}% · revisions={round} · status=approved_demo</p></div> : null}
        </article>
      </div>
    </>
  );
}

function A2ALab({ locale }: { locale: Locale }) {
  const isVi = locale === "vi";
  const [request, setRequest] = useState(isVi ? "Tìm bất thường trong CSV doanh thu" : "Find anomalies in this revenue CSV");
  const [routed, setRouted] = useState(false);
  const [override, setOverride] = useState("");
  const [offline, setOffline] = useState(false);
  const [retry, setRetry] = useState(0);
  const result = routeWithVisibleRules(request);
  const selected = override || result.specialist;
  const fallback = offline && selected;
  function reset() { setRequest(isVi ? "Tìm bất thường trong CSV doanh thu" : "Find anomalies in this revenue CSV"); setRouted(false); setOverride(""); setOffline(false); setRetry(0); }
  return (
    <>
      <LabHead code="CONNECT · A2A ROUTING LAB" title={isVi ? "Điều phối bằng rule hiển thị rõ" : "Route with visible rules"} copy={isVi ? "Rule-based simulator cục bộ, không phải model confidence hay A2A trực tiếp." : "A local rule-based simulator, not model confidence or live A2A."} />
      <div className="a2a-lab-layout">
        <div className="lab-controls">
          <label><span>{isVi ? "Request ngắn" : "Short request"}</span><textarea name="a2a-request" maxLength={160} value={request} onChange={(event) => { setRequest(event.target.value); setRouted(false); }} /></label>
          <label><span>{isVi ? "Manual override" : "Manual override"}</span><select name="a2a-override" value={override} onChange={(event) => { setOverride(event.target.value); setRouted(true); }}><option value="">{isVi ? "Dùng rule match" : "Use rule match"}</option>{["trip-planner", "script-team", "worldcup-analyst", "love-advisor", "dashboard-insights"].map((slug) => <option key={slug}>{slug}</option>)}</select></label>
          <label className="switch-row"><input name="a2a-offline" type="checkbox" checked={offline} onChange={(event) => { setOffline(event.target.checked); setRetry(0); }} /><span>{isVi ? "Mô phỏng specialist offline" : "Simulate specialist offline"}</span></label>
          <div className="lab-actions"><button type="button" onClick={() => setRouted(true)}>{isVi ? "Chạy routing" : "Run routing"}</button><button type="button" onClick={reset}>{isVi ? "Đặt lại" : "Reset"}</button></div>
        </div>
        <article className="lab-artifact routing-artifact">
          <span className="mono">LOCAL ROUTER · {routed ? "RESULT" : "EMPTY"}</span>
          {!routed ? <p>{isVi ? "Chạy routing để xem rule và contract." : "Run routing to inspect rules and the contract."}</p> : !selected ? <div className="no-match"><strong>{isVi ? "Không có rule khớp." : "No rule matched."}</strong><p>{isVi ? "Fallback yêu cầu làm rõ intent." : "Fallback asks the user to clarify intent."}</p></div> : <>
            <dl><div><dt>{isVi ? "Specialist" : "Specialist"}</dt><dd>{selected}</dd></div><div><dt>{isVi ? "Từ khóa khớp" : "Matched keywords"}</dt><dd>{result.matchedKeywords.join(", ") || (override ? "manual override" : "none")}</dd></div><div><dt>Endpoint</dt><dd>{portFor(selected)}</dd></div><div><dt>Agent Card</dt><dd>capability={selected}; input=text; output=artifact</dd></div></dl>
            {fallback ? <div className="fallback-state"><strong>{isVi ? "Specialist không khả dụng." : "Specialist unavailable."}</strong><p>{isVi ? "Timeout mô phỏng. Architecture trace vẫn khả dụng." : "Simulated timeout. The architecture trace remains available."}</p><p className="mono">RETRY {retry}/2</p><button type="button" disabled={retry >= 2} onClick={() => setRetry((value) => Math.min(2, value + 1))}>{isVi ? "Thử lại" : "Retry"}</button>{retry >= 2 ? <p>{isVi ? "Circuit mở: trả fallback tĩnh." : "Circuit open: returning static fallback."}</p> : null}</div> : <p className="route-success">{isVi ? "Rule đã chọn capability; đây không phải live health status." : "A rule selected the capability; this is not live health status."}</p>}
          </>}
        </article>
      </div>
    </>
  );
}

function portFor(slug: string) {
  return ({
    "trip-planner": ":8001",
    "script-team": ":8002",
    "worldcup-analyst": ":8003",
    "love-advisor": ":8004",
    "dashboard-insights": ":8005"
  } as Record<string, string>)[slug] ?? "unassigned";
}
