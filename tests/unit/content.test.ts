import { describe, expect, it } from "vitest";

import { filterProjects, getProjectFilters, projects } from "@/lib/content";
import { getRealWorldCase } from "@/content/real-world-cases";
import { conceptGuides, localizeConceptGuide } from "@/content/learning-v4/concept-guides";

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

  it("provides six localized real-world cases with simulator targets", () => {
    const cases = projects.map((project) => getRealWorldCase(project.slug, "vi"));
    expect(cases).toHaveLength(6);
    for (const item of cases) {
      expect(item?.contextChips).toHaveLength(4);
      expect(item?.pains).toHaveLength(3);
      expect(item?.constraints).toHaveLength(3);
      expect(item?.expectedArtifacts[0].previewData).toHaveLength(3);
      expect(item?.simulatorCaseId).toMatch(/^(TP|ST|WC|LA|DI|A2A)-01$/);
    }
  });

  it("provides the six-part beginner guide for all 17 concepts", () => {
    expect(Object.keys(conceptGuides)).toHaveLength(17);
    for (const id of Object.keys(conceptGuides)) {
      const guide = localizeConceptGuide(id, "en");
      expect(guide.definition.split(" ").length).toBeLessThanOrEqual(25);
      expect(guide.needSignals).toHaveLength(3);
      expect(guide.applySteps).toHaveLength(3);
      expect(guide.everydayExample.length).toBeGreaterThan(10);
      expect(guide.workExample.length).toBeGreaterThan(10);
    }
  });
});
