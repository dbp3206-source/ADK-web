"use client";

import { useMemo, useState } from "react";

import type { Project } from "@/lib/types";

const dashboardStages = ["Ingest", "Frame", "Write", "QA", "Revise", "Format", "Archive"];
const scriptRoles = ["Drafter", "Critic", "Reviser"];
const tripStages = ["Plan", "Save", "Retrieve"];

export function ProjectInteraction({ project }: { project: Project }) {
  if (project.slug === "trip-planner") return <TripInteraction />;
  if (project.slug === "script-team") return <ScriptInteraction />;
  if (project.slug === "worldcup-analyst") return <WorldCupInteraction />;
  if (project.slug === "love-advisor") return <LoveInteraction />;
  if (project.slug === "dashboard-insights") return <DashboardInteraction />;
  return <A2AInteraction />;
}

function StageButtons({
  stages,
  active,
  setActive,
  label
}: {
  stages: string[];
  active: number;
  setActive: (index: number) => void;
  label: string;
}) {
  return (
    <div className="interaction-tabs" role="tablist" aria-label={label}>
      {stages.map((stage, index) => (
        <button
          type="button"
          role="tab"
          aria-selected={active === index}
          onClick={() => setActive(index)}
          key={stage}
        >
          {stage}
        </button>
      ))}
    </div>
  );
}

function TripInteraction() {
  const [active, setActive] = useState(0);
  const fields = [
    ["status", active === 0 ? "drafted" : active === 1 ? "stored_in_session" : "retrieved"],
    ["destination", "Hue"],
    ["duration", "3 days"],
    ["persistence", "session only"]
  ];
  return (
    <div className="project-interaction trip-interaction">
      <div className="itinerary-canvas">
        <StageButtons stages={tripStages} active={active} setActive={setActive} label="Trip state stages" />
        <ol className="route-days">
          <li><span>01</span> Request details</li>
          <li><span>02</span> Draft itinerary</li>
          <li><span>03</span> Tool receipt</li>
        </ol>
      </div>
      <aside className="state-drawer">
        <p className="mono">SESSION STATE · {tripStages[active].toUpperCase()}</p>
        <dl>
          {fields.map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}

function ScriptInteraction() {
  const [active, setActive] = useState(0);
  const copy = [
    "A source brief becomes a first manuscript.",
    "Margin critique names structure, clarity and missing evidence.",
    "The revision answers the critique and preserves the handoff trail."
  ];
  return (
    <div className="project-interaction script-interaction">
      <div className="manuscript-panel">
        <StageButtons stages={scriptRoles} active={active} setActive={setActive} label="Script role handoff" />
        <p className="manuscript-label mono">REVISION {active + 1}</p>
        <p>{copy[active]}</p>
        <p className={active > 0 ? "redline" : ""}>
          Ownership moves by an explicit transfer contract, not an oversized shared prompt.
        </p>
      </div>
      <aside className="margin-critique">
        <p className="mono">MARGIN CRITIQUE</p>
        <strong>{scriptRoles[active]} owns this step.</strong>
        <p>{active === 0 ? "Draft against the brief." : active === 1 ? "Return structured feedback." : "Resolve marked issues."}</p>
      </aside>
    </div>
  );
}

function WorldCupInteraction() {
  const layers = ["Fact", "Calculation", "Synthesis"];
  const [active, setActive] = useState(0);
  const content = [
    ["Evidence ledger", "Source scope is explicit. No live score or unsupported team mark is shown."],
    ["Calculation tape", "Code performs arithmetic after verified inputs are supplied. Numeric evidence is pending."],
    ["Analyst report", "The root agent combines evidence and calculation without hiding their separate trails."]
  ];
  return (
    <div className="project-interaction worldcup-interaction">
      <StageButtons stages={layers} active={active} setActive={setActive} label="Analyst report layers" />
      <div className="evidence-ledger">
        <p className="mono">LAYER {active + 1} · {layers[active].toUpperCase()}</p>
        <h3>{content[active][0]}</h3>
        <p>{content[active][1]}</p>
      </div>
      <aside className="calculation-tape mono">
        <span>source_scope = pending verification</span>
        <span>calculation = code boundary</span>
        <span>claim_status = needs verification</span>
      </aside>
    </div>
  );
}

function LoveInteraction() {
  const [laneA, setLaneA] = useState(false);
  const [laneB, setLaneB] = useState(false);
  const merged = laneA && laneB;
  return (
    <div className="project-interaction love-interaction">
      <div className={`preference-lane ${laneA ? "is-complete" : ""}`}>
        <p className="mono">LENS A · DESCRIPTIVE PREFERENCES</p>
        <p>Independent observations remain bounded and uncertain.</p>
        <button type="button" onClick={() => setLaneA((value) => !value)}>
          {laneA ? "Reset lens A" : "Complete lens A"}
        </button>
      </div>
      <div className={`synthesis-gate ${merged ? "is-complete" : ""}`}>
        <span aria-hidden="true">⇢</span>
        <strong>{merged ? "Schema ready" : "Waiting for both lenses"}</strong>
        <span aria-hidden="true">⇠</span>
      </div>
      <div className={`preference-lane ${laneB ? "is-complete" : ""}`}>
        <p className="mono">LENS B · VALUES AND CONTEXT</p>
        <p>No person is scored and no sensitive trait is inferred.</p>
        <button type="button" onClick={() => setLaneB((value) => !value)}>
          {laneB ? "Reset lens B" : "Complete lens B"}
        </button>
      </div>
      <div className="safety-note" role="note">
        <strong>Safety and uncertainty.</strong> This architecture demonstration is not medical or psychological advice.
        It avoids appearance scoring, aggressive tone and conclusions from insufficient data.
      </div>
    </div>
  );
}

function DashboardInteraction() {
  const [active, setActive] = useState(0);
  const iteration = active === 4 ? 1 : active > 4 ? 2 : 0;
  return (
    <div className="project-interaction dashboard-interaction">
      <aside className="ingestion-rail">
        <StageButtons stages={dashboardStages} active={active} setActive={setActive} label="Dashboard report pipeline" />
      </aside>
      <article className="report-canvas">
        <header>
          <p className="mono">REPORT CANVAS · STAGE {active + 1}/7</p>
          <span className="qa-stamp">QA ITERATION {iteration}/2</span>
        </header>
        <h3>{dashboardStages[active]} the evidence</h3>
        <p>
          {active < 3
            ? "Context moves from a permitted file boundary into an explicit analysis frame."
            : active < 6
              ? "Claims remain attached to a review and revision path before formatting."
              : "The artifact returns with an archive receipt; source-level verification remains pending."}
        </p>
        <div className="claim-evidence-matrix">
          <span>Claim ID</span><span>Source reference</span><span>Status</span>
          <strong>C-01</strong><span>Pending owner evidence</span><span>Needs verification</span>
          <strong>C-02</strong><span>Pending owner evidence</span><span>Needs verification</span>
        </div>
      </article>
    </div>
  );
}

function A2AInteraction() {
  const specialists = [
    ["Trip Planner", ":8001", "travel planning"],
    ["Script Team", ":8002", "writing workflow"],
    ["World Cup Analyst", ":8003", "sports analysis"],
    ["Love Advisor", ":8004", "preference synthesis"],
    ["Dashboard Insights", ":8005", "data insight"]
  ];
  const [selected, setSelected] = useState(0);
  const card = useMemo(() => specialists[selected], [selected]);
  return (
    <div className="project-interaction a2a-interaction">
      <div className="specialist-ports" role="list" aria-label="Simulated specialist ports">
        {specialists.map((specialist, index) => (
          <div role="listitem" key={specialist[0]}>
            <button
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span>{specialist[0]}</span>
              <span className="mono">{specialist[1]}</span>
            </button>
          </div>
        ))}
      </div>
      <aside className="agent-card-inspector">
        <p className="mono">AGENT CARD · SIMULATED INSPECTOR</p>
        <dl>
          <div><dt>Name</dt><dd>{card[0]}</dd></div>
          <div><dt>Capability</dt><dd>{card[2]}</dd></div>
          <div><dt>Local port</dt><dd>{card[1]}</dd></div>
          <div><dt>Routing reason</dt><dd>Request intent matches the declared capability.</dd></div>
          <div><dt>Fallback</dt><dd>Static architecture remains available; live execution is not enabled.</dd></div>
        </dl>
      </aside>
    </div>
  );
}
