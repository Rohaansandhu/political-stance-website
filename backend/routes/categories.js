import express from 'express';
import * as CategoriesController from '../controllers/categories.js';

const router = express.Router();

router.get("/", CategoriesController.getCategories);

export default router;