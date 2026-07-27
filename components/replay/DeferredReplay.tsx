"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

import type { Locale } from "@/lib/i18n";

type ReplayProps = { slug: string; locale: Locale; compact?: boolean };

export function DeferredReplay({ slug, locale, fallback }: ReplayProps & { fallback: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [Player, setPlayer] = useState<ComponentType<ReplayProps> | null>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      import("./VerifiedReplayPlayer").then((module) => setPlayer(() => module.VerifiedReplayPlayer));
    }, { rootMargin: "500px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={host} className="deferred-workbench">{Player ? <Player slug={slug} locale={locale} compact /> : fallback}</div>;
}
