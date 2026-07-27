import { localizeProject } from "@/content/project-copy";
import { projects } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { getProjectReplays, getRootAgent } from "@/lib/replays";

export function StaticAgentCoreFallback({ locale }: { locale: Locale }) {
  const project = projects[0];
  const source = getRootAgent(project.slug);
  const replay = getProjectReplays(project.slug)[0];
  return (
    <section className="agent-core-explorer agent-core-static" aria-labelledby="agent-core-static-title">
      <header className="section-head-v2">
        <p className="eyebrow-v2">AGENT CORE & ARTIFACT EXPLORER</p>
        <h2 id="agent-core-static-title">
          {locale === "vi" ? "Từ root agent thật đến artifact có thể kiểm tra." : "From the real root agent to an inspectable artifact."}
        </h2>
        <p>
          {locale === "vi"
            ? "Bản tĩnh hiển thị source và artifact đầu tiên; tương tác tải khi khu vực tiến gần viewport."
            : "The static view shows the first source and artifact; interaction loads as this area nears the viewport."}
        </p>
      </header>
      <div className="agent-core-layout">
        <ol className="agent-static-projects">
          {projects.map((item) => (
            <li key={item.slug}>
              <span className="mono">{String(item.index).padStart(2, "0")} · {item.verb}</span>
              <strong>{localizeProject(item, locale).title}</strong>
            </li>
          ))}
        </ol>
        <div className={`agent-core-workbench project-${project.slug}`}>
          <header>
            <div><span className="mono">{project.verb}</span><h3>{localizeProject(project, locale).title}</h3></div>
          </header>
          {source ? (
            <div className="agent-source-panel">
              <div className="source-meta-line mono"><span>{source.path}</span><span>L{source.startLine}–L{source.endLine}</span></div>
              <pre tabIndex={0}><code>{source.source}</code></pre>
            </div>
          ) : null}
          <div className="agent-structure-artifact">
            <article><h4>Root agent</h4><pre tabIndex={0}><code>{JSON.stringify(source?.structure ?? {}, null, 2)}</code></pre></article>
            <article><h4>Replay artifact</h4><pre tabIndex={0}><code>{JSON.stringify(replay?.output ?? {}, null, 2)}</code></pre></article>
          </div>
        </div>
      </div>
    </section>
  );
}
