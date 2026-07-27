"use client";

import { useMemo, useState } from "react";

import { localizeProject, patternByProject } from "@/content/project-copy";
import { filterPatterns, getProjectFilters, projects } from "@/lib/content";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";

export function ProjectsBrowserV2({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [view, setView] = useState<"ladder" | "table">("ladder");
  const shown = useMemo(() => projects.filter((project) => {
    const copy = localizeProject(project, locale);
    const haystack = `${copy.title} ${copy.thesis} ${copy.lesson} ${getProjectFilters(project.slug).join(" ")}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && selected.every((pattern) => getProjectFilters(project.slug).includes(pattern as never));
  }), [locale, query, selected]);
  const toggle = (pattern: string) => setSelected((current) => current.includes(pattern) ? current.filter((item) => item !== pattern) : [...current, pattern]);

  return (
    <div className="projects-browser-v2">
      <div className="project-controls-v2">
        <label><span>{dict.projects.search}</span><input name="project-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <fieldset><legend>{dict.projects.filters}</legend><div>{filterPatterns.map((pattern) => <button type="button" aria-pressed={selected.includes(pattern)} onClick={() => toggle(pattern)} key={pattern}>{pattern}</button>)}</div></fieldset>
        <div className="view-controls" role="group" aria-label="View">
          <button type="button" aria-pressed={view === "ladder"} onClick={() => setView("ladder")}>{dict.projects.ladder}</button>
          <button type="button" aria-pressed={view === "table"} onClick={() => setView("table")}>{dict.projects.table}</button>
          <button type="button" disabled={!query && !selected.length} onClick={() => { setQuery(""); setSelected([]); }}>{dict.projects.clear}</button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{shown.length} / {projects.length}</p>
      {!shown.length ? <div className="filter-empty-v2"><p>{dict.projects.empty}</p><button type="button" onClick={() => { setSelected([]); setQuery(""); }}>{dict.projects.clear}</button></div> :
        view === "ladder" ? <ol className="project-ladder-v2">{shown.map((project) => {
          const copy = localizeProject(project, locale);
          return <li className={`project-${project.slug}`} key={project.slug}>
            <a href={localizedPath(locale, `/projects/${project.slug}`)}>
              <span className="project-number-v2 mono">{String(project.index).padStart(2, "0")}</span>
              <span><small className="mono">{project.verb} · {patternByProject[project.slug]}</small><strong>{copy.title}</strong><p>{copy.thesis}</p></span>
              <dl><div><dt>{dict.projects.pattern}</dt><dd>{getProjectFilters(project.slug).join(" · ")}</dd></div><div><dt>{dict.projects.maturity}</dt><dd>{copy.maturity}</dd></div><div><dt>{dict.projects.evidence}</dt><dd>{dict.evidence.labels.documented}</dd></div></dl>
            </a>
          </li>;
        })}</ol> :
        <div className="project-table-wrap"><table><thead><tr><th>#</th><th>{dict.nav.projects}</th><th>{dict.projects.pattern}</th><th>{dict.projects.maturity}</th><th>{dict.projects.evidence}</th></tr></thead><tbody>{shown.map((project) => {
          const copy = localizeProject(project, locale);
          return <tr key={project.slug}><td>{String(project.index).padStart(2, "0")}</td><th><a href={localizedPath(locale, `/projects/${project.slug}`)}>{copy.title}</a></th><td>{getProjectFilters(project.slug).join(" · ")}</td><td>{copy.maturity}</td><td>{dict.evidence.labels.documented}</td></tr>;
        })}</tbody></table></div>}
    </div>
  );
}
