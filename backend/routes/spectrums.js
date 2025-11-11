import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("legislator_profiles");

    const sample = await collection.findOne({}, { projection: { _id: 0, detailed_spectrums: 1 } });

    if (!sample || !sample.detailed_spectrums) {
      return res.json([]);
    }

    res.json(Object.keys(sample.detailed_spectrums));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch spectrums" });
  }
});

router.get("/:spectrum", async (req, res) => {
  try {
    const db = getDB();
    const { minScore, maxScore } = req.query;
    const collection = db.collection("legislator_profiles");

    const profiles = await collection
      .find({
        [`detailed_spectrums.${req.params.spectrum}.score`]: {
          $gte: minScore ? parseFloat(minScore) : -Infinity,
          $lte: maxScore ? parseFloat(maxScore) : Infinity,
        },
      })
      .toArray();

    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profiles by spectrum" });
  }
});

export default router;