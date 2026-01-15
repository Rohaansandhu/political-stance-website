import express from "express";
import * as BillAnalysisController from "../controllers/bill_analyses.js";

const router = express.Router();

// Get featured bills (homepage)
router.get("/featured", BillAnalysisController.getFeaturedBills);

// Get unique filter values (for dropdowns)
router.get("/filters", BillAnalysisController.getFilterOptions);

// Get ideology distribution (for stats/charts)
router.get("/stats/ideology", BillAnalysisController.getIdeologyDistribution);

// Get all bill analyses with filters and pagination
router.get("/", BillAnalysisController.getBillAnalyses);
// Query params: ?model=...&bill_type=...&chamber=...&congress=...&category=...&ideology=...&page=...&limit=...&search=...

// Get single bill analysis by bill_id (MUST be last - it's a catch-all)
router.get("/:bill_id/:model", BillAnalysisController.getBillAnalysisByIdAndModel);

export default router;