// Pure display logic for How Would You Vote? cards.
import politicalAxes from "../../../data/politicalAxes.json";
import type { AxisScore, CastVote, Chamber, PartyTally } from "./types";

export const AXIS_RELEVANCE = 0.3;

export const PARTY_NAMES: Record<string, string> = {
  D: "Democrats",
  R: "Republicans",
  I: "Independents",
};

export const PARTY_TOKENS: Record<string, string> = {
  D: "partyDem",
  R: "partyRep",
  I: "partyInd",
};

export const US_STATES = [
  "AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "GU",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
  "MP", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
  "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "VI",
  "WA", "WV", "WI", "WY",
];

export function chamberLabel(chamber: Chamber): "House" | "Senate" {
  return chamber === "senate" ? "Senate" : "House";
}

export function parseChamber(value: string | null | undefined): Chamber | null {
  return value === "house" || value === "senate" ? value : null;
}

export function deckPath(chamber: Chamber): string {
  return `/how-would-you-vote?chamber=${chamber}`;
}

export function matchesPath(chamber: Chamber): string {
  return `/how-would-you-vote/${chamber}/matches`;
}

// Roll calls record outcomes as "Passed", "Joint Resolution Defeated", "Motion
// Agreed to" and so on.
export function didPass(result: string): boolean {
  return /passed|agreed/i.test(result);
}

export function totalTally(tally: Record<string, PartyTally>) {
  const totals = { yea: 0, nay: 0, not_voting: 0 };
  for (const party of Object.values(tally)) {
    totals.yea += party.yea;
    totals.nay += party.nay;
    totals.not_voting += party.not_voting;
  }
  return totals;
}

// The share of a party's Yea and Nay votes on the user's side, or null if none
// of them cast one.
export function sharedWithParty(tally: PartyTally | undefined, vote: CastVote) {
  if (!tally) return null;
  const cast = tally.yea + tally.nay;
  if (cast === 0) return null;
  return Math.round((tally[vote] / cast) * 100);
}

function axisDefinition(axisId: string) {
  return politicalAxes.political_axes.find((a) => a.id === axisId);
}

export function axisLabel(axisId: string): string {
  return axisDefinition(axisId)?.name ?? axisId;
}

// "Fiscal Restraint" on the Fiscal axis reads as just "Restraint".
function poleLabel(axisId: string, side: "negative" | "positive"): string {
  const axis = axisDefinition(axisId);
  if (!axis) return side;
  const label = axis[`${side}_pole`].label;
  const prefix = `${axis.name} `;
  return label.startsWith(prefix) ? label.slice(prefix.length) : label;
}

// Which pole a vote pushed, as the sign flips for a Nay. Null for a position of 0.
export function pushedPole(score: AxisScore, vote: CastVote) {
  const signed = score.position * (vote === "yea" ? 1 : -1);
  if (signed === 0) return null;
  const side = signed > 0 ? ("positive" as const) : ("negative" as const);
  return { side, label: poleLabel(score.axis, side) };
}

// Left-right direction of a Yea in one category. A missing score means the
// analysis found no partisan lean there.
export function leftRightDirection(score: number | undefined) {
  if (!score) return null;
  const side = score > 0 ? ("positive" as const) : ("negative" as const);
  return { side, label: poleLabel("left_right", side) };
}

export function lastName(name: string): string {
  return name.split(" ").pop() ?? name;
}
