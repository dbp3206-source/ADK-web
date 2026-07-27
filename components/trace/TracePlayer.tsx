"use client";

import { useEffect, useMemo, useState } from "react";

import { StaticLink as Link } from "@/components/layout/StaticLink";
import type { TracePreset } from "@/lib/types";

const specialistLabels: Record<string, string> = {
  "trip-planner": "Trip Planner :8001",
  "script-team": "Script Team :8002",
  "worldcup-analyst": "World Cup Analyst :8003",
  "love-advisor": "Love Advisor :8004",
  "dashboard-insights": "Dashboard Insights :8005"
};

export function TracePlayer({
  presets,
  compact = false
}: {
  presets: TracePreset[];
  compact?: boolean;
}) {
  const [presetId, setPresetId] = useState(presets[0]?.id ?? "");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const preset = useMemo(
    () => presets.find((item) => item.id === presetId) ?? presets[0],
    [presetId, presets]
  );
  const step = preset?.steps[stepIndex];
  const complete = preset ? stepIndex === preset.steps.length - 1 : false;

  useEffect(() => {
    if (!playing || !preset) return;
    if (complete) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStepIndex((current) => current + 1), 1100);
    return () => window.clearTimeout(timer);
  }, [complete, playing, preset, stepIndex]);

  if (!preset || !step) return null;

  function selectPreset(value: string) {
    setPresetId(value);
    setStepIndex(0);
    setPlaying(false);
  }

  return (
    <section className={`trace-player ${compact ? "trace-player-compact" : ""}`} aria-label="Simulated system trace">
      <div className="simulation-notice">
        <span aria-hidden="true">◇</span>
        <strong>Simulated trace from repository architecture</strong>
      </div>

      <div className="trace-toolbar">
        <label>
          <span>Request preset</span>
          <select value={presetId} onChange={(event) => selectPreset(event.target.value)}>
            {presets.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <div className="trace-controls" role="group" aria-label="Trace playback controls">
          <button type="button" onClick={() => setPlaying((current) => !current)} aria-pressed={playing}>
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStepIndex((current) => Math.max(0, current - 1));
            }}
            disabled={stepIndex === 0}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStepIndex((current) => Math.min(preset.steps.length - 1, current + 1));
            }}
            disabled={complete}
          >
            Next
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStepIndex(0);
            }}
          >
            Restart
          </button>
        </div>
        <span className="step-counter mono">
          STEP {stepIndex + 1} / {preset.steps.length}
        </span>
      </div>

      <div className="system-explorer-layout">
        <div className="system-topology" aria-label="A2A topology">
          <div className={`topology-node node-user ${step.type === "input" ? "is-active" : ""}`}>
            <span className="node-type">Input</span>
            User request
          </div>
          <div className={`trace-link ${stepIndex >= 1 ? "is-active" : ""}`} aria-hidden="true" />
          <div className={`topology-node node-service ${step.type === "routing" ? "is-active" : ""}`}>
            <span className="node-type">Remote service</span>
            Orchestrator :8000
          </div>
          <div className={`trace-link ${stepIndex >= 2 ? "is-active" : ""}`} aria-hidden="true" />
          <div className="specialist-bank">
            {Object.entries(specialistLabels).map(([slug, label]) => (
              <div
                className={`topology-node node-service ${preset.targetProject === slug && stepIndex >= 2 ? "is-active" : ""}`}
                key={slug}
              >
                <span className="node-type">Specialist</span>
                {label}
              </div>
            ))}
          </div>
          <div className={`trace-link ${step.type === "artifact" ? "is-active" : ""}`} aria-hidden="true" />
          <div className={`topology-node node-artifact ${step.type === "artifact" ? "is-active" : ""}`}>
            <span className="node-type">Artifact</span>
            Returned result
          </div>
        </div>

        <aside className="trace-inspector" aria-label="Active trace step inspector">
          <div className="trace-inspector-heading">
            <span className="trace-step-type mono">{step.type}</span>
            <span className="trace-playing-state mono">{playing ? "PLAYING" : complete ? "COMPLETE" : "PAUSED"}</span>
          </div>
          <h2>{step.title}</h2>
          <p>{step.detail}</p>
          {step.type === "routing" ? (
            <div className="routing-reason">
              <h3>Routing reason</h3>
              <p>
                The request intent matches the specialist capability described for {specialistLabels[preset.targetProject]}.
              </p>
            </div>
          ) : null}
          {["workflow", "parallel", "loop", "tool", "validation"].includes(step.type) ? (
            <div className="routing-reason">
              <h3>Specialist focus</h3>
              <p>
                The selected specialist exposes its internal workflow, tool/data boundary and validation step without
                implying that a live service ran.
              </p>
            </div>
          ) : null}
          {complete ? (
            <div className="artifact-return">
              <h3>Artifact return</h3>
              <p>{preset.steps[preset.steps.length - 1].detail}</p>
              <Link href={`/projects/${preset.targetProject}`}>Open related case study</Link>
            </div>
          ) : null}
        </aside>
      </div>

      <p className="sr-only" aria-live="polite">
        Step {stepIndex + 1} of {preset.steps.length}: {step.title}. {step.detail}
      </p>
      <details className="trace-text-alternative">
        <summary>Read the complete trace as text</summary>
        <ol>
          {preset.steps.map((item, index) => (
            <li key={item.id} aria-current={index === stepIndex ? "step" : undefined}>
              <strong>{item.title}:</strong> {item.detail}
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
