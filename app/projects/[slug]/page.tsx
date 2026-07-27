import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArchitectureLegend } from "@/components/architecture/ArchitectureDiagram";
import { LazyArchitectureDiagram } from "@/components/architecture/LazyArchitectureDiagram";
import { ProjectInteraction } from "@/components/case-study/ProjectInteraction";
import { CodePendingState } from "@/components/evidence/CodePendingState";
import { EvidenceBadge } from "@/components/evidence/EvidenceBadge";
import { StaticLink as Link } from "@/components/layout/StaticLink";
import { TracePlayer } from "@/components/trace/TracePlayer";
import { getAdjacentProjects, getProject, getTraceForProject, projects, traces } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.verb}`,
    description: project.thesis
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const trace =
    getTraceForProject(project.slug) ??
    (project.slug === "a2a-orchestrator" ? traces.find((item) => item.targetProject === "trip-planner") : undefined);
  const adjacent = getAdjacentProjects(project.slug);

  return (
    <article className={`case-study project-${project.slug}`}>
      <header className="case-masthead page-shell">
        <div className="case-index-block">
          <span className="case-index mono">{String(project.index).padStart(2, "0")}</span>
          <span className="project-verb mono">{project.verb}</span>
        </div>
        <div>
          <p className="case-vibe mono">{project.vibe.name}</p>
          <h1>{project.title}</h1>
          <p className="case-thesis">{project.thesis}</p>
          <div className="case-meta">
            <span>{project.lesson}</span>
            <span>{project.status}</span>
            <EvidenceBadge status="needs_user_input" />
          </div>
        </div>
      </header>

      <section className="case-problem page-shell">
        <div>
          <h2>The user job</h2>
          <p>{project.problem}</p>
        </div>
        <blockquote>{project.vibe.metaphor}</blockquote>
      </section>

      <section className="case-signature page-shell" aria-labelledby="signature-title">
        <div className="section-intro">
          <h2 id="signature-title">{project.vibe.name}</h2>
          <p>{project.vibe.layout}</p>
        </div>
        <ProjectInteraction project={project} />
      </section>

      <section className="case-architecture page-shell" aria-labelledby="architecture-title">
        <div className="section-intro">
          <h2 id="architecture-title">Architecture</h2>
          <p>{project.architecture.summary}</p>
        </div>
        <ArchitectureLegend />
        <LazyArchitectureDiagram project={project} />
      </section>

      {trace ? (
        <section className="case-trace page-shell" aria-labelledby="trace-title">
          <div className="section-intro">
            <h2 id="trace-title">Request trace</h2>
            <p>Step through one source-derived request path. This is not a live execution.</p>
          </div>
          <TracePlayer presets={[trace]} />
          <details className="raw-project-trace">
            <summary>Read the project workflow details</summary>
            <ol>
              {project.requestTrace.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </details>
        </section>
      ) : null}

      <div className="page-shell">
        <CodePendingState />
      </div>

      <section className="decision-section page-shell" aria-labelledby="decisions-title">
        <div>
          <h2 id="decisions-title">Design decisions</h2>
          <ol>
            {project.designDecisions.map((decision, index) => (
              <li key={decision}>
                <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                <p>{decision}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="failure-panel">
          <h2>Failure modes</h2>
          <ul>
            {project.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
          </ul>
        </div>
      </section>

      <section className="roadmap-section page-shell" aria-labelledby="roadmap-title">
        <div>
          <p className="mono">PROPOSED UPGRADE</p>
          <h2 id="roadmap-title">The next engineering layer</h2>
        </div>
        <ol>
          {project.roadmap.map((item, index) => (
            <li key={item}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ol>
      </section>

      <footer className="evidence-footer page-shell">
        <div>
          <p className="mono">EVIDENCE FOOTER</p>
          <h2>Proof remains pending until the repository is connected.</h2>
          <p>
            No source path, commit, screenshot or test result has been invented. “Last verified” remains unavailable
            until owner evidence is supplied.
          </p>
        </div>
        <ul>
          {project.evidence.map((item) => (
            <li key={item.label}>
              <span>
                <strong>{item.label}</strong>
                <span className="mono">{item.type}</span>
              </span>
              <EvidenceBadge status={item.status} />
            </li>
          ))}
        </ul>
      </footer>

      <nav className="project-prev-next page-shell" aria-label="Adjacent capability steps">
        {adjacent.previous ? (
          <Link href={`/projects/${adjacent.previous.slug}`}>
            <span className="mono">PREVIOUS · {adjacent.previous.verb}</span>
            {adjacent.previous.title}
          </Link>
        ) : <span />}
        {adjacent.next ? (
          <Link href={`/projects/${adjacent.next.slug}`}>
            <span className="mono">NEXT · {adjacent.next.verb}</span>
            {adjacent.next.title}
          </Link>
        ) : <Link href="/system"><span className="mono">NEXT</span>System Explorer</Link>}
      </nav>
    </article>
  );
}
