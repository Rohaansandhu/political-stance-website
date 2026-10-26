// Shared, pure math for the axis compass chart and the legislator profile's
// axis fingerprint. No React/Chakra/recharts imports here on purpose --
// both consumers need the exact same scaling/clamping/correlation logic.

export interface RosterAxisEntry {
  score: number;
  within_party_z: number | null;
  // Precomputed z-score vs. the current chamber (population SD), written by
  // the pipeline's create_axis_stats.py -- preferred over computing this in
  // the browser, which has no minimum-bill-count cutoff and can drift
  // slightly from what the pipeline's own stats/correlations assume.
  chamber_z: number | null;
  bill_count: number;
  current_percentile_rank: number;
}

export interface RosterMember {
  member_id: string;
  official_full_name: string;
  party: "D" | "R" | "I";
  state: string;
  current: boolean;
  axes: Record<string, RosterAxisEntry>;
}

export type ScaleMode = "chamber" | "party" | "raw";

export function filterCurrent(roster: RosterMember[]): RosterMember[] {
  return roster.filter((m) => m.current);
}

export function getScaledValue(
  member: RosterMember,
  axisId: string,
  scale: ScaleMode,
): number | null {
  const entry = member.axes[axisId];
  if (!entry) return null;

  if (scale === "raw") return entry.score;
  if (scale === "party") return entry.within_party_z;
  return entry.chamber_z; // scale === "chamber"
}

export function domainForScale(scale: ScaleMode): [number, number] {
  return scale === "raw" ? [-1, 1] : [-3.2, 3.2];
}

export function clampToDomain(
  value: number,
  domain: [number, number],
): { clamped: number; isPinned: boolean } {
  const [, hi] = domain;
  // Raw scale's domain (±1) IS the natural bound -- scores can't exceed it,
  // so nothing is ever pinned there. Chamber/party scales use a wider
  // domain (±3.2) but pin outliers at the inner ±3 edge, per spec.
  if (hi === 1) {
    return { clamped: Math.max(-1, Math.min(1, value)), isPinned: false };
  }

  const pinEdge = 3;
  if (value > pinEdge) return { clamped: pinEdge, isPinned: true };
  if (value < -pinEdge) return { clamped: -pinEdge, isPinned: true };
  return { clamped: value, isPinned: false };
}

export interface PlottedPartyPoint {
  party: "D" | "R" | "I";
  x: number;
  y: number;
}

export function computePartyAverages(
  points: PlottedPartyPoint[],
): Record<"D" | "R" | "I", { x: number; y: number; n: number } | null> {
  const result: Record<"D" | "R" | "I", { x: number; y: number; n: number } | null> = {
    D: null,
    R: null,
    I: null,
  };

  (["D", "R", "I"] as const).forEach((party) => {
    const partyPoints = points.filter((p) => p.party === party);
    if (partyPoints.length === 0) return;
    const x = partyPoints.reduce((a, p) => a + p.x, 0) / partyPoints.length;
    const y = partyPoints.reduce((a, p) => a + p.y, 0) / partyPoints.length;
    result[party] = { x, y, n: partyPoints.length };
  });

  return result;
}

// Fallback only -- prefer the pipeline's precomputed axis_stats.correlations
// (fetched via useAxisStatsDoc) when available, since it applies the same
// minimum-bill-count cutoff as the chamber/party z-scores themselves. This
// is used when a pair/model has no precomputed entry.
export function pearsonR(points: { x: number; y: number }[]): number | null {
  const n = points.length;
  if (n < 2) return null;

  const meanX = points.reduce((a, p) => a + p.x, 0) / n;
  const meanY = points.reduce((a, p) => a + p.y, 0) / n;

  let num = 0;
  let denomX = 0;
  let denomY = 0;
  for (const p of points) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    num += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  if (denomX === 0 || denomY === 0) return null;
  return num / Math.sqrt(denomX * denomY);
}

export function countExcludedForPartyScale(
  roster: RosterMember[],
  axisId: string,
): number {
  return roster.filter(
    (m) => m.axes[axisId] && m.axes[axisId].within_party_z === null,
  ).length;
}

// Deterministic pseudo-random jitter, seeded by a string id, so the same
// member always lands at the same vertical offset across re-renders.
export function jitter(seed: string, amplitude: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  // Map the hash to [-amplitude, amplitude] via a sine transform for a
  // decently uniform-looking spread without pulling in a PRNG library.
  const normalized = Math.sin(hash) * 0.5 + 0.5; // [0, 1]
  return (normalized * 2 - 1) * amplitude;
}
