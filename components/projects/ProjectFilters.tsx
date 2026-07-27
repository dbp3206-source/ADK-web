"use client";

import { useMemo, useState } from "react";

import { StaticLink as Link } from "@/components/layout/StaticLink";
import { filterPatterns, filterProjects, getProjectFilters } from "@/lib/content";

export function ProjectFilters() {
  const [selected, setSelected] = useState<string[]>([]);
  const results = useMemo(() => filterProjects(selected), [selected]);

  function toggle(pattern: string) {
    setSelected((current) =>
      current.includes(pattern) ? current.filter((item) => item !== pattern) : [...current, pattern]
    );
  }

  return (
    <div className="project-browser">
      <fieldset className="filter-group">
        <legend>Filter by architecture pattern</legend>
        <p>Selecting more than one pattern matches projects that contain every selected pattern.</p>
        <div className="filter-controls">
          {filterPatterns.map((pattern) => (
            <label className="filter-chip" key={pattern}>
              <input
                type="checkbox"
                checked={selected.includes(pattern)}
                onChange={() => toggle(pattern)}
              />
              <span>{pattern}</span>
            </label>
          ))}
          {selected.length > 0 ? (
            <button type="button" className="text-action" onClick={() => setSelected([])}>
              Clear filters
            </button>
          ) : null}
        </div>
      </fieldset>

      <p className="result-count mono" aria-live="polite">
        {results.length} {results.length === 1 ? "project" : "projects"} shown
      </p>

      {results.length > 0 ? (
        <ol className="project-index">
          {results.map((project) => (
            <li key={project.slug} className={`project-index-row project-${project.slug}`}>
              <span className="project-index-number mono">{String(project.index).padStart(2, "0")}</span>
              <div className="project-index-copy">
                <p className="project-verb mono">{project.verb}</p>
                <h2>
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h2>
                <p>{project.lesson}</p>
              </div>
              <ul className="pattern-list" aria-label={`${project.title} patterns`}>
                {getProjectFilters(project.slug).map((pattern) => (
                  <li key={pattern}>{pattern}</li>
                ))}
              </ul>
              <div className="project-index-evidence">
                <span className="evidence-badge evidence-needs_user_input">
                  <span aria-hidden="true">○</span> Needs verification
                </span>
                <span className="mono">{project.status}</span>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="filter-empty" role="status">
          <p>No project matches all selected patterns. Clear one filter.</p>
          <button type="button" onClick={() => setSelected([])}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
