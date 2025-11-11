import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js'
import { getDB } from './config/db.js';

import legislatorRoutes from "./routes/legislators.js";
import categoryRoutes from "./routes/categories.js";
import spectrumRoutes from "./routes/spectrums.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.frontend_url,
  credentials: true, 
}));

app.get("/", (req, res) => {
    res.send("Server is ready");
});

app.listen(4000, async () =>  {
    await connectDB();
    console.log("Server start at http://localhost:4000 ");
});

app.use("/legislators", legislatorRoutes);
app.use("/congress-data/categories", categoryRoutes);
app.use("/congress-data/spectrums", spectrumRoutes);

app.get("/states", async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("legislator_profiles");

    const states = await collection.distinct("state");
    res.json(states.sort());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch states" });
  }
});
