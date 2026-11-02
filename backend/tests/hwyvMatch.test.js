import assert from "node:assert/strict";
import { test } from "node:test";

import { computeMatch } from "../lib/hwyvMatch.js";

function makeCard(id, overrides = {}) {
  return {
    vote_id: id,
    contest: 0.8,
    primary_categories: [],
    left_right: {},
    axes: [],
    ...overrides,
  };
}

function makeMember(id, party = "D") {
  return {
    member_id: id,
    bioguide_id: id,
    name: `Member ${id}`,
    party,
    state: "CA",
  };
}

// n cards the user votes Yea on, with `memberVotesFor(i)` as each member's votes.
function scenario(n, memberVotesFor, cardOverrides = {}) {
  const cards = Array.from({ length: n }, (_, i) =>
    makeCard(`v${i}`, cardOverrides),
  );
  const memberVotes = {};
  cards.forEach((card, i) => {
    memberVotes[card.vote_id] = memberVotesFor(i);
  });
  return { votes: cards.map((card) => ({ card, u: 1 })), memberVotes };
}

function agreeOf(n) {
  const { votes, memberVotes } = scenario(n, () => ({ twin: 1 }));
  const result = computeMatch({
    votes,
    memberVotes,
    members: [makeMember("twin")],
    axisInputs: null,
  });
  return result.matches.top[0].agree;
}

test("a user identical to a member ranks that member first", () => {
  const { votes, memberVotes } = scenario(8, (i) => ({
    twin: 1,
    other: i % 2 ? 1 : -1,
    opposite: -1,
  }));
  const result = computeMatch({
    votes,
    memberVotes,
    members: ["opposite", "other", "twin"].map((id) => makeMember(id)),
    axisInputs: null,
  });

  assert.equal(result.matches.top[0].member_id, "twin");
  assert.equal(result.matches.top[0].agreed, 8);
  assert.equal(result.matches.top[0].shared, 8);
  assert.equal(result.matches.bottom[0]?.member_id, undefined);
  assert.equal(result.matches.top[2].member_id, "opposite");
});

test("agree approaches 1 as votes grow", () => {
  const few = agreeOf(5);
  const some = agreeOf(50);
  const many = agreeOf(500);

  assert.ok(few < some && some < many);
  assert.ok(many > 0.99);
  // Two pseudo-votes at 50%: (5c + c) / (5c + 2c)
  assert.equal(few, Math.round((6 / 7) * 1000) / 1000);
});

test("not voting is excluded from shared and from both sums", () => {
  // Six Yea matches, plus two roll calls the member didn't vote on
  const { votes, memberVotes } = scenario(8, (i) => ({ m: i < 6 ? 1 : 0 }));
  const withAbsences = computeMatch({
    votes,
    memberVotes,
    members: [makeMember("m")],
    axisInputs: null,
  }).matches.top[0];

  assert.equal(withAbsences.shared, 6);
  assert.equal(withAbsences.agreed, 6);
  // num and den only have the six shared votes: (6c + c) / (6c + 2c)
  assert.equal(withAbsences.agree, Math.round((7 / 8) * 1000) / 1000);
});

test("a member missing from the roll call is treated as not voting", () => {
  const { votes, memberVotes } = scenario(6, (i) =>
    i < 5 ? { m: 1 } : {},
  );
  const row = computeMatch({
    votes,
    memberVotes,
    members: [makeMember("m")],
    axisInputs: null,
  }).matches.top[0];
  assert.equal(row.shared, 5);
});

test("a member with fewer than 5 shared votes is not ranked", () => {
  const { votes, memberVotes } = scenario(6, (i) => ({
    enough: 1,
    few: i < 4 ? 1 : 0,
  }));
  const result = computeMatch({
    votes,
    memberVotes,
    members: [makeMember("enough"), makeMember("few", "R")],
    axisInputs: null,
  });

  assert.deepEqual(
    result.matches.top.map((r) => r.member_id),
    ["enough"],
  );
  assert.deepEqual(result.matches.bottom, []);
  assert.equal(result.party_agreement.R, undefined);
  assert.ok(result.party_agreement.D > 0.5);
});

test("top and bottom are ten each, with no overlap, closest and farthest first", () => {
  const ids = Array.from({ length: 25 }, (_, i) => `m${String(i).padStart(2, "0")}`);
  const { votes, memberVotes } = scenario(30, (i) =>
    Object.fromEntries(ids.map((id, rank) => [id, i < 30 - rank ? 1 : -1])),
  );
  const { top, bottom } = computeMatch({
    votes,
    memberVotes,
    members: ids.map((id) => makeMember(id)),
    axisInputs: null,
  }).matches;

  assert.equal(top.length, 10);
  assert.equal(bottom.length, 10);
  assert.equal(top[0].member_id, "m00");
  assert.equal(bottom[0].member_id, "m24");
  assert.equal(new Set([...top, ...bottom].map((r) => r.member_id)).size, 20);
});

test("party agreement averages over each party's eligible members", () => {
  const { votes, memberVotes } = scenario(6, () => ({ a: 1, b: 1, c: -1 }));
  const result = computeMatch({
    votes,
    memberVotes,
    members: [makeMember("a"), makeMember("b"), makeMember("c", "R")],
    axisInputs: null,
  });
  assert.ok(result.party_agreement.D > result.party_agreement.R);
});

test("categories need 3 votes and members need 3 shared votes in them", () => {
  const healthcare = { primary_categories: ["Healthcare"] };
  const { votes: inCategory, memberVotes } = scenario(
    4,
    (i) => ({ a: 1, b: 1, few: i < 2 ? 1 : 0 }),
    healthcare,
  );
  const trade = makeCard("t", { primary_categories: ["Trade"] });
  memberVotes.t = { a: 1 };

  const { by_category: byCategory } = computeMatch({
    votes: [...inCategory, { card: trade, u: 1 }],
    memberVotes,
    members: [makeMember("a"), makeMember("b", "R"), makeMember("few", "I")],
    axisInputs: null,
  });

  assert.deepEqual(Object.keys(byCategory), ["Healthcare"]);
  assert.equal(byCategory.Healthcare.n_votes, 4);
  assert.equal(byCategory.Healthcare.top.length, 2);
  assert.ok(byCategory.Healthcare.party.D > 0.5);
  assert.ok(byCategory.Healthcare.party.R > 0.5);
  assert.equal(byCategory.Healthcare.party.I, undefined);
});

function axisResult(n, { k = 0.5, position = 0.6, relevance = 0.9, u = 1 } = {}) {
  const cards = Array.from({ length: n }, (_, i) =>
    makeCard(`v${i}`, { axes: [{ axis: "fiscal", position, relevance }] }),
  );
  return computeMatch({
    votes: cards.map((card) => ({ card, u })),
    memberVotes: {},
    members: [],
    axisInputs: { fiscal: { shrink_k: k, stats: { mean: 0.1, sd: 0.5 } } },
  });
}

test("axis score is +1 unshrunk when every vote pushes the + pole", () => {
  assert.equal(axisResult(4, { k: 0 }).axes.fiscal.score, 1);
  // A Nay on a bill whose Yea pushes the - pole also pushes the + pole
  assert.equal(axisResult(4, { k: 0, position: -0.6, u: -1 }).axes.fiscal.score, 1);
  assert.equal(axisResult(4, { k: 0, u: -1 }).axes.fiscal.score, -1);
});

test("axis score moves toward 0 with fewer votes for the same pattern", () => {
  const few = axisResult(3).axes.fiscal.score;
  const some = axisResult(10).axes.fiscal.score;
  const many = axisResult(100).axes.fiscal.score;
  assert.ok(0 < few && few < some && some < many && many < 1);
});

test("axis score uses the agreement-index formula", () => {
  // Three cards, contest 0.8, weighted 0.54 each: num = den = 3 * 0.8 * 0.54
  const expected = (3 * 0.8 * 0.54) / (3 * 0.8 * 0.54 + 0.5);
  const fiscal = axisResult(3).axes.fiscal;
  assert.equal(fiscal.score, Math.round(expected * 1000) / 1000);
  assert.equal(fiscal.n_votes, 3);
  assert.equal(
    fiscal.chamber_z,
    Math.round(((expected - 0.1) / 0.5) * 1000) / 1000,
  );
});

test("an axis with fewer than 3 relevant votes returns null", () => {
  assert.equal(axisResult(2).axes.fiscal, null);
  assert.equal(axisResult(2).axis_progress.fiscal, 2);
  // Enough votes, but relevance is under 0.3 on all of them
  assert.equal(axisResult(5, { relevance: 0.2 }).axes.fiscal, null);
  assert.equal(axisResult(5, { relevance: 0.2 }).axis_progress.fiscal, 0);
  assert.notEqual(axisResult(3).axes.fiscal, null);
});

test("low-relevance votes still count toward the score once unlocked", () => {
  const relevant = Array.from({ length: 3 }, (_, i) =>
    makeCard(`r${i}`, {
      axes: [{ axis: "fiscal", position: 1, relevance: 0.5 }],
    }),
  );
  const faint = makeCard("f", {
    axes: [{ axis: "fiscal", position: -1, relevance: 0.1 }],
  });
  const { fiscal } = computeMatch({
    votes: [...relevant, faint].map((card) => ({ card, u: 1 })),
    memberVotes: {},
    members: [],
    axisInputs: { fiscal: { shrink_k: 0, stats: { mean: 0, sd: 1 } } },
  }).axes;

  assert.equal(fiscal.n_votes, 3);
  assert.equal(fiscal.score, Math.round((1.4 / 1.6) * 1000) / 1000);
});

test("left_right averages the bill's category scores and flips for a Nay", () => {
  const cards = Array.from({ length: 3 }, (_, i) =>
    makeCard(`v${i}`, { left_right: { A: 0.2, B: 0.4 } }),
  );
  const { left_right: leftRight } = computeMatch({
    votes: cards.map((card) => ({ card, u: -1 })),
    memberVotes: {},
    members: [],
    axisInputs: { left_right: { shrink_k: 0, stats: { mean: 0, sd: 1 } } },
  }).axes;
  assert.equal(leftRight.score, -1);
  assert.equal(leftRight.n_votes, 3);
});

test("an axis with no spread reports no chamber_z", () => {
  const cards = [0, 1, 2].map((i) =>
    makeCard(`v${i}`, {
      axes: [{ axis: "fiscal", position: 1, relevance: 1 }],
    }),
  );
  const { fiscal } = computeMatch({
    votes: cards.map((card) => ({ card, u: 1 })),
    memberVotes: {},
    members: [],
    axisInputs: { fiscal: { shrink_k: 0, stats: { mean: 0, sd: null } } },
  }).axes;
  assert.equal(fiscal.chamber_z, null);
});

test("no agreement data returns null axes with a reason", () => {
  const result = computeMatch({
    votes: [],
    memberVotes: {},
    members: [],
    axisInputs: null,
  });
  assert.equal(result.axes, null);
  assert.equal(typeof result.reason, "string");
});
