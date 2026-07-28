"use client";

import { useState } from "react";
import { projects } from "@/lib/content";
import { localizeProject } from "@/content/project-copy";
import { localizedPath, type Locale } from "@/lib/i18n";
import discoveryData from "@/content/discovery.json";

export function ProjectDiscoveryDesk({ locale }: { locale: Locale }) {
  const data = discoveryData[locale] || discoveryData["en"];
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  
  // Find project based on exact preset ID or keyword matching
  const findMatch = (text: string) => {
    if (!text.trim()) return null;
    
    const lowerText = text.toLowerCase();
    
    // Check if it matches a preset prompt exactly
    const presetMatch = data.presets.find(p => lowerText === p.prompt.toLowerCase());
    if (presetMatch) return presetMatch.project;
    
    // Fallback to keyword scoring
    let bestMatch = null;
    let highestScore = 0;
    
    for (const preset of data.presets) {
      let score = 0;
      for (const keyword of preset.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          score++;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = preset.project;
      }
    }
    
    return highestScore > 0 ? bestMatch : "trip-planner"; // Default to first if typed random text
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      setResult(null);
      return;
    }
    
    setResult(findMatch(prompt));
  };
  
  const handlePreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
    setResult(findMatch(presetPrompt));
  };
  
  // Find project data if result is set
  const matchedProject = result ? projects.find(p => p.slug === result) : null;
  const copy = matchedProject ? localizeProject(matchedProject, locale) : null;

  return (
    <section className="discovery-desk-v3 page-shell-v2">
      <div className="discovery-desk-container">
        <header className="discovery-header">
          <h2>{data.heading}</h2>
          <p>{data.description}</p>
        </header>
        
        <div className="discovery-interactive">
          <form className="discovery-prompt-box" onSubmit={handleSubmit}>
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={data.presets[0].prompt}
              aria-label={data.heading}
            />
            <button type="submit" className="sim-send-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
          
          <div className="discovery-presets">
            {data.presets.map(preset => (
              <button 
                key={preset.id}
                type="button"
                className="practice-tab"
                onClick={() => handlePreset(preset.prompt)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          <p className="discovery-trust-label mono">{data.trustLabel}</p>
        </div>
        
        {matchedProject && copy && (
          <div className="discovery-result sim-step-detail">
            <div className="discovery-result-card">
              <div className="discovery-result-header">
                <span className="mono">{matchedProject.verb} · {String(matchedProject.index).padStart(2, '0')}</span>
                <h3>{copy.title}</h3>
              </div>
              
              <div className="discovery-result-body">
                <div className="discovery-result-col">
                  <h4>Vấn đề cốt lõi</h4>
                  <p>{copy.thesis}</p>
                </div>
                <div className="discovery-result-col">
                  <h4>Giải pháp kỹ thuật</h4>
                  <p>{copy.lesson}</p>
                </div>
              </div>
              
              <div className="discovery-result-actions v2-primary-actions">
                <a href={localizedPath(locale, `/projects/${matchedProject.slug}`)} className="primary-action-v2">
                  Xem chi tiết kiến trúc
                </a>
                <a href={localizedPath(locale, `/projects/${matchedProject.slug}`) + "#simulator"} className="secondary-action-v2">
                  Chạy mô phỏng (Simulator)
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
