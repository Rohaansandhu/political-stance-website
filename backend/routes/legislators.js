import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("legislator_profiles");

    const query = {};
    if (req.query.spec_hash) query.spec_hash = req.query.spec_hash;
    if (req.query.party) query.party = req.query.party;
    if (req.query.state) query.state = req.query.state;
    if (req.query.model) query.model = req.query.model;
    if (req.query.schema_version) {
      query.schema_version = parseInt(req.query.schema_version);
    }
    if (req.query.min_votes) {
      query.vote_count = { $gte: parseInt(req.query.min_votes) };
    }

    // pagination defaults
    const limit = parseInt(req.query.limit) || 200;
    const offset = parseInt(req.query.offset) || 0;

    const profiles = await collection.find(query, {
      projection: {
        _id: 0,
        member_id: 1,
        name: 1,
        party: 1,
        state: 1,
        vote_count: 1
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
    const collection = db.collection("legislator_profiles");
    const profile = await collection.findOne({ member_id: req.params.member_id, spec_hash: req.query.spec_hash });
    if (!profile) return res.status(404).json({ error: "Legislator not found" });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch legislator profile" });
  }
});

export default router;