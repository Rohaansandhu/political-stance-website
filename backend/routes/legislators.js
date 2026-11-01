import express from 'express';

import * as LegislatorController from "../controllers/legislators.js";
import * as LegislatorVotesController from "../controllers/legislatorVotes.js";

const router = express.Router();

// Get all legislators with filters
router.get("/", LegislatorController.getLegislators);

// Get all legislator_profiles by spec_hash
router.get("/profiles/:spec_hash", LegislatorController.getLegislatorProfilesBySpecHash);

// Get a legislator's scored votes (joined with bill titles and party splits)
router.get("/:member_id/:model/votes", LegislatorVotesController.getLegislatorVotes);
// Query params: ?filter=broke|defining|recent&axis=...&pole=...&category=...&congress=...&q=...&sort=...&page=...&limit=...

// Get a legislator's percentile within each axis-and-category cell
router.get("/:member_id/:model/axis-categories", LegislatorVotesController.getLegislatorAxisCategories);
// Query params: ?axis=... or ?category=...

// Get legislator_profile by member_id and mdoel
router.get("/:member_id/:model", LegislatorController.getLegislatorProfileByMemberIdAndModel);

// Get legislator_profile by member_id
router.get("/:member_id", LegislatorController.getLegislatorProfileByMemberId);


export default router;