// Pure helpers for "How Would You Vote?" cards: which fields each response may
// carry, and how decks are ordered. No database access.

// Everything a user may see before voting. The pipeline's copy of this list is
// BRIEF_FIELDS in the tracker's schema/hwyv_cards.py.
export const BRIEF_FIELDS = [
  "vote_id",
  "bill_id",
  "chamber",
  "congress",
  "date",
  "short_title",
  "popular_title",
  "brief",
  "key_provisions",
  "needs_two_thirds",
  "omnibus",
  "primary_categories",
  "featured",
];

export const REVEAL_FIELDS = [
  "vote_id",
  "bill_id",
  "short_title",
  "result",
  "requires",
  "needs_two_thirds",
  "tally",
  "d_majority_yea",
  "r_majority_yea",
  "sponsor",
  "sponsor_party",
  "source_url",
  "left_right",
  "axes",
  "model",
  "schema_version",
  "axis_schema_version",
];

function pick(card, fields) {
  const result = {};
  for (const field of fields) result[field] = card[field] ?? null;
  return result;
}

export function toBriefCard(card) {
  return pick(card, BRIEF_FIELDS);
}

export function toRevealCard(card) {
  return pick(card, REVEAL_FIELDS);
}

// The pipeline's featured rank: contest * (1 + 2 * cross), newest first on ties.
export function sortFeatured(cards) {
  const rank = (c) => c.contest * (1 + 2 * c.cross);
  return [...cards].sort(
    (a, b) =>
      rank(b) - rank(a) ||
      b.date.localeCompare(a.date) ||
      a.vote_id.localeCompare(b.vote_id),
  );
}

// FNV-1a, spread over (0, 1). Open at both ends so the sample's key is defined.
function hashToUnit(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // A final mix, since FNV barely changes the top bits for a one-character change
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0x5bd1e995);
  hash ^= hash >>> 15;
  return ((hash >>> 0) + 0.5) / 2 ** 32;
}

// Contest-weighted sample without replacement (Efraimidis-Spirakis: take the
// largest u^(1/weight)). Each card's u comes from the seed and its own id, so
// excluding a card doesn't reorder the others and a deck stays put as the user
// votes through it.
export function sampleWeighted(cards, seed, limit) {
  return cards
    .filter((c) => c.contest > 0)
    .map((card) => ({
      card,
      key: Math.log(hashToUnit(`${seed}|${card.vote_id}`)) / card.contest,
    }))
    .sort((a, b) => b.key - a.key || a.card.vote_id.localeCompare(b.card.vote_id))
    .slice(0, limit)
    .map((entry) => entry.card);
}
