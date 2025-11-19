import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js'

import legislatorRoutes from "./routes/legislators.js";
import congressRoutes from "./routes/congress-data.js";
import categoryRoutes from "./routes/categories.js";

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
app.use("/congress-data", congressRoutes);
app.use("/categories", categoryRoutes);
