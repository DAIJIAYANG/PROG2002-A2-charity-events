// models/eventModel.js
import pool from '../db/event_db.js';

// Build WHERE and params from filters (simple and explicit)
function buildWhere(filters = {}) {
  const where = [];
  const params = [];

  // always skip suspended events
  where.push('e.is_suspended = 0');

  // status filter: "upcoming"/"active" >= today, "past" < today
  if (filters.status) {
    if (filters.status === 'upcoming' || filters.status === 'active') {
      where.push('e.end_datetime >= CURDATE()');
    } else if (filters.status === 'past') {
      where.push('e.end_datetime < CURDATE()');
    }
  }

  // by category
  if (filters.category_id) {
    where.push('e.category_id = ?');
    params.push(filters.category_id);
  }

  // fuzzy match by location
  if (filters.location) {
    where.push('e.location LIKE ?');
    params.push('%' + filters.location + '%');
  }

  // date range (start >= from, end <= to)
  if (filters.date_from) {
    where.push('e.start_datetime >= ?');
    params.push(filters.date_from);
  }
  if (filters.date_to) {
    where.push('e.end_datetime <= ?');
    params.push(filters.date_to);
  }

  // simple keyword search
  if (filters.q) {
    where.push('(e.name LIKE ? OR e.description LIKE ? OR e.purpose LIKE ?)');
    params.push('%' + filters.q + '%', '%' + filters.q + '%', '%' + filters.q + '%');
  }

  const whereClause = where.length ? ('WHERE ' + where.join(' AND ')) : '';
  return { where: whereClause, params };
}

// list events with optional filters
export async function getEvents(filters = {}) {
  const { where, params } = buildWhere(filters);
  const sql = `
    SELECT e.id, e.name, e.location, e.start_datetime, e.end_datetime,
           e.image_url, e.ticket_price, e.goal_amount, e.raised_amount,
           c.id AS category_id, c.name AS category_name,
           o.id AS org_id, o.name AS org_name
    FROM events e
    JOIN categories c ON c.id = e.category_id
    JOIN organizations o ON o.id = e.org_id
    ${where}
    ORDER BY e.start_datetime ASC
  `;
  const [rows] = await pool.query(sql, params);
  return rows;
}

// get one event by id (ignore suspended)
export async function getEventById(id) {
  const sql = `
    SELECT e.*, c.name AS category_name, o.name AS org_name, o.mission AS org_mission, o.website AS org_website
    FROM events e
    JOIN categories c ON c.id = e.category_id
    JOIN organizations o ON o.id = e.org_id
    WHERE e.id = ? AND e.is_suspended = 0
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows[0] || null;
}

// list all categories (for filters, etc.)
export async function getCategories() {
  const [rows] = await pool.query('SELECT id, name, slug FROM categories ORDER BY name ASC');
  return rows;
}
