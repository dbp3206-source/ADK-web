export interface MetricRow {
  period: string;
  channel: string;
  revenue: number;
  orders: number;
}

export interface RevenueChange {
  channel: string;
  period: string;
  previousValue: number;
  currentValue: number;
  percentChange: number;
  thresholdPercent: number;
  isAnomaly: boolean;
  evidenceRows: [string, string];
}

export const syntheticSalesRows: MetricRow[] = [
  { period: "2026-01", channel: "Organic", revenue: 120000, orders: 320 },
  { period: "2026-02", channel: "Organic", revenue: 124000, orders: 331 },
  { period: "2026-03", channel: "Organic", revenue: 88000, orders: 248 },
  { period: "2026-01", channel: "Paid", revenue: 150000, orders: 290 },
  { period: "2026-02", channel: "Paid", revenue: 154000, orders: 301 },
  { period: "2026-03", channel: "Paid", revenue: 152000, orders: 297 }
];

export function detectRevenueDrops(rows: MetricRow[], thresholdPercent: number): RevenueChange[] {
  const threshold = Number.isFinite(thresholdPercent) ? Math.min(100, Math.max(0, Math.abs(thresholdPercent))) : 20;
  const groups = new Map<string, MetricRow[]>();
  for (const row of rows) groups.set(row.channel, [...(groups.get(row.channel) ?? []), row]);

  return [...groups.entries()].flatMap(([channel, channelRows]) => {
    const sorted = [...channelRows].sort((a, b) => a.period.localeCompare(b.period));
    return sorted.slice(1).map((current, index) => {
      const previous = sorted[index];
      const percentChange = previous.revenue === 0
        ? 0
        : ((current.revenue - previous.revenue) / previous.revenue) * 100;
      return {
        channel,
        period: current.period,
        previousValue: previous.revenue,
        currentValue: current.revenue,
        percentChange,
        thresholdPercent: threshold,
        isAnomaly: percentChange <= -threshold,
        evidenceRows: [`${previous.period}/${channel}`, `${current.period}/${channel}`] as [string, string]
      };
    });
  });
}

export interface RoutingRule {
  specialist: string;
  keywords: string[];
}

export const routingRules: RoutingRule[] = [
  { specialist: "trip-planner", keywords: ["trip", "travel", "itinerary", "lịch", "chuyến đi", "huế", "đà nẵng"] },
  { specialist: "script-team", keywords: ["script", "kịch bản", "brief", "draft", "critique", "revision"] },
  { specialist: "worldcup-analyst", keywords: ["world cup", "football", "bóng đá", "đội tuyển", "thống kê"] },
  { specialist: "love-advisor", keywords: ["preference", "sở thích", "giao tiếp", "planning style"] },
  { specialist: "dashboard-insights", keywords: ["csv", "revenue", "doanh thu", "dashboard", "insight", "anomaly", "bất thường"] }
];

export interface RoutingResult {
  specialist: string | null;
  matchedKeywords: string[];
  candidates: Array<{ specialist: string; matchedKeywords: string[]; score: number }>;
}

export function routeWithVisibleRules(request: string, rules = routingRules): RoutingResult {
  const normalized = request.trim().toLocaleLowerCase();
  const candidates = rules
    .map((rule) => {
      const matchedKeywords = rule.keywords.filter((keyword) => normalized.includes(keyword.toLocaleLowerCase()));
      return { specialist: rule.specialist, matchedKeywords, score: matchedKeywords.length };
    })
    .sort((a, b) => b.score - a.score || a.specialist.localeCompare(b.specialist));
  const winner = candidates[0];
  return {
    specialist: winner && winner.score > 0 ? winner.specialist : null,
    matchedKeywords: winner?.matchedKeywords ?? [],
    candidates
  };
}

export interface TripDemoState {
  destination: string;
  days: number;
  budgetTier: string;
  preferences: string[];
  savedAt: string;
}

export const tripStorageKey = "adk-trip-planner-demo-state";

export function parseTripState(raw: string | null): TripDemoState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<TripDemoState>;
    if (
      typeof value.destination !== "string" ||
      typeof value.days !== "number" ||
      typeof value.budgetTier !== "string" ||
      !Array.isArray(value.preferences) ||
      typeof value.savedAt !== "string"
    ) return null;
    return value as TripDemoState;
  } catch {
    return null;
  }
}

export function goalsPerMatch(goals: number, matches: number) {
  return matches > 0 ? goals / matches : 0;
}

export function shotConversion(goals: number, shots: number) {
  return shots > 0 ? (goals / shots) * 100 : 0;
}
