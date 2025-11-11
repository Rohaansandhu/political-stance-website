import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("legislators");

    // populate legislators with data that are current
    const query = {'has_data': true, 'current': true};

    // pagination defaults
    const limit = parseInt(req.query.limit) || 200;
    const offset = parseInt(req.query.offset) || 0;

    const profiles = await collection.find(query, {
      projection: {
        _id: 0,
      }
    })
      .skip(offset)
      .limit(limit)
      .toArray();

    res.json({ results: profiles, count: profiles.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislators" });
  }
});

// Get legislator_profile by member_id and spec_hash
router.get("/:member_id", async (req, res) => {
  try {
    if (!req.params.member_id) {
      return res.status(400).json({ error: "member_id is required" });
    }
    // default model for now will be gpt-oss-120b, need a future way to specify model version
    const spec_hash_house = "gpt-oss-120b_2_all_house_all";
    const spec_hash_senate = "gpt-oss-120b_2_all_senate_all";
    const db = getDB();
    const profile_collection = db.collection("legislator_profiles");
    let profile = null;
    const legislator_collection = db.collection("legislators");
    let legislator = null;
    if (req.params.member_id.startsWith("S")) {
      legislator = await legislator_collection.findOne({lis: req.params.member_id});
      profile = await profile_collection.findOne({ member_id: req.params.member_id, spec_hash: spec_hash_senate });
    } else {
      legislator = await legislator_collection.findOne({bioguide: req.params.member_id});
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

export default router;