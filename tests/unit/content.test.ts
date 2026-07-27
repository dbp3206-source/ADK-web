import { describe, expect, it } from "vitest";

import { filterProjects, getProjectFilters, projects } from "@/lib/content";

describe("project content model", () => {
  it("keeps the approved capability order", () => {
    expect(projects.map((project) => project.verb)).toEqual([
      "ACT",
      "DELEGATE",
      "COMPUTE",
      "COMPOSE",
      "VERIFY",
      "CONNECT"
    ]);
  });

  it("uses AND semantics for pattern filters", () => {
    expect(filterProjects(["Tool", "State"]).map((project) => project.slug)).toEqual(["trip-planner"]);
    expect(filterProjects(["State", "A2A"])).toEqual([]);
  });

  it("maps the deepest project to workflow, loop, retrieval and MCP", () => {
    expect(getProjectFilters("dashboard-insights")).toEqual(
      expect.arrayContaining(["Sequential", "Loop", "RAG", "MCP"])
    );
  });

  it("keeps at least three limitations and roadmap items per project", () => {
    for (const project of projects) {
      expect(project.limitations.length).toBeGreaterThanOrEqual(3);
      expect(project.roadmap.length).toBeGreaterThanOrEqual(3);
    }
  });
});
