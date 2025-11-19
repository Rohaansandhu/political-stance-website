import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const db = getDB();
        const collection = db.collection("categories");

        const document = await collection.findOne();

        const categories = document.political_categories.map(cat => cat.name);

        res.json(categories);
    }
    catch {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

export default router;