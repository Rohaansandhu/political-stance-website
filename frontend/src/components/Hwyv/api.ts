import { buildSpecHash, DEFAULT_MODEL } from "../CongressData/modelLabels";
import type {
  BriefCard,
  CastVote,
  Chamber,
  MatchResult,
  RevealCard,
} from "./types";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/congress-data`;

export function specHashFor(chamber: Chamber): string {
  return buildSpecHash(DEFAULT_MODEL, chamber) ?? "";
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

export function fetchDeck(
  chamber: Chamber,
  options: {
    deck: "featured" | "random";
    category?: string;
    limit: number;
    exclude: string[];
    seed?: string;
  },
): Promise<BriefCard[]> {
  const params = new URLSearchParams({
    deck: options.deck,
    limit: String(options.limit),
  });
  if (options.category) params.set("category", options.category);
  if (options.exclude.length > 0) params.set("exclude", options.exclude.join(","));
  if (options.seed) params.set("seed", options.seed);
  return fetchJson(`${API_BASE}/${specHashFor(chamber)}/hwyv/deck?${params}`);
}

export function fetchCard(chamber: Chamber, voteId: string): Promise<BriefCard> {
  return fetchJson(
    `${API_BASE}/${specHashFor(chamber)}/hwyv/cards/${encodeURIComponent(voteId)}`,
  );
}

export function fetchReveal(chamber: Chamber, voteId: string): Promise<RevealCard> {
  return fetchJson(
    `${API_BASE}/${specHashFor(chamber)}/hwyv/cards/${encodeURIComponent(voteId)}/reveal`,
  );
}

export function postMatch(
  chamber: Chamber,
  votes: { vote_id: string; vote: CastVote }[],
): Promise<MatchResult> {
  return fetchJson(`${API_BASE}/${specHashFor(chamber)}/hwyv/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ votes }),
  });
}
