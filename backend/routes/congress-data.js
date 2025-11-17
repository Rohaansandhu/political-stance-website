import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

router.get('/:spec_hash/histogram/:field/:subject/:current', async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection("histogram_stats");

        if (!req.params.spec_hash) {
            return res.status(400).json({ error: "member_id is required" });
        }
        if (!req.params.field) {
            return res.status(400).json({ error: "field is required" })
        }
        if (!req.params.subject) {
            return res.status(400).json({ error: "subject is required" })
        }
        if (!req.params.subject) {
            return res.status(400), json({ current: "current flag is required" })
        }

        const stats = await collection.findOne({ 
            spec_hash: req.params.spec_hash, 
            field: req.params.field, 
            subject: req.params.subject, 
            current: parseBoolean(req.params.current), 
            "chart_type": "histogram" 
        })

        if (!stats) return res.status(404).json({ error: "Stat not found" });

        res.status(200).json(stats);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch histogram subject" });
    }
});

router.get('/:spec_hash/scatter/:field/:subject/:current', async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection("scatter_stats");

        if (!req.params.spec_hash) {
            return res.status(400).json({ error: "member_id is required" });
        }
        if (!req.params.field) {
            return res.status(400).json({ error: "field is required" })
        }
        if (!req.params.subject) {
            return res.status(400).json({ error: "subject is required" })
        }
        if (!req.params.subject) {
            return res.status(400), json({ current: "current flag is required" })
        }

        const stats = await collection.findOne({ spec_hash: req.params.spec_hash, 
            field: req.params.field, 
            subject: req.params.subject, 
            current: parseBoolean(req.params.current), 
            "chart_type": "scatter" 
        })

        if (!stats) return res.status(404).json({ error: "Stat not found" });

        res.status(200).json(stats);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch scatterplot subject" });
    }
});

function parseBoolean(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    return null;  // invalid
}

export default router;