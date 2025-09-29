// Event detail page
const API_BASE = window.API_BASE || '';

document.addEventListener('DOMContentLoaded', loadEvent);

function getId() {
  try {
    const u = new URL(window.location.href);
    return u.searchParams.get('id');
  } catch {
    return null;
  }
}

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

async function loadEvent() {
  const id = getId();
  const card = document.getElementById('eventCard');
  const err = document.getElementById('eventError');
  if (!card) return;

  card.replaceChildren();
  if (err) { err.style.display = 'none'; err.textContent = ''; }
  card.append(el('p', 'small', 'Loading event...'));

  if (!id) {
    card.replaceChildren();
    if (err) { err.textContent = 'No event selected.'; err.style.display = 'block'; }
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('network');

    const json = await res.json();
    const e = json?.data;
    if (!e) throw new Error('not found');

    card.replaceChildren();

    if (e.image_url) {
      const im = document.createElement('img');
      im.src = e.image_url;
      im.alt = e.name || 'event image';
      im.loading = 'lazy';
      card.append(im);
    }

    card.append(el('h2', null, e.name || 'Event'));
    if (e.category_name) card.append(el('div', 'badge', e.category_name));

    card.append(el('p', 'small', 'When: ' + whenText(e.start_datetime, e.end_datetime)));
    card.append(el('p', 'small', 'Where: ' + (e.location || '')));

    const org = [];
    if (e.org_name) org.push(e.org_name);
    if (e.org_mission) org.push('— ' + e.org_mission);
    if (org.length) card.append(el('p', 'small', 'Organiser: ' + org.join(' ')));

    card.append(el('h3', null, 'Purpose'));
    card.append(el('p', null, e.purpose || ''));

    card.append(el('h3', null, 'About the Event'));
    card.append(el('p', null, e.description || ''));

    card.append(el('h3', null, 'Tickets'));
    const price = Number(e.ticket_price);
    card.append(el('p', null, 'Price: ' + (price > 0 ? `$${price.toFixed(2)}` : 'Free')));

    const btn = el('button', 'btn', 'Register');
    btn.addEventListener('click', () => alert('This feature is currently under construction.'));
    card.append(btn);

    card.append(el('h3', null, 'Goal vs Progress'));
    const goal = Number(e.goal_amount);
    const raised = Number(e.raised_amount);
    const pct = (Number.isFinite(goal) && goal > 0 && Number.isFinite(raised))
      ? Math.min(100, Math.round((raised / goal) * 100))
      : 0;
    card.append(el('p', null, `Goal: ${Number.isFinite(goal) ? '$' + goal.toLocaleString() : '—'} · Raised: ${Number.isFinite(raised) ? '$' + raised.toLocaleString() : '—'} (${pct}%)`));
  } catch (_) {
    card.replaceChildren();
    if (err) { err.textContent = 'Failed to load event.'; err.style.display = 'block'; }
  }
}
