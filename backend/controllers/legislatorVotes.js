import { getDB } from "../config/db.js";
import { MODEL_SCHEMA_CONFIG, buildSpecHash } from "../config/models.js";

// Votes where the losing side has less than this share say little about a
// member's ideology (a bill that passed 400-10 shouldn't be anyone's "most
// liberal vote"), so they're left out of the pole-labeled and defining lists.
const CONTESTED_MINORITY_SHARE = 0.1;

// Same cutoff the pipeline uses before computing a within-party z-score.
const MIN_BILLS = 10;

const CACHE_MAX_MEMBERS = 20;
const CACHE_TTL_MS = 10 * 60 * 1000;

const YEA_VOTES = new Set(["yea", "yes", "aye", "y"]);
const NAY_VOTES = new Set(["nay", "no", "n"]);

// Mirrors get_vote_value in the tracker's vote_utils.py.
function voteValue(vote) {
  const normalized = (vote ?? "").toLowerCase().trim();
  if (YEA_VOTES.has(normalized)) return 1;
  if (NAY_VOTES.has(normalized)) return -1;
  return 0;
}

// Senators' member_ids look like S313; House bioguide ids are 7 chars and can
// also start with S (e.g. Scalise, S001176).
function specHashForMember(memberId, model) {
  const isSenator = memberId.startsWith("S") && memberId.length <= 4;
  return buildSpecHash(model, isSenator ? "senate" : "house");
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}

function buildBillId(bill) {
  if (!bill?.type || !bill?.number || !bill?.congress) return "";
  return `${bill.type}${bill.number}-${bill.congress}`;
}

// Schema 5 tags several primary_categories; older schemas use primary + secondary.
function primaryCategoriesOf(analysis) {
  const categories = analysis.political_categories ?? {};
  const tagged =
    categories.primary_categories ??
    [categories.primary, ...(categories.secondary ?? [])];
  return tagged.filter((c) => c && typeof c === "object" && c.name);
}

function buildPartySplit(groups) {
  const split = {};
  for (const group of groups) {
    const value = voteValue(group.k);
    if (value === 0) continue;
    const side = value === 1 ? "yea" : "nay";
    for (const party of group.parties ?? []) {
      split[party] ??= { yea: 0, nay: 0 };
      split[party][side] += 1;
    }
  }
  return split;
}

function isContested(split) {
  let yea = 0;
  let nay = 0;
  for (const tally of Object.values(split)) {
    yea += tally.yea;
    nay += tally.nay;
  }
  const total = yea + nay;
  return total > 0 && Math.min(yea, nay) / total >= CONTESTED_MINORITY_SHARE;
}

function votedAgainstParty(party, value, split) {
  const tally = split[party];
  if (!tally || tally.yea === tally.nay) return false;
  return (tally.yea > tally.nay ? 1 : -1) !== value;
}

function buildRow(vote, value, rollcall, analysis, axisAnalysis) {
  const groups = rollcall?.groups ?? [];
  const split = buildPartySplit(groups);
  const selfGroup = groups.find((g) => g.selfIndex >= 0);
  // The party on the roll call, not the member's current one, so a party
  // switcher's older votes are compared against the party they were in.
  const partyAtVote = selfGroup?.selfParty;

  const categories = primaryCategoriesOf(analysis)
    .filter((c) => c.partisan_score)
    .map((c) => ({
      name: c.name,
      impact: round3((c.partisan_score ?? 0) * (c.impact_score ?? 0) * value),
    }));

  const axes = (axisAnalysis?.axis_scores ?? [])
    .filter((a) => a.position && a.relevance)
    .map((a) => ({
      axis: a.axis,
      impact: round3(a.position * a.relevance * value),
    }));

  return {
    vote_id: vote.vote_id,
    bill_id: buildBillId(vote.bill),
    congress: vote.bill.congress,
    title: analysis.bill_summary?.title ?? null,
    summary: analysis.bill_summary?.key_provisions?.[0] ?? null,
    // member_votes docs synced before the date field existed don't have one.
    date: vote.date ?? rollcall?.date ?? null,
    vote: value === 1 ? "Yea" : "Nay",
    question: rollcall?.question ?? null,
    result: rollcall?.result ?? null,
    party_split: split,
    party_at_vote: partyAtVote ?? null,
    broke_with_party:
      partyAtVote === "R" || partyAtVote === "D"
        ? votedAgainstParty(partyAtVote, value, split)
        : false,
    contested: isContested(split),
    left_right: categories.length
      ? round3(
          categories.reduce((sum, c) => sum + c.impact, 0) / categories.length,
        )
      : null,
    categories,
    axes,
  };
}

async function loadScoredVotes(memberId, model) {
  const db = getDB();
  const config = MODEL_SCHEMA_CONFIG[model];

  const votes = await db
    .collection("member_votes")
    .find(
      { member_id: memberId },
      { projection: { _id: 0, vote_id: 1, bill: 1, vote: 1, date: 1 } },
    )
    .toArray();

  const scorable = votes.filter(
    (v) => buildBillId(v.bill) && voteValue(v.vote) !== 0,
  );
  const billIds = [...new Set(scorable.map((v) => buildBillId(v.bill)))];

  const [analyses, axisAnalyses, rollcalls] = await Promise.all([
    db
      .collection("bill_analyses")
      .find(
        {
          bill_id: { $in: billIds },
          model,
          schema_version: config.schema_version,
        },
        {
          projection: {
            _id: 0,
            bill_id: 1,
            "bill_summary.title": 1,
            "bill_summary.key_provisions": 1,
            political_categories: 1,
          },
        },
      )
      .toArray(),
    config.axis_schema_version
      ? db
          .collection("bill_axis_analyses")
          .find(
            {
              bill_id: { $in: billIds },
              model,
              axis_schema_version: config.axis_schema_version,
            },
            {
              projection: {
                _id: 0,
                bill_id: 1,
                "axis_scores.axis": 1,
                "axis_scores.position": 1,
                "axis_scores.relevance": 1,
              },
            },
          )
          .toArray()
      : [],
    // Only each voter's party is needed, so this keeps the 400+ member lists
    // out of the response instead of projecting the whole votes field.
    db
      .collection("rollcall_votes")
      .aggregate([
        { $match: { vote_id: { $in: scorable.map((v) => v.vote_id) } } },
        {
          $project: {
            _id: 0,
            vote_id: 1,
            date: 1,
            question: 1,
            result: 1,
            groups: {
              $map: {
                input: { $objectToArray: "$votes" },
                as: "g",
                in: {
                  k: "$$g.k",
                  parties: "$$g.v.party",
                  selfIndex: { $indexOfArray: ["$$g.v.id", memberId] },
                  selfParty: {
                    $arrayElemAt: [
                      "$$g.v.party",
                      { $indexOfArray: ["$$g.v.id", memberId] },
                    ],
                  },
                },
              },
            },
          },
        },
      ])
      .toArray(),
  ]);

  const analysisByBill = new Map(analyses.map((a) => [a.bill_id, a]));
  const axisByBill = new Map(axisAnalyses.map((a) => [a.bill_id, a]));
  const rollcallByVote = new Map(rollcalls.map((r) => [r.vote_id, r]));

  return scorable
    .filter((v) => analysisByBill.has(buildBillId(v.bill)))
    .map((v) => {
      const billId = buildBillId(v.bill);
      return buildRow(
        v,
        voteValue(v.vote),
        rollcallByVote.get(v.vote_id),
        analysisByBill.get(billId),
        axisByBill.get(billId),
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Keyed member+model LRU holding the in-flight promise, so the several
// requests a profile page fires at once share one join.
const voteCache = new Map();

function getScoredVotes(memberId, model) {
  const key = `${memberId}|${model}`;
  const cached = voteCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    voteCache.delete(key);
    voteCache.set(key, cached);
    return cached.rows;
  }

  const rows = loadScoredVotes(memberId, model).catch((err) => {
    voteCache.delete(key);
    throw err;
  });
  voteCache.delete(key);
  voteCache.set(key, { at: Date.now(), rows });
  if (voteCache.size > CACHE_MAX_MEMBERS) {
    voteCache.delete(voteCache.keys().next().value);
  }
  return rows;
}

// The impact a row has on whatever the request is focused on: an axis, a
// category, or (by default) the overall Left-Right position.
function impactFor(row, axis, category) {
  if (category) {
    return row.categories.find((c) => c.name === category)?.impact ?? null;
  }
  if (axis && axis !== "left_right") {
    return row.axes.find((a) => a.axis === axis)?.impact ?? null;
  }
  return row.left_right;
}

function matchesSearch(row, query) {
  const text = query.toLowerCase();
  const compact = text.replace(/[^a-z0-9-]/g, "");
  return (
    row.title?.toLowerCase().includes(text) ||
    row.summary?.toLowerCase().includes(text) ||
    row.question?.toLowerCase().includes(text) ||
    (compact.length > 0 && row.bill_id.includes(compact))
  );
}

export const getLegislatorVotes = async (req, res) => {
  try {
    const { member_id: memberId, model } = req.params;
    if (!MODEL_SCHEMA_CONFIG[model]) {
      return res.status(400).json({ error: "Unknown model" });
    }

    const {
      filter = "recent",
      axis,
      pole,
      category,
      congress,
      q,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const scored = await getScoredVotes(memberId, model);

    // Institutional is computed from party-line votes, not per-bill scores,
    // so its votes are simply the member's breaks from their party.
    const isInstitutional = axis === "institutional";
    const focusAxis = isInstitutional ? null : axis;
    const onlyBroke = filter === "broke" || isInstitutional;
    const hideUnanimous = filter === "defining" || Boolean(pole);

    let rows = scored.map((row) => ({
      row,
      impact: impactFor(row, focusAxis, category),
    }));

    rows = rows.filter(({ row, impact }) => {
      if (onlyBroke && !row.broke_with_party) return false;
      if (hideUnanimous && !row.contested) return false;
      if ((focusAxis || category) && impact === null) return false;
      if (pole === "positive" && !(impact > 0)) return false;
      if (pole === "negative" && !(impact < 0)) return false;
      if (congress && String(row.congress) !== String(congress)) return false;
      if (q && q.trim() && !matchesSearch(row, q.trim())) return false;
      return true;
    });

    // Rows arrive newest first, so date order needs no sort of its own.
    if (sort === "impact" || filter === "defining" || pole) {
      rows.sort((a, b) => Math.abs(b.impact ?? 0) - Math.abs(a.impact ?? 0));
    }

    const pageNumber = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const start = (pageNumber - 1) * pageSize;

    res.status(200).json({
      total: rows.length,
      scored_total: scored.length,
      page: pageNumber,
      limit: pageSize,
      results: rows
        .slice(start, start + pageSize)
        .map(({ row, impact }) => ({ ...row, impact })),
      facets: {
        congresses: [...new Set(scored.map((r) => r.congress))].sort(
          (a, b) => b - a,
        ),
        categories: [
          ...new Set(scored.flatMap((r) => r.categories.map((c) => c.name))),
        ].sort(),
        axes: [...new Set(scored.flatMap((r) => r.axes.map((a) => a.axis)))],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislator votes" });
  }
};

// Same ranking as pandas rank(pct=True, method="average"), which is what the
// pipeline's current_percentile_rank uses, so peer groups computed here read
// the same as the stored chamber percentiles.
function rankAmong(value, scores) {
  const lower = scores.filter((s) => s < value).length;
  const equal = scores.filter((s) => s === value).length;
  const higher = scores.length - lower - equal;
  return {
    percentile: (lower + (equal + 1) / 2) / scores.length,
    rank: higher + 1,
    total: scores.length,
  };
}

function cellStats(self, peers, getCell) {
  const cell = getCell(self);
  if (!cell || cell.bill_count < MIN_BILLS) return null;
  const sufficient = (member) => {
    const c = getCell(member);
    return c && c.bill_count >= MIN_BILLS ? c.score : null;
  };

  const chamberScores = peers.map(sufficient).filter((s) => s !== null);
  const partyScores = peers
    .filter((m) => m.party === self.party)
    .map(sufficient)
    .filter((s) => s !== null);

  return {
    chamber: rankAmong(cell.score, chamberScores),
    party:
      self.party === "R" || self.party === "D"
        ? rankAmong(cell.score, partyScores)
        : null,
  };
}

// Where a member sits within one axis-and-category cell, e.g. Security Posture
// on Immigration. Peers' by_category entries are too heavy to send for a whole
// chamber, so the percentiles are worked out here instead.
export const getLegislatorAxisCategories = async (req, res) => {
  try {
    const { member_id: memberId, model } = req.params;
    const { axis, category } = req.query;
    const specHash = specHashForMember(memberId, model);
    if (!specHash) return res.status(400).json({ error: "Unknown model" });
    if (Boolean(axis) === Boolean(category)) {
      return res.status(400).json({ error: "Pass either axis or category" });
    }

    const profiles = getDB().collection("legislator_profiles");
    const self = await profiles.findOne(
      { member_id: memberId, spec_hash: specHash },
      { projection: { axes: 1, party: 1, member_id: 1 } },
    );
    if (!self) return res.status(404).json({ error: "Legislator not found" });

    const axisIds = axis ? [axis] : Object.keys(self.axes ?? {});
    // Checked against the member's own document because these values become
    // projection paths below.
    const categoryNames = category
      ? [category]
      : Object.keys(self.axes?.[axis]?.by_category ?? {});
    const isKnown = axis
      ? Boolean(self.axes?.[axis])
      : axisIds.some((id) => self.axes[id]?.by_category?.[category]);
    if (!isKnown) return res.status(200).json({ cells: [] });

    const projection = { _id: 0, party: 1, member_id: 1 };
    for (const id of axisIds) {
      if (axis) {
        projection[`axes.${id}.by_category`] = 1;
      } else if (self.axes[id]?.by_category?.[category]) {
        projection[`axes.${id}.by_category.${category}`] = 1;
      }
    }

    const peers = await profiles
      .find({ spec_hash: specHash, current: true }, { projection })
      .toArray();

    const cells = [];
    for (const id of axisIds) {
      for (const name of categoryNames) {
        const getCell = (member) => member.axes?.[id]?.by_category?.[name];
        const cell = getCell(self);
        if (!cell) continue;
        cells.push({
          axis: id,
          category: name,
          bill_count: cell.bill_count,
          stats: cellStats(self, peers, getCell),
        });
      }
    }

    cells.sort((a, b) => b.bill_count - a.bill_count);
    res.status(200).json({ cells });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch axis categories" });
  }
};
