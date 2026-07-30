"use client";

import { useMemo, useState } from "react";

import { localizeProject, patternByProject } from "@/content/project-copy";
import { filterPatterns, getProjectFilters, projects } from "@/lib/content";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";

const humanJobs = [
  { id: "memory", vi: "Nhớ thông tin", en: "Remember information", projects: ["trip-planner"] },
  { id: "writing", vi: "Viết và phản biện", en: "Write and review", projects: ["script-team"] },
  { id: "sources", vi: "Tìm và kiểm nguồn", en: "Find and check sources", projects: ["worldcup-analyst", "dashboard-insights"] },
  { id: "calculation", vi: "Tính toán chính xác", en: "Calculate precisely", projects: ["worldcup-analyst", "dashboard-insights"] },
  { id: "parallel", vi: "Chạy việc song song", en: "Run work in parallel", projects: ["love-advisor"] },
  { id: "qa", vi: "Kiểm tra dữ liệu", en: "Verify data", projects: ["dashboard-insights"] },
  { id: "routing", vi: "Điều phối agent", en: "Route between agents", projects: ["a2a-orchestrator", "script-team"] }
] as const;

const situations: Record<string, { vi: string; en: string }> = {
  "trip-planner": {
    vi: "Bạn đang lên lịch trình nhiều ngày và bổ sung ràng buộc qua nhiều lượt.",
    en: "You are planning a multi-day trip and adding constraints over several turns."
  },
  "script-team": {
    vi: "Một brief cần đi qua người viết, người phản biện và người sửa.",
    en: "A brief needs to move through a writer, critic and reviser."
  },
  "worldcup-analyst": {
    vi: "Một câu hỏi thể thao cần cả dữ kiện đã chốt và phép tính lặp lại được.",
    en: "A sports question needs both fixed facts and reproducible calculation."
  },
  "love-advisor": {
    vi: "Hai góc nhìn độc lập cần được xử lý đồng thời rồi tổng hợp có giới hạn.",
    en: "Two independent perspectives need to run together and then be bounded in synthesis."
  },
  "dashboard-insights": {
    vi: "Một file kinh doanh cần tạo insight nhưng mọi kết luận phải truy ngược được.",
    en: "A business file needs insights, but every conclusion must remain traceable."
  },
  "a2a-orchestrator": {
    vi: "Nhiều agent triển khai riêng cần tìm đúng năng lực và gọi nhau qua mạng.",
    en: "Separately deployed agents need to discover the right capability and call across a network."
  }
};

export function ProjectsBrowserV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [job, setJob] = useState("");
  const [technical, setTechnical] = useState<string[]>([]);

  const shown = useMemo(() => projects.filter((project) => {
    const copy = localizeProject(project, locale);
    const haystack = `${copy.title} ${copy.problem} ${copy.thesis} ${copy.lesson} ${copy.artifact} ${getProjectFilters(project.slug).join(" ")}`.toLowerCase();
    const jobMatch = !job || humanJobs.find((item) => item.id === job)?.projects.includes(project.slug as never);
    const technicalMatch = technical.every((pattern) => getProjectFilters(project.slug).includes(pattern as never));
    return haystack.includes(query.toLowerCase()) && jobMatch && technicalMatch;
  }), [job, locale, query, technical]);

  const toggleTechnical = (pattern: string) => {
    setTechnical((current) => current.includes(pattern) ? current.filter((item) => item !== pattern) : [...current, pattern]);
  };
  const clear = () => {
    setQuery("");
    setJob("");
    setTechnical([]);
  };

  return (
    <div className="projects-browser-v2">
      <div className="problem-starters" aria-label={locale === "vi" ? "Chọn vấn đề cần giải quyết" : "Choose a problem to solve"}>
        <span className="mono">{locale === "vi" ? "BẠN ĐANG CẦN GÌ?" : "WHAT DO YOU NEED?"}</span>
        {humanJobs.map((item) => (
          <button
            type="button"
            aria-pressed={job === item.id}
            onClick={() => setJob((current) => current === item.id ? "" : item.id)}
            key={item.id}
          >
            {locale === "vi" ? item.vi : item.en}
          </button>
        ))}
      </div>

      <div className="project-controls-v2">
        <label>
          <span>{dict.projects.search}</span>
          <input name="project-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <details className="advanced-project-filters">
          <summary>{locale === "vi" ? "Bộ lọc kỹ thuật nâng cao" : "Advanced technical filters"}</summary>
          <fieldset>
            <legend className="sr-only">{dict.projects.filters}</legend>
            <div>{filterPatterns.map((pattern) => <button type="button" aria-pressed={technical.includes(pattern)} onClick={() => toggleTechnical(pattern)} key={pattern}>{pattern}</button>)}</div>
          </fieldset>
        </details>
        <button className="project-clear-filter" type="button" disabled={!query && !job && !technical.length} onClick={clear}>{dict.projects.clear}</button>
      </div>

      <p className="project-result-count mono" aria-live="polite">{shown.length} / {projects.length} {locale === "vi" ? "project phù hợp" : "matching projects"}</p>

      {!shown.length ? (
        <div className="filter-empty-v2"><p>{dict.projects.empty}</p><button type="button" onClick={clear}>{dict.projects.clear}</button></div>
      ) : (
        <ol className="project-ladder-v2 project-problem-ledger">
          {shown.map((project) => {
            const copy = localizeProject(project, locale);
            return (
              <li className={`project-${project.slug}`} key={project.slug}>
                <a href={localizedPath(locale, `/projects/${project.slug}`)}>
                  <span className="project-number-v2 mono">{String(project.index).padStart(2, "0")}</span>
                  <span className="project-ledger-title">
                    <small className="mono">{project.verb} · {patternByProject[project.slug]}</small>
                    <strong>{copy.title}</strong>
                  </span>
                  <dl className="project-flow">
                    <div className="project-flow-step"><dt>{locale === "vi" ? "Tình huống" : "Situation"}</dt><dd>{situations[project.slug][locale]}</dd></div>
                    <div className="project-flow-step"><dt>{locale === "vi" ? "Vấn đề" : "Problem"}</dt><dd>{copy.problem}</dd></div>
                    <div className="project-flow-step"><dt>{locale === "vi" ? "Agent hỗ trợ" : "Agent helps"}</dt><dd>{copy.thesis}</dd></div>
                    <div className="project-flow-step"><dt>{locale === "vi" ? "Đầu ra" : "Output"}</dt><dd>{copy.artifact}</dd></div>
                    <div className="project-flow-step"><dt>{locale === "vi" ? "Năng lực mới" : "New capability"}</dt><dd>{copy.whatItProves}</dd></div>
                  </dl>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
