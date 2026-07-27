"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const ProjectLab = dynamic(
  () => import("@/components/labs/ProjectLab").then((module) => module.ProjectLab),
  {
    loading: () => (
      <div className="lab-loading" role="status">
        <span className="mono">LOADING LOCAL LAB</span>
        <p>The static architecture and limitation text remain available.</p>
      </div>
    )
  }
);

export function LazyProjectLab({ slug, locale, featured = false }: { slug: string; locale: Locale; featured?: boolean }) {
  const [ready, setReady] = useState(false);
  const boundary = useRef<HTMLDivElement>(null);
  const dict = getDictionary(locale);
  useEffect(() => {
    const node = boundary.current;
    if (!node || !("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "600px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={boundary} className="lazy-lab-boundary" id={featured ? undefined : "lab"}>
      {ready ? <ProjectLab slug={slug} locale={locale} featured={featured} /> : (
        <div className="lab-loading" role="status">
          <span className="mono">LOCAL LAB · LAZY BOUNDARY</span>
          <p>{dict.lab.staticFallback}</p>
          <noscript>{dict.common.localSimulation}</noscript>
        </div>
      )}
    </div>
  );
}
