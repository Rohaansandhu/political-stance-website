import { getDB } from "../config/db.js";

export const getBillAnalyses = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("bill_analyses");

    // Extract query params
    const {
      model,
      bill_type,
      chamber,
      congress,
      category, // filter by primary_category name
      ideology, // 'liberal', 'moderate', 'conservative'
      search, // search bill_id or title
      page = 1,
      limit = 20,
      sort = "-congress", // default: newest first
    } = req.query;

    // Build query object
    const query = { schema_version: 3 }; // Only get v3 schema

    if (model) query.model = model;
    if (bill_type) query.bill_type = bill_type;
    if (chamber) query.chamber = chamber;
    if (congress) query.congress = congress;
    if (search) {
      query.$or = [
        { bill_id: { $regex: search, $options: "i" } },
        { "bill_summary.title": { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query["political_categories.primary_categories.name"] = category;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let bills;
    let total;

    // Handle ideology filter with aggregation
    if (ideology) {
      const ideologyRanges = {
        liberal: { $lt: -0.3 },
        moderate: { $gte: -0.3, $lte: 0.3 },
        conservative: { $gt: 0.3 },
      };

      const ideologyCondition = ideologyRanges[ideology];
      if (!ideologyCondition) {
        return res.status(400).json({ error: "Invalid ideology filter" });
      }

      // Build aggregation pipeline
      const pipeline = [
        { $match: query },
        {
          $addFields: {
            avg_partisan_score: {
              $avg: "$political_categories.primary_categories.partisan_score",
            },
          },
        },
        {
          $match: {
            avg_partisan_score: ideologyCondition,
          },
        },
        {
          $project: {
            bill_id: 1,
            model: 1,
            bill_type: 1,
            chamber: 1,
            congress: 1,
            "bill_summary.title": 1,
            "political_categories.primary_categories": 1,
            avg_partisan_score: 1,
          },
        },
      ];

      // Get total count
      const countPipeline = [...pipeline, { $count: "total" }];
      const countResult = await collection.aggregate(countPipeline).toArray();
      total = countResult.length > 0 ? countResult[0].total : 0;

      // Add sorting, skip, and limit
      const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
      const sortDirection = sort.startsWith("-") ? -1 : 1;
      pipeline.push({ $sort: { [sortField]: sortDirection } });
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(limit) });

      bills = await collection.aggregate(pipeline).toArray();
    } else {
      // Regular query without ideology filter
      const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
      const sortDirection = sort.startsWith("-") ? -1 : 1;

      bills = await collection
        .find(query)
        .project({
          bill_id: 1,
          model: 1,
          bill_type: 1,
          chamber: 1,
          congress: 1,
          "bill_summary.title": 1,
          "political_categories.primary_categories": 1,
        })
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray();

      total = await collection.countDocuments(query);
    }

    res.json({
      bills,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bill analyses" });
  }
};

export const getFeaturedBills = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("bill_analyses");

    // Strategy: Get one recent bill from each major category
    // This ensures diverse representation
    const categories = [
      "Environment & Energy",
      "Healthcare",
      "Education",
      "Economy & Finance",
      "Foreign Policy & National Security",
      "Government & Institutional Reform",
    ];

    const featuredBills = await collection
      .aggregate([
        { $match: { schema_version: 3 } },
        { $unwind: "$political_categories.primary_categories" },
        {
          $match: {
            "political_categories.primary_categories.name": { $in: categories },
          },
        },
        { $sort: { congress: -1, _id: -1 } },
        {
          $group: {
            _id: "$political_categories.primary_categories.name",
            bill: { $first: "$$ROOT" },
          },
        },
        { $limit: 6 },
        { $replaceRoot: { newRoot: "$bill" } },
        {
          $project: {
            bill_id: 1,
            model: 1,
            bill_type: 1,
            chamber: 1,
            congress: 1,
            "bill_summary.title": 1,
            "political_categories.primary_categories": 1,
          },
        },
      ])
      .toArray();

    res.json({ featured_bills: featuredBills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch featured bills" });
  }
};

export const getFilterOptions = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("bill_analyses");

    const [models, billTypes, chambers, congresses] = await Promise.all([
      collection.distinct("model", { schema_version: 3 }),
      collection.distinct("bill_type", { schema_version: 3 }),
      collection.distinct("chamber", { schema_version: 3 }),
      collection.distinct("congress", { schema_version: 3 }),
    ]);

    // For categories, need to extract from nested array

    const categoryCollection = db.collection("categories");

    const document = await categoryCollection.findOne();

    const categories = document.political_categories.map((cat) => cat.name);

    res.json({
      models,
      bill_types: billTypes,
      chambers,
      congresses: congresses.sort((a, b) => b - a),
      categories: categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch filter options" });
  }
};

export const getBillAnalysisByIdAndModel = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("bill_analyses");
    const { bill_id, model } = req.params;

    const bill = await collection.findOne({
      bill_id,
      model,
      schema_version: 3,
    });

    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    res.json(bill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bill analysis" });
  }
};

export const getIdeologyDistribution = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection("bill_analyses");

    const distribution = await collection
      .aggregate([
        { $match: { schema_version: 3 } },
        {
          $addFields: {
            avg_partisan_score: {
              $avg: "$political_categories.primary_categories.partisan_score",
            },
          },
        },
        {
          $bucket: {
            groupBy: "$avg_partisan_score",
            boundaries: [-1, -0.6, -0.3, 0, 0.3, 0.6, 1],
            default: "other",
            output: {
              count: { $sum: 1 },
              bills: {
                $push: {
                  bill_id: "$bill_id",
                  title: "$bill_summary.title",
                  avg_score: "$avg_partisan_score",
                },
              },
            },
          },
        },
      ])
      .toArray();

    res.json({ distribution });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch ideology distribution" });
  }
};
