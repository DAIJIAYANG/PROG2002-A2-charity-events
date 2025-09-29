// Event details page script (simple student-style comments)

// fallback in case API_BASE isn't injected
const API_BASE = window.API_BASE || '';

function getParam(name) {
  // get ?id= from current url
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  } catch (e) {
    // if something weird with URL, just return null
    return null;
  }
}

// formatter: money like $1,234.56 (using browser locale)
const fmtMoney = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
function money(n) {
  const v = Number(n);
  return Number.isFinite(v) ? fmtMoney.format(v) : '—'; // show dash if invalid
}

// formatter: date → local string
function fmtDate(d) {
  const t = new Date(d);
  return isNaN(t) ? '—' : t.toLocaleString();
}

// quick helper to build an element
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

// image with lazy load + fallback if broken
function img(src, alt) {
  const im = document.createElement('img');
  im.alt = alt || '';
  im.src = src || 'public/img/placeholder.jpg';
  im.loading = 'lazy';
  im.referrerPolicy = 'no-referrer';
  im.addEventListener('error', () => {
    // if img url 404 or something, swap to placeholder
    im.src = 'public/img/placeholder.jpg';
  });
  return im;
}

async function loadEvent() {
  const id = getParam('id');                   // we expect /event.html?id=123
  const card = document.getElementById('eventCard');
  const err = document.getElementById('eventError');

  if (!card || !err) return;                   // required containers missing

  // reset UI and show a simple loading msg
  card.replaceChildren();
  err.style.display = 'none';
  card.append(el('p', 'small', 'Loading event...'));

  if (!id) {
    // no id in url → nothing to show
    card.replaceChildren();
    err.textContent = 'No event selected.';
    err.style.display = 'block';
    return;
  }

  try {
    // fetch one event by id
    const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Network error: ${res.status}`);

    // expected shape: { ok: true, data: {...} }
    const json = await res.json();
    if (!json || json.ok !== true || !json.data) {
      throw new Error(json?.error || 'API error');
    }

    const e = json.data;

    // derive some display fields with safe fallbacks
    const priceNum = Number(e.ticket_price);
    const priceText = Number.isFinite(priceNum) && priceNum > 0 ? money(priceNum) : 'Free';

    const goal = Number(e.goal_amount);
    const raised = Number(e.raised_amount);
    // percentage, keep in [0,100]
    const pct = Number.isFinite(goal) && goal > 0 && Number.isFinite(raised)
      ? Math.min(100, Math.max(0, Math.round((raised / goal) * 100)))
      : 0;

    // render (avoid dumping raw data into innerHTML to reduce XSS risk)
    card.replaceChildren();

    // top image + title
    card.append(img(e.image_url, `${e.name || 'Event'} image`));
    card.append(el('h2', null, e.name || 'Untitled Event'));

    // category tag (if we have it)
    if (e.category_name) card.append(el('div', 'badge', e.category_name));

    // when (use innerHTML only for the <strong> label, values are formatted)
    const when = el('p', 'small');
    when.innerHTML = `<strong>When:</strong> ${fmtDate(e.start_datetime)} — ${fmtDate(e.end_datetime)}`;
    card.append(when);

    // where
    const where = el('p', 'small');
    where.innerHTML = `<strong>Where:</strong> ${e.location ? String(e.location) : '—'}`;
    card.append(where);

    // organiser info
    const org = el('p', 'small');
    const orgName = e.org_name ? String(e.org_name) : '—';
    const orgExtra = e.org_mission ? ' — ' + String(e.org_mission) : '';
    org.innerHTML = `<strong>Organiser:</strong> ${orgName}${orgExtra}`;
    card.append(org);

    // purpose + about sections (plain text)
    card.append(el('h3', null, 'Purpose'));
    card.append(el('p', null, e.purpose || ''));

    card.append(el('h3', null, 'About the Event'));
    card.append(el('p', null, e.description || ''));

    // tickets
    card.append(el('h3', null, 'Tickets'));
    const priceP = el('p');
    priceP.innerHTML = `Price: <strong>${priceText}</strong>`;
    card.append(priceP);

    // register button (just a placeholder for now)
    const btn = el('button', 'btn');
    btn.id = 'registerBtn';
    btn.setAttribute('aria-label', 'Register for this event');
    btn.textContent = 'Register';
    btn.addEventListener('click', () => {
      // we implement real register flow in A3 (not in A2)
      alert('This feature is currently under construction.');
    });
    card.append(btn);

    // goal vs progress
    card.append(el('h3', null, 'Goal vs Progress'));
    const goalP = el('p');
    const goalStr = Number.isFinite(goal) ? money(goal) : '—';
    const raisedStr = Number.isFinite(raised) ? money(raised) : '—';
    goalP.textContent = `Goal: ${goalStr} · Raised: ${raisedStr} (${pct}%)`;
    card.append(goalP);

  } catch (ex) {
    // show a friendly error (don’t crash the whole page)
    card.replaceChildren();
    err.textContent = 'Failed to load event. ' + (ex?.message || ex);
    err.style.display = 'block';
  }
}

// run after DOM is ready
document.addEventListener('DOMContentLoaded', loadEvent);
