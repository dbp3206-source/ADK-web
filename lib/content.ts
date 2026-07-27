import projectsData from "@/content/projects.json";
import tracesData from "@/content/traces.json";
import glossaryData from "@/content/glossary.json";
import type { Project, TracePreset } from "@/lib/types";

export const projects = (projectsData as Project[]).sort((a, b) => a.index - b.index);
export const traces = tracesData as TracePreset[];
export const glossary = glossaryData as { term: string; short: string }[];

export const filterPatterns = [
  "Tool",
  "State",
  "Transfer",
  "AgentTool",
  "Parallel",
  "Sequential",
  "Loop",
  "RAG",
  "MCP",
  "A2A"
] as const;

export type FilterPattern = (typeof filterPatterns)[number];

const projectFilterMap: Record<string, FilterPattern[]> = {
  "trip-planner": ["Tool", "State"],
  "script-team": ["State", "Transfer"],
  "worldcup-analyst": ["Tool", "AgentTool"],
  "love-advisor": ["Parallel", "Sequential"],
  "dashboard-insights": ["Tool", "Sequential", "Loop", "RAG", "MCP"],
  "a2a-orchestrator": ["A2A"]
};

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectFilters(slug: string) {
  return projectFilterMap[slug] ?? [];
}

export function filterProjects(selected: string[]) {
  if (selected.length === 0) return projects;
  return projects.filter((project) => {
    const available = getProjectFilters(project.slug);
    return selected.every((pattern) => available.includes(pattern as FilterPattern));
  });
}

export function getTraceForProject(slug: string) {
  return traces.find((trace) => trace.targetProject === slug);
}

export function getAdjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return {
    previous: index > 0 ? projects[index - 1] : undefined,
    next: index < projects.length - 1 ? projects[index + 1] : undefined
  };
}
