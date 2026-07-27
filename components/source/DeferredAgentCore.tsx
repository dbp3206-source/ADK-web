"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

import type { Locale } from "@/lib/i18n";

type ExplorerProps = { locale: Locale; initialProject?: string; compact?: boolean };

export function DeferredAgentCore({ locale, fallback }: { locale: Locale; fallback: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [Explorer, setExplorer] = useState<ComponentType<ExplorerProps> | null>(null);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let disposed = false;
    const loadExplorer = () => {
      import("./AgentCoreExplorer").then((module) => {
        if (!disposed) setExplorer(() => module.AgentCoreExplorer);
      });
    };
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loadExplorer();
    }, { rootMargin: "500px 0px" });
    observer.observe(node);
    const idleFallback = window.setTimeout(loadExplorer, 1500);
    return () => {
      disposed = true;
      window.clearTimeout(idleFallback);
      observer.disconnect();
    };
  }, []);
  return <div ref={host} className="deferred-workbench">{Explorer ? <Explorer locale={locale} /> : fallback}</div>;
}
