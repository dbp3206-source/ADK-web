"use client";

import { useEffect, useMemo, useState } from "react";

import { localizeProject, controlOwnerByProject, patternByProject } from "@/content/project-copy";
import { getVoiceSections } from "@/content/voice";
import { SystemExplorerV2 } from "@/components/trace/SystemExplorerV2";
import { VoiceGuide } from "@/components/voice/VoiceGuide";
import { projects } from "@/lib/content";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";

type JourneyMode = "recruiter" | "engineer" | "learner";
const progressKey = "adk-v2-journey-progress";
const modeKey = "adk-v2-journey-mode";

export function HomeHero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [audience, setAudience] = useState(0);
  const [mode, setMode] = useState<JourneyMode>("recruiter");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("mode") as JourneyMode | null;
    const saved = window.localStorage.getItem(modeKey) as JourneyMode | null;
    const valid = ["recruiter", "engineer", "learner"] as JourneyMode[];
    setMode(query && valid.includes(query) ? query : saved && valid.includes(saved) ? saved : "recruiter");
  }, []);

  function chooseMode(next: JourneyMode) {
    setMode(next);
    window.localStorage.setItem(modeKey, next);
    const params = new URLSearchParams(window.location.search);
    params.set("mode", next);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
  }

  function resetJourney() {
    setMode("recruiter");
    window.localStorage.removeItem(modeKey);
    window.localStorage.removeItem(progressKey);
    const params = new URLSearchParams(window.location.search);
    params.delete("mode");
    window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`);
    window.dispatchEvent(new CustomEvent("adk:journey-reset"));
  }

  const activeAudience = dict.hero.audiences[audience];
  return (
    <>
      <section className="hero-v2">
        <div className="hero-grid-v2">
        <div className="hero-copy-v2">
          <p className="eyebrow-v2">{dict.hero.eyebrow}</p>
          <h1>{dict.hero.title}</h1>
          <p className="lede-v2">{dict.hero.subtitle}</p>
          <section className="audience-switcher-v2" aria-labelledby="audience-label">
            <p className="mono" id="audience-label">{dict.hero.audienceLabel}</p>
            <p className="audience-copy-v2" aria-hidden="true">{activeAudience[2]}</p>
            <span className="sr-only">{activeAudience[2]}</span>
            <div role="group" aria-label={dict.hero.audienceLabel}>
              {dict.hero.audiences.map((item, index) => (
                <button type="button" aria-pressed={audience === index} key={item[0]} onClick={() => setAudience(index)}>
                  {item[1]}
                </button>
              ))}
            </div>
          </section>
          <div className="v2-primary-actions">
            <a className="primary-action-v2" href={`${localizedPath(locale, "/system")}?mode=${mode}`}>{dict.hero.ctaPrimary}</a>
            <a className="secondary-action-v2" href={localizedPath(locale, "/projects")}>{dict.hero.ctaSecondary}</a>
          </div>
          <dl className="hero-stats-v2" aria-label={locale === "vi" ? "Quy mô hệ project" : "Project ecosystem scale"}>
            {dict.hero.stats.map(([value, label, detail]) => <div key={label}><dt>{value}</dt><dd><strong>{label}</strong><span>{detail}</span></dd></div>)}
          </dl>
        </div>
        <div className="hero-control-plane">
          <SystemExplorerV2 locale={locale} compact />
          <VoiceGuide locale={locale} sections={getVoiceSections("home", locale)} compact />
        </div>
        </div>
      </section>

      <section className="journey-mode page-shell-v2" aria-labelledby="journey-mode-title">
        <div>
          <p className="eyebrow-v2">DISCOVERY MODE</p>
          <h2 id="journey-mode-title">{dict.journey.title}</h2>
          <p>{locale === "vi" ? "Chế độ chỉ thay đổi gợi ý và mức chi tiết mặc định; không khóa hoặc ẩn nội dung." : "Modes change recommendations and default detail only; they never lock or hide content."}</p>
        </div>
        <fieldset>
          <legend className="sr-only">{dict.journey.title}</legend>
          {dict.journey.modes.map(([id, label, description]) => (
            <label className={mode === id ? "is-active" : ""} key={id}>
              <input type="radio" name="journey-mode" value={id} checked={mode === id} onChange={() => chooseMode(id as JourneyMode)} />
              <strong>{label}</strong><span>{description}</span>
            </label>
          ))}
        </fieldset>
        <button type="button" className="text-control-v2" onClick={resetJourney}>{dict.journey.reset}</button>
      </section>
      <JourneyProgress locale={locale} mode={mode} />
    </>
  );
}

export function CapabilityLadderV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [selected, setSelected] = useState(0);
  const project = projects[selected];
  const copy = localizeProject(project, locale);
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
                  <span><strong>{localized.title}</strong><small>{localized.lesson}</small></span>
                </button>
              </li>
            );
          })}
        </ol>
        <article className={`capability-inspector project-${project.slug}`} aria-live="polite">
          <header><span className="mono">{project.verb} · {String(project.index).padStart(2, "0")}</span><h3>{copy.title}</h3><p>{copy.thesis}</p></header>
          <dl>
            <div><dt>{dict.home.layer}</dt><dd>{copy.lesson}</dd></div>
            <div><dt>{dict.home.owner}</dt><dd>{controlOwnerByProject[project.slug]}</dd></div>
            <div><dt>{dict.home.artifact}</dt><dd>{copy.artifact}</dd></div>
            <div><dt>{dict.home.risk}</dt><dd>{copy.limitations[0]}</dd></div>
            <div><dt>{dict.home.evidence}</dt><dd>{dict.evidence.labels.documented}</dd></div>
          </dl>
          <div className="capability-mini-panel" aria-label={`${copy.title} architecture`}>
            <span>input</span><i aria-hidden="true">→</i><strong>{patternByProject[project.slug]}</strong><i aria-hidden="true">→</i><span>artifact</span>
          </div>
          <a href={localizedPath(locale, `/projects/${project.slug}#lab`)}>{dict.home.tryLab} →</a>
        </article>
      </div>
    </section>
  );
}

function JourneyProgress({ locale, mode }: { locale: Locale; mode: JourneyMode }) {
  const dict = getDictionary(locale);
  const paths: Record<JourneyMode, Array<[string, string]>> = {
    recruiter: [["home", locale === "vi" ? "Luận điểm" : "Thesis"], ["dashboard", "Dashboard"], ["a2a", "A2A"], ["evidence", dict.nav.evidence], ["contact", dict.nav.contact]],
    engineer: [["system", dict.nav.system], ["trip", "Trip"], ["script", "Script"], ["dashboard", "Dashboard"], ["a2a", "A2A"], ["evidence", dict.nav.evidence]],
    learner: [["home", locale === "vi" ? "Luận điểm" : "Thesis"], ["ladder", locale === "vi" ? "Sáu bước" : "Six steps"], ["learn", dict.nav.learn], ["system", dict.nav.system], ["lab", "Micro-lab"]]
  };
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    try { setDone(JSON.parse(window.localStorage.getItem(progressKey) ?? "[]") as string[]); } catch { setDone([]); }
    const reset = () => setDone([]);
    window.addEventListener("adk:journey-reset", reset);
    return () => window.removeEventListener("adk:journey-reset", reset);
  }, []);
  function toggle(id: string) {
    setDone((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem(progressKey, JSON.stringify(next));
      return next;
    });
  }
  const path = paths[mode];
  const next = path.find(([id]) => !done.includes(id));
  return (
    <aside className="journey-progress page-shell-v2" aria-label={dict.journey.progress}>
      <div><span className="mono">{dict.journey.progress}</span><strong>{done.length}/{path.length}</strong></div>
      <ol>{path.map(([id, label]) => <li key={id}><button type="button" aria-pressed={done.includes(id)} onClick={() => toggle(id)}><span aria-hidden="true">{done.includes(id) ? "✓" : "○"}</span>{label}</button></li>)}</ol>
      <p><strong>{dict.journey.next}:</strong> {next?.[1] ?? (locale === "vi" ? "Đã xem hết lộ trình gợi ý." : "Recommended path complete.")}</p>
    </aside>
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
