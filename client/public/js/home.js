// Home page: list upcoming/active events
const API_BASE = window.API_BASE || '';

document.addEventListener('DOMContentLoaded', loadHome);

function el(tag, className, text) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = String(text);
  return n;
}

function whenText(s, e) {
  const a = new Date(s), b = new Date(e);
  const okA = !isNaN(a), okB = !isNaN(b);
  if (okA && okB) return a.toLocaleString() + ' — ' + b.toLocaleString();
  if (okA) return a.toLocaleString();
  if (okB) return b.toLocaleString();
  return '';
}

async function loadHome() {
  const grid = document.getElementById('eventsGrid');
  const err = document.getElementById('homeError');
  if (!grid) return;

  grid.replaceChildren();
  if (err) { err.style.display = 'none'; err.textContent = ''; }
  grid.append(el('p', 'small', 'Loading upcoming events...'));

  try {
    const res = await fetch(`${API_BASE}/api/events?status=upcoming`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];

    grid.replaceChildren();

    if (list.length === 0) {
      grid.append(el('p', null, 'No upcoming events.'));
      return;
    }

    for (const ev of list) {
      const card = el('article', 'card');

      if (ev.image_url) {
        const im = document.createElement('img');
        im.src = ev.image_url;
        im.alt = ev.name || 'event image';
        im.loading = 'lazy';
        card.append(im);
      }

      card.append(el('h3', null, ev.name || 'Event'));

      if (ev.category_name) {
        const b = el('div', 'badge', ev.category_name);
        card.append(b);
      }

      card.append(el('p', 'small', whenText(ev.start_datetime, ev.end_datetime)));
      card.append(el('p', null, ev.location || ''));

      const a = document.createElement('a');
      a.className = 'btn';
      a.href = `event.html?id=${encodeURIComponent(ev.id)}`;
      a.textContent = 'View Details';
      card.append(a);

      grid.append(card);
    }
  } catch (e) {
    grid.replaceChildren();
    if (err) {
      err.textContent = 'Failed to load events.';
      err.style.display = 'block';
    }
  }
}
