import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js'

import legislatorRoutes from "./routes/legislators.js";
import congressRoutes from "./routes/congress-data.js";
import categoryRoutes from "./routes/categories.js";
import billAnalysisRoutes from "./routes/bill_analyses.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.frontend_url,
  credentials: true, 
}));

app.get("/", (req, res) => {
    res.send("Server is ready");
});

app.use("/api/legislators", legislatorRoutes);
app.use("/api/congress-data", congressRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/bill-analyses", billAnalysisRoutes);

const port = process.env.PORT || 5001;

app.listen(port, async () =>  {
    await connectDB();
    console.log("Server start at http://localhost:" + port);
});


