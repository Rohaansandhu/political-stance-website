import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BRIEF_FIELDS,
  sampleWeighted,
  sortFeatured,
  toBriefCard,
  toRevealCard,
} from "../lib/hwyvCards.js";

const FORBIDDEN_IN_BRIEF = [
  "result",
  "requires",
  "tally",
  "sponsor",
  "sponsor_party",
  "source_url",
  "left_right",
  "axes",
  "d_majority_yea",
  "r_majority_yea",
  "contest",
  "cross",
];

const fullCard = {
  spec_hash: "spec",
  vote_id: "h1-119.2025",
  bill_id: "hr1-119",
  chamber: "house",
  congress: 119,
  date: "2025-01-01T12:00:00-05:00",
  short_title: "Title",
  popular_title: null,
  brief: "This bill does a thing.",
  key_provisions: ["Does a thing."],
  needs_two_thirds: true,
  omnibus: false,
  contest: 0.5,
  cross: 0.1,
  featured: true,
  primary_categories: ["Healthcare"],
  result: "Passed",
  requires: "2/3",
  tally: { D: { yea: 1, nay: 2, not_voting: 0 } },
  d_majority_yea: false,
  r_majority_yea: true,
  sponsor: "Rep. A Person",
  sponsor_party: "R",
  source_url: "https://example.com",
  left_right: { Healthcare: 0.2 },
  axes: [{ axis: "fiscal", position: 1, relevance: 1, reasoning: "x" }],
  model: "m",
  schema_version: 5,
  axis_schema_version: 1,
};

test("brief cards carry only brief fields", () => {
  const brief = toBriefCard(fullCard);
  assert.deepEqual(Object.keys(brief).sort(), [...BRIEF_FIELDS].sort());
  for (const key of FORBIDDEN_IN_BRIEF) {
    assert.equal(key in brief, false, `${key} leaked into a brief card`);
  }
});

test("reveal cards carry the fields a reveal needs", () => {
  const reveal = toRevealCard(fullCard);
  for (const key of ["result", "tally", "sponsor", "left_right", "axes"]) {
    assert.deepEqual(reveal[key], fullCard[key]);
  }
});

function card(id, contest, cross = 0, date = "2025-01-01") {
  return { vote_id: id, contest, cross, date };
}

test("featured order is by rank, then newest", () => {
  const ordered = sortFeatured([
    card("low", 0.4),
    card("cross", 0.5, 0.5),
    card("older", 0.6, 0, "2024-01-01"),
    card("newer", 0.6, 0, "2025-06-01"),
  ]);
  assert.deepEqual(
    ordered.map((c) => c.vote_id),
    ["cross", "newer", "older", "low"],
  );
});

const pool = Array.from({ length: 200 }, (_, i) =>
  card(`v${i}`, i < 100 ? 0.9 : 0.1),
);

test("random decks are the same for the same seed", () => {
  const ids = (seed) => sampleWeighted(pool, seed, 20).map((c) => c.vote_id);
  assert.deepEqual(ids("a"), ids("a"));
  assert.notDeepEqual(ids("a"), ids("b"));
});

test("random decks don't repeat a card", () => {
  const ids = sampleWeighted(pool, "a", 50).map((c) => c.vote_id);
  assert.equal(new Set(ids).size, 50);
});

test("random decks favor contested cards", () => {
  let high = 0;
  for (let seed = 0; seed < 50; seed++) {
    high += sampleWeighted(pool, seed, 20).filter((c) => c.contest === 0.9).length;
  }
  // 900 of the 1000 draws would be 90%; uniform sampling would give half
  assert.ok(high > 800, `only ${high} of 1000 draws were contested cards`);
});

test("excluding a card doesn't reorder the others", () => {
  const full = sampleWeighted(pool, "a", 20).map((c) => c.vote_id);
  const rest = pool.filter((c) => c.vote_id !== full[0]);
  const after = sampleWeighted(rest, "a", 19).map((c) => c.vote_id);
  assert.deepEqual(after, full.slice(1));
});
