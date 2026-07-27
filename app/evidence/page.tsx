import type { Metadata } from "next";
import { StaticLink as Link } from "@/components/layout/StaticLink";

import { EvidenceBadge, allowedEvidenceLabels } from "@/components/evidence/EvidenceBadge";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Evidence, Tests and Known Limitations",
  description: "Source policy, verification status, limitations and production-hardening roadmap."
};

const layerMatrix = [
  ["Tool", "Input, expected output and error case", "Needs verification"],
  ["Agent", "Sample prompt and tool selection", "Needs verification"],
  ["Workflow", "Branch, order and loop trace", "Implemented in source"],
  ["Data", "Source file and derived claim", "Needs verification"],
  ["A2A", "Agent Card, port and remote response", "Needs verification"],
  ["UI", "Responsive screenshots, console and accessibility checks", "Verified locally"]
];

export default function EvidencePage() {
  return (
    <div className="page-shell page-top evidence-page">
      <header className="page-masthead">
        <p className="eyebrow">TRUST LAYER</p>
        <h1>Evidence before adjectives.</h1>
        <p className="lede">
          Every technical claim should point to a source file, test, screenshot or clearly labeled design proposal.
          Missing proof remains “Needs verification.”
        </p>
      </header>

      <section id="source-policy" className="evidence-policy" aria-labelledby="policy-title">
        <div>
          <h2 id="policy-title">Source policy</h2>
          <p>
            The portfolio renders package-supplied architecture and content as static evidence. It does not claim that
            the six Python repositories, a live backend or external services were inspected.
          </p>
        </div>
        <ul>
          {allowedEvidenceLabels.map((label, index) => (
            <li key={label}><EvidenceBadge status={statusByIndex[index]} /><p>{evidenceExplanations[index]}</p></li>
          ))}
        </ul>
      </section>

      <section className="evidence-matrix" aria-labelledby="matrix-title">
        <div className="section-intro">
          <h2 id="matrix-title">Verification matrix</h2>
          <p>Required evidence by system layer. Statuses describe this portfolio build, not the Python agents.</p>
        </div>
        <div className="matrix-table" role="table" aria-label="Evidence requirements by layer">
          <div role="row" className="matrix-head">
            <span role="columnheader">Layer</span>
            <span role="columnheader">Required evidence</span>
            <span role="columnheader">Current state</span>
          </div>
          {layerMatrix.map((row) => (
            <div role="row" key={row[0]}>
              <strong role="cell">{row[0]}</strong>
              <span role="cell">{row[1]}</span>
              <span role="cell">{row[2]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="project-verification" aria-labelledby="project-verification-title">
        <div className="section-intro">
          <h2 id="project-verification-title">Per-project status</h2>
          <p>Architecture content is represented; source-level evidence remains pending owner input.</p>
        </div>
        <ol>
          {projects.map((project) => (
            <li key={project.slug}>
              <span className="mono">{String(project.index).padStart(2, "0")}</span>
              <div><strong>{project.title}</strong><span>{project.status}</span></div>
              <EvidenceBadge status="needs_user_input" />
              <Link href={`/projects/${project.slug}`}>Open evidence footer</Link>
            </li>
          ))}
        </ol>
      </section>

      <section id="limitations" className="consolidated-limitations" aria-labelledby="limitations-title">
        <div className="section-intro">
          <h2 id="limitations-title">Known limitations</h2>
          <p>
            Knowing where state disappears, retrieval can mix domains or a distributed call needs versioning is part
            of engineering.
          </p>
        </div>
        {projects.map((project) => (
          <article key={project.slug}>
            <h3>{project.title}</h3>
            <ul>{project.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        ))}
      </section>

      <section className="documentation-mismatches" aria-labelledby="mismatch-title">
        <h2 id="mismatch-title">Documentation mismatches to verify</h2>
        <ul>
          <li>World Cup Analyst documentation mentions dependencies while the source report notes a missing requirements file.</li>
          <li>Dashboard Insights documentation and local Chroma paths may be out of sync.</li>
          <li>A2A SDK and Agent Card compatibility must be checked against the installed protocol version.</li>
        </ul>
      </section>

      <section className="hardening-roadmap" aria-labelledby="hardening-title">
        <h2 id="hardening-title">Production-hardening roadmap</h2>
        <ol>
          {[
            "Verify source files, requirements and repository status.",
            "Add durable storage, domain isolation and retention controls.",
            "Add authentication, secrets management and tool boundaries.",
            "Add health checks, timeout, retry, backoff and circuit breaker.",
            "Propagate trace IDs and evaluate task, factuality, format and safety behavior.",
            "Connect a redacted live backend only after the static fallback remains complete."
          ].map((item, index) => <li key={item}><span className="mono">{index + 1}</span>{item}</li>)}
        </ol>
      </section>

      <section id="accessibility" className="accessibility-privacy">
        <article>
          <h2>Accessibility</h2>
          <p>
            Semantic landmarks, visible focus, keyboard trace controls, text alternatives, aria-live updates, reduced
            motion and responsive content are part of the verification scope.
          </p>
        </article>
        <article>
          <h2>Privacy</h2>
          <p>
            The static MVP collects no prompt, file or personal visitor data. A future live demo requires disclosure,
            redaction, rate limiting, retention and deletion decisions.
          </p>
        </article>
      </section>
    </div>
  );
}

const statusByIndex = [
  "implemented_in_source",
  "verified_locally",
  "proposed_upgrade",
  "needs_user_input"
] as const;

const evidenceExplanations = [
  "The package states that the feature exists in the project source; the path still requires owner confirmation.",
  "A check was executed in this local portfolio workspace and recorded in the QA report.",
  "A concrete future engineering step, not current functionality.",
  "The proof is missing, unverified or blocked by owner input."
];
