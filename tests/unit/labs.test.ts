import { describe, expect, it } from "vitest";

import { detectRevenueDrops, goalsPerMatch, parseTripState, routeWithVisibleRules, shotConversion, syntheticSalesRows } from "@/lib/labs";

describe("deterministic micro-lab helpers", () => {
  it("detects only the synthetic organic revenue drop at a 20% threshold", () => {
    const anomalies = detectRevenueDrops(syntheticSalesRows, 20).filter((item) => item.isAnomaly);
    expect(anomalies).toHaveLength(1);
    expect(anomalies[0]).toMatchObject({ channel: "Organic", period: "2026-03" });
    expect(anomalies[0].evidenceRows).toEqual(["2026-02/Organic", "2026-03/Organic"]);
  });

  it("uses visible deterministic routing rules and a safe no-match fallback", () => {
    expect(routeWithVisibleRules("Phân tích doanh thu CSV").specialist).toBe("dashboard-insights");
    expect(routeWithVisibleRules("unrelated request").specialist).toBeNull();
  });

  it("does not divide by zero", () => {
    expect(goalsPerMatch(10, 0)).toBe(0);
    expect(shotConversion(3, 0)).toBe(0);
    expect(goalsPerMatch(9, 3)).toBe(3);
  });

  it("rejects malformed trip state", () => {
    expect(parseTripState("not-json")).toBeNull();
    expect(parseTripState('{"destination":"Hue"}')).toBeNull();
  });
});
