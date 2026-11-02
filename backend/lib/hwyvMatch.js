// The math behind "How Would You Vote?" matches. No database access, so it can
// be unit tested on its own (tests/hwyvMatch.test.js).

const MIN_SHARED = 5;
const MIN_SHARED_CATEGORY = 3;
const MIN_CATEGORY_VOTES = 3;
const TOP_COUNT = 10;
const TOP_COUNT_CATEGORY = 3;

const MIN_AXIS_VOTES = 3;
const AXIS_RELEVANCE = 0.3;
export const LEFT_RIGHT = "left_right";

const PARTIES = ["D", "R", "I"];

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function mean(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// agree_m for every member over `votes` ([{ card, u }]). A member counts on a
// roll call only if they cast Yea or Nay on it.
function memberAgreement(votes, members, memberVotes) {
  if (votes.length === 0) return [];
  const pseudoVotes = 2 * median(votes.map((v) => v.card.contest));

  return members.map((member) => {
    let shared = 0;
    let agreed = 0;
    let num = 0;
    let den = 0;
    for (const { card, u } of votes) {
      const value = memberVotes[card.vote_id]?.[member.member_id];
      if (value !== 1 && value !== -1) continue;
      shared += 1;
      den += card.contest;
      if (value === u) {
        agreed += 1;
        num += card.contest;
      }
    }
    return {
      ...member,
      shared,
      agreed,
      agree: (num + 0.5 * pseudoVotes) / (den + pseudoVotes),
    };
  });
}

function toMatchRow(row) {
  return {
    bioguide_id: row.bioguide_id,
    member_id: row.member_id,
    name: row.name,
    party: row.party,
    state: row.state,
    agree: round3(row.agree),
    shared: row.shared,
    agreed: row.agreed,
  };
}

// Closest first; ties go to whoever shares more votes, then by name so the
// order doesn't depend on the query's.
function sortByAgreement(rows) {
  return [...rows].sort(
    (a, b) =>
      b.agree - a.agree ||
      b.shared - a.shared ||
      a.name.localeCompare(b.name),
  );
}

function partyAverages(rows) {
  const result = {};
  for (const party of PARTIES) {
    const group = rows.filter((r) => r.party === party);
    if (group.length > 0) {
      result[party] = round3(mean(group.map((r) => r.agree)));
    }
  }
  return result;
}

function computeByCategory(votes, members, memberVotes) {
  const byCategory = {};
  const categories = new Set(votes.flatMap((v) => v.card.primary_categories));

  for (const category of categories) {
    const inCategory = votes.filter((v) =>
      v.card.primary_categories.includes(category),
    );
    if (inCategory.length < MIN_CATEGORY_VOTES) continue;

    const eligible = memberAgreement(inCategory, members, memberVotes).filter(
      (r) => r.shared >= MIN_SHARED_CATEGORY,
    );
    byCategory[category] = {
      n_votes: inCategory.length,
      top: sortByAgreement(eligible).slice(0, TOP_COUNT_CATEGORY).map(toMatchRow),
      party: partyAverages(eligible),
    };
  }
  return byCategory;
}

// Mean of the bill's primary-category scores, the left_right score of a Yea.
function leftRightPush(card) {
  const scores = Object.values(card.left_right ?? {});
  return scores.length ? mean(scores) : null;
}

// How far a Yea on this card pushes the axis, and whether the card counts
// toward unlocking it.
function axisPush(card, axis) {
  if (axis === LEFT_RIGHT) {
    const push = leftRightPush(card);
    return push === null ? null : { push, counts: true };
  }
  const entry = card.axes?.find((a) => a.axis === axis);
  if (!entry) return null;
  return {
    push: entry.position * entry.relevance,
    counts: entry.relevance >= AXIS_RELEVANCE,
  };
}

// The user's position on one axis, treating them as a member in the agreement
// index: score = Σ c·w / (Σ c·|w| + k). Null until enough relevant votes exist.
function computeAxis(votes, axis, k, stats) {
  let num = 0;
  let den = 0;
  let relevantVotes = 0;
  for (const { card, u } of votes) {
    const entry = axisPush(card, axis);
    if (!entry) continue;
    const weighted = entry.push * u;
    num += card.contest * weighted;
    den += card.contest * Math.abs(weighted);
    if (entry.counts) relevantVotes += 1;
  }

  if (relevantVotes < MIN_AXIS_VOTES) return { relevantVotes, position: null };

  const score = den + k > 0 ? num / (den + k) : 0;
  const hasStats = stats?.mean != null && stats?.sd;
  return {
    relevantVotes,
    position: {
      score: round3(score),
      chamber_z: hasStats ? round3((score - stats.mean) / stats.sd) : null,
      n_votes: relevantVotes,
    },
  };
}

// axisInputs: { [axis]: { shrink_k, stats: { mean, sd } } }. Null means the
// profile set has no agreement data, so no axis is reported at all.
function computeAxes(votes, axisInputs) {
  if (!axisInputs) {
    return {
      axes: null,
      axis_progress: null,
      reason: "No agreement data for this profile set",
    };
  }

  const axes = {};
  const progress = {};
  for (const [axis, { shrink_k: k, stats }] of Object.entries(axisInputs)) {
    const { relevantVotes, position } = computeAxis(votes, axis, k, stats);
    axes[axis] = position;
    progress[axis] = relevantVotes;
  }
  return { axes, axis_progress: progress };
}

// votes: [{ card, u }], u = 1 for Yea and -1 for Nay. Cards carry vote_id,
// contest, primary_categories, left_right and axes.
// members: [{ member_id, bioguide_id, name, party, state }].
// memberVotes: { [vote_id]: { [member_id]: 1 | -1 | 0 } }.
export function computeMatch({ votes, members, memberVotes, axisInputs }) {
  const rows = memberAgreement(votes, members, memberVotes);
  const ranked = sortByAgreement(rows.filter((r) => r.shared >= MIN_SHARED));
  const top = ranked.slice(0, TOP_COUNT);
  const bottom = ranked.slice(top.length).slice(-TOP_COUNT).reverse();

  return {
    n_votes: votes.length,
    matches: { top: top.map(toMatchRow), bottom: bottom.map(toMatchRow) },
    by_category: computeByCategory(votes, members, memberVotes),
    ...computeAxes(votes, axisInputs),
    party_agreement: partyAverages(ranked),
  };
}
