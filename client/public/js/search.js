// search.js — basic version (student-style)

// fallback if not injected
const API_BASE = window.API_BASE || '';

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  const form = document.getElementById('searchForm');
  if (form) form.addEventListener('submit', runSearch);
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearFilters);
});

// load <select> options from API
async function loadCategories() {
  const sel = document.getElementById('category_id');
  if (!sel) return;
  try {
    const res = await fetch(`${API_BASE}/api/categories`);
    const json = await res.json();
    if (json && Array.isArray(json.data)) {
      for (const c of json.data) {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name || '';
        sel.appendChild(opt);
      }
    }
  } catch (_) {
    console.log('load categories failed');
  }
}

// build query string from form (default upcoming)
function formToQuery(form) {
  const p = new URLSearchParams();
  p.set('status', 'upcoming');
  if (form.date_from.value) p.set('date_from', form.date_from.value);
  if (form.date_to.value) p.set('date_to', form.date_to.value);
  const loc = form.location.value.trim();
  if (loc) p.set('location', loc);
  if (form.category_id.value) p.set('category_id', form.category_id.value);
  return p.toString();
}

function whenText(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const sOk = !isNaN(s);
  const eOk = !isNaN(e);
  if (sOk && eOk) return s.toLocaleString() + ' — ' + e.toLocaleString();
  if (sOk) return s.toLocaleString();
  if (eOk) return e.toLocaleString();
  return '';
}

// make one result card (very simple)
function makeCard(ev) {
  const card = document.createElement('article');
  card.className = 'card';

  const h3 = document.createElement('h3');
  h3.textContent = ev.name || 'Event';
  card.appendChild(h3);

  if (ev.image_url) {
    const im = document.createElement('img');
    im.src = ev.image_url;
    im.alt = ev.name || '';
    card.appendChild(im);
  }

  if (ev.category_name) {
    const b = document.createElement('div');
    b.className = 'badge';
    b.textContent = ev.category_name;
    card.appendChild(b);
  }

  const pWhen = document.createElement('p');
  pWhen.className = 'small';
  pWhen.textContent = whenText(ev.start_datetime, ev.end_datetime);
  card.appendChild(pWhen);

  const pWhere = document.createElement('p');
  pWhere.textContent = ev.location || '';
  card.appendChild(pWhere);

  const pPrice = document.createElement('p');
  const priceNum = Number(ev.ticket_price);
  pPrice.textContent = 'Ticket: ' + (priceNum > 0 ? ('$' + priceNum) : 'Free');
  card.appendChild(pPrice);

  if (ev.id !== undefined && ev.id !== null) {
    const a = document.createElement('a');
    a.className = 'btn';
    a.href = `event.html?id=${encodeURIComponent(ev.id)}`;
    a.textContent = 'View Details';
    card.appendChild(a);
  }

  return card;
}

// submit search
async function runSearch(e) {
  e.preventDefault();

  const form = document.getElementById('searchForm');
  const msg = document.getElementById('searchMsg');
  const err = document.getElementById('searchError');
  const grid = document.getElementById('resultsGrid');

  msg.textContent = '';
  err.style.display = 'none';
  err.textContent = '';
  grid.innerHTML = '';

  // simple date check
  const df = form.date_from.value;
  const dt = form.date_to.value;
  if (df && dt && df > dt) {
    err.textContent = 'Date range is invalid: From should be earlier than To.';
    err.style.display = 'block';
    return;
  }

  // tip if all empty
  const allEmpty = !df && !dt && !form.location.value.trim() && !form.category_id.value;
  if (allEmpty) msg.textContent = 'Tip: you can set date / location / category.';

  try {
    msg.textContent = allEmpty ? msg.textContent : 'Searching...';
    const qs = formToQuery(form);
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

    for (const ev of list) {
      grid.appendChild(makeCard(ev));
    }
  } catch (_) {
    msg.textContent = '';
    err.textContent = 'Search failed.';
    err.style.display = 'block';
  }
}

// clear filters and UI
function clearFilters() {
  const form = document.getElementById('searchForm');
  if (form) form.reset();
  const grid = document.getElementById('resultsGrid');
  if (grid) grid.innerHTML = '';
  const msg = document.getElementById('searchMsg');
  if (msg) msg.textContent = '';
  const err = document.getElementById('searchError');
  if (err) { err.textContent = ''; err.style.display = 'none'; }
}
