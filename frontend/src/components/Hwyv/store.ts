// A user's votes live only in this browser, under one localStorage key. Memory
// is the source of truth while the page is open, so the feature still works,
// without persistence, when storage is blocked.
import { useEffect, useSyncExternalStore } from "react";
import { postMatch, specHashFor } from "./api";
import type { CastVote, Chamber, StoredVote } from "./types";

const STORAGE_KEY = "hwyv:v1";
const VOTE_ID_PATTERN = /^[a-z]+\d+-\d+\.\d+$/i;
const VOTE_VALUES: StoredVote[] = ["yea", "nay", "skip"];

export const MATCH_UNLOCK_VOTES = 10;

export interface VoteEntry {
  vote: StoredVote;
  at: string;
}

interface ChamberVotes {
  spec_hash: string;
  votes: Record<string, VoteEntry>;
}

interface HwyvState {
  home_state: string | null;
  chambers: Partial<Record<Chamber, ChamberVotes>>;
  // Whether the last write reached localStorage. Not itself stored.
  persisted: boolean;
}

function cleanVotes(raw: unknown): Record<string, VoteEntry> {
  const votes: Record<string, VoteEntry> = {};
  if (typeof raw !== "object" || raw === null) return votes;
  for (const [voteId, entry] of Object.entries(raw)) {
    const vote = (entry as VoteEntry | null)?.vote;
    if (VOTE_ID_PATTERN.test(voteId) && VOTE_VALUES.includes(vote as StoredVote)) {
      const at = (entry as VoteEntry).at;
      votes[voteId] = {
        vote: vote as StoredVote,
        at: typeof at === "string" ? at : new Date().toISOString(),
      };
    }
  }
  return votes;
}

function cleanChambers(raw: unknown): HwyvState["chambers"] {
  const chambers: HwyvState["chambers"] = {};
  if (typeof raw !== "object" || raw === null) return chambers;
  for (const chamber of ["house", "senate"] as Chamber[]) {
    const entry = (raw as Record<string, ChamberVotes | undefined>)[chamber];
    if (entry) {
      chambers[chamber] = {
        spec_hash: typeof entry.spec_hash === "string" ? entry.spec_hash : "",
        votes: cleanVotes(entry.votes),
      };
    }
  }
  return chambers;
}

function readStorage(): HwyvState {
  const empty: HwyvState = { home_state: null, chambers: {}, persisted: true };
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return { ...empty, persisted: false };
  }
  if (!raw) return empty;

  try {
    const parsed = JSON.parse(raw);
    return {
      home_state:
        typeof parsed?.home_state === "string" ? parsed.home_state : null,
      chambers: cleanChambers(parsed?.chambers),
      persisted: true,
    };
  } catch {
    return empty;
  }
}

function writeStorage(state: HwyvState): boolean {
  try {
    const { home_state, chambers } = state;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ home_state, chambers }),
    );
    return true;
  } catch {
    return false;
  }
}

let state: HwyvState = readStorage();
const listeners = new Set<() => void>();

function update(changes: Partial<HwyvState>) {
  const next = { ...state, ...changes };
  state = { ...next, persisted: writeStorage(next) };
  listeners.forEach((listener) => listener());
}

function updateChamber(chamber: Chamber, value: ChamberVotes | undefined) {
  const chambers = { ...state.chambers };
  if (value) chambers[chamber] = value;
  else delete chambers[chamber];
  update({ chambers });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function useHwyvState(): HwyvState {
  return useSyncExternalStore(subscribe, () => state);
}

export function recordVote(chamber: Chamber, voteId: string, vote: StoredVote) {
  const current = state.chambers[chamber];
  updateChamber(chamber, {
    // An outdated spec_hash stays until reconcile has checked the older votes
    spec_hash: current?.spec_hash ?? specHashFor(chamber),
    votes: {
      ...current?.votes,
      [voteId]: { vote, at: new Date().toISOString() },
    },
  });
}

export function clearVotes(chamber: Chamber) {
  updateChamber(chamber, undefined);
}

export function setHomeState(homeState: string | null) {
  update({ home_state: homeState });
}

// Read at the moment a deck loads, so voting doesn't refetch the deck in use.
export function votedIds(chamber: Chamber): string[] {
  return Object.keys(state.chambers[chamber]?.votes ?? {});
}

export function exportVotes() {
  const { home_state, chambers } = state;
  const blob = new Blob(
    [JSON.stringify({ home_state, chambers }, null, 2)],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "how-would-you-vote.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Merges a file from exportVotes, with imported votes winning. Returns how many
// votes it had. Blanking spec_hash makes reconcile drop any without a card.
export function importVotes(text: string): number {
  const parsed = JSON.parse(text);
  const incoming = cleanChambers(parsed?.chambers);
  const chambers = { ...state.chambers };
  let count = 0;

  for (const chamber of ["house", "senate"] as Chamber[]) {
    const entry = incoming[chamber];
    if (!entry) continue;
    count += Object.keys(entry.votes).length;
    chambers[chamber] = {
      spec_hash: "",
      votes: { ...chambers[chamber]?.votes, ...entry.votes },
    };
  }

  update({
    chambers,
    home_state:
      typeof parsed?.home_state === "string" ? parsed.home_state : state.home_state,
  });
  return count;
}

const reconciling = new Set<Chamber>();

// After the pipeline reruns under a new spec_hash, keep only the votes whose
// vote_id still has a card. The match endpoint reports the ones that don't. A
// failed request changes nothing, so it's simply tried again on the next load.
async function reconcile(chamber: Chamber) {
  if (reconciling.has(chamber)) return;
  reconciling.add(chamber);
  try {
    const ids = votedIds(chamber);
    const { ignored } = await postMatch(
      chamber,
      ids.map((vote_id) => ({ vote_id, vote: "yea" as CastVote })),
    );
    const gone = new Set(ignored);
    const votes = { ...state.chambers[chamber]?.votes };
    for (const voteId of Object.keys(votes)) {
      if (gone.has(voteId)) delete votes[voteId];
    }
    updateChamber(chamber, { spec_hash: specHashFor(chamber), votes });
  } catch (err) {
    console.error("Error checking stored votes:", err);
  } finally {
    reconciling.delete(chamber);
  }
}

export function useHwyv(chamber: Chamber | null) {
  const current = useHwyvState();
  const stored = chamber ? current.chambers[chamber] : undefined;
  const votes = stored?.votes ?? {};
  const outdated = Boolean(stored && stored.spec_hash !== specHashFor(chamber!));

  useEffect(() => {
    if (chamber && outdated) reconcile(chamber);
  }, [chamber, outdated]);

  const castVotes = Object.entries(votes)
    .filter(([, entry]) => entry.vote !== "skip")
    .map(([vote_id, entry]) => ({ vote_id, vote: entry.vote as CastVote }));

  return {
    votes,
    castVotes,
    homeState: current.home_state,
    persisted: current.persisted,
    voteCount(other: Chamber) {
      return Object.values(current.chambers[other]?.votes ?? {}).filter(
        (entry) => entry.vote !== "skip",
      ).length;
    },
  };
}
