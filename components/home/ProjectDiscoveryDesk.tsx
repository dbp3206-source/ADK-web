"use client";

import { useState } from "react";

import discoveryData from "@/content/discovery.json";
import { localizeProject } from "@/content/project-copy";
import { projects } from "@/lib/content";
import { localizedPath, type Locale } from "@/lib/i18n";

export function ProjectDiscoveryDesk({ locale }: { locale: Locale }) {
  const data = discoveryData[locale] || discoveryData.en;
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  const findMatches = (text: string) => {
    const normalized = text.trim().toLowerCase();
    if (!normalized) return [];
    const exact = data.presets.find((preset) => preset.prompt.toLowerCase() === normalized);
    if (exact) return [exact.project];

    const scored = data.presets.map((preset) => ({
      project: preset.project,
      score: preset.keywords.reduce(
        (total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? 1 : 0),
        0,
      ),
    }));
    const highest = Math.max(...scored.map((item) => item.score));
    return highest > 0 ? scored.filter((item) => item.score === highest).map((item) => item.project) : [];
  };

  const search = (value = prompt) => {
    setPrompt(value);
    setResults(findMatches(value));
    setSearched(true);
  };

  const matched = results
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  return (
    <section className="discovery-desk-v3 page-shell-v2" aria-labelledby="discovery-title">
      <div className="discovery-desk-container">
        <header className="discovery-header">
          <p className="eyebrow-v2">PROJECT DISCOVERY DESK</p>
          <h2 id="discovery-title">
            {locale === "vi" ? "Bạn đang muốn giải quyết việc gì?" : "What are you trying to solve?"}
          </h2>
          <p>{data.description}</p>
        </header>

        <form
          className="discovery-prompt-box"
          onSubmit={(event) => {
            event.preventDefault();
            search();
          }}
        >
          <label className="sr-only" htmlFor="project-discovery-prompt">{data.heading}</label>
          <input
            id="project-discovery-prompt"
            type="search"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={locale === "vi" ? "Ví dụ: kiểm tra insight từ bảng dữ liệu" : "Example: validate an insight from a dataset"}
          />
          <button type="submit" className="sim-send-btn">
            {locale === "vi" ? "Tìm project" : "Find a project"}
          </button>
        </form>

        <div className="discovery-presets" aria-label={locale === "vi" ? "Tình huống mẫu" : "Preset situations"}>
          {data.presets.map((preset) => (
            <button key={preset.id} type="button" className="practice-tab" onClick={() => search(preset.prompt)}>
              {preset.label}
            </button>
          ))}
        </div>
        <p className="discovery-trust-label mono">{data.trustLabel}</p>

        {searched && matched.length === 0 ? (
          <div className="discovery-empty" role="status">
            <strong>{locale === "vi" ? "Chưa có kết quả khớp rõ." : "No clear match yet."}</strong>
            <p>
              {locale === "vi"
                ? "Hãy thử mô tả công việc bằng một trong các ý: ghi nhớ, viết nội dung, tính toán, dữ liệu hoặc điều phối agent."
                : "Try describing the job with one of these ideas: memory, writing, calculation, data or agent routing."}
            </p>
          </div>
        ) : null}

        {matched.length > 0 ? (
          <div className="discovery-result" role="status">
            <div className="discovery-request">
              <span className="mono">{locale === "vi" ? "PROMPT CỦA BẠN" : "YOUR PROMPT"}</span>
              <p>{prompt}</p>
            </div>
            <div className="discovery-matches">
              {matched.map((project) => {
                const copy = localizeProject(project, locale);
                return (
                  <article className={`discovery-result-card project-${project.slug}`} key={project.slug}>
                    <div className={`mini-signal mini-${project.slug}`} aria-hidden="true"><i /><i /><i /><i /></div>
                    <div className="discovery-result-header">
                      <span className="mono">{project.verb} · {String(project.index).padStart(2, "0")}</span>
                      <h3>{copy.title}</h3>
                    </div>
                    <dl className="discovery-result-body">
                      <div><dt>{locale === "vi" ? "Vì sao project tồn tại" : "Why this project exists"}</dt><dd>{copy.problem}</dd></div>
                      <div><dt>{locale === "vi" ? "Agent sẽ làm gì" : "What the agent does"}</dt><dd>{copy.thesis}</dd></div>
                      <div><dt>{locale === "vi" ? "Output mẫu" : "Sample output"}</dt><dd>{copy.artifact}</dd></div>
                    </dl>
                    <div className="discovery-result-actions">
                      <a href={localizedPath(locale, `/projects/${project.slug}`)} className="primary-action-v2">
                        {locale === "vi" ? "Mở case study" : "Open case study"}
                      </a>
                      <a href={`${localizedPath(locale, `/projects/${project.slug}`)}#${project.slug}-simulator`} className="secondary-action-v2">
                        {locale === "vi" ? "Xem demo" : "View demo"}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
