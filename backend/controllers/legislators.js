import { getDB } from "../config/db.js";
import { buildSpecHash } from "../config/models.js";

export const getLegislators = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("legislators");

    const {
      search,
      state,
      chamber,
      party,
      limit = 538,
      offset = 0,
    } = req.query;

    // Base query - only current legislators with data
    const query = { has_data: true, current: true };

    // Add search filter (name search)
    if (search && search.trim()) {
      query.$or = [
        { "name.official_full": { $regex: search, $options: "i" } },
        { "name.first": { $regex: search, $options: "i" } },
        { "name.last": { $regex: search, $options: "i" } },
      ];
    }

    // Add chamber filter using lis field (is non-null for senators, null for reps)
    if (chamber && chamber.trim()) {
      if (chamber === "sen") {
        query.lis = { $ne: null };
      }
      if (chamber === "rep") {
        query.lis = null;
      }
    }

    const termsConditions = {};

    if (state && state.trim()) {
      termsConditions.state = state.toUpperCase();
    }

    if (party && party.trim()) {
      termsConditions.party = party;
    }

    // Only add terms filter if we have conditions
    if (Object.keys(termsConditions).length > 0) {
      query["terms"] = { $elemMatch: termsConditions };
    }

    const profiles = await collection
      .find(query, {
        projection: {
          _id: 0,
          bioguide: 1,
          lis: 1,
          name: 1,
          bio: 1,
          terms: 1,
          current: 1,
        },
      })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .toArray();

    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);

    res.json({
      results: profiles,
      count: profiles.length,
      total: totalCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislators" });
  }
};

export const getLegislatorProfileByMemberId = async (req, res) => {
  try {
    if (!req.params.member_id) {
      return res.status(400).json({ error: "member_id is required" });
    }
    
    const db = getDB();
    const legislator_collection = db.collection("legislators");
    const legislator = await legislator_collection.findOne({
      member_id: req.params.member_id,
    });
    
    if (!legislator)
      return res
        .status(404)
        .json({ error: "Legislator not found (legislators)" });

    res.status(200).json(legislator);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislator profile" });
  }
};

export const getLegislatorProfileByMemberIdAndModel = async (req, res) => {
  try {
    if (!req.params.member_id) {
      return res.status(400).json({ error: "member_id is required" });
    }
    if (!req.params.model) {
      return res.status(400).json({ error: "model is required" });
    }
    const spec_hash_house = buildSpecHash(req.params.model, "house");
    const spec_hash_senate = buildSpecHash(req.params.model, "senate");
    if (!spec_hash_house || !spec_hash_senate) {
      return res.status(400).json({ error: "Unknown model" });
    }
    const db = getDB();
    const profile_collection = db.collection("legislator_profiles");
    let profile = null;
    const legislator_collection = db.collection("legislators");
    const legislator = await legislator_collection.findOne({
      member_id: req.params.member_id,
    });
    // Need to determine if senator or house rep
    if (
      req.params.member_id.startsWith("S") &&
      req.params.member_id.length <= 4
    ) {
      profile = await profile_collection.findOne({
        member_id: req.params.member_id,
        spec_hash: spec_hash_senate,
      });
    } else {
      profile = await profile_collection.findOne({
        member_id: req.params.member_id,
        spec_hash: spec_hash_house,
      });
    }
    if (!profile)
      return res
        .status(404)
        .json({ error: "Legislator not found (legislator_profiles)" });
    if (!legislator)
      return res
        .status(404)
        .json({ error: "Legislator not found (legislators)" });

    const combined_result = Object.assign({}, profile, legislator);
    res.status(200).json(combined_result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislator profile" });
  }
};

// Trims the dynamic `axes` map down to just the fields the axis-compass /
// fingerprint visualizations need, dropping `by_category` and other
// per-axis breakdowns. `axes` is keyed by axis id, so a plain projection
// can't drop nested fields on each entry — this needs $objectToArray /
// $map / $arrayToObject instead.
const LITE_AXES_EXPR = {
  $arrayToObject: {
    $map: {
      input: { $objectToArray: "$axes" },
      as: "a",
      in: {
        k: "$$a.k",
        v: {
          score: "$$a.v.score",
          within_party_z: "$$a.v.within_party_z",
          chamber_z: "$$a.v.chamber_z",
          bill_count: "$$a.v.bill_count",
          current_percentile_rank: "$$a.v.current_percentile_rank",
        },
      },
    },
  },
};

export const getLegislatorProfilesBySpecHash = async (req, res) => {
  try {
    if (!req.params.spec_hash) {
      return res.status(400).json({ error: "spec_hash is required" });
    }
    const db = getDB();
    const profile_collection = db.collection("legislator_profiles");

    const isLite = req.query.lite === "true";

    // lite=true drops primary_categories entirely and trims axes, since the
    // full payload (primary_categories + full per-axis by_category) can run
    // to ~25KB per member -- too large to fetch for an entire chamber roster
    // (e.g. for the axis compass chart or a legislator's peer comparison).
    const projectStage = isLite
      ? {
          $project: {
            _id: 0,
            member_id: 1,
            party: 1,
            state: 1,
            current: "$legislator_data.current",
            official_full_name: "$legislator_data.name.official_full",
            axes: LITE_AXES_EXPR,
          },
        }
      : {
          $project: {
            _id: 0,
            member_id: 1,
            name: 1,
            party: 1,
            state: 1,
            spec_hash: 1,
            primary_categories: 1,
            axes: 1,
            current: "$legislator_data.current",
            official_full_name: "$legislator_data.name.official_full",
          },
        };

    // Aggregation pipeline, match (find) with spec_hash, lookup with legislators collection to add the member_id
    // unwind will join the array with individual documents, only project the official_full name field
    const profiles = await profile_collection
      .aggregate([
        {
          $match: { spec_hash: req.params.spec_hash },
        },
        {
          $lookup: {
            from: "legislators",
            localField: "member_id",
            foreignField: "member_id",
            as: "legislator_data",
          },
        },
        {
          $unwind: {
            path: "$legislator_data",
            preserveNullAndEmptyArrays: true,
          },
        },
        projectStage,
      ])
      .toArray();

    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislator profiles" });
  }
};
