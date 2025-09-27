// controllers/eventsController.js
import { getEvents, getEventById } from '../models/eventModel.js';

// GET /api/events
// Reads optional query params and passes them to the model.
// Supported filters: status, category_id, location, date_from, date_to, q
export async function listEvents(req, res) {
  try {
    // Collect filters from the query string
    const { status, category_id, location, date_from, date_to, q } = req.query;
    const filters = { status, category_id, location, date_from, date_to, q };

    // Ask the model for filtered results
    const events = await getEvents(filters);

    // Return a simple JSON shape the frontend can use
    res.json({ ok: true, count: events.length, data: events });
  } catch (err) {
    // Log the real error on the server for debugging
    console.error('listEvents error:', err);

    // Send a generic error back to the client
    res.status(500).json({ ok: false, error: 'Failed to fetch events.' });
  }
}

// GET /api/events/:id
// Returns one event by id. If not found (or suspended), send 404.
export async function showEvent(req, res) {
  try {
    // Grab the path param like /api/events/123
    const id = req.params.id;

    // Fetch a single event record
    const event = await getEventById(id);

    // If nothing came back, tell the client it's not found
    if (!event) {
      return res.status(404).json({ ok: false, error: 'Event not found or suspended.' });
    }

    // Otherwise return the event
    res.json({ ok: true, data: event });
  } catch (err) {
    // Same idea: log on server, keep client message simple
    console.error('showEvent error:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch event.' });
  }
}
