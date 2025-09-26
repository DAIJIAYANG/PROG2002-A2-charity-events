import { getCategories } from '../models/eventModel.js';

export async function listCategories(req, res) {
  try {
    const categories = await getCategories();
    res.json({ ok: true, count: categories.length, data: categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to fetch categories.' });
  }
}
