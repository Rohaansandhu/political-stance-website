// Shape of legislator_profiles.axes.<axis_id> (schema v5 / axis_schema_version 1).
// Extra fields beyond RankStats/CategoryStats in the pipeline's AxisStats model
// (raw_score, party_prior, empirical_m) are kept optional here since they're
// present in the real data but not yet reflected in the pipeline's Pydantic model.
export interface AxisInfo {
  score: number;
  raw_score?: number;
  bill_count: number;
  party_prior?: number;
  empirical_m?: number;
  // z-score among same-party members; null for independents/small groups/no spread
  within_party_z: number | null;
  by_category?: Record<string, { score: number; bill_count: number }>;
  // Only present on the computed "institutional" axis
  defection_rate?: number;
  rank: number;
  percentile_rank: number;
  total_members: number;
  current_rank: number;
  current_percentile_rank: number;
  total_current_members: number;
}

export type Axes = Record<string, AxisInfo>;
