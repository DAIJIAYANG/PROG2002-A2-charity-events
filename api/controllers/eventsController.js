// controllers/eventsController.js
import { getEvents, getEventById } from '../models/eventModel.js';

// GET /api/events
// Optional filters: status, category_id, location, date_from, date_to, q
export async function listEvents(req, res) {
  try {
    const { status, category_id, location, date_from, date_to, q } = req.query; // read filters
    const filters = { status, category_id, location, date_from, date_to, q };
    const events = await getEvents(filters); // query with filters
    res.json({ ok: true, count: events.length, data: events });
  } catch (err) {
    console.error('[events] list error:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch events.' });
  }
}

// GET /api/events/:id
// Return one event by id; 404 if not found/suspended.
export async function showEvent(req, res) {
  try {
    const id = req.params.id; // from URL
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ ok: false, error: 'Event not found or suspended.' });
    }
    res.json({ ok: true, data: event });
  } catch (err) {
    console.error('[events] show error:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch event.' });
  }
}
