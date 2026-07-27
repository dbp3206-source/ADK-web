import { StaticLink as Link } from "@/components/layout/StaticLink";

import { TracePlayer } from "@/components/trace/TracePlayer";
import { getProjectFilters, projects, traces } from "@/lib/content";

export default function HomePage() {
  const dashboard = projects.find((project) => project.slug === "dashboard-insights")!;
  const a2a = projects.find((project) => project.slug === "a2a-orchestrator")!;
  const editorialProjects = projects.filter(
    (project) => !["dashboard-insights", "a2a-orchestrator"].includes(project.slug)
  );

  return (
    <>
      <section className="home-thesis page-shell">
        <div className="thesis-copy">
          <p className="eyebrow">GOOGLE ADK · A2A · PYTHON</p>
          <h1>From one tool-using agent to a distributed agent ecosystem.</h1>
          <p className="lede">
            Six projects that progressively add state, specialist roles, workflow composition, retrieval, quality
            loops, observability and A2A orchestration.
          </p>
          <div className="primary-actions">
            <Link className="primary-action" href="/system">Run the system trace</Link>
            <Link className="secondary-action" href="/projects">Browse the six steps</Link>
          </div>
        </div>
        <TracePlayer presets={traces} compact />
      </section>

      <section className="proof-strip" aria-label="Portfolio scope">
        <span><strong>6</strong> projects</span>
        <span><strong>4</strong> multi-agent patterns</span>
        <span>MCP + RAG</span>
        <span>A2A ports 8000–8005</span>
      </section>

      <section className="capability-section page-shell">
        <div className="section-intro">
          <h2>One missing engineering layer at a time.</h2>
          <p>Each checkpoint changes who controls the work, what the system can access and how the outcome can be checked.</p>
        </div>
        <ol className="capability-ladder">
          {projects.map((project) => (
            <li key={project.slug} className={`project-${project.slug}`}>
              <Link href={`/projects/${project.slug}`}>
                <span className="capability-index mono">{String(project.index).padStart(2, "0")}</span>
                <span className="capability-verb mono">{project.verb}</span>
                <strong>{project.title}</strong>
                <span>{project.lesson}</span>
                <span className="capability-limit">{project.limitations[0]}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="featured-work page-shell" aria-labelledby="featured-title">
        <div className="section-intro">
          <h2 id="featured-title">The pipeline and the control plane.</h2>
          <p>The deepest specialist and the distributed system receive the strongest visual weight.</p>
        </div>
        <article className="dashboard-feature project-dashboard-insights">
          <div className="feature-copy">
            <p className="project-verb mono">{dashboard.verb} · 05</p>
            <h3>A pipeline, not a prompt demo.</h3>
            <p>
              Dashboard Insights combines file ingestion, analysis frameworks, MCP, RAG, a bounded QA loop, tool
              logging and report archiving. The question is whether a claim can be traced, checked and revised.
            </p>
            <Link href="/projects/dashboard-insights">Inspect Dashboard Insights</Link>
          </div>
          <div className="report-miniature" aria-label="Report pipeline miniature">
            <div className="report-sheet">
              <span className="mono">CLAIM / EVIDENCE</span>
              <i />
              <i />
              <i />
            </div>
            <ol className="qa-rail">
              {["Ingest", "Frame", "Write", "QA", "Revise", "Archive"].map((item, index) => (
                <li key={item}><span className="mono">{index + 1}</span>{item}</li>
              ))}
            </ol>
          </div>
        </article>

        <article className="a2a-feature project-a2a-orchestrator">
          <div>
            <p className="project-verb mono">{a2a.verb} · 06</p>
            <h3>Independent systems, one capability map.</h3>
            <p>
              The orchestrator reads intent, selects a specialist through its capability contract and sends work
              across a service boundary.
            </p>
            <Link href="/projects/a2a-orchestrator">Inspect the A2A control plane</Link>
          </div>
          <div className="a2a-tower" aria-label="Orchestrator and five specialist services">
            <span className="orchestrator-node">ORCHESTRATOR :8000</span>
            {["TRIP :8001", "SCRIPT :8002", "WORLD CUP :8003", "LOVE :8004", "DASHBOARD :8005"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>

        <div className="editorial-project-rows">
          {editorialProjects.map((project) => (
            <article key={project.slug} className={`editorial-project-row project-${project.slug}`}>
              <span className="project-index-number mono">{String(project.index).padStart(2, "0")}</span>
              <div>
                <p className="project-verb mono">{project.verb}</p>
                <h3>{project.title}</h3>
                <p>{project.thesis}</p>
              </div>
              <ProjectMiniVisual slug={project.slug} />
              <div>
                <ul className="pattern-list">
                  {getProjectFilters(project.slug).map((pattern) => <li key={pattern}>{pattern}</li>)}
                </ul>
                <Link href={`/projects/${project.slug}`}>Open case study</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="request-anatomy page-shell">
        <div className="section-intro">
          <h2>Read a request by its anatomy.</h2>
          <p>Every system view names what is received, decided, called, checked and returned.</p>
        </div>
        <ol>
          {["User prompt", "Intent routing", "Remote agent", "Internal workflow", "Tool / data", "Validation", "Artifact"].map(
            (item, index) => (
              <li key={item}>
                <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                <details>
                  <summary>Why this exists</summary>
                  <p>{requestReasons[index]}</p>
                </details>
              </li>
            )
          )}
        </ol>
      </section>

      <section className="engineering-honesty page-shell">
        <h2>Engineering honesty is part of the architecture.</h2>
        <div>
          <article>
            <h3>Represented now</h3>
            <p>
              Tool and state concepts; transfer, Agent-as-Tool and workflow patterns; MCP, RAG, logging and archive
              concepts; A2A topology and ports; source-based simulated traces.
            </p>
          </article>
          <article>
            <h3>Next production layer</h3>
            <p>
              Durable storage, authentication, health registry, timeout and retry, circuit breaker, cross-service
              tracing, evaluation, domain isolation and a verified live backend.
            </p>
          </article>
        </div>
        <Link href="/evidence">Review evidence and known limitations</Link>
      </section>

      <section className="contact-terminal page-shell" aria-labelledby="open-to-title">
        <p className="mono">$ open-to</p>
        <h2 id="open-to-title">AI/ML Engineering Internship</h2>
        <p>Agent systems · Python · Applied AI</p>
        <Link href="/contact">Contact details</Link>
      </section>
    </>
  );
}

function ProjectMiniVisual({ slug }: { slug: string }) {
  return (
    <div className={`project-mini-visual mini-${slug}`} aria-hidden="true">
      <span /><span /><span /><span />
    </div>
  );
}

const requestReasons = [
  "Defines the user job and the input boundary.",
  "Explains why one capability is selected over another.",
  "Makes the service boundary and specialist ownership visible.",
  "Shows the ordered, parallel or looping work inside the specialist.",
  "Separates model reasoning from executable tools and retrieved data.",
  "Exposes the check that must pass before an artifact returns.",
  "Names the durable or structured output produced by the system."
];
