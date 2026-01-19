import { getDB } from "../config/db.js";

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
    // default model for now will be gpt-oss-120b, need a future way to specify model version
    // const spec_hash_house = "gpt-oss-120b_2_all_house_all";
    // const spec_hash_senate = "gpt-oss-120b_2_all_senate_all";
    const spec_hash_house = "gemini-2.5-flash-lite_3_all_house_all";
    const spec_hash_senate = "gemini-2.5-flash-lite_3_all_senate_all";
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

const model_to_latest_schema = {
  "gpt-oss-120b": "3",
  "gemini-2.5-flash-lite": "3",
  "llama3.3-70b": "3",
  "qwen-3-32b": "3",
};

export const getLegislatorProfileByMemberIdAndModel = async (req, res) => {
  try {
    if (!req.params.member_id) {
      return res.status(400).json({ error: "member_id is required" });
    }
    if (!req.params.model) {
      return res.status(400).json({ error: "model is required" });
    }
    const spec_hash_house = `${req.params.model}_${
      model_to_latest_schema[req.params.model]
    }_all_house_all`;
    const spec_hash_senate = `${req.params.model}_${
      model_to_latest_schema[req.params.model]
    }_all_senate_all`;
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

    // Backwards compatability with schema v2, REMOVE LATER
    // Remove primary categories, change main_categories to be primary categories
    if (model_to_latest_schema[req.params.model] === "2") {
      profile["primary_categories"] = profile["main_categories"];
    }

    const combined_result = Object.assign({}, profile, legislator);
    res.status(200).json(combined_result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislator profile" });
  }
};

export const getLegislatorProfilesBySpecHash = async (req, res) => {
  try {
    if (!req.params.spec_hash) {
      return res.status(400).json({ error: "spec_hash is required" });
    }
    const db = getDB();
    const profile_collection = db.collection("legislator_profiles");

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
        {
          $project: {
            _id: 0,
            member_id: 1,
            name: 1,
            party: 1,
            state: 1,
            spec_hash: 1,
            primary_categories: 1,
            official_full_name: "$legislator_data.name.official_full",
          },
        },
      ])
      .toArray();

    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislator profiles" });
  }
};
