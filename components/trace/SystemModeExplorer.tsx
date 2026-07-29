"use client";

import { useState } from "react";

import { SystemExplorerV2 } from "@/components/trace/SystemExplorerV2";
import { getTracePresets } from "@/content/trace-presets-v2";
import type { Locale } from "@/lib/i18n";

export function SystemModeExplorer({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<"easy" | "technical">("easy");
  const [presetIndex, setPresetIndex] = useState(0);
  const presets = getTracePresets(locale);
  const preset = presets[presetIndex];
  const vi = locale === "vi";

  const selectMode = (nextMode: "easy" | "technical") => {
    setMode(nextMode);
    window.requestAnimationFrame(() => {
      document.getElementById(`system-mode-${nextMode}`)?.focus({ preventScroll: true });
    });
  };

  return (
    <section className="system-mode-explorer" aria-label={vi ? "Chế độ xem hệ thống" : "System viewing mode"}>
      <div
        className="system-mode-switch"
        role="tablist"
        aria-label={vi ? "Mức chi tiết" : "Detail level"}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            selectMode(mode === "easy" ? "technical" : "easy");
          }
        }}
      >
        <button
          id="system-mode-easy"
          type="button"
          role="tab"
          aria-selected={mode === "easy"}
          aria-controls="system-panel-easy"
          tabIndex={mode === "easy" ? 0 : -1}
          onClick={() => selectMode("easy")}
        >
          {vi ? "Dễ hiểu" : "Easy to follow"}
        </button>
        <button
          id="system-mode-technical"
          type="button"
          role="tab"
          aria-selected={mode === "technical"}
          aria-controls="system-panel-technical"
          tabIndex={mode === "technical" ? 0 : -1}
          onClick={() => selectMode("technical")}
        >
          {vi ? "Chi tiết kỹ thuật" : "Technical details"}
        </button>
      </div>

      {mode === "easy" ? (
        <div id="system-panel-easy" className="easy-system-view" role="tabpanel" aria-labelledby="system-mode-easy">
          <label>
            <span>{vi ? "Chọn tình huống" : "Choose a scenario"}</span>
            <select value={presetIndex} onChange={(event) => setPresetIndex(Number(event.target.value))}>
              {presets.map((item, index) => <option value={index} key={item.id}>{item.label}</option>)}
            </select>
          </label>
          <p className="easy-system-request"><span>USER</span>{preset.request}</p>
          <ol className="easy-system-trace">
            {preset.steps.map((step) => (
              <li key={step.id}>
                <span className="mono">{String(step.id).padStart(2, "0")}</span>
                <div><strong>{step.title}</strong><p>{step.detail}</p></div>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div id="system-panel-technical" role="tabpanel" aria-labelledby="system-mode-technical">
          <SystemExplorerV2 locale={locale} />
        </div>
      )}
    </section>
  );
}
