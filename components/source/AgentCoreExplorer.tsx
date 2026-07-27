"use client";

import { useEffect, useMemo, useState } from "react";

import { localizeProject } from "@/content/project-copy";
import { projects } from "@/lib/content";
import { type Locale } from "@/lib/i18n";
import { getProjectReplays, getRootAgent } from "@/lib/replays";

const labels = {
  vi: {
    eyebrow: "AGENT CORE & ARTIFACT EXPLORER",
    title: "Từ root agent thật đến artifact có thể kiểm tra.",
    intro: "Chọn project để đọc nguyên bản assignment root_agent, cấu trúc được parse và output của một replay đã ghi nhận.",
    exact: "Mã nguồn nguyên bản",
    full: "Toàn bộ",
    condensed: "Khung xem gọn",
    copy: "Sao chép mã",
    copied: "Đã sao chép",
    copyLink: "Sao chép liên kết source",
    structure: "Cấu trúc agent",
    artifact: "Artifact từ replay",
    case: "Ca phát lại",
    metadata: "Metadata nguồn",
    noSource: "Không có source project Love Advisor trong phạm vi đường dẫn được cung cấp. Các ca bên dưới được ghi nhãn Browser Simulation.",
    noStructure: "Không có field cấu trúc nào được xác minh từ source trong phạm vi đã cung cấp.",
    noCommit: "Không có Git metadata trong source được cung cấp; commit không được hiển thị.",
    staticFallback: "Khi JavaScript không khả dụng, source và artifact vẫn xuất hiện trong nội dung HTML của từng case study.",
  },
  en: {
    eyebrow: "AGENT CORE & ARTIFACT EXPLORER",
    title: "From the real root agent to an inspectable artifact.",
    intro: "Choose a project to inspect the exact root_agent assignment, parsed structure, and recorded output from one replay.",
    exact: "Exact source",
    full: "Full view",
    condensed: "Condensed viewport",
    copy: "Copy code",
    copied: "Copied",
    copyLink: "Copy source deep link",
    structure: "Agent structure",
    artifact: "Replay artifact",
    case: "Replay case",
    metadata: "Source metadata",
    noSource: "No Love Advisor project source was included in the supplied paths. Its cases below are labeled Browser Simulation.",
    noStructure: "No structure field was verified from source in the supplied scope.",
    noCommit: "The supplied source has no Git metadata, so no commit is displayed.",
    staticFallback: "Without JavaScript, source and artifact context remain available in each case study’s HTML content.",
  },
} as const;

function JsonPreview({ value }: { value: unknown }) {
  return <pre tabIndex={0}><code>{JSON.stringify(value, null, 2)}</code></pre>;
}

export function AgentCoreExplorer({
  locale,
  initialProject = "trip-planner",
  compact = false,
}: {
  locale: Locale;
  initialProject?: string;
  compact?: boolean;
}) {
  const text = labels[locale];
  const initial = Math.max(0, projects.findIndex((project) => project.slug === initialProject));
  const [projectIndex, setProjectIndex] = useState(initial);
  const [caseIndex, setCaseIndex] = useState(0);
  const [view, setView] = useState<"full" | "condensed">("condensed");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const project = projects[projectIndex];
  const projectCopy = localizeProject(project, locale);
  const evidence = getRootAgent(project.slug);
  const cases = useMemo(() => getProjectReplays(project.slug), [project.slug]);
  const replay = cases[Math.min(caseIndex, Math.max(0, cases.length - 1))];
  const structureEntries = evidence
    ? Object.entries(evidence.structure).filter(([, value]) => value !== undefined && (!Array.isArray(value) || value.length))
    : [];

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("source");
    const requestedIndex = projects.findIndex((item) => item.slug === requested);
    if (requestedIndex >= 0) {
      setProjectIndex(requestedIndex);
      setCaseIndex(0);
    }
  }, []);

  function selectProject(index: number) {
    setProjectIndex(index);
    setCaseIndex(0);
    setCopied(false);
  }

  function copySource() {
    if (!evidence) return;
    navigator.clipboard?.writeText(evidence.source).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  function copySourceLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("source", project.slug);
    url.hash = "agent-core";
    navigator.clipboard?.writeText(url.toString()).then(() => {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1600);
    });
  }

  return (
    <section className={`agent-core-explorer ${compact ? "agent-core-compact" : ""}`} id="agent-core" aria-labelledby="agent-core-title">
      {!compact ? (
        <header className="section-head-v2">
          <p className="eyebrow-v2">{text.eyebrow}</p>
          <h2 id="agent-core-title">{text.title}</h2>
          <p>{text.intro}</p>
        </header>
      ) : <h3 id="agent-core-title">{text.exact}</h3>}

      <div className="agent-core-layout">
        <nav className="agent-project-list" aria-label={locale === "vi" ? "Chọn project agent" : "Choose an agent project"}>
          {projects.map((item, index) => (
            <button
              type="button"
              key={item.slug}
              onClick={() => selectProject(index)}
              aria-pressed={index === projectIndex}
              className={`project-${item.slug}`}
            >
              <span className="mono">{String(item.index).padStart(2, "0")} · {item.verb}</span>
              <strong>{localizeProject(item, locale).title}</strong>
              <small>{getRootAgent(item.slug) ? "root_agent located" : "browser simulation"}</small>
            </button>
          ))}
        </nav>

        <div className="agent-core-workbench project-${project.slug}">
          <header>
            <div><span className="mono">{project.verb}</span><h3>{projectCopy.title}</h3></div>
            {evidence ? (
              <div className="source-view-controls" role="group" aria-label={locale === "vi" ? "Chế độ xem mã" : "Code view"}>
                <button type="button" aria-pressed={view === "condensed"} onClick={() => setView("condensed")}>{text.condensed}</button>
                <button type="button" aria-pressed={view === "full"} onClick={() => setView("full")}>{text.full}</button>
                <button type="button" onClick={copySource}>{copied ? text.copied : text.copy}</button>
                <button type="button" onClick={copySourceLink}>{linkCopied ? text.copied : text.copyLink}</button>
              </div>
            ) : null}
          </header>

          {evidence ? (
            <div className="agent-source-panel">
              <div className="source-meta-line mono">
                <span>{evidence.path}</span>
                <span>L{evidence.startLine}–L{evidence.endLine}</span>
              </div>
              <pre className={view === "condensed" ? "is-condensed" : ""} tabIndex={0} aria-label={`${text.exact}: ${evidence.path}`}>
                <code>{evidence.source.split("\n").map((line, index) => (
                  <span className="source-line" key={`${evidence.startLine + index}-${line}`}>
                    <span aria-hidden="true">{evidence.startLine + index}</span>
                    <span>{line || " "}</span>
                  </span>
                ))}</code>
              </pre>
              <p className="source-view-note">{view === "condensed" ? text.condensed : text.full} · {locale === "vi" ? "Nội dung mã không bị viết lại." : "Source text is not rewritten."}</p>
            </div>
          ) : (
            <div className="agent-source-empty" role="status">
              <strong>{projectCopy.title}</strong>
              <p>{text.noSource}</p>
            </div>
          )}

          <div className="agent-structure-artifact">
            <article>
              <h4>{text.structure}</h4>
              {structureEntries.length ? (
                <dl className="agent-structure-grid">
                  {structureEntries.map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{typeof value === "string" ? value : JSON.stringify(value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : <p>{text.noStructure}</p>}
            </article>

            <article>
              <h4>{text.artifact}</h4>
              {cases.length ? (
                <>
                  <label className="artifact-case-select">
                    <span>{text.case}</span>
                    <select name={`${project.slug}-artifact-case`} value={caseIndex} onChange={(event) => setCaseIndex(Number(event.target.value))}>
                      {cases.map((item, index) => <option value={index} key={item.caseId}>{item.caseId} · {item.title}</option>)}
                    </select>
                  </label>
                  <span className={`replay-mode mode-${replay.mode}`}>{replay.mode.replaceAll("-", " ")}</span>
                  <JsonPreview value={replay.output} />
                </>
              ) : <p>{text.noSource}</p>}
            </article>
          </div>

          {evidence ? (
            <footer className="agent-source-metadata">
              <strong>{text.metadata}</strong>
              <span><code>sha256:{evidence.sha256}</code></span>
              {evidence.tests.map((test) => <span key={test}><code>{test}</code></span>)}
              {!evidence.sourceCommit ? <span>{text.noCommit}</span> : <span><code>{evidence.sourceCommit}</code></span>}
            </footer>
          ) : null}
          <p className="sr-only">{text.staticFallback}</p>
        </div>
      </div>
    </section>
  );
}
