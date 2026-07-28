import { ArchitectureDiagram, ArchitectureLegend } from "@/components/architecture/ArchitectureDiagram";
import { CaseStudyTools } from "@/components/case-study/CaseStudyTools";
import { StaticLink as Link } from "@/components/layout/StaticLink";
import { AgentInteractionSimulator } from "@/components/simulator/AgentInteractionSimulator";
import { AgentCoreExplorer } from "@/components/source/AgentCoreExplorer";
import { localizeProject, patternByProject } from "@/content/project-copy";
import { getAdjacentProjects, getProject, getProjectFilters } from "@/lib/content";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";

export function CaseStudyV2({ slug, locale }: { slug: string; locale: Locale }) {
  const project = getProject(slug);
  if (!project) return null;
  const dict = getDictionary(locale);
  const copy = localizeProject(project, locale);
  const adjacent = getAdjacentProjects(slug);
  const sections = [
    ["problem", dict.caseStudy.problem],
    ["architecture", dict.caseStudy.architecture],
    ["trace", dict.caseStudy.trace],
    ["simulator", locale === "vi" ? "Xem agent xử lý" : "See agent process"],
    ["source", locale === "vi" ? "Root agent & artifact" : "Root agent & artifact"],
    ["decisions", dict.caseStudy.decisions]
  ];
  return (
    <article className={`case-study-v2 case-${slug} project-${slug}`}>
      <header className="case-cover-v2 page-shell-v2">
        <div className="case-index-v2">
          <span className="mono">{String(project.index).padStart(2, "0")}</span>
          <span className="mono">{project.verb} · {patternByProject[slug]}</span>
        </div>
        <div>
          <p className="eyebrow-v2">{project.vibe.name}</p>
          <h1>{copy.title}</h1>
          <p className="case-thesis-v2">{copy.thesis}</p>
        </div>
        <dl>
          <div><dt>{dict.projects.pattern}</dt><dd>{getProjectFilters(slug).join(" · ")}</dd></div>
          <div><dt>{dict.projects.maturity}</dt><dd>{copy.maturity}</dd></div>
        </dl>
        <CaseStudyTools locale={locale} />
      </header>

      <div className="case-body-v2 page-shell-v2">
        <aside className="case-toc-v2">
          <strong>{dict.caseStudy.toc}</strong>
          <nav>{sections.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav>
        </aside>
        <div className="case-content-v2">
          <section id="problem" className="case-section-v2">
            <span className="section-number mono">01</span>
            <div>
              <h2>{dict.caseStudy.problem}</h2>
              <p className="large-copy-v2">{copy.problem}</p>
              <h3>{dict.caseStudy.proves}</h3>
              <p>{copy.whatItProves}</p>
            </div>
          </section>

          <section id="architecture" className="case-section-v2 architecture-section-v2">
            <span className="section-number mono">02</span>
            <div>
              <h2>{dict.caseStudy.architecture}</h2>
              <p>{project.architecture.summary}</p>
              <ArchitectureLegend />
              <ArchitectureDiagram project={project} />
            </div>
          </section>

          <section id="trace" className="case-section-v2">
            <span className="section-number mono">03</span>
            <div>
              <h2>{dict.caseStudy.trace}</h2>
              <UniqueProjectStage slug={slug} timeline={copy.primaryTimeline} locale={locale} />
            </div>
          </section>

          <section id="simulator" className="case-section-v2 lab-section-v2">
            <span className="section-number mono">04</span>
            <div>
              <h2>{locale === "vi" ? "Xem agent xử lý một yêu cầu" : "See the agent process a request"}</h2>
              <p className="section-intro">{locale === "vi" ? "Chọn một kịch bản, xem từng bước agent xử lý và kết quả cuối cùng." : "Select a scenario, watch each processing step, and see the final output."}</p>
              <AgentInteractionSimulator slug={slug} locale={locale} />
            </div>
          </section>

          <section id="source" className="case-section-v2">
            <span className="section-number mono">05</span>
            <div>
              <h2>{locale === "vi" ? "Root agent & artifact" : "Root agent & artifact"}</h2>
              <p>{copy.artifact}</p>
              <AgentCoreExplorer locale={locale} initialProject={slug} compact />
            </div>
          </section>

          <section id="decisions" className="case-section-v2 split-evidence-v2">
            <span className="section-number mono">06</span>
            <div>
              <h2>{dict.caseStudy.decisions}</h2>
              <ol>{copy.decisions.map((item, index) => <li key={item}><span className="mono">{index + 1}</span>{item}</li>)}</ol>
            </div>
          </section>

          <nav className="case-adjacent-v2" aria-label="Adjacent projects">
            {adjacent.previous ? <Link href={localizedPath(locale, `/projects/${adjacent.previous.slug}`)}>← {dict.caseStudy.previous}: {adjacent.previous.title}</Link> : <span />}
            {adjacent.next ? <Link href={localizedPath(locale, `/projects/${adjacent.next.slug}`)}>{dict.caseStudy.next}: {adjacent.next.title} →</Link> : <span />}
          </nav>
        </div>
      </div>
    </article>
  );
}

function UniqueProjectStage({ slug, timeline, locale }: { slug: string; timeline: string[]; locale: Locale }) {
  const labels: Record<string, string> = {
    "trip-planner": locale === "vi" ? "Route / State trace" : "Route / State trace",
    "script-team": locale === "vi" ? "Bản thảo / Lề phản biện / Redline" : "Manuscript / Critique margin / Redline",
    "worldcup-analyst": locale === "vi" ? "Sổ bằng chứng / Băng tính" : "Evidence ledger / Calculation tape",
    "love-advisor": locale === "vi" ? "Hai lăng kính / Cổng tổng hợp" : "Dual lenses / Synthesis gate",
    "dashboard-insights": locale === "vi" ? "Report canvas / QA loop / Archive" : "Report canvas / QA loop / Archive",
    "a2a-orchestrator": locale === "vi" ? "Topology / Port / Agent Card" : "Topology / Ports / Agent Card"
  };
  return (
    <div className={`unique-stage-v2 stage-${slug}`}>
      <span className="mono">{labels[slug]}</span>
      <ol>{timeline.map((step, index) => <li key={step}><span className="mono">{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
    </div>
  );
}
