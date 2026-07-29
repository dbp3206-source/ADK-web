"use client";

import { useEffect, useMemo, useState } from "react";

import concepts from "@/content/learning-v4/system-concepts.json";
import { localizedPath, type Locale } from "@/lib/i18n";

type LayerId = "context" | "access" | "actions" | "runtime" | "reliability";
type Mastery = 0 | 1 | 2;

const layers: { id: LayerId; vi: string; en: string; signal: string }[] = [
  { id: "context", vi: "Context & Tri thức", en: "Context & Knowledge", signal: "FIND" },
  { id: "access", vi: "Truy cập model", en: "Model Access", signal: "ROUTE" },
  { id: "actions", vi: "Hành động & Kết nối", en: "Actions & Connectivity", signal: "ACT" },
  { id: "runtime", vi: "Agent Runtime", en: "Agent Runtime", signal: "LOOP" },
  { id: "reliability", vi: "Độ tin cậy", en: "Reliability & Quality", signal: "PROVE" },
];

const scenarios = [
  {
    vi: "Trợ lý hỏi đáp tài liệu nội bộ",
    en: "Internal document assistant",
    base: ["SC-01", "SC-02", "SC-03", "SC-04", "SC-15", "SC-17"],
  },
  {
    vi: "Nền tảng dùng nhiều model/provider",
    en: "Multi-model, multi-provider platform",
    base: ["SC-05", "SC-06", "SC-07", "SC-16", "SC-17"],
  },
  {
    vi: "Agent cập nhật CRM qua tool",
    en: "Agent that updates a CRM through tools",
    base: ["SC-08", "SC-09", "SC-11", "SC-12", "SC-13", "SC-15", "SC-16"],
  },
  {
    vi: "Hệ thống quyết định có rủi ro cao",
    en: "High-risk decision support system",
    base: ["SC-03", "SC-04", "SC-15", "SC-16", "SC-17"],
  },
];

const incidents = [
  {
    id: "stale-cache",
    vi: "Người dùng nhận câu trả lời từ chính sách cũ dù tài liệu nguồn đã cập nhật.",
    en: "A user receives an answer from an old policy after the source was updated.",
    candidates: ["SC-05", "SC-03", "SC-14", "SC-08"],
    answer: "SC-05",
    mitigationVi: "Gắn phiên bản nguồn, quyền và TTL vào cache key; vô hiệu cache khi index thay đổi.",
    mitigationEn: "Include source version, permissions and TTL in the cache key; invalidate it when the index changes.",
  },
  {
    id: "wrong-route",
    vi: "Router chuyển một tác vụ pháp lý khó sang model rẻ nhưng không đủ năng lực.",
    en: "The router sends a difficult legal task to a cheaper but underpowered model.",
    candidates: ["SC-06", "SC-07", "SC-13", "SC-02"],
    answer: "SC-06",
    mitigationVi: "Eval router theo nhóm task và thêm confidence threshold cùng fallback model.",
    mitigationEn: "Evaluate routing by task class and add a confidence threshold plus fallback model.",
  },
  {
    id: "tool-repeat",
    vi: "Tool timeout, agent retry và tạo hai bản ghi CRM giống nhau.",
    en: "A tool times out, the agent retries and creates duplicate CRM records.",
    candidates: ["SC-09", "SC-10", "SC-04", "SC-17"],
    answer: "SC-09",
    mitigationVi: "Dùng idempotency key, error contract và kiểm tra hậu điều kiện trước retry.",
    mitigationEn: "Use an idempotency key, error contract and postcondition check before retrying.",
  },
  {
    id: "runaway-loop",
    vi: "Agent tiếp tục gọi tool dù mục tiêu đã đạt và tiêu hết budget.",
    en: "An agent keeps calling tools after the goal is met and exhausts its budget.",
    candidates: ["SC-13", "SC-12", "SC-14", "SC-01"],
    answer: "SC-13",
    mitigationVi: "Định nghĩa stop condition, giới hạn số bước và escalation khi loop không tiến triển.",
    mitigationEn: "Define a stop condition, step limit and escalation when the loop stops making progress.",
  },
  {
    id: "trace-leak",
    vi: "Log giúp debug nhưng vô tình lưu prompt chứa dữ liệu cá nhân.",
    en: "Debug logs accidentally retain personal data from prompts.",
    candidates: ["SC-16", "SC-15", "SC-11", "SC-06"],
    answer: "SC-16",
    mitigationVi: "Redact theo trường dữ liệu, phân tầng quyền xem log và đặt retention policy.",
    mitigationEn: "Redact by field, tier log access and define a retention policy.",
  },
];

export function SystemConceptsTrack({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  const [selectedId, setSelectedId] = useState("SC-04");
  const [scenario, setScenario] = useState(0);
  const [freshness, setFreshness] = useState(2);
  const [autonomy, setAutonomy] = useState(1);
  const [actionRisk, setActionRisk] = useState(1);
  const [costPressure, setCostPressure] = useState(1);
  const [incidentIndex, setIncidentIndex] = useState(0);
  const [incidentChoice, setIncidentChoice] = useState("");
  const [mastery, setMastery] = useState<Record<string, Mastery>>({});

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("system-concepts-mastery") || "{}");
      setMastery(saved);
    } catch {
      setMastery({});
    }
  }, []);

  const setConceptMastery = (id: string, value: Mastery) => {
    setMastery((current) => {
      const next = { ...current, [id]: value };
      window.localStorage.setItem("system-concepts-mastery", JSON.stringify(next));
      return next;
    });
  };

  const selected = concepts.find((item) => item.id === selectedId) ?? concepts[0];
  const downstream = concepts.filter((item) => item.dependsOn.includes(selected.id));
  const incident = incidents[incidentIndex];

  const recommended = useMemo(() => {
    const weighted = new Map<string, number>();
    const add = (ids: string[], points: number) => ids.forEach((id) => weighted.set(id, (weighted.get(id) || 0) + points));
    add(scenarios[scenario].base, 4);
    if (freshness >= 2) add(["SC-03", "SC-04", "SC-05", "SC-16"], freshness);
    if (autonomy >= 2) add(["SC-12", "SC-13", "SC-14", "SC-15", "SC-16"], autonomy);
    if (actionRisk >= 2) add(["SC-08", "SC-09", "SC-11", "SC-15", "SC-16", "SC-17"], actionRisk + 1);
    if (costPressure >= 2) add(["SC-05", "SC-06", "SC-07", "SC-17"], costPressure);
    return [...weighted.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7).map(([id]) => concepts.find((item) => item.id === id)!);
  }, [actionRisk, autonomy, costPressure, freshness, scenario]);

  const mastered = concepts.filter((item) => mastery[item.id] === 2).length;
  const revisit = concepts.filter((item) => (mastery[item.id] || 0) < 2).slice(0, 4);

  return (
    <div className="v2-page system-concepts-track">
      <header className="system-concepts-cover page-shell-v2">
        <p className="eyebrow-v2">TRACK C · AI SYSTEM CONCEPTS</p>
        <h1>{vi ? "Nhìn AI như một hệ thống, không phải danh sách thuật ngữ." : "See AI as a system, not a list of terms."}</h1>
        <p>{vi ? "17 concept được nối bằng dependency, failure signal và quyết định vận hành. Tiến độ được lưu riêng trên trình duyệt của bạn." : "Seventeen concepts connected through dependencies, failure signals and operating decisions. Progress stays in your browser."}</p>
      </header>

      <nav className="learning-track-nav page-shell-v2" aria-label={vi ? "Điều hướng Track C" : "Track C navigation"}>
        <a href={localizedPath(locale, "/learn")}>← {vi ? "Ba track" : "Three tracks"}</a>
        <a href="#system-atlas">{vi ? "Bản đồ hệ thống" : "System Atlas"}</a>
        <a href="#architecture-tuner">{vi ? "Bộ chỉnh kiến trúc" : "Architecture Tuner"}</a>
        <a href="#failure-studio">{vi ? "Phòng sự cố" : "Failure Studio"}</a>
        <a href="#mastery-passport">{vi ? "Hộ chiếu kiến thức" : "Mastery Passport"}</a>
      </nav>

      <section className="concept-section page-shell-v2" id="system-atlas">
        <header><p className="eyebrow-v2">SYSTEM ATLAS · 5 LAYERS</p><h2>{vi ? "Chọn một node để thấy nó phụ thuộc vào đâu." : "Choose a node to inspect its dependencies."}</h2></header>
        <div className="concept-atlas">
          <div className="concept-layer-map">
            {layers.map((layer) => (
              <section key={layer.id} className={`concept-layer concept-layer-${layer.id}`}>
                <header><span className="mono">{layer.signal}</span><h3>{vi ? layer.vi : layer.en}</h3></header>
                <div>
                  {concepts.filter((item) => item.layer === layer.id).map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      aria-pressed={selected.id === item.id}
                      data-mastery={mastery[item.id] || 0}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <span className="mono">{item.id}</span>
                      <strong>{item.term}</strong>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="concept-inspector" aria-live="polite">
            <p className="eyebrow-v2">{selected.id} · {selected.term}</p>
            <h3>{vi ? selected.vi : selected.en}</h3>
            <dl>
              <div><dt>{vi ? "Phụ thuộc vào" : "Depends on"}</dt><dd>{selected.dependsOn.length ? selected.dependsOn.map((id) => concepts.find((item) => item.id === id)?.term).join(" · ") : (vi ? "Nền tảng độc lập" : "Independent foundation")}</dd></div>
              <div><dt>{vi ? "Cấp năng lực cho" : "Enables"}</dt><dd>{downstream.length ? downstream.map((item) => item.term).join(" · ") : (vi ? "Lớp kiểm soát cuối" : "Final control layer")}</dd></div>
              <div><dt>{vi ? "Failure signal" : "Failure signal"}</dt><dd>{vi ? selected.failureVi : selected.failureEn}</dd></div>
              <div><dt>{vi ? "Câu hỏi thiết kế" : "Design question"}</dt><dd>{vi ? selected.questionVi : selected.questionEn}</dd></div>
            </dl>
            <div className="concept-mastery-control" role="group" aria-label={vi ? `Mức nắm vững ${selected.term}` : `${selected.term} mastery`}>
              {([0, 1, 2] as Mastery[]).map((level) => (
                <button type="button" key={level} aria-pressed={(mastery[selected.id] || 0) === level} onClick={() => setConceptMastery(selected.id, level)}>
                  {level === 0 ? (vi ? "Chưa rõ" : "Unclear") : level === 1 ? (vi ? "Đang nối" : "Connecting") : (vi ? "Giải thích được" : "Can explain")}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="concept-section concept-tuner-band" id="architecture-tuner">
        <div className="page-shell-v2">
          <header><p className="eyebrow-v2">ARCHITECTURE TUNER</p><h2>{vi ? "Điều chỉnh ràng buộc, xem concept stack thay đổi." : "Tune constraints and watch the concept stack change."}</h2></header>
          <div className="architecture-tuner">
            <div className="tuner-controls">
              <label><span>{vi ? "Bối cảnh" : "Scenario"}</span><select value={scenario} onChange={(event) => setScenario(Number(event.target.value))}>{scenarios.map((item, index) => <option value={index} key={item.vi}>{vi ? item.vi : item.en}</option>)}</select></label>
              {[
                [vi ? "Dữ liệu thay đổi nhanh" : "Fast-changing data", freshness, setFreshness],
                [vi ? "Mức tự chủ của agent" : "Agent autonomy", autonomy, setAutonomy],
                [vi ? "Rủi ro khi hành động" : "Action risk", actionRisk, setActionRisk],
                [vi ? "Áp lực chi phí" : "Cost pressure", costPressure, setCostPressure],
              ].map(([label, value, setter]) => (
                <label className="tuner-range" key={String(label)}>
                  <span>{String(label)}</span>
                  <input type="range" min="0" max="3" step="1" value={Number(value)} onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))} />
                  <output>{["LOW", "MID", "HIGH", "CRITICAL"][Number(value)]}</output>
                </label>
              ))}
            </div>
            <article className="recommended-stack" aria-live="polite">
              <span className="mono">{vi ? "STACK ĐỀ XUẤT" : "RECOMMENDED STACK"}</span>
              <ol>{recommended.map((item, index) => <li key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><button type="button" onClick={() => { setSelectedId(item.id); document.getElementById("system-atlas")?.scrollIntoView({ behavior: "smooth" }); }}>{item.term}</button></li>)}</ol>
              <p>{vi ? "Đây là lộ trình đọc theo ràng buộc, không phải kiến trúc production tự động." : "This is a constraint-driven reading route, not an automatically production-ready architecture."}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="concept-section page-shell-v2" id="failure-studio">
        <header><p className="eyebrow-v2">FAILURE INJECTION STUDIO</p><h2>{vi ? "Tìm control plane chịu trách nhiệm." : "Find the control plane that owns the failure."}</h2></header>
        <div className="failure-studio">
          <div className="incident-rail" role="tablist" aria-label={vi ? "Chọn sự cố" : "Choose an incident"}>
            {incidents.map((item, index) => <button type="button" role="tab" aria-selected={incidentIndex === index} onClick={() => { setIncidentIndex(index); setIncidentChoice(""); }} key={item.id}>{String(index + 1).padStart(2, "0")}</button>)}
          </div>
          <article>
            <p className="failure-prompt">{vi ? incident.vi : incident.en}</p>
            <p>{vi ? "Concept nào sở hữu biện pháp kiểm soát đầu tiên?" : "Which concept owns the first control?"}</p>
            <div className="incident-choices">
              {incident.candidates.map((id) => {
                const item = concepts.find((concept) => concept.id === id)!;
                return <button type="button" key={id} aria-pressed={incidentChoice === id} onClick={() => setIncidentChoice(id)}>{item.term}</button>;
              })}
            </div>
            {incidentChoice ? (
              <div className={incidentChoice === incident.answer ? "incident-result is-correct" : "incident-result is-review"} role="status">
                <strong>{incidentChoice === incident.answer ? (vi ? "Đúng control đầu tiên" : "Correct first control") : (vi ? "Chưa phải control đầu tiên" : "Not the first control")}</strong>
                <p>{incidentChoice === incident.answer ? (vi ? incident.mitigationVi : incident.mitigationEn) : (vi ? "Concept này có thể liên quan, nhưng hãy tìm control trực tiếp sở hữu failure signal." : "This concept may be related, but find the control that directly owns the failure signal.")}</p>
              </div>
            ) : null}
          </article>
        </div>
      </section>

      <section className="concept-section mastery-passport page-shell-v2" id="mastery-passport">
        <header><p className="eyebrow-v2">MASTERY PASSPORT</p><h2>{vi ? `${mastered}/17 concept bạn có thể tự giải thích.` : `${mastered}/17 concepts you can explain.`}</h2></header>
        <div className="mastery-meter" aria-label={vi ? "Tiến độ 17 concept" : "17-concept progress"}><span style={{ width: `${(mastered / 17) * 100}%` }} /></div>
        <div className="revisit-queue">
          <h3>{vi ? "Hàng đợi explain-back tiếp theo" : "Next explain-back queue"}</h3>
          <ol>{revisit.map((item) => <li key={item.id}><button type="button" onClick={() => { setSelectedId(item.id); document.getElementById("system-atlas")?.scrollIntoView({ behavior: "smooth" }); }}><span className="mono">{item.id}</span>{item.term}</button></li>)}</ol>
        </div>
      </section>
    </div>
  );
}
