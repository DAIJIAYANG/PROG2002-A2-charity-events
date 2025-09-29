// controllers/categoriesController.js
import { getCategories } from '../models/eventModel.js';

// GET /api/categories - list all categories
export async function listCategories(req, res) {
  try {
    const categories = await getCategories();
    res.json({ ok: true, count: categories.length, data: categories });
  } catch (err) {
    console.error('listCategories:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch categories.' });
  }
}
