// controllers/categoriesController.js
import { getCategories } from '../models/eventModel.js';

// GET /api/categories
// Fetch all categories from the database and return JSON.
// No query/body params needed for this route.
export async function listCategories(req, res) {
  try {
    // Ask the model for the data
    const categories = await getCategories();

    // Return a simple, consistent shape for the frontend
    res.json({
      ok: true,
      count: categories.length, // how many rows we got
      data: categories
    });
  } catch (err) {
    // Print the actual error to the server console for debugging。
    console.error('listCategories error:', err);

    // Send a generic error to the client (don’t leak internals)
    res.status(500).json({ ok: false, error: 'Failed to fetch categories.' });
  }
}
