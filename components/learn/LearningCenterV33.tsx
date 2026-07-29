"use client";

import { useMemo, useState } from "react";

import compareItems from "@/content/learning-v33/compare-lab.vi.json";
import checklistItems from "@/content/learning-v33/design-checklist.vi.json";
import dictionaryItems from "@/content/learning-v33/knowledge-dictionary.vi.json";
import moduleItems from "@/content/learning-v33/modules.vi.json";
import selectorItems from "@/content/learning-v33/technique-selector.vi.json";
import workflowItems from "@/content/learning-v33/workflow-labs.vi.json";
import projectLibraries from "@/content/project-track-v33/project-learning-library.vi.json";
import { SystemConceptsTrack } from "@/components/learn/SystemConceptsTrack";
import { localizeProject } from "@/content/project-copy";
import { projects } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";

type LearningMode = "landing" | "practical" | "projects" | "systems";
type ChecklistStatus = "missing" | "review" | "present";

const moduleEnglish = [
  ["Choose an AI problem", "Which tasks are worth using AI for, and what output is actually needed?"],
  ["Work effectively with LLMs", "How do you define context, output structure and review criteria?"],
  ["RAG and knowledge systems", "When should a system retrieve private or changing documents?"],
  ["Tool calling, APIs and MCP", "How does AI use real data and tools within clear boundaries?"],
  ["Agents, workflows and orchestration", "When is a workflow enough, and when does an agent help?"],
  ["Evaluation and observability", "How do you know whether the system is improving?"],
  ["Safety, permissions and control", "Which data and actions need stronger boundaries?"],
  ["Deployment and cost", "Can the system run reliably at an acceptable latency and cost?"],
  ["Multimodal work", "Should the task use OCR, Document AI or a vision-language model?"],
] as const;

function LearningCover({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  return (
    <header className="learning-v33-cover page-shell-v2">
      <p className="eyebrow-v2">LEARNING CENTER · THREE TRACKS</p>
      <h1>{vi ? "Học từ việc cần làm, rồi đi sâu vào hệ thống." : "Start with the job, then go deeper into the system."}</h1>
      <p>{vi ? "Chọn một track. Bạn có thể đổi hướng bất cứ lúc nào." : "Choose a track. You can switch paths at any time."}</p>
    </header>
  );
}

function LearningLanding({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  return (
    <div className="v2-page learning-v33">
      <LearningCover locale={locale} />
      <section className="learning-gates page-shell-v2" aria-label={vi ? "Ba track học" : "Three learning tracks"}>
        <article className="learning-gate learning-gate-practical">
          <span className="mono">TRACK A</span>
          <h2>{vi ? "AI thực chiến cho công việc" : "Practical AI for work"}</h2>
          <p>{vi ? "Bắt đầu từ một tình huống công việc, chọn kỹ thuật rồi kiểm tra thiết kế." : "Start from a work situation, choose a technique and review the design."}</p>
          <ul>
            <li>{vi ? "Decision Wizard" : "Decision Wizard"}</li>
            <li>{vi ? "9 module · từ điển 114 mục" : "9 modules · 114-item dictionary"}</li>
            <li>{vi ? "8 Workflow Labs · checklist · compare" : "8 Workflow Labs · checklist · compare"}</li>
          </ul>
          <a className="primary-action-v2" href={localizedPath(locale, "/learn/ai-practical")}>{vi ? "Chọn kỹ thuật" : "Choose a technique"} →</a>
        </article>
        <article className="learning-gate learning-gate-projects">
          <span className="mono">TRACK B</span>
          <h2>{vi ? "Khám phá sáu project" : "Explore the six projects"}</h2>
          <p>{vi ? "Học trực tiếp từ architecture, simulator, output, source và failure case." : "Learn directly from architecture, simulator, output, source and failure cases."}</p>
          <ul>
            <li>{vi ? "Project dictionary" : "Project dictionary"}</li>
            <li>{vi ? "Source Tour · Debug Lab" : "Source Tour · Debug Lab"}</li>
            <li>{vi ? "Matching · reasoning · interview" : "Matching · reasoning · interview"}</li>
          </ul>
          <a className="primary-action-v2" href={localizedPath(locale, "/learn/projects")}>{vi ? "Chọn project" : "Choose a project"} →</a>
        </article>
        <article className="learning-gate learning-gate-systems">
          <span className="mono">TRACK C</span>
          <h2>{vi ? "17 concept của hệ thống AI" : "17 AI system concepts"}</h2>
          <p>{vi ? "Nối concept thành dependency map, điều chỉnh kiến trúc theo ràng buộc và xử lý failure signal." : "Connect concepts through dependencies, tune an architecture by constraints and diagnose failure signals."}</p>
          <ul>
            <li>System Atlas · 5 layers</li>
            <li>Architecture Tuner</li>
            <li>Failure Studio · Mastery Passport</li>
          </ul>
          <a className="primary-action-v2" href={localizedPath(locale, "/learn/system-concepts")}>{vi ? "Mở System Concepts Lab" : "Open System Concepts Lab"} →</a>
        </article>
      </section>
    </div>
  );
}

function PracticalTrack({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  const [situation, setSituation] = useState(0);
  const [query, setQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [workflow, setWorkflow] = useState(0);
  const [showFailures, setShowFailures] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, ChecklistStatus>>({});
  const groups = Array.from(new Set(compareItems.map((item) => item.group)));
  const [compareGroup, setCompareGroup] = useState(groups[0]);
  const pageSize = 12;

  const filteredDictionary = useMemo(() => dictionaryItems.filter((item) => {
    const text = `${item.term} ${item.vietnameseMeaning} ${item.keywords.join(" ")}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (moduleFilter === "all" || item.module === moduleFilter);
  }), [moduleFilter, query]);
  const pageCount = Math.max(1, Math.ceil(filteredDictionary.length / pageSize));
  const shownDictionary = filteredDictionary.slice(page * pageSize, page * pageSize + pageSize);
  const selectedTechnique = selectorItems[situation];
  const selectedWorkflow = workflowItems[workflow];
  const compared = compareItems.filter((item) => item.group === compareGroup);

  const setFilter = (value: string) => {
    setModuleFilter(value);
    setPage(0);
  };

  return (
    <div className="v2-page learning-v33 practical-track">
      <LearningCover locale={locale} />
      <nav className="learning-track-nav page-shell-v2" aria-label={vi ? "Điều hướng track" : "Track navigation"}>
        <a href={localizedPath(locale, "/learn")}>← {vi ? "Ba track" : "Three tracks"}</a>
        <a href="#decision-wizard">{vi ? "Chọn kỹ thuật" : "Decision Wizard"}</a>
        <a href="#dictionary">{vi ? "Từ điển" : "Dictionary"}</a>
        <a href="#workflows">Workflow Labs</a>
        <a href="#checklist">Checklist</a>
        <a href="#compare">Compare Lab</a>
      </nav>

      <section className="learning-tool-section page-shell-v2" id="decision-wizard">
        <header><p className="eyebrow-v2">DECISION WIZARD</p><h2>{vi ? "Bạn đang cần AI làm việc gì?" : "What job should AI help with?"}</h2></header>
        <div className="decision-wizard">
          <label>
            <span>{vi ? "Tình huống" : "Situation"}</span>
            <select value={situation} onChange={(event) => setSituation(Number(event.target.value))}>
              {selectorItems.map((item, index) => <option value={index} key={item.id}>{vi ? item.situation : `Situation ${index + 1}`}</option>)}
            </select>
          </label>
          <article>
            <span className="mono">{selectedTechnique.id}</span>
            <h3>{selectedTechnique.recommendedApproach}</h3>
            <p>{vi ? selectedTechnique.keyDesignPoint : "Use the smallest controllable approach that fits the task, data boundary and review needs."}</p>
            <ul>{selectedTechnique.conceptsToRead.map((concept) => <li key={concept}>{concept}</li>)}</ul>
          </article>
        </div>
      </section>

      <section className="learning-tool-section page-shell-v2">
        <header><p className="eyebrow-v2">9 MODULES</p><h2>{vi ? "Học theo câu hỏi dẫn đường" : "Learn through guiding questions"}</h2></header>
        <ol className="module-ledger">
          {moduleItems.map((item, index) => (
            <li key={item.order}>
              <span className="mono">{String(item.order).padStart(2, "0")}</span>
              <div>
                <h3>{vi ? item.title : moduleEnglish[index][0]}</h3>
                <p>{vi ? item.guidingQuestion : moduleEnglish[index][1]}</p>
              </div>
              <small>{item.estimatedTime}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="learning-tool-section page-shell-v2" id="dictionary">
        <header><p className="eyebrow-v2">KNOWLEDGE DICTIONARY · 114</p><h2>{vi ? "Tra khái niệm khi cần" : "Look up a concept when you need it"}</h2></header>
        <div className="dictionary-toolbar">
          <label><span>{vi ? "Tìm" : "Search"}</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} /></label>
          <label><span>Module</span><select value={moduleFilter} onChange={(event) => setFilter(event.target.value)}><option value="all">{vi ? "Tất cả" : "All"}</option>{moduleItems.map((item) => <option value={item.title} key={item.order}>{item.order}</option>)}</select></label>
        </div>
        <p className="dictionary-count mono">{filteredDictionary.length} / 114</p>
        <div className="dictionary-list">
          {shownDictionary.map((item) => (
            <details key={item.id}>
              <summary><span className="mono">{item.id}</span><strong>{item.term}</strong><small>{vi ? item.priority : `Module ${item.module.slice(0, 1)}`}</small></summary>
              <div>
                <p>{vi ? item.explanation : `Use ${item.term} when it matches the task, data boundary and control requirements described in this module.`}</p>
                <dl>
                  <div><dt>{vi ? "Dùng khi" : "Use when"}</dt><dd>{vi ? item.useWhen : item.keywords.join(" · ")}</dd></div>
                  <div><dt>{vi ? "Câu hỏi thiết kế" : "Design check"}</dt><dd>{vi ? item.designQuestion : "What can fail, what evidence is available, and where is human review needed?"}</dd></div>
                </dl>
              </div>
            </details>
          ))}
        </div>
        <div className="pagination">
          <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0}>{vi ? "Trang trước" : "Previous"}</button>
          <span className="mono">{page + 1} / {pageCount}</span>
          <button type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page >= pageCount - 1}>{vi ? "Trang sau" : "Next"}</button>
        </div>
      </section>

      <section className="learning-tool-section page-shell-v2" id="workflows">
        <header><p className="eyebrow-v2">8 WORKFLOW LABS</p><h2>{vi ? "Theo dõi flow và bật failure case" : "Inspect the flow and reveal failure cases"}</h2></header>
        <div className="workflow-lab">
          <div className="workflow-tabs" role="tablist">
            {workflowItems.map((item, index) => <button type="button" role="tab" aria-selected={workflow === index} onClick={() => { setWorkflow(index); setShowFailures(false); }} key={item.id}>{item.id}</button>)}
          </div>
          <article>
            <span className="mono">{selectedWorkflow.id}</span>
            <h3>{vi ? selectedWorkflow.title : `Workflow ${workflow + 1}`}</h3>
            <p>{vi ? selectedWorkflow.goal : "A prepared work scenario for choosing techniques, boundaries and measurable checks."}</p>
            <ol className="workflow-flow">{selectedWorkflow.flow.map((step) => <li key={step}>{step}</li>)}</ol>
            <button type="button" aria-pressed={showFailures} onClick={() => setShowFailures((value) => !value)}>{showFailures ? (vi ? "Ẩn failure case" : "Hide failures") : (vi ? "Bật failure case" : "Reveal failures")}</button>
            {showFailures ? <ul className="workflow-failures">{selectedWorkflow.failureCases.map((item) => <li key={item}>{vi ? item : "A boundary, source or validation step fails and the workflow must stop or ask for review."}</li>)}</ul> : null}
            <dl><div><dt>Techniques</dt><dd>{selectedWorkflow.techniques.join(" · ")}</dd></div><div><dt>Metrics</dt><dd>{vi ? selectedWorkflow.metrics.join(" · ") : "Evidence coverage · validation quality · safe fallback rate"}</dd></div></dl>
          </article>
        </div>
      </section>

      <section className="learning-tool-section page-shell-v2" id="checklist">
        <header><p className="eyebrow-v2">CHECKLIST AUDITOR · 10</p><h2>{vi ? "Kiểm tra từng phần, không tạo điểm số giả" : "Review each area without a fake readiness score"}</h2></header>
        <div className="checklist-auditor">
          {checklistItems.map((item, index) => {
            const status = checklist[item.id] || "missing";
            return (
              <article key={item.id}>
                <div><span className="mono">{item.id}</span><h3>{vi ? item.category : `Design area ${index + 1}`}</h3><p>{vi ? item.mainQuestion : "Is this area explicit, testable and supported by evidence?"}</p></div>
                <div className="checklist-status" role="group" aria-label={vi ? item.category : `Design area ${index + 1}`}>
                  {(["missing", "review", "present"] as ChecklistStatus[]).map((value) => <button type="button" aria-pressed={status === value} onClick={() => setChecklist((current) => ({ ...current, [item.id]: value }))} key={value}>{value === "missing" ? (vi ? "Chưa có" : "Missing") : value === "review" ? (vi ? "Cần xem lại" : "Review") : (vi ? "Đã có" : "Present")}</button>)}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="learning-tool-section page-shell-v2" id="compare">
        <header><p className="eyebrow-v2">COMPARE LAB · 14 GROUPS</p><h2>{vi ? "Đặt hai khái niệm cạnh nhau" : "Put related concepts side by side"}</h2></header>
        <label className="compare-group-select"><span>{vi ? "Nhóm so sánh" : "Comparison group"}</span><select value={compareGroup} onChange={(event) => setCompareGroup(event.target.value)}>{groups.map((group, index) => <option value={group} key={group}>{vi ? group : `Group ${index + 1}`}</option>)}</select></label>
        <div className="compare-split">
          {compared.slice(0, 2).map((item) => <article key={item.id}><span className="mono">{item.id}</span><h3>{item.concept}</h3><p>{vi ? item.mainRole : "Inspect its role, best use and limits within this group."}</p><dl><div><dt>{vi ? "Dùng khi" : "Use when"}</dt><dd>{vi ? item.useWhen : "Use it when this concept matches the task and control boundary."}</dd></div><div><dt>{vi ? "Khác biệt chính" : "Key difference"}</dt><dd>{vi ? item.keyDifference : "Compare the control boundary and expected output."}</dd></div></dl></article>)}
        </div>
      </section>
    </div>
  );
}

function ProjectTrack({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  const [selected, setSelected] = useState(0);
  const library = projectLibraries[selected];
  const project = projects.find((item) => item.slug === library.slug)!;
  const copy = localizeProject(project, locale);

  return (
    <div className="v2-page learning-v33 project-track">
      <LearningCover locale={locale} />
      <nav className="learning-track-nav page-shell-v2"><a href={localizedPath(locale, "/learn")}>← {vi ? "Ba track" : "Three tracks"}</a></nav>
      <section className="project-library page-shell-v2">
        <div className="project-library-tabs" role="tablist" aria-label={vi ? "Chọn project" : "Choose a project"}>
          {projectLibraries.map((item, index) => <button type="button" role="tab" aria-selected={selected === index} onClick={() => setSelected(index)} key={item.slug}><span className="mono">{item.architectureStep}</span>{item.project}</button>)}
        </div>
        <article className={`project-library-sheet project-${project.slug}`}>
          <header><p className="eyebrow-v2">{library.architectureStep} · PROJECT LIBRARY</p><h1>{copy.title}</h1><p>{vi ? library.beginnerQuestion : copy.whatItProves}</p></header>
          <section>
            <h2>{vi ? "Project giải quyết vấn đề gì?" : "What problem does it solve?"}</h2>
            <p>{copy.problem}</p>
          </section>
          <section>
            <h2>{vi ? "Architecture map" : "Architecture map"}</h2>
            <ol className="project-architecture-map">{copy.primaryTimeline.slice(0, 7).map((step, index) => <li key={step}><span className="mono">{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>
          </section>
          <section className="project-topic-grid">
            <div><h2>{vi ? "Project dictionary" : "Project dictionary"}</h2><ul>{library.dictionaryTopics.map((topic) => <li key={topic}>{topic}</li>)}</ul></div>
            <div><h2>{vi ? "Role / tool / state" : "Role / tool / state"}</h2><p>{copy.lesson}</p><p>{copy.artifact}</p></div>
          </section>
          <section>
            <h2>Source Tour</h2>
            <p>{vi ? "Đi từ câu hỏi người dùng đến simulator, sau đó mở exact source trong chi tiết kỹ thuật." : "Move from the user question to the simulator, then open exact source inside technical details."}</p>
            <div className="project-library-actions">
              <a className="primary-action-v2" href={`${localizedPath(locale, `/projects/${project.slug}`)}#${project.slug}-simulator`}>{vi ? "Mở simulator" : "Open simulator"}</a>
              <a className="secondary-action-v2" href={localizedPath(locale, `/projects/${project.slug}`)}>{vi ? "Mở source tour" : "Open source tour"}</a>
            </div>
          </section>
          <section className="debug-interview-grid">
            <article><h2>Debug Challenge</h2><p>{copy.limitations[0]}</p><details><summary>{vi ? "Xem hướng xử lý" : "Reveal a response"}</summary><p>{copy.roadmap[0]}</p></details></article>
            <article><h2>Interview Mode</h2><ol><li>{vi ? `Vì sao ${copy.lesson} phù hợp với bài toán này?` : `Why is ${copy.lesson} appropriate here?`}</li><li>{vi ? "Failure nào cần dừng workflow?" : "Which failure should stop the workflow?"}</li><li>{vi ? "Output nào chứng minh hệ thống đã làm đúng?" : "Which output proves the system did the job?"}</li></ol></article>
          </section>
        </article>
      </section>
    </div>
  );
}

export function LearningCenterV33({ locale, mode = "landing" }: { locale: Locale; mode?: LearningMode }) {
  if (mode === "practical") return <PracticalTrack locale={locale} />;
  if (mode === "projects") return <ProjectTrack locale={locale} />;
  if (mode === "systems") return <SystemConceptsTrack locale={locale} />;
  return <LearningLanding locale={locale} />;
}
