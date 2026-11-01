// Shared, pure display logic for the legislator page: how a percentile turns
// into a pole, band, headline, and rank. No React/Chakra imports here so every
// section reads the same way.
import politicalAxes from "../../../data/politicalAxes.json";
import { filterCurrent, type RosterMember } from "../CongressData/axisStats";

export type Comparison = "chamber" | "party";
export type Side = "negative" | "positive";

export interface Position {
  // 0-1, higher means closer to the positive pole.
  percentile: number;
  // 1 is the member closest to the positive pole.
  rank: number;
  total: number;
}

export interface Poles {
  negative: string;
  positive: string;
}

// Same cutoff the pipeline uses before computing a within-party z-score.
export const MIN_BILLS = 10;

// The official pole labels ("Restraint / Dovish") read badly inside "More X
// than 63%", so these are the words used in sentences. Strip ends still show
// the official labels.
const AXIS_POLE_PHRASES: Record<string, Poles> = {
  left_right: { negative: "Liberal", positive: "Conservative" },
  economic: { negative: "Public-Oriented", positive: "Market-Oriented" },
  fiscal: { negative: "Pro-Spending", positive: "Fiscally Restrained" },
  state_power: { negative: "Libertarian", positive: "Authoritarian" },
  social: { negative: "Progressive", positive: "Traditional" },
  security: { negative: "Dovish", positive: "Hawkish" },
  trade: { negative: "Free Trade", positive: "Protectionist" },
  global: { negative: "Multilateral", positive: "Sovereigntist" },
  institutional: { negative: "Establishment", positive: "Insurgent" },
  executive_power: { negative: "Pro-Congress", positive: "Pro-Executive" },
  federalism: { negative: "Centralized", positive: "Decentralized" },
};

export const CATEGORY_POLES: Poles = {
  negative: "Liberal",
  positive: "Conservative",
};

// Fixed so every member's page reads the same way.
export const AXIS_GROUPS: { label: string; axes: string[] }[] = [
  { label: "Overall", axes: ["left_right", "institutional"] },
  { label: "Economy", axes: ["economic", "fiscal", "trade"] },
  {
    label: "Government power",
    axes: ["state_power", "executive_power", "federalism"],
  },
  { label: "Social", axes: ["social"] },
  { label: "World", axes: ["security", "global"] },
];

export function axisDefinition(axisId: string) {
  return politicalAxes.political_axes.find((a) => a.id === axisId);
}

export function axisName(axisId: string): string {
  if (axisId === "left_right") return "Left–Right";
  return axisDefinition(axisId)?.name ?? axisId;
}

export function axisPolePhrases(axisId: string): Poles {
  const phrases = AXIS_POLE_PHRASES[axisId];
  if (phrases) return phrases;
  const axis = axisDefinition(axisId);
  return {
    negative: axis?.negative_pole.label ?? "Negative",
    positive: axis?.positive_pole.label ?? "Positive",
  };
}

// Colors follow direction, not party, so party colors stay on dots and badges.
export const SIDE_COLOR: Record<Side, string> = {
  negative: "cyan.fg",
  positive: "orange.fg",
};

export function sideOf(percentile: number): Side {
  return percentile >= 0.5 ? "positive" : "negative";
}

export function towardPoleShare(percentile: number): number {
  return percentile >= 0.5 ? percentile : 1 - percentile;
}

// The stored percentile counts the member themself, so the top member would
// otherwise read "more than 100%".
export function displayPercent(share: number): number {
  return Math.min(99, Math.round(share * 100));
}

// Stored ranks count from the positive pole, with ties sharing the best rank.
// Counting from the other pole means knowing how many members scored lower,
// which the rank and the (tie-averaged) percentile pin down together. Simply
// flipping the rank would put a tied member behind everyone they tie with.
export function rankFromPole(position: Position): number {
  if (sideOf(position.percentile) === "positive") return position.rank;
  const { percentile, rank, total } = position;
  const lower = Math.round(2 * percentile * total - total + rank - 2);
  return Math.min(total, Math.max(1, lower + 1));
}

export function bandLabel(share: number, pole: string, middle: string): string {
  if (share >= 0.9) return `Very ${pole}`;
  if (share >= 0.7) return pole;
  if (share >= 0.55) return `Leans ${pole}`;
  return middle;
}

// ---- Who the member is being compared against ----

export type ChamberName = "House" | "Senate";

export interface MemberContext {
  memberId: string;
  lastName: string;
  model: string;
  chamber: ChamberName;
  party: string | undefined;
  comparison: Comparison;
  canComparePartyPeers: boolean;
}

export function partySingular(party: string | undefined): string | null {
  if (party === "R") return "Republican";
  if (party === "D") return "Democratic";
  return null;
}

export function partyMemberNoun(party: string | undefined): string | null {
  if (party === "R") return "Republican";
  if (party === "D") return "Democrat";
  return null;
}

export function partyPlural(party: string | undefined): string | null {
  if (party === "R") return "Republicans";
  if (party === "D") return "Democrats";
  return null;
}

export function chamberPartyLabel(ctx: MemberContext): string {
  return `${ctx.chamber} ${partyPlural(ctx.party) ?? "members"}`;
}

function groupLabel(ctx: MemberContext): string {
  return ctx.comparison === "party" ? chamberPartyLabel(ctx) : `the ${ctx.chamber}`;
}

function middleLabel(ctx: MemberContext): string {
  return ctx.comparison === "party"
    ? "Middle of the party"
    : `Middle of the ${ctx.chamber}`;
}

export interface PositionText {
  side: Side;
  pole: string;
  percent: number;
  band: string;
  headline: string;
  rankText: string;
}

export function describePosition(
  position: Position,
  poles: Poles,
  ctx: MemberContext,
): PositionText {
  const side = sideOf(position.percentile);
  const pole = poles[side];
  const share = towardPoleShare(position.percentile);
  const percent = displayPercent(share);
  return {
    side,
    pole,
    percent,
    band: bandLabel(share, pole, middleLabel(ctx)),
    headline: `More ${pole} than ${percent}% of ${groupLabel(ctx)}`,
    rankText: `#${rankFromPole(position)} of ${position.total} most ${pole}`,
  };
}

// e.g. "more often than 78% of the House"
export function loyaltyComparison(position: Position, group: string): string {
  // The axis runs toward Insurgent, so a low percentile means high loyalty.
  const isMoreLoyal = position.percentile < 0.5;
  const share = towardPoleShare(position.percentile);
  return `${isMoreLoyal ? "more" : "less"} often than ${displayPercent(share)}% of ${group}`;
}

// ---- Where the numbers come from ----

interface StoredRanks {
  bill_count: number;
  rank?: number;
  percentile_rank?: number;
  total_members?: number;
  current_rank?: number;
  current_percentile_rank?: number;
  total_current_members?: number;
}

// Former members have no rank among current members, so they fall back to
// their rank among everyone on record.
export function chamberPosition(info: StoredRanks | undefined): Position | null {
  if (!info || info.bill_count < MIN_BILLS) return null;
  if (
    info.current_rank != null &&
    info.current_rank !== -1 &&
    info.current_percentile_rank != null
  ) {
    return {
      percentile: info.current_percentile_rank,
      rank: info.current_rank,
      total: info.total_current_members ?? 0,
    };
  }
  if (info.rank != null && info.rank !== -1 && info.percentile_rank != null) {
    return {
      percentile: info.percentile_rank,
      rank: info.rank,
      total: info.total_members ?? 0,
    };
  }
  return null;
}

// Same ranking as pandas rank(pct=True, method="average"), which is what the
// pipeline's current_percentile_rank uses, so party view reads the same as
// chamber view.
export function positionAmong(value: number, scores: number[]): Position | null {
  if (scores.length === 0) return null;
  const lower = scores.filter((s) => s < value).length;
  const equal = scores.filter((s) => s === value).length;
  return {
    percentile: (lower + (equal + 1) / 2) / scores.length,
    rank: scores.length - lower - equal + 1,
    total: scores.length,
  };
}

function currentPartyPeers(
  roster: RosterMember[],
  party: string | undefined,
): RosterMember[] {
  return filterCurrent(roster).filter((m) => m.party === party);
}

export function axisPartyPosition(
  roster: RosterMember[],
  party: string | undefined,
  axisId: string,
  info: { score: number; bill_count: number } | undefined,
): Position | null {
  if (!info || info.bill_count < MIN_BILLS) return null;
  const scores = currentPartyPeers(roster, party)
    .map((m) => m.axes?.[axisId])
    .filter((entry) => entry && entry.bill_count >= MIN_BILLS)
    .map((entry) => entry.score);
  return positionAmong(info.score, scores);
}

export function categoryPartyPosition(
  roster: RosterMember[],
  party: string | undefined,
  category: string,
  info: { score: number; bill_count: number } | undefined,
): Position | null {
  if (!info || info.bill_count < MIN_BILLS) return null;
  const scores = currentPartyPeers(roster, party)
    .map((m) => m.primary_categories?.[category])
    .filter((entry) => entry && entry.bill_count >= MIN_BILLS)
    .map((entry) => entry!.score);
  return positionAmong(info.score, scores);
}

// How far from the middle of the member's own party, used for "most distinctive".
export function distinctiveness(position: Position | null): number {
  return position ? Math.abs(position.percentile - 0.5) : -1;
}

// ---- Links and small formatters ----

// Some newer members have no official_full name on record.
export function displayName(name: {
  official_full?: string;
  first?: string;
  last?: string;
}): string {
  return name.official_full ?? [name.first, name.last].filter(Boolean).join(" ");
}

export function voteHistoryUrl(
  ctx: Pick<MemberContext, "memberId" | "model">,
  params: Record<string, string> = {},
): string {
  const query = new URLSearchParams({ model: ctx.model, ...params });
  return `/legislators/${ctx.memberId}/votes?${query.toString()}`;
}

const BILL_TYPE_LABELS: Record<string, string> = {
  hr: "H.R.",
  s: "S.",
  hjres: "H.J.Res.",
  sjres: "S.J.Res.",
  hres: "H.Res.",
  sres: "S.Res.",
  hconres: "H.Con.Res.",
  sconres: "S.Con.Res.",
};

export function formatBillId(billId: string): string {
  // e.g. "hr351-114" -> "H.R. 351"
  const match = billId.match(/^([a-z]+)(\d+)-(\d+)$/i);
  if (!match) return billId.toUpperCase();
  const [, type, number] = match;
  return `${BILL_TYPE_LABELS[type.toLowerCase()] ?? type.toUpperCase()} ${number}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
