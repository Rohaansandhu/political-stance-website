// Display order: left_right as the headline, then the axes the handoff
// flags as carrying the most independent signal, then the ones that
// largely track left_right (shown with an overlap caveat where relevant).
export const AXIS_ORDER = [
  "left_right",
  "state_power",
  "fiscal",
  "security",
  "trade",
  "federalism",
  "institutional",
  "economic",
  "social",
  "executive_power",
  "global",
];

// Apply to few enough bills that per-member scores rest on weaker evidence.
export const SPARSE_AXES = new Set(["trade", "global"]);

// Axes that correlate strongly with left_right chamber-wide and shouldn't be
// read as fully independent dimensions (see data pipeline handoff §6).
export const OVERLAP_NOTES: Record<string, string> = {
  economic:
    "Tends to closely track Left-Right for most members — treat as related, not fully independent.",
  social:
    "Agrees in sign with Left-Right on ~98% of the bills it applies to, and applies to relatively few bills — treat as overlapping with Left-Right rather than independent.",
};

export function sortAxisIds(axisIds: string[]): string[] {
  return [
    ...AXIS_ORDER.filter((id) => axisIds.includes(id)),
    ...axisIds.filter((id) => !AXIS_ORDER.includes(id)),
  ];
}
