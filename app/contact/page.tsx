import type { Metadata } from "next";

import { config, getUtilityLinks, isRealUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact routes for the ADK Agent Ecosystem portfolio."
};

export default function ContactPage() {
  const utilityLinks = getUtilityLinks();
  const hasEmail = Boolean(config.owner.email);
  const mailto = hasEmail ? `mailto:${config.owner.email}` : "";
  return (
    <div className="page-shell page-top contact-page">
      <header className="page-masthead">
        <p className="eyebrow">CONTACT TERMINAL</p>
        <h1>Open to an AI/ML engineering internship.</h1>
        <p className="lede">Agent systems · Python · Applied AI</p>
      </header>
      {isRealUrl(mailto) || utilityLinks.length > 0 ? (
        <section className="contact-actions" aria-label="Configured contact actions">
          {isRealUrl(mailto) ? <a className="primary-action" href={mailto}>Send email</a> : null}
          {utilityLinks.map((link) => (
            <a className="secondary-action" href={link.href} key={link.label} target="_blank" rel="noreferrer">
              Open {link.label}
            </a>
          ))}
        </section>
      ) : (
        <section className="contact-empty">
          <span className="mono">NO CONTACT ENDPOINT CONFIGURED</span>
          <h2>Contact details will be added before public release.</h2>
          <p>No fake form or placeholder link is rendered.</p>
        </section>
      )}
    </div>
  );
}
