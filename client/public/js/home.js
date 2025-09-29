// home.js — simple version (student-style)

// fallback if not injected
const API_BASE = window.API_BASE || '';

document.addEventListener('DOMContentLoaded', loadHome);

function whenText(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const sOk = !isNaN(s);
  const eOk = !isNaN(e);
  if (sOk && eOk) return s.toLocaleString() + ' — ' + e.toLocaleString();
  if (sOk) return s.toLocaleString();
  if (eOk) return e.toLocaleString();
  return (start || '') + (end ? ' — ' + end : '');
}

async function loadHome() {
  const grid = document.getElementById('eventsGrid');
  const errBox = document.getElementById('homeError');
  if (!grid || !errBox) return;

  grid.textContent = 'Loading...';
  errBox.style.display = 'none';

  try {
    const res = await fetch(`${API_BASE}/api/events?status=upcoming`);
    if (!res.ok) throw new Error('network');

    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];

    grid.textContent = '';

    if (list.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No upcoming events.';
      grid.appendChild(p);
      return;
    }

    for (const e of list) {
      const card = document.createElement('article');
      card.className = 'card';

      // title
      const h3 = document.createElement('h3');
      h3.textContent = e.name || 'Event';
      card.appendChild(h3);

      // image (only if exists)
      if (e.image_url) {
        const im = document.createElement('img');
        im.src = e.image_url;
        im.alt = e.name || '';
        card.appendChild(im);
      }

      // category (optional)
      if (e.category_name) {
        const b = document.createElement('div');
        b.className = 'badge';
        b.textContent = e.category_name;
        card.appendChild(b);
      }

      // when
      const pWhen = document.createElement('p');
      pWhen.className = 'small';
      pWhen.textContent = whenText(e.start_datetime, e.end_datetime);
      card.appendChild(pWhen);

      // location
      const pWhere = document.createElement('p');
      pWhere.textContent = e.location || '';
      card.appendChild(pWhere);

      // price (very basic)
      const pPrice = document.createElement('p');
      const priceNum = Number(e.ticket_price);
      pPrice.textContent = 'Ticket: ' + (priceNum > 0 ? ('$' + priceNum) : 'Free');
      card.appendChild(pPrice);

      // details link
      if (e.id !== undefined && e.id !== null) {
        const a = document.createElement('a');
        a.className = 'btn';
        a.href = `event.html?id=${encodeURIComponent(e.id)}`;
        a.textContent = 'View Details';
        card.appendChild(a);
      }

      grid.appendChild(card);
    }
  } catch (err) {
    grid.textContent = '';
    errBox.textContent = 'Failed to load events.';
    errBox.style.display = 'block';
  }
}
