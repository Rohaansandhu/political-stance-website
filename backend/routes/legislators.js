import express from 'express';

import * as LegislatorController from "../controllers/legislators.js";

const router = express.Router();

// Get all legislators with filters
router.get("/", LegislatorController.getLegislators);

// Get legislator_profile by member_id
router.get("/:member_id", LegislatorController.getLegislatorProfileByMemberId);

// Get legislator_profile by member_id and mdoel
router.get("/:member_id/:model", LegislatorController.getLegislatorProfileByMemberIdAndModel);

export default router;