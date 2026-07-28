import { describe, expect, it } from "vitest";

import { getOwnerName, getUtilityLinks, isRealUrl } from "@/lib/site";

describe("conditional external links", () => {
  it("hides empty and placeholder values", () => {
    expect(isRealUrl("")).toBe(false);
    expect(isRealUrl("__CONFIG__")).toBe(false);
    expect(getOwnerName()).toBe("dbp3206");
    expect(getUtilityLinks()).toEqual([
      { label: "GitHub", href: "https://github.com/dbp3206-source" }
    ]);
  });

  it("accepts real web and mail links only", () => {
    expect(isRealUrl("https://example.com")).toBe(true);
    expect(isRealUrl("mailto:owner@example.com")).toBe(true);
    expect(isRealUrl("javascript:alert(1)")).toBe(false);
  });
});
