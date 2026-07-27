import { describe, expect, it } from "vitest";

import { getDictionary, localizedPath, localeFromPath } from "@/lib/i18n";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, shape(child)]));
  }
  return typeof value;
}

describe("locale dictionaries and routes", () => {
  it("keeps Vietnamese and English dictionary structures in parity", () => {
    expect(shape(getDictionary("en"))).toEqual(shape(getDictionary("vi")));
  });

  it("preserves a route while switching locale", () => {
    expect(localizedPath("vi", "/projects/trip-planner")).toBe("/vi/projects/trip-planner");
    expect(localizedPath("en", "/vi/system")).toBe("/en/system");
    expect(localeFromPath("/en/projects")).toBe("en");
    expect(localeFromPath("/projects")).toBe("vi");
  });
});
