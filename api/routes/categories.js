import { Router } from 'express';
import { listCategories } from '../controllers/categoriesController.js';

const router = Router();

// GET /api/categories
router.get('/', listCategories);

export default router;
