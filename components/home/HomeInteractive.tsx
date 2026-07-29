"use client";

import { useMemo, useState } from "react";

import { localizeProject, controlOwnerByProject, patternByProject } from "@/content/project-copy";
import { projects } from "@/lib/content";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";

export function HomeHero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="hero-v2">
      <div className="hero-grid-v2 hero-grid-field-guide">
        <div className="hero-copy-v2">
          <p className="eyebrow-v2">{dict.hero.eyebrow}</p>
          <h1>{dict.hero.title}</h1>
          <p className="lede-v2">{dict.hero.subtitle}</p>
          <div className="v2-primary-actions">
            <a className="primary-action-v2" href="#field-guide-title">
              {locale === "vi" ? "Đi theo sáu bước" : "Follow the six steps"}
            </a>
            <a className="secondary-action-v2" href={localizedPath(locale, "/projects")}>{dict.hero.ctaSecondary}</a>
          </div>
          <dl className="hero-stats-v2" aria-label={locale === "vi" ? "Quy mô hệ project" : "Project ecosystem scale"}>
            {dict.hero.stats.map(([value, label, detail]) => <div key={label}><dt>{value}</dt><dd><strong>{label}</strong><span>{detail}</span></dd></div>)}
          </dl>
        </div>
        <div className="hero-field-guide-mark" aria-hidden="true">
          <span>REQUEST</span>
          <strong>ACT</strong><strong>DELEGATE</strong><strong>COMPUTE</strong>
          <strong>COMPOSE</strong><strong>VERIFY</strong><strong>CONNECT</strong>
          <span>RESULT</span>
        </div>
      </div>
    </section>
  );
}

export function CapabilityLadderV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [selected, setSelected] = useState(0);
  const project = projects[selected];
  const copy = localizeProject(project, locale);

  const questions: Record<string, string> = {
    "trip-planner": locale === "vi" ? "Agent có thể nhớ thông tin bạn đã cung cấp không?" : "Can an agent remember the information you provided?",
    "script-team": locale === "vi" ? "Nhiều vai trò có thể cùng hoàn thiện một nội dung không?" : "Can multiple roles collaborate to complete a piece of content?",
    "worldcup-analyst": locale === "vi" ? "Làm sao tách tìm dữ kiện khỏi tính toán?" : "How do you separate fact-finding from calculation?",
    "love-advisor": locale === "vi" ? "Hai hướng phân tích có thể chạy cùng lúc không?" : "Can two analysis directions run at the same time?",
    "dashboard-insights": locale === "vi" ? "Làm sao kiểm tra kết luận trước khi dùng?" : "How do you verify a conclusion before using it?",
    "a2a-orchestrator": locale === "vi" ? "Nhiều agent chạy riêng có thể tìm và gọi nhau không?" : "Can independent agents discover and call each other?",
  };

  return (
    <section className="capability-v2 page-shell-v2" aria-labelledby="capability-v2-title">
      <header className="section-head-v2">
        <p className="eyebrow-v2">{dict.home.ladderEyebrow}</p>
        <h2 id="capability-v2-title">{dict.home.ladderTitle}</h2>
        <p>{dict.home.ladderBody}</p>
      </header>
      <div className="capability-workbench">
        <ol className="capability-checkpoints" aria-label={dict.home.ladderTitle}>
          {projects.map((item, index) => {
            const localized = localizeProject(item, locale);
            return (
              <li key={item.slug}>
                <button type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
                  <span className="capability-number mono">{String(item.index).padStart(2, "0")}</span>
                  <span className="capability-code mono">{item.verb}</span>
                  <span><strong>{localized.title}</strong><small>{questions[item.slug]}</small></span>
                </button>
              </li>
            );
          })}
        </ol>
        <article className={`capability-inspector project-${project.slug}`} aria-live="polite">
          <header><span className="mono">{project.verb} · {String(project.index).padStart(2, "0")}</span><h3>{copy.title}</h3><p className="capability-question">{questions[project.slug]}</p><p>{copy.thesis}</p></header>
          <dl>
            <div><dt>{dict.home.layer}</dt><dd>{copy.lesson}</dd></div>
            <div><dt>{dict.home.owner}</dt><dd>{controlOwnerByProject[project.slug]}</dd></div>
            <div><dt>{dict.home.artifact}</dt><dd>{copy.artifact}</dd></div>
          </dl>
          <div className="capability-mini-panel" aria-label={`${copy.title} architecture`}>
            <span>input</span><i aria-hidden="true">→</i><strong>{patternByProject[project.slug]}</strong><i aria-hidden="true">→</i><span>artifact</span>
          </div>
          <a href={localizedPath(locale, `/projects/${project.slug}`)}>{locale === "vi" ? "Xem case study →" : "View case study →"}</a>
        </article>
      </div>
    </section>
  );
}

export function ArtifactGallery({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [filter, setFilter] = useState("all");
  const [openSlug, setOpenSlug] = useState(projects[0].slug);
  const [copied, setCopied] = useState(false);
  const shown = filter === "all" ? projects : projects.filter((project) => patternByProject[project.slug].toLowerCase().includes(filter));
  const active = projects.find((project) => project.slug === openSlug) ?? projects[0];
  const activeCopy = localizeProject(active, locale);
  const sample = JSON.stringify({ project: active.slug, artifactType: activeCopy.artifact, status: "architecture-derived sample" }, null, 2);
  async function copySample() {
    try { await navigator.clipboard.writeText(sample); setCopied(true); window.setTimeout(() => setCopied(false), 2500); } catch { setCopied(false); }
  }
  return (
    <section className="artifact-gallery-v2 page-shell-v2" aria-labelledby="artifact-gallery-title">
      <header className="section-head-v2"><p className="eyebrow-v2">ARTIFACTS</p><h2 id="artifact-gallery-title">{dict.home.artifacts}</h2><p>{locale === "vi" ? "Các artifact là mẫu suy ra từ kiến trúc, không phải output model trực tiếp." : "Artifacts are architecture-derived samples, not live model output."}</p></header>
      <div className="artifact-filters" role="group" aria-label={dict.projects.filters}>
        {["all", "tool", "workflow", "a2a"].map((item) => <button type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} key={item}>{item.toUpperCase()}</button>)}
      </div>
      <div className="artifact-gallery-grid">
        <ol>{shown.map((project) => { const copy = localizeProject(project, locale); return <li key={project.slug}><button type="button" aria-pressed={openSlug === project.slug} onClick={() => setOpenSlug(project.slug)}><span className="mono">{String(project.index).padStart(2, "0")}</span><strong>{project.title}</strong><small>{copy.artifact}</small></button></li>; })}</ol>
        <article className={`artifact-preview project-${active.slug}`}><span className="mono">{dict.caseStudy.sample} · {active.verb}</span><h3>{activeCopy.artifact}</h3><pre tabIndex={0}><code>{sample}</code></pre><div><button type="button" onClick={copySample}>{copied ? dict.common.copied : (locale === "vi" ? "Sao chép JSON" : "Copy JSON")}</button><a href={localizedPath(locale, `/projects/${active.slug}`)}>{dict.common.openProject}</a></div></article>
      </div>
    </section>
  );
}

export function PatternComparator({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [left, setLeft] = useState(projects[1].slug);
  const [right, setRight] = useState(projects[2].slug);
  const leftProject = projects.find((item) => item.slug === left)!;
  const rightProject = projects.find((item) => item.slug === right)!;
  const rows = [
    [locale === "vi" ? "Điều khiển" : "Control", controlOwnerByProject],
    [locale === "vi" ? "Giao tiếp" : "Communication", Object.fromEntries(projects.map((project) => [project.slug, patternByProject[project.slug]]))],
    [locale === "vi" ? "Tuần tự" : "Sequencing", Object.fromEntries(projects.map((project) => [project.slug, localizeProject(project, locale).primaryTimeline.slice(0, 3).join(" → ")]))],
    [locale === "vi" ? "State" : "State", Object.fromEntries(projects.map((project) => [project.slug, project.slug === "trip-planner" ? "session state" : project.slug === "script-team" ? "output keys" : project.slug === "dashboard-insights" ? "report + archive" : "bounded output"]))],
    [locale === "vi" ? "Rủi ro" : "Risk", Object.fromEntries(projects.map((project) => [project.slug, localizeProject(project, locale).limitations[0]]))]
  ] as const;
  return (
    <section className="pattern-comparator page-shell-v2" aria-labelledby="pattern-comparator-title">
      <header className="section-head-v2"><p className="eyebrow-v2">CONTROL MODELS</p><h2 id="pattern-comparator-title">{dict.home.comparator}</h2></header>
      <div className="comparator-selects">
        <label><span>A</span><select name="pattern-left" value={left} onChange={(event) => setLeft(event.target.value)}>{projects.map((project) => <option value={project.slug} disabled={project.slug === right} key={project.slug}>{project.title}</option>)}</select></label>
        <label><span>B</span><select name="pattern-right" value={right} onChange={(event) => setRight(event.target.value)}>{projects.map((project) => <option value={project.slug} disabled={project.slug === left} key={project.slug}>{project.title}</option>)}</select></label>
      </div>
      <div className="comparator-table" role="table" aria-label={dict.home.comparator} tabIndex={0}>
        <div role="row" className="comparator-head"><span role="columnheader">{dict.projects.pattern}</span><strong role="columnheader">{leftProject.title}</strong><strong role="columnheader">{rightProject.title}</strong></div>
        {rows.map(([label, values]) => <div role="row" key={label}><strong role="rowheader">{label}</strong><span role="cell">{values[left]}</span><span role="cell">{values[right]}</span></div>)}
      </div>
    </section>
  );
}
