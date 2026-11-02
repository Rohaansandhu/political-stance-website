import express from 'express';

import * as CongressController from '../controllers/congress-data.js';
import * as HwyvController from '../controllers/hwyv.js';

const router = express.Router();

router.get('/:spec_hash/histogram/:field/:subject/:current', CongressController.getHistogramSubject);

router.get('/:spec_hash/scatter/:field/:subject/:current', CongressController.getScatterSubject);

router.get('/:spec_hash/axis-stats/:current', CongressController.getAxisStats);

// How Would You Vote? Brief fields only: no result, tally, sponsor or analysis
router.get('/:spec_hash/hwyv/deck', HwyvController.getDeck);
// Query params: ?deck=featured|random&category=...&limit=...&exclude=<comma vote_ids>&seed=...
router.get('/:spec_hash/hwyv/cards/:vote_id', HwyvController.getCard);

// The rest of a card, plus how current members voted
router.get('/:spec_hash/hwyv/cards/:vote_id/reveal', HwyvController.getReveal);

router.post('/:spec_hash/hwyv/match', express.json({ limit: '1mb' }), HwyvController.postMatch);

export default router;