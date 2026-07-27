import type { Metadata } from "next";
import { StaticLink as Link } from "@/components/layout/StaticLink";

import { getUtilityLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the Builder",
  description: "The architecture journey and capability areas behind the six-project portfolio."
};

const capabilityGroups = [
  ["Agent Systems", "Google ADK, tool calling, state, transfer, AgentTool, workflow agents, MCP and A2A"],
  ["Python / Data", "Typed tools, structured output, ingestion, calculation, RAG, logging and artifacts"],
  ["Web / Interface", "Next.js, TypeScript, data-driven content, SVG diagrams and interaction design"],
  ["Engineering Quality", "Evidence boundaries, limitations, accessibility, testing and production hardening"]
];

export default function AboutPage() {
  const utilityLinks = getUtilityLinks();
  return (
    <div className="page-shell page-top about-page">
      <header className="page-masthead about-masthead">
        <p className="eyebrow">ABOUT · OWNER PROFILE PENDING</p>
        <h1>I explored six levels of agent architecture.</h1>
        <p className="lede">
          I started with a single tool-using agent and progressively added state, specialist roles, workflow
          composition, retrieval, quality loops, observability and remote A2A orchestration.
        </p>
        <p className="owner-notice">
          This approved generic journey paragraph is temporary. Verified education, employment and personal
          background have not been supplied.
        </p>
      </header>

      <section className="about-ladder" aria-labelledby="about-ladder-title">
        <h2 id="about-ladder-title">What I explored</h2>
        <ol>
          {[
            ["ACT", "Tools and session state"],
            ["DELEGATE", "Role specialization and transfer"],
            ["COMPUTE", "Evidence retrieval and code execution"],
            ["COMPOSE", "Parallel and sequential workflow"],
            ["VERIFY", "Ingestion, retrieval, QA and archive"],
            ["CONNECT", "A2A discovery and remote routing"]
          ].map(([verb, lesson], index) => (
            <li key={verb}><span className="mono">{String(index + 1).padStart(2, "0")}</span><strong>{verb}</strong><p>{lesson}</p></li>
          ))}
        </ol>
      </section>

      <section className="skill-groups" aria-labelledby="skills-title">
        <h2 id="skills-title">Capability areas</h2>
        {capabilityGroups.map(([title, copy]) => (
          <article key={title}><h3>{title}</h3><p>{copy}</p></article>
        ))}
      </section>

      <section className="internship-target">
        <p className="mono">$ open-to</p>
        <h2>AI/ML Engineering Internship</h2>
        <p>Agent systems · Python · Applied AI</p>
        <div className="primary-actions">
          <Link className="primary-action" href="/contact">Contact</Link>
          {utilityLinks.map((link) => (
            <a className="secondary-action" key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
          ))}
        </div>
      </section>
    </div>
  );
}
