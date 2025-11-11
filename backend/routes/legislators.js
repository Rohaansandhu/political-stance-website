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
    const db = getDB();
    const profile_collection = db.collection("legislator_profiles");
    const profile = await profile_collection.findOne({ member_id: req.params.member_id, spec_hash: req.query.spec_hash });
    if (!profile) return res.status(404).json({ error: "Legislator not found (legislator_profiles)" });
    const legislator_collection = db.collection("legislators");
    let legislator = null;
    if (req.query.member_id.startsWith("S")) {
      legislator = await legislator_collection.findOne({lis: req.params.member_id});
    } else {
      legislator = await legislator_collection.findOne({bioguide: req.params.member_id});
    }
    if (!legislator) return res.status(404).json({ error: "Legislator not found (legislators)" });
    const combined_result = Object.assign({}, profile, legislator);
    res.json(combined_result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislator profile" });
  }
});

export default router;