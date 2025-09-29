// controllers/categoriesController.js
import { getCategories } from '../models/eventModel.js';

// GET /api/categories
// Return all categories as JSON. No input needed.
export async function listCategories(req, res) {
  try {
    const categories = await getCategories(); // read from DB
    res.json({
      ok: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    console.error('[categories] list error:', err); // log on server
    res.status(500).json({ ok: false, error: 'Failed to fetch categories.' });
  }
}
