"use client";

import { useEffect, useMemo, useState } from "react";

import concepts from "@/content/learning-v4/system-concepts.json";
import { localizeConceptGuide } from "@/content/learning-v4/concept-guides";
import { localizedPath, type Locale } from "@/lib/i18n";

type LayerId = "context" | "access" | "actions" | "runtime" | "reliability";
type Mastery = 0 | 1 | 2;

const layers: { id: LayerId; vi: string; en: string; signal: string }[] = [
  { id: "context", vi: "Tìm tri thức", en: "Find knowledge", signal: "FIND" },
  { id: "access", vi: "Chọn model", en: "Choose model", signal: "ROUTE" },
  { id: "actions", vi: "Dùng công cụ", en: "Use tools", signal: "ACT" },
  { id: "runtime", vi: "Agent Runtime", en: "Agent Runtime", signal: "LOOP" },
  { id: "reliability", vi: "Kiểm tra chất lượng", en: "Prove quality", signal: "PROVE" },
];

const scenarios = [
  {
    vi: "Hỏi đáp tài liệu nội bộ",
    en: "Internal document assistant",
    base: ["SC-01", "SC-02", "SC-03", "SC-04", "SC-15", "SC-17"],
  },
  {
    vi: "Trợ lý chăm sóc khách hàng",
    en: "Customer support assistant",
    base: ["SC-03", "SC-04", "SC-05", "SC-06", "SC-15", "SC-16", "SC-17"],
  },
  {
    vi: "Xử lý hóa đơn",
    en: "Invoice processing",
    base: ["SC-01", "SC-08", "SC-09", "SC-11", "SC-12", "SC-15", "SC-16", "SC-17"],
  },
  {
    vi: "Agent cập nhật CRM",
    en: "Agent that updates a CRM through tools",
    base: ["SC-08", "SC-09", "SC-11", "SC-12", "SC-13", "SC-15", "SC-16"],
  },
  {
    vi: "Phân tích báo cáo",
    en: "Report analysis",
    base: ["SC-03", "SC-04", "SC-09", "SC-13", "SC-16", "SC-17"],
  },
  {
    vi: "Agent được quyền thực hiện hành động",
    en: "Agent authorized to take actions",
    base: ["SC-08", "SC-09", "SC-11", "SC-12", "SC-13", "SC-15", "SC-16", "SC-17"],
  },
];

const tunerQuestions = [
  {
    key: "freshness",
    vi: "Dữ liệu có thường xuyên thay đổi không?",
    en: "How often does the data change?",
    optionsVi: ["Ít", "Thỉnh thoảng", "Thường xuyên"],
    optionsEn: ["Rarely", "Sometimes", "Often"],
  },
  {
    key: "autonomy",
    vi: "Agent có được tự thực hiện hành động không?",
    en: "May the agent take actions on its own?",
    optionsVi: ["Không", "Sau khi duyệt", "Có giới hạn"],
    optionsEn: ["No", "After approval", "With limits"],
  },
  {
    key: "actionRisk",
    vi: "Nếu agent làm sai, ảnh hưởng có lớn không?",
    en: "How serious is a wrong action?",
    optionsVi: ["Nhỏ", "Có thể sửa", "Ảnh hưởng lớn"],
    optionsEn: ["Low", "Reversible", "High impact"],
  },
  {
    key: "costPressure",
    vi: "Chi phí và tốc độ có cần tối ưu mạnh không?",
    en: "How strongly must cost and speed be optimized?",
    optionsVi: ["Không", "Cân bằng", "Rất cần"],
    optionsEn: ["No", "Balanced", "Strongly"],
  },
] as const;

const incidents = [
  {
    id: "stale-cache",
    vi: "Người dùng nhận câu trả lời từ chính sách cũ dù tài liệu nguồn đã cập nhật.",
    en: "A user receives an answer from an old policy after the source was updated.",
    impactVi: "Nhân viên có thể làm sai quy trình đang có hiệu lực.",
    impactEn: "An employee may follow an outdated process.",
    causesVi: ["Cache chưa hết hạn.", "RAG lấy sai phiên bản.", "Memory giữ câu trả lời cũ."],
    causesEn: ["Cache did not expire.", "RAG retrieved an old version.", "Memory retained an old answer."],
    candidates: ["SC-05", "SC-03", "SC-14", "SC-08"],
    answer: "SC-05",
    mitigationVi: "Kiểm tra cache trước: gắn phiên bản nguồn, quyền và TTL vào cache key; vô hiệu cache khi index thay đổi.",
    mitigationEn: "Include source version, permissions and TTL in the cache key; invalidate it when the index changes.",
  },
  {
    id: "wrong-route",
    vi: "Router chuyển một tác vụ pháp lý khó sang model rẻ nhưng không đủ năng lực.",
    en: "The router sends a difficult legal task to a cheaper but underpowered model.",
    impactVi: "Người dùng nhận phân tích thiếu căn cứ trong một nhiệm vụ rủi ro.",
    impactEn: "The user receives weak analysis for a high-risk task.",
    causesVi: ["Phân loại task quá rộng.", "Không có confidence threshold.", "Fallback chưa được eval."],
    causesEn: ["Task classes are too broad.", "No confidence threshold exists.", "Fallback was not evaluated."],
    candidates: ["SC-06", "SC-07", "SC-13", "SC-02"],
    answer: "SC-06",
    mitigationVi: "Kiểm tra Model Routing trước: eval theo nhóm task, thêm confidence threshold và fallback model.",
    mitigationEn: "Evaluate routing by task class and add a confidence threshold plus fallback model.",
  },
  {
    id: "tool-repeat",
    vi: "Tool timeout, agent retry và tạo hai bản ghi CRM giống nhau.",
    en: "A tool times out, the agent retries and creates duplicate CRM records.",
    impactVi: "Sales team thấy hai cơ hội bán hàng cho cùng một khách.",
    impactEn: "The sales team sees duplicate opportunities for one customer.",
    causesVi: ["Không có idempotency key.", "Timeout bị hiểu là thất bại.", "Không kiểm tra hậu điều kiện."],
    causesEn: ["No idempotency key.", "Timeout was treated as failure.", "No postcondition check."],
    candidates: ["SC-09", "SC-10", "SC-04", "SC-17"],
    answer: "SC-09",
    mitigationVi: "Kiểm tra Tool Use trước: dùng idempotency key, error contract và hậu điều kiện trước khi retry.",
    mitigationEn: "Use an idempotency key, error contract and postcondition check before retrying.",
  },
  {
    id: "runaway-loop",
    vi: "Agent tiếp tục gọi tool dù mục tiêu đã đạt và tiêu hết budget.",
    en: "An agent keeps calling tools after the goal is met and exhausts its budget.",
    impactVi: "Người dùng chờ lâu hơn và chi phí tăng mà output không tốt hơn.",
    impactEn: "The user waits longer and cost rises without a better output.",
    causesVi: ["Không có stop condition.", "Goal state không được kiểm tra.", "Loop không phát hiện thiếu tiến triển."],
    causesEn: ["No stop condition.", "Goal state is not checked.", "The loop cannot detect stalled progress."],
    candidates: ["SC-13", "SC-12", "SC-14", "SC-01"],
    answer: "SC-13",
    mitigationVi: "Kiểm tra Execution Loop trước: định nghĩa stop condition, giới hạn bước và escalation khi không tiến triển.",
    mitigationEn: "Define a stop condition, step limit and escalation when the loop stops making progress.",
  },
  {
    id: "trace-leak",
    vi: "Log giúp debug nhưng vô tình lưu prompt chứa dữ liệu cá nhân.",
    en: "Debug logs accidentally retain personal data from prompts.",
    impactVi: "Dữ liệu nhạy cảm xuất hiện với người không cần quyền truy cập.",
    impactEn: "Sensitive data becomes visible to people who do not need access.",
    causesVi: ["Không redact theo trường.", "Quyền xem log quá rộng.", "Retention quá dài."],
    causesEn: ["No field-level redaction.", "Log access is too broad.", "Retention is too long."],
    candidates: ["SC-16", "SC-15", "SC-11", "SC-06"],
    answer: "SC-16",
    mitigationVi: "Kiểm tra Observability trước: redact theo trường, phân quyền xem log và đặt retention policy.",
    mitigationEn: "Redact by field, tier log access and define a retention policy.",
  },
];

export function SystemConceptsTrack({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  const [selectedId, setSelectedId] = useState("SC-04");
  const [selectedLayer, setSelectedLayer] = useState<LayerId>("context");
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
  const selectedGuide = localizeConceptGuide(selected.id, locale);
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
  const controlValues = { freshness, autonomy, actionRisk, costPressure };
  const controlSetters = { setFreshness, setAutonomy, setActionRisk, setCostPressure };

  const stackReason = (id: string) => {
    if (freshness >= 2 && ["SC-03", "SC-04", "SC-05"].includes(id)) {
      return vi
        ? "Thêm vì dữ liệu thay đổi thường xuyên và output cần dùng thông tin còn hiệu lực."
        : "Added because data changes often and outputs need current information.";
    }
    if (actionRisk >= 2 && ["SC-15", "SC-16", "SC-17"].includes(id)) {
      return vi
        ? "Thêm vì một hành động sai có ảnh hưởng lớn, nên cần giới hạn, trace và kiểm thử."
        : "Added because a wrong action has high impact, requiring controls, traces and evaluation.";
    }
    if (autonomy >= 2 && ["SC-12", "SC-13"].includes(id)) {
      return vi
        ? "Thêm vì agent được hành động có giới hạn và cần runtime với điều kiện dừng rõ."
        : "Added because bounded autonomy needs a runtime with explicit stop conditions.";
    }
    if (costPressure >= 2 && ["SC-06", "SC-07"].includes(id)) {
      return vi
        ? "Thêm để cân bằng chất lượng, tốc độ và chi phí giữa các model."
        : "Added to balance model quality, speed and cost.";
    }
    return vi
      ? `Thêm vì đây là năng lực nền cho tình huống “${scenarios[scenario].vi}”.`
      : `Added as a core capability for “${scenarios[scenario].en}”.`;
  };

  const selectConcept = (id: string) => {
    const item = concepts.find((concept) => concept.id === id);
    if (!item) return;
    setSelectedId(id);
    setSelectedLayer(item.layer as LayerId);
  };

  const nextActionFor = (id: string) => {
    const level = mastery[id] || 0;
    const guide = localizeConceptGuide(id, locale);
    if (level === 0) {
      return {
        status: vi ? "Chưa rõ" : "Unclear",
        action: vi ? `Xem giải thích 30 giây: ${guide.plainTitle}` : `Read the 30-second explanation: ${guide.plainTitle}`,
      };
    }
    if (level === 1) {
      return {
        status: vi ? "Đang nối" : "Connecting",
        action: vi ? "So sánh với concept liên quan rồi thử một tình huống." : "Compare a related concept, then try one scenario.",
      };
    }
    return {
      status: vi ? "Giải thích được" : "Can explain",
      action: vi ? "Trả lời explain-back và áp dụng vào một project." : "Complete an explain-back and apply it to a project.",
    };
  };

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
        <header><p className="eyebrow-v2">SYSTEM ATLAS · 5 LAYERS</p><h2>{vi ? "Chọn một khái niệm, hiểu việc nó giúp bạn làm." : "Choose a concept and see the job it helps you do."}</h2></header>
        <div className="concept-layer-selector" role="tablist" aria-label={vi ? "Chọn lớp hệ thống" : "Choose a system layer"}>
          {layers.map((layer) => (
            <button
              key={layer.id}
              type="button"
              role="tab"
              aria-selected={selectedLayer === layer.id}
              onClick={() => setSelectedLayer(layer.id)}
            >
              <span>{layer.signal}</span>
              {vi ? layer.vi : layer.en}
            </button>
          ))}
        </div>
        <div className="concept-atlas">
          <div className="concept-layer-map">
            {layers.map((layer) => (
              <section key={layer.id} className={`concept-layer concept-layer-${layer.id}${selectedLayer === layer.id ? " is-active" : ""}`}>
                <header><span className="mono">{layer.signal}</span><h3>{vi ? layer.vi : layer.en}</h3></header>
                <div>
                  {concepts.filter((item) => item.layer === layer.id).map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      aria-pressed={selected.id === item.id}
                      data-mastery={mastery[item.id] || 0}
                      onClick={() => selectConcept(item.id)}
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
            <header className="concept-detail-header">
              <span className="concept-detail-icon" aria-hidden="true">{selected.id.slice(-2)}</span>
              <div>
                <p className="eyebrow-v2">{selected.id} · {selected.term}</p>
                <h3>{selectedGuide.plainTitle}</h3>
              </div>
            </header>
            <p className="concept-definition">{selectedGuide.definition}</p>
            <ul className="concept-use-cases" aria-label={vi ? "Tình huống sử dụng" : "Use cases"}>
              {selectedGuide.useCases.map((item) => <li key={item}>{item}</li>)}
            </ul>

            <section className="concept-solves">
              <h4>{vi ? "Nó giúp giải quyết việc gì?" : "What does it solve?"}</h4>
              <p>{selectedGuide.problemSolved}</p>
            </section>

            <section className="concept-need-signals">
              <h4>{vi ? "Khi nào tôi cần nó?" : "When do I need it?"}</h4>
              <ul>{selectedGuide.needSignals.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>

            <div className="concept-examples">
              <article>
                <span aria-hidden="true">01</span>
                <h4>{vi ? "Ví dụ đời sống" : "Everyday example"}</h4>
                <p>{selectedGuide.everydayExample}</p>
              </article>
              <article>
                <span aria-hidden="true">02</span>
                <h4>{vi ? "Ví dụ công việc" : "Work example"}</h4>
                <p>{selectedGuide.workExample}</p>
              </article>
            </div>

            <section className="concept-apply-now">
              <h4>{vi ? "Áp dụng ngay trong 3 bước" : "Apply it in 3 steps"}</h4>
              <ol>{selectedGuide.applySteps.map((item) => <li key={item}>{item}</li>)}</ol>
            </section>

            <section className="concept-watch-out">
              <span aria-hidden="true">!</span>
              <div>
                <h4>{vi ? "Dễ sai ở đâu?" : "Watch out"}</h4>
                <p>{selectedGuide.failureSignal}</p>
                <small>{selectedGuide.avoidTip}</small>
              </div>
            </section>

            <details className="concept-deep-dive">
              <summary>{vi ? "Đi sâu vào hệ thống" : "Deep dive into the system"}</summary>
              <dl>
                <div><dt>{vi ? "Phụ thuộc vào" : "Depends on"}</dt><dd>{selected.dependsOn.length ? selected.dependsOn.map((id) => concepts.find((item) => item.id === id)?.term).join(" · ") : (vi ? "Nền tảng độc lập" : "Independent foundation")}</dd></div>
                <div><dt>{vi ? "Cấp năng lực cho" : "Enables"}</dt><dd>{downstream.length ? downstream.map((item) => item.term).join(" · ") : (vi ? "Lớp kiểm soát cuối" : "Final control layer")}</dd></div>
                <div><dt>{vi ? "Failure signal kỹ thuật" : "Technical failure signal"}</dt><dd>{vi ? selected.failureVi : selected.failureEn}</dd></div>
                <div><dt>{vi ? "Câu hỏi thiết kế" : "Design question"}</dt><dd>{vi ? selected.questionVi : selected.questionEn}</dd></div>
                <div><dt>{vi ? "Concept liên quan" : "Related concepts"}</dt><dd>{selectedGuide.relatedConcepts.map((id) => concepts.find((item) => item.id === id)?.term).filter(Boolean).join(" · ")}</dd></div>
              </dl>
            </details>

            <div className="concept-detail-actions">
              <button type="button" onClick={() => document.getElementById("failure-studio")?.scrollIntoView({ behavior: "smooth" })}>{vi ? "Thử một ví dụ" : "Try an example"}</button>
              <button type="button" onClick={() => selectConcept(selectedGuide.relatedConcepts[0])}>{vi ? "Xem concept liên quan" : "View a related concept"}</button>
            </div>
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
              {tunerQuestions.map((question) => {
                const value = controlValues[question.key];
                const setter = controlSetters[`set${question.key[0].toUpperCase()}${question.key.slice(1)}` as keyof typeof controlSetters];
                const options = vi ? question.optionsVi : question.optionsEn;
                return (
                  <fieldset className="tuner-question" key={question.key}>
                    <legend>{vi ? question.vi : question.en}</legend>
                    <div>
                      {options.map((option, index) => (
                        <button
                          type="button"
                          key={option}
                          aria-pressed={value === index}
                          onClick={() => setter(index)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                );
              })}
            </div>
            <article className="recommended-stack" aria-live="polite">
              <span className="mono">{vi ? "STACK ĐỀ XUẤT" : "RECOMMENDED STACK"}</span>
              <ol>{recommended.map((item, index) => <li key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><button type="button" onClick={() => { selectConcept(item.id); document.getElementById("system-atlas")?.scrollIntoView({ behavior: "smooth" }); }}><strong>{item.term}</strong><small>{stackReason(item.id)}</small></button></li>)}</ol>
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
            <div className="incident-framework">
              <section>
                <span>01</span>
                <h3>{vi ? "Điều gì đã xảy ra?" : "What happened?"}</h3>
                <p className="failure-prompt">{vi ? incident.vi : incident.en}</p>
              </section>
              <section>
                <span>02</span>
                <h3>{vi ? "Người dùng bị ảnh hưởng thế nào?" : "How is the user affected?"}</h3>
                <p>{vi ? incident.impactVi : incident.impactEn}</p>
              </section>
              <section>
                <span>03</span>
                <h3>{vi ? "Nguyên nhân có thể nằm ở đâu?" : "Where might the cause be?"}</h3>
                <ul>{(vi ? incident.causesVi : incident.causesEn).map((cause) => <li key={cause}>{cause}</li>)}</ul>
              </section>
            </div>
            <p className="incident-question">{vi ? "Bạn sẽ kiểm tra phần nào đầu tiên?" : "What would you inspect first?"}</p>
            <div className="incident-choices">
              {incident.candidates.map((id) => {
                const item = concepts.find((concept) => concept.id === id)!;
                return <button type="button" key={id} aria-pressed={incidentChoice === id} onClick={() => setIncidentChoice(id)}>{item.term}</button>;
              })}
            </div>
            {incidentChoice ? (
              <div className={incidentChoice === incident.answer ? "incident-result is-correct" : "incident-result is-review"} role="status">
                <strong>{incidentChoice === incident.answer ? (vi ? "Đúng control đầu tiên" : "Correct first control") : (vi ? "Chưa phải control đầu tiên" : "Not the first control")}</strong>
                <p>{incidentChoice === incident.answer ? (vi ? incident.mitigationVi : incident.mitigationEn) : (vi ? `Concept này có thể liên quan, nhưng chưa sở hữu failure đầu tiên. ${incident.mitigationVi}` : `This concept may be related but does not own the first failure. ${incident.mitigationEn}`)}</p>
              </div>
            ) : null}
          </article>
        </div>
      </section>

      <section className="concept-section mastery-passport page-shell-v2" id="mastery-passport">
        <header><p className="eyebrow-v2">MASTERY PASSPORT</p><h2>{vi ? `${mastered}/17 concept bạn có thể tự giải thích.` : `${mastered}/17 concepts you can explain.`}</h2></header>
        <div
          className="mastery-meter"
          role="progressbar"
          aria-label={vi ? "Tiến độ 17 concept" : "17-concept progress"}
          aria-valuemin={0}
          aria-valuemax={17}
          aria-valuenow={mastered}
        >
          <span style={{ width: `${(mastered / 17) * 100}%` }} />
        </div>
        <div className="revisit-queue">
          <h3>{vi ? "Bước học tiếp theo" : "Your next learning actions"}</h3>
          <ol>{revisit.map((item) => {
            const next = nextActionFor(item.id);
            return (
              <li key={item.id}>
                <button type="button" onClick={() => { selectConcept(item.id); document.getElementById("system-atlas")?.scrollIntoView({ behavior: "smooth" }); }}>
                  <span className="mono">{item.id}</span>
                  <strong>{item.term}</strong>
                  <small>{next.status} · {next.action}</small>
                </button>
              </li>
            );
          })}</ol>
        </div>
      </section>
    </div>
  );
}
