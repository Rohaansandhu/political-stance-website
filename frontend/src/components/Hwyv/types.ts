export type Chamber = "house" | "senate";
export type CastVote = "yea" | "nay";
export type StoredVote = CastVote | "skip";

export interface BriefCard {
  vote_id: string;
  bill_id: string;
  chamber: Chamber;
  congress: number;
  date: string;
  short_title: string;
  popular_title: string | null;
  brief: string;
  key_provisions: string[];
  needs_two_thirds: boolean;
  omnibus: boolean;
  primary_categories: string[];
  featured: boolean;
}

export interface PartyTally {
  yea: number;
  nay: number;
  not_voting: number;
}

export interface AxisScore {
  axis: string;
  position: number;
  relevance: number;
  reasoning: string;
}

export interface RevealMember {
  bioguide_id: string;
  member_id: string;
  name: string;
  party: "D" | "R" | "I";
  state: string;
  vote: CastVote | "not_voting";
  against_party: boolean;
}

export interface RevealCard {
  vote_id: string;
  bill_id: string;
  short_title: string;
  result: string;
  requires: string | null;
  needs_two_thirds: boolean;
  tally: Record<string, PartyTally>;
  d_majority_yea: boolean;
  r_majority_yea: boolean;
  sponsor: string | null;
  sponsor_party: string | null;
  source_url: string | null;
  left_right: Record<string, number>;
  axes: AxisScore[];
  model: string;
  schema_version: number;
  axis_schema_version: number;
  members: RevealMember[];
  // Current members who weren't in the chamber for this vote.
  not_in_office: number;
}

export interface MatchRow {
  bioguide_id: string;
  member_id: string;
  name: string;
  party: "D" | "R" | "I";
  state: string;
  agree: number;
  shared: number;
  agreed: number;
}

export interface AxisPosition {
  score: number;
  chamber_z: number | null;
  n_votes: number;
}

export interface MatchResult {
  n_votes: number;
  ignored: string[];
  matches: { top: MatchRow[]; bottom: MatchRow[] };
  by_category: Record<
    string,
    { n_votes: number; top: MatchRow[]; party: Record<string, number> }
  >;
  axes: Record<string, AxisPosition | null> | null;
  // Relevant votes per axis, so a locked axis can say how many more it needs.
  axis_progress: Record<string, number> | null;
  reason?: string;
  party_agreement: Record<string, number>;
}
