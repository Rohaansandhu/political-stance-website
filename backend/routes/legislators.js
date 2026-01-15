import express from 'express';

import * as LegislatorController from "../controllers/legislators.js";

const router = express.Router();

// Get all legislators with filters
router.get("/", LegislatorController.getLegislators);

// Get all legislator_profiles by spec_hash
router.get("/profiles/:spec_hash", LegislatorController.getLegislatorProfilesBySpecHash);

// Get legislator_profile by member_id and mdoel
router.get("/:member_id/:model", LegislatorController.getLegislatorProfileByMemberIdAndModel);

// Get legislator_profile by member_id
router.get("/:member_id", LegislatorController.getLegislatorProfileByMemberId);


export default router;