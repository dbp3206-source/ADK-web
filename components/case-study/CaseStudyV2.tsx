import { ArchitectureDiagram, ArchitectureLegend } from "@/components/architecture/ArchitectureDiagram";
import { CaseStudyTools } from "@/components/case-study/CaseStudyTools";
import { LazyProjectLab } from "@/components/labs/LazyProjectLab";
import { StaticLink as Link } from "@/components/layout/StaticLink";
import { VoiceGuide } from "@/components/voice/VoiceGuide";
import { localizeProject, patternByProject } from "@/content/project-copy";
import { getVoiceSections } from "@/content/voice";
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
    ["lab-section", "Micro-lab"],
    ["artifact", dict.caseStudy.artifact],
    ["decisions", dict.caseStudy.decisions],
    ["evidence", dict.caseStudy.evidence],
    ["limitations", dict.caseStudy.limitations]
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
          <div><dt>{dict.projects.evidence}</dt><dd>{dict.evidence.labels.documented}</dd></div>
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
            <span className="section-number mono">01</span><div><h2>{dict.caseStudy.problem}</h2><p className="large-copy-v2">{copy.problem}</p><h3>{dict.caseStudy.proves}</h3><p>{copy.whatItProves}</p></div>
          </section>

          <section id="architecture" className="case-section-v2 architecture-section-v2">
            <span className="section-number mono">02</span>
            <div><h2>{dict.caseStudy.architecture}</h2><p>{project.architecture.summary}</p><ArchitectureLegend /><ArchitectureDiagram project={project} /></div>
          </section>

          <section id="trace" className="case-section-v2">
            <span className="section-number mono">03</span>
            <div><h2>{dict.caseStudy.trace}</h2><UniqueProjectStage slug={slug} timeline={copy.primaryTimeline} locale={locale} /></div>
          </section>

          <section id="lab-section" className="case-section-v2 lab-section-v2">
            <span className="section-number mono">04</span>
            <div><h2>Micro-lab · {copy.title}</h2><LazyProjectLab slug={slug} locale={locale} /></div>
          </section>

          <section id="artifact" className="case-section-v2">
            <span className="section-number mono">05</span>
            <div><h2>{dict.caseStudy.artifact}</h2><p>{copy.artifact}</p><div className="artifact-sheet-v2"><span className="mono">{dict.caseStudy.sample} · {project.verb}</span><pre><code>{project.sampleArtifact}</code></pre></div></div>
          </section>

          <section id="decisions" className="case-section-v2 split-evidence-v2">
            <span className="section-number mono">06</span>
            <div><h2>{dict.caseStudy.decisions}</h2><ol>{copy.decisions.map((item, index) => <li key={item}><span className="mono">{index + 1}</span>{item}</li>)}</ol></div>
          </section>

          <section id="evidence" className="case-section-v2">
            <span className="section-number mono">07</span>
            <div>
              <h2>{dict.caseStudy.evidence}</h2>
              <div className="case-evidence-grid">
                <article><span>{dict.evidence.labels.documented}</span><p>{locale === "vi" ? "Kiến trúc, luồng, quyết định và giới hạn trong material đã cung cấp." : "Architecture, flow, decisions and limitations in the supplied material."}</p></article>
                <article><span>{dict.evidence.labels.located}</span><p>{dict.caseStudy.sourcePending}</p></article>
                <article><span>{dict.evidence.labels.verified}</span><p>{locale === "vi" ? "UI, trace và lab được kiểm tra trong website portfolio này; chưa xác minh source project bên ngoài." : "Portfolio UI, trace and lab are locally checked; external project source is not yet verified."}</p></article>
              </div>
              <div className="source-pending-v2"><strong>{dict.caseStudy.source}</strong><p>{dict.caseStudy.sourcePending}</p></div>
            </div>
          </section>

          <section id="limitations" className="case-section-v2 limitation-section-v2">
            <span className="section-number mono">08</span>
            <div className="limitation-columns-v2">
              <div><h2>{dict.caseStudy.limitations}</h2><ul>{copy.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h2>{dict.caseStudy.roadmap}</h2><ul>{copy.roadmap.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
          </section>

          <VoiceGuide locale={locale} sections={getVoiceSections(slug, locale)} />
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
