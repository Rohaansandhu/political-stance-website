// One-off script: replace the stale `categories` collection document with the
// v5 category definitions (renamed/moved subcategories, `scope` field).
// Usage: node scripts/seedCategories.js
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const categoriesPath = join(
  __dirname,
  "..",
  "..",
  "frontend",
  "data",
  "politicalCategories.json",
);

async function main() {
  const raw = readFileSync(categoriesPath, "utf-8");
  const { political_categories } = JSON.parse(raw);

  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const collection = db.collection("categories");

  const existing = await collection.findOne();
  const result = existing
    ? await collection.replaceOne(
        { _id: existing._id },
        { political_categories },
      )
    : await collection.insertOne({ political_categories });

  console.log(
    existing
      ? `Replaced categories document ${existing._id} (${political_categories.length} categories).`
      : `Inserted new categories document (${political_categories.length} categories).`,
  );
  console.log(result);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed to seed categories:", err);
  process.exit(1);
});
