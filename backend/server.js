import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import legislatorRoutes from "./routes/legislators.js";
import congressRoutes from "./routes/congress-data.js";
import categoryRoutes from "./routes/categories.js";
import billAnalysisRoutes from "./routes/bill_analyses.js";

dotenv.config();

const app = express();

// Create list of allowed URLs from env
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (server-to-server, health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Make sure the DB is connected before any API handler runs
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ error: "Database unavailable" });
  }
});

// Data only changes when the pipeline runs, so let the CDN cache GET responses
app.use("/api", (req, res, next) => {
  if (req.method === "GET") {
    res.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use("/api/legislators", legislatorRoutes);
app.use("/api/congress-data", congressRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/bill-analyses", billAnalysisRoutes);

// Attempt fix for google crawlers
app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /");
});

// Vercel imports the app and handles requests itself; only listen locally
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5001;
  app.listen(port, async () => {
    await connectDB();
    console.log("Server start at http://localhost:" + port);
  });
}

export default app;
