// controllers/eventsController.js
import { getEvents, getEventById } from '../models/eventModel.js';

// GET /api/events - list events with optional filters
export async function listEvents(req, res) {
  try {
    const { status, category_id, location, date_from, date_to, q } = req.query;
    const filters = { status, category_id, location, date_from, date_to, q };
    const events = await getEvents(filters);
    res.json({ ok: true, count: events.length, data: events });
  } catch (err) {
    console.error('listEvents:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch events.' });
  }
}

// GET /api/events/:id - get one event by id (404 if missing/suspended)
export async function showEvent(req, res) {
  try {
    const id = req.params.id;
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ ok: false, error: 'Event not found or suspended.' });
    }
    res.json({ ok: true, data: event });
  } catch (err) {
    console.error('showEvent:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch event.' });
  }
}
