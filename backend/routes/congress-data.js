import express from 'express';

import * as CongressController from '../controllers/congress-data.js';

const router = express.Router();

router.get('/:spec_hash/histogram/:field/:subject/:current', CongressController.getHistogramSubject);

router.get('/:spec_hash/scatter/:field/:subject/:current', CongressController.getScatterSubject);

export default router;