// base url
const API_BASE = window.API_BASE || '';

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  const f = document.getElementById('searchForm');
  if (f) f.addEventListener('submit', runSearch);
  const clr = document.getElementById('clearBtn');
  if (clr) clr.addEventListener('click', clearFilters);
});

// fill category select
async function loadCategories() {
  const sel = document.getElementById('category_id');
  if (!sel) return;
  try {
    const res = await fetch(`${API_BASE}/api/categories`);
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];
    for (const c of list) {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name || '';
      sel.appendChild(opt);
    }
  } catch {
    // ignore
  }
}

// build query (default: upcoming)
function buildQS(form) {
  const p = new URLSearchParams();
  p.set('status', 'upcoming');
  if (form.date_from.value) p.set('date_from', form.date_from.value);
  if (form.date_to.value) p.set('date_to', form.date_to.value);
  const loc = form.location.value.trim();
  if (loc) p.set('location', loc);
  if (form.category_id.value) p.set('category_id', form.category_id.value);
  return p.toString();
}

function whenText(s, e) {
  const a = new Date(s), b = new Date(e);
  const as = !isNaN(a), bs = !isNaN(b);
  if (as && bs) return a.toLocaleString() + ' — ' + b.toLocaleString();
  if (as) return a.toLocaleString();
  if (bs) return b.toLocaleString();
  return '';
}

// make one card
function makeCard(ev) {
  const card = document.createElement('article');
  card.className = 'card';

  const h = document.createElement('h3');
  h.textContent = ev.name || 'Event';
  card.appendChild(h);

  if (ev.image_url) {
    const im = document.createElement('img');
    im.src = ev.image_url;
    im.alt = ev.name || '';
    im.loading = 'lazy';
    im.addEventListener('error', () => (im.src = 'public/img/placeholder.jpg'));
    card.appendChild(im);
  }

  // past tag
  if (new Date(ev.end_datetime) < new Date()) {
    const t = document.createElement('div');
    t.className = 'badge';
    t.textContent = 'Past';
    card.appendChild(t);
  }

  if (ev.category_name) {
    const tag = document.createElement('div');
    tag.className = 'badge';
    tag.textContent = ev.category_name;
    card.appendChild(tag);
  }

  const p1 = document.createElement('p');
  p1.className = 'small';
  p1.textContent = whenText(ev.start_datetime, ev.end_datetime);
  card.appendChild(p1);

  const p2 = document.createElement('p');
  p2.textContent = ev.location || '';
  card.appendChild(p2);

  const price = Number(ev.ticket_price);
  const p3 = document.createElement('p');
  p3.textContent = 'Ticket: ' + (price > 0 ? '$' + price : 'Free');
  card.appendChild(p3);

  if (ev.id !== undefined && ev.id !== null) {
    const a = document.createElement('a');
    a.className = 'btn';
    a.href = `event.html?id=${encodeURIComponent(ev.id)}`;
    a.textContent = 'View Details';
    card.appendChild(a);
  }

  return card;
}

// submit
async function runSearch(e) {
  e.preventDefault();

  const form = document.getElementById('searchForm');
  const msg = document.getElementById('searchMsg');
  const err = document.getElementById('searchError');
  const grid = document.getElementById('resultsGrid');

  msg.textContent = '';
  err.textContent = '';
  err.style.display = 'none';
  grid.innerHTML = '';

  // quick date check
  const df = form.date_from.value;
  const dt = form.date_to.value;
  if (df && dt && df > dt) {
    err.textContent = 'Date range is invalid: From should be earlier than To.';
    err.style.display = 'block';
    return;
  }

  const empty = !df && !dt && !form.location.value.trim() && !form.category_id.value;
  if (empty) msg.textContent = 'Tip: set date / location / category if you want.';

  try {
    if (!empty) msg.textContent = 'Searching...';
    const qs = buildQS(form);
    const res = await fetch(`${API_BASE}/api/events?${qs}`);
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];

    msg.textContent = `Found ${list.length} event(s).`;

    if (list.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No matching events.';
      grid.appendChild(p);
      return;
    }

    for (const ev of list) grid.appendChild(makeCard(ev));

  } catch {
    msg.textContent = '';
    err.textContent = 'Search failed.';
    err.style.display = 'block';
  }
}

// reset form + ui
function clearFilters() {
  const f = document.getElementById('searchForm');
  if (f) f.reset();
  const grid = document.getElementById('resultsGrid');
  if (grid) grid.innerHTML = '';
  const msg = document.getElementById('searchMsg');
  if (msg) msg.textContent = '';
  const err = document.getElementById('searchError');
  if (err) { err.textContent = ''; err.style.display = 'none'; }
}
