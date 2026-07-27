"use client";

import dynamic from "next/dynamic";

import type { Project } from "@/lib/types";

const ArchitectureDiagram = dynamic(
  () => import("@/components/architecture/ArchitectureDiagram").then((module) => module.ArchitectureDiagram),
  {
    loading: () => (
      <div className="diagram-loading" role="status">
        Loading architecture diagram…
      </div>
    )
  }
);

export function LazyArchitectureDiagram({ project }: { project: Project }) {
  return <ArchitectureDiagram project={project} />;
}
