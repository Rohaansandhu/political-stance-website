import { getDB } from "../config/db.js";
import {
  BRIEF_FIELDS,
  sampleWeighted,
  sortFeatured,
  toBriefCard,
  toRevealCard,
} from "../lib/hwyvCards.js";
import { computeMatch } from "../lib/hwyvMatch.js";

const DEFAULT_DECK_LIMIT = 20;
const MAX_DECK_LIMIT = 100;
const MAX_MATCH_VOTES = 5000;

// A reveal is the same for every user and only changes when the pipeline reruns.
const REVEAL_CACHE_CONTROL = "public, max-age=3600";

const ROSTER_TTL_MS = 10 * 60 * 1000;
const ROLLCALL_CACHE_MAX = 300;

// Computed from party-line votes, so it has no per-bill scores to place a user with.
const INSTITUTIONAL = "institutional";

const YEA_VOTES = new Set(["yea", "yes", "aye", "y"]);
const NAY_VOTES = new Set(["nay", "no", "n"]);

// Mirrors get_vote_value in the tracker's vote_utils.py.
function voteValue(vote) {
  const normalized = (vote ?? "").toLowerCase().trim();
  if (YEA_VOTES.has(normalized)) return 1;
  if (NAY_VOTES.has(normalized)) return -1;
  return 0;
}

const VOTE_NAMES = { 1: "yea", "-1": "nay", 0: "not_voting" };

// spec_hash -> { at, members }, holding the in-flight promise so concurrent
// requests share one load.
const rosterCache = new Map();

// Sitting members of the profile set's chamber. Senators' member_ids are LIS
// ids, so bioguide_id comes from the legislators collection.
async function loadCurrentMembers(specHash) {
  const db = getDB();
  const profiles = await db
    .collection("legislator_profiles")
    .find(
      { spec_hash: specHash, current: true },
      { projection: { _id: 0, member_id: 1, name: 1, party: 1, state: 1 } },
    )
    .toArray();

  const legislators = await db
    .collection("legislators")
    .find(
      { member_id: { $in: profiles.map((p) => p.member_id) } },
      {
        projection: {
          _id: 0,
          member_id: 1,
          bioguide: 1,
          "name.official_full": 1,
        },
      },
    )
    .toArray();
  const byMemberId = new Map(legislators.map((l) => [l.member_id, l]));

  return profiles.map((p) => {
    const legislator = byMemberId.get(p.member_id);
    return {
      member_id: p.member_id,
      bioguide_id: legislator?.bioguide ?? p.member_id,
      name: legislator?.name?.official_full ?? p.name,
      party: p.party,
      state: p.state,
    };
  });
}

function getCurrentMembers(specHash) {
  const cached = rosterCache.get(specHash);
  if (cached && Date.now() - cached.at < ROSTER_TTL_MS) return cached.members;

  const members = loadCurrentMembers(specHash).catch((err) => {
    rosterCache.delete(specHash);
    throw err;
  });
  rosterCache.set(specHash, { at: Date.now(), members });
  return members;
}

// vote_id -> Map(member_id -> { value, party }). The cloud's rollcall_votes has
// no vote_id index, so a lookup there can take seconds.
const rollcallCache = new Map();

function parseRollcallVotes(votes) {
  const voters = new Map();
  for (const [key, group] of Object.entries(votes ?? {})) {
    const value = voteValue(key);
    for (const voter of group) {
      // "VP" entries are plain strings, not voters
      if (typeof voter === "object" && voter?.id) {
        voters.set(voter.id, { value, party: voter.party });
      }
    }
  }
  return voters;
}

async function getRollcallVoters(voteIds) {
  const missing = voteIds.filter((id) => !rollcallCache.has(id));
  if (missing.length > 0) {
    const rollcalls = await getDB()
      .collection("rollcall_votes")
      .find(
        { vote_id: { $in: missing } },
        { projection: { _id: 0, vote_id: 1, votes: 1 } },
      )
      .toArray();
    for (const rollcall of rollcalls) {
      rollcallCache.set(rollcall.vote_id, parseRollcallVotes(rollcall.votes));
    }
  }

  const result = {};
  for (const id of voteIds) {
    const voters = rollcallCache.get(id);
    if (voters) result[id] = voters;
  }
  while (rollcallCache.size > ROLLCALL_CACHE_MAX) {
    rollcallCache.delete(rollcallCache.keys().next().value);
  }
  return result;
}

export const getDeck = async (req, res) => {
  try {
    const { deck = "featured", category, exclude, seed } = req.query;
    if (deck !== "featured" && deck !== "random") {
      return res.status(400).json({ error: "deck must be featured or random" });
    }
    if (category !== undefined && typeof category !== "string") {
      return res.status(400).json({ error: "category must be a string" });
    }

    const limit = Math.min(
      MAX_DECK_LIMIT,
      Math.max(1, parseInt(req.query.limit) || DEFAULT_DECK_LIMIT),
    );
    const excluded =
      typeof exclude === "string" ? exclude.split(",").filter(Boolean) : [];

    const filter = {
      spec_hash: req.params.spec_hash,
      vote_id: { $nin: excluded },
    };
    if (deck === "featured") filter.featured = true;
    if (category) filter.primary_categories = category;

    const projection = { _id: 0, contest: 1, cross: 1 };
    for (const field of BRIEF_FIELDS) projection[field] = 1;

    const cards = await getDB()
      .collection("hwyv_cards")
      .find(filter, { projection })
      .toArray();

    const ordered =
      deck === "featured"
        ? sortFeatured(cards).slice(0, limit)
        : sampleWeighted(cards, seed ?? Date.now(), limit);

    res.status(200).json(ordered.map(toBriefCard));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch deck" });
  }
};

function findCard(req, options) {
  return getDB()
    .collection("hwyv_cards")
    .findOne(
      { spec_hash: req.params.spec_hash, vote_id: req.params.vote_id },
      options,
    );
}

export const getCard = async (req, res) => {
  try {
    const card = await findCard(req);
    if (!card) return res.status(404).json({ error: "Card not found" });
    res.status(200).json(toBriefCard(card));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch card" });
  }
};

// Only Democrats and Republicans have a majority worth breaking from; two
// independents don't make a party line.
function votedAgainstMajority(voter, card) {
  if (voter.value === 0) return false;
  const tally = card.tally?.[voter.party];
  if ((voter.party !== "D" && voter.party !== "R") || !tally) return false;
  if (tally.yea === tally.nay) return false;
  return (tally.yea > tally.nay ? 1 : -1) !== voter.value;
}

export const getReveal = async (req, res) => {
  try {
    const card = await findCard(req);
    if (!card) return res.status(404).json({ error: "Card not found" });

    const [members, rollcalls] = await Promise.all([
      getCurrentMembers(req.params.spec_hash),
      getRollcallVoters([card.vote_id]),
    ]);
    const voters = rollcalls[card.vote_id] ?? new Map();

    // A current member who isn't on the roll call wasn't in the chamber yet, so
    // listing them as "not voting" would wrongly say they missed the vote.
    const onRollcall = members.filter((m) => voters.has(m.member_id));

    res.set("Cache-Control", REVEAL_CACHE_CONTROL);
    res.status(200).json({
      ...toRevealCard(card),
      members: onRollcall.map((m) => {
        const voter = voters.get(m.member_id);
        return {
          bioguide_id: m.bioguide_id,
          member_id: m.member_id,
          name: m.name,
          party: m.party,
          state: m.state,
          vote: VOTE_NAMES[voter.value],
          against_party: votedAgainstMajority(voter, card),
        };
      }),
      not_in_office: members.length - onRollcall.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reveal" });
  }
};

// { [axis]: { shrink_k, stats } }, or null if the profile set has no agreement data.
async function loadAxisInputs(specHash) {
  const db = getDB();
  const axisStats = await db
    .collection("axis_stats")
    .findOne(
      { spec_hash: specHash, current: true },
      { projection: { _id: 0, agreement_axes: 1 } },
    );
  const axes = Object.keys(axisStats?.agreement_axes ?? {}).filter(
    (axis) => axis !== INSTITUTIONAL,
  );
  if (axes.length === 0) return null;

  const projection = { _id: 0 };
  for (const axis of axes) projection[`axes.${axis}.agreement.shrink_k`] = 1;
  const profiles = await db
    .collection("legislator_profiles")
    .find({ spec_hash: specHash, current: true }, { projection })
    .toArray();

  // shrink_k is the same for every member in a run, but not every member has
  // every axis, so it's the first one found per axis.
  const inputs = {};
  for (const axis of axes) {
    const profile = profiles.find(
      (p) => p.axes?.[axis]?.agreement?.shrink_k != null,
    );
    if (profile) {
      inputs[axis] = {
        shrink_k: profile.axes[axis].agreement.shrink_k,
        stats: axisStats.agreement_axes[axis],
      };
    }
  }
  return Object.keys(inputs).length > 0 ? inputs : null;
}

// Splits the request into the votes that count and the ids to report back as
// ignored. A later vote on the same bill replaces an earlier one.
function parseVotes(rawVotes) {
  const ignored = [];
  const valid = new Map();
  for (const entry of rawVotes) {
    if (typeof entry?.vote_id !== "string") continue;
    const u = { yea: 1, nay: -1 }[entry.vote];
    if (u === undefined) {
      ignored.push(entry.vote_id);
      valid.delete(entry.vote_id);
    } else {
      valid.set(entry.vote_id, u);
    }
  }
  return { valid, ignored };
}

// Nothing in the request is stored.
export const postMatch = async (req, res) => {
  try {
    const { spec_hash: specHash } = req.params;
    const rawVotes = req.body?.votes;
    if (!Array.isArray(rawVotes) || rawVotes.length > MAX_MATCH_VOTES) {
      return res.status(400).json({
        error: `votes must be an array of at most ${MAX_MATCH_VOTES} entries`,
      });
    }

    const { valid, ignored } = parseVotes(rawVotes);
    const cards = await getDB()
      .collection("hwyv_cards")
      .find(
        { spec_hash: specHash, vote_id: { $in: [...valid.keys()] } },
        {
          projection: {
            _id: 0,
            vote_id: 1,
            contest: 1,
            primary_categories: 1,
            left_right: 1,
            axes: 1,
          },
        },
      )
      .toArray();

    const cardIds = new Set(cards.map((c) => c.vote_id));
    for (const voteId of valid.keys()) {
      if (!cardIds.has(voteId)) ignored.push(voteId);
    }

    const [members, rollcalls, axisInputs] = await Promise.all([
      getCurrentMembers(specHash),
      getRollcallVoters([...cardIds]),
      loadAxisInputs(specHash),
    ]);

    const memberVotes = {};
    for (const [voteId, voters] of Object.entries(rollcalls)) {
      memberVotes[voteId] = Object.fromEntries(
        [...voters].map(([id, voter]) => [id, voter.value]),
      );
    }

    res.status(200).json({
      ...computeMatch({
        votes: cards.map((card) => ({ card, u: valid.get(card.vote_id) })),
        members,
        memberVotes,
        axisInputs,
      }),
      ignored,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute matches" });
  }
};
