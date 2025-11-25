import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("legislators");

    const { search, state, chamber, party, limit = 538, offset = 0 } = req.query;

    // Base query - only current legislators with data
    const query = { has_data: true, current: true };

    // Add search filter (name search)
    if (search && search.trim()) {
      query.$or = [
        { 'name.official_full': { $regex: search, $options: 'i' } },
        { 'name.first': { $regex: search, $options: 'i' } },
        { 'name.last': { $regex: search, $options: 'i' } }
      ];
    }

    const termsConditions = {};
    
    if (state && state.trim()) {
      termsConditions.state = state.toUpperCase();
    }
    
    if (chamber && chamber.trim()) {
      termsConditions.type = chamber.toLowerCase();
    }

    if (party && party.trim()) {
      termsConditions.party = party;
    }

    // Only add terms filter if we have conditions
    if (Object.keys(termsConditions).length > 0) {
      query['terms'] = { $elemMatch: termsConditions };
    }

    const profiles = await collection.find(query, {
      projection: {
        _id: 0,
        bioguide: 1,
        lis: 1,
        name: 1,
        bio: 1,
        terms: 1,
        current: 1
      }
    })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .toArray();

    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);

    res.json({
      results: profiles,
      count: profiles.length,
      total: totalCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislators" });
  }
});

// Get legislator_profile by member_id
router.get("/:member_id", async (req, res) => {
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
    const legislator = await legislator_collection.findOne({ member_id: req.params.member_id });
    // Need to determine if senator or house rep
    if (req.params.member_id.startsWith("S") && req.params.member_id.length <= 4) {
      profile = await profile_collection.findOne({ member_id: req.params.member_id, spec_hash: spec_hash_senate });
    } else {
      profile = await profile_collection.findOne({ member_id: req.params.member_id, spec_hash: spec_hash_house });
    }
    if (!profile) return res.status(404).json({ error: "Legislator not found (legislator_profiles)" });
    if (!legislator) return res.status(404).json({ error: "Legislator not found (legislators)" });
    const combined_result = Object.assign({}, profile, legislator);
    res.status(200).json(combined_result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislator profile" });
  }
});

const model_to_latest_schema = {
  "gpt-oss-120b": "2",
  "gemini-2.5-flash-lite": "3",
  "llama3.3-70b": "2",
  "qwen-3-32b": "2",
}

// Get legislator_profile by member_id and mdoel
router.get("/:member_id/:model", async (req, res) => {
  try {
    if (!req.params.member_id) {
      return res.status(400).json({ error: "member_id is required" });
    }
    if (!req.params.model) {
      return res.status(400).json({ error: "model is required"});
    }
    const spec_hash_house = `${req.params.model}_${model_to_latest_schema[req.params.model]}_all_house_all`;
    const spec_hash_senate = `${req.params.model}_${model_to_latest_schema[req.params.model]}_all_senate_all`;
    const db = getDB();
    const profile_collection = db.collection("legislator_profiles");
    let profile = null;
    const legislator_collection = db.collection("legislators");
    const legislator = await legislator_collection.findOne({ member_id: req.params.member_id });
    // Need to determine if senator or house rep
    if (req.params.member_id.startsWith("S") && req.params.member_id.length <= 4) {
      profile = await profile_collection.findOne({ member_id: req.params.member_id, spec_hash: spec_hash_senate });
    } else {
      profile = await profile_collection.findOne({ member_id: req.params.member_id, spec_hash: spec_hash_house });
    }
    if (!profile) return res.status(404).json({ error: "Legislator not found (legislator_profiles)" });
    if (!legislator) return res.status(404).json({ error: "Legislator not found (legislators)" });

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
});

export default router;