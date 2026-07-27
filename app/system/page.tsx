import type { Metadata } from "next";

import { TracePlayer } from "@/components/trace/TracePlayer";
import { traces } from "@/lib/content";

export const metadata: Metadata = {
  title: "Interactive A2A System Explorer",
  description: "Follow five simulated requests through the ADK agent ecosystem."
};

export default function SystemPage() {
  return (
    <div className="page-shell page-top system-page">
      <header className="page-masthead system-masthead">
        <p className="eyebrow">A2A CONTROL PLANE · STATIC SIMULATION</p>
        <h1>Follow one request across the ecosystem.</h1>
        <p className="lede">
          Choose a preset and inspect how intent becomes a routing decision, a specialist workflow, a tool or data
          action, validation and an artifact.
        </p>
      </header>
      <TracePlayer presets={traces} />
      <section className="offline-boundary" aria-labelledby="offline-title">
        <h2 id="offline-title">Static by design.</h2>
        <p>
          No live specialist is connected. If a future live service is unavailable, the interface will say:
          “The live specialist is unavailable. The architecture trace is still available; live execution has been paused.”
        </p>
      </section>
    </div>
  );
}
