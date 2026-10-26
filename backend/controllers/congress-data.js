import { getDB } from '../config/db.js';

export const getHistogramSubject = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("histogram_stats");

    if (!req.params.spec_hash) {
      return res.status(400).json({ error: "member_id is required" });
    }
    if (!req.params.field) {
      return res.status(400).json({ error: "field is required" });
    }
    if (!req.params.subject) {
      return res.status(400).json({ error: "subject is required" });
    }
    if (!req.params.subject) {
      return res.status(400), json({ current: "current flag is required" });
    }

    const stats = await collection.findOne({
      spec_hash: req.params.spec_hash,
      field: req.params.field,
      subject: req.params.subject,
      current: parseBoolean(req.params.current),
      chart_type: "histogram",
    });

    if (!stats) return res.status(404).json({ error: "Stat not found" });

    res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch histogram subject" });
  }
};

export const getScatterSubject = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("scatter_stats");

    if (!req.params.spec_hash) {
      return res.status(400).json({ error: "member_id is required" });
    }
    if (!req.params.field) {
      return res.status(400).json({ error: "field is required" });
    }
    if (!req.params.subject) {
      return res.status(400).json({ error: "subject is required" });
    }
    if (!req.params.subject) {
      return res.status(400), json({ current: "current flag is required" });
    }

    const stats = await collection.findOne({
      spec_hash: req.params.spec_hash,
      field: req.params.field,
      subject: req.params.subject,
      current: parseBoolean(req.params.current),
      chart_type: "scatter",
    });

    if (!stats) return res.status(404).json({ error: "Stat not found" });

    res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch scatterplot subject" });
  }
};

// Precomputed per-axis chamber mean/SD and axis-pair Pearson r (both "raw"
// and "party" variants), written by the pipeline's create_axis_stats.py.
// Preferred over computing these in the browser since the pipeline applies
// a minimum-bill-count cutoff the client doesn't know about.
export const getAxisStats = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("axis_stats");

    if (!req.params.spec_hash) {
      return res.status(400).json({ error: "spec_hash is required" });
    }
    if (!req.params.current) {
      return res.status(400).json({ error: "current flag is required" });
    }

    const stats = await collection.findOne({
      spec_hash: req.params.spec_hash,
      current: parseBoolean(req.params.current),
    });

    if (!stats) return res.status(404).json({ error: "Stat not found" });

    res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch axis stats" });
  }
};

function parseBoolean(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    return null;  // invalid
}