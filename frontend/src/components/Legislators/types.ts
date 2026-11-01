export interface AxisInfo {
  score: number;
  raw_score?: number;
  bill_count: number;
  within_party_z: number | null;
  by_category: Record<string, { score: number; bill_count: number }>;
  rank: number;
  percentile_rank: number;
  total_members: number;
  current_rank: number;
  current_percentile_rank: number;
  total_current_members: number;
  defection_rate?: number;
}

export interface CategoryInfo {
  score: number;
  bill_count: number;
  rank: number;
  percentile_rank: number;
  total_members?: number;
  current_rank: number;
  current_percentile_rank: number;
  total_current_members?: number;
}

export interface Term {
  type: string;
  start: string;
  end: string;
  state: string;
  district?: number;
  class?: number;
  party: string;
  url?: string;
  phone?: string;
}

export interface LeadershipRole {
  title: string;
  chamber?: string;
  start: string;
  end?: string;
}

export interface LegislatorData {
  member_id: string;
  name: { official_full?: string; first?: string; last?: string };
  bio: { gender: string; birthday: string };
  id: { bioguide?: string; lis?: string };
  party?: string;
  state: string;
  current?: boolean;
  vote_count: number;
  terms?: Term[];
  leadership_roles?: LeadershipRole[];
  primary_categories: Record<string, CategoryInfo>;
  axes?: Record<string, AxisInfo>;
}

export interface MemberVote {
  vote_id: string;
  bill_id: string;
  congress: number;
  title: string | null;
  summary: string | null;
  date: string;
  vote: "Yea" | "Nay";
  question: string | null;
  result: string | null;
  party_split: Record<string, { yea: number; nay: number }>;
  broke_with_party: boolean;
  contested: boolean;
  left_right: number | null;
  categories: { name: string; impact: number }[];
  axes: { axis: string; impact: number }[];
  impact: number | null;
}

export interface MemberVotesResponse {
  total: number;
  scored_total: number;
  page: number;
  limit: number;
  results: MemberVote[];
  facets: { congresses: number[]; categories: string[]; axes: string[] };
}

export interface AxisCategoryCell {
  axis: string;
  category: string;
  bill_count: number;
  stats: {
    chamber: { percentile: number; rank: number; total: number };
    party: { percentile: number; rank: number; total: number } | null;
  } | null;
}
