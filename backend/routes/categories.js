import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("legislator_profiles");

    const sample = await collection.findOne({}, { projection: { _id: 0, main_categories: 1 } });

    if (!sample || !sample.main_categories) {
      return res.json([]);
    }

    res.json(Object.keys(sample.main_categories));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/:category", async (req, res) => {
  try {
    const db = getDB();
    const { minScore, maxScore } = req.query;
    const collection = db.collection("legislator_profiles");

    const profiles = await collection
      .find({
        [`main_categories.${req.params.category}.score`]: {
          $gte: minScore ? parseFloat(minScore) : -Infinity,
          $lte: maxScore ? parseFloat(maxScore) : Infinity,
        },
      })
      .toArray();

    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profiles by category" });
  }
});

export default router;