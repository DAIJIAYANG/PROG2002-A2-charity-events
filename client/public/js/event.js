// event.js — simple version

// if not injected, fallback to empty
const API_BASE = window.API_BASE || '';

function getIdFromUrl() {
  // read ?id=xxx
  const p = new URLSearchParams(window.location.search);
  return p.get('id');
}

document.addEventListener('DOMContentLoaded', loadEvent);

async function loadEvent() {
  const id = getIdFromUrl();
  const card = document.getElementById('eventCard');
  const errBox = document.getElementById('eventError');

  if (!card || !errBox) return;

  if (!id) {
    errBox.textContent = 'No event selected.';
    errBox.style.display = 'block';
    return;
  }

  card.textContent = 'Loading...';

  try {
    const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('network');

    const json = await res.json();
    if (!json || json.ok !== true || !json.data) throw new Error('api');

    const e = json.data;

    // clear and start render
    card.textContent = '';

    // title
    const h2 = document.createElement('h2');
    h2.textContent = e.name || 'Event';
    card.appendChild(h2);

    // image (only if exists)
    if (e.image_url) {
      const im = document.createElement('img');
      im.src = e.image_url;
      im.alt = e.name || '';
      card.appendChild(im);
    }

    // category tag
    if (e.category_name) {
      const tag = document.createElement('div');
      tag.className = 'badge';
      tag.textContent = e.category_name;
      card.appendChild(tag);
    }

    // when
    const start = new Date(e.start_datetime);
    const end = new Date(e.end_datetime);
    const pWhen = document.createElement('p');
    const startText = isNaN(start) ? (e.start_datetime || '') : start.toLocaleString();
    const endText = isNaN(end) ? (e.end_datetime || '') : end.toLocaleString();
    pWhen.textContent = 'When: ' + startText + ' — ' + endText;
    card.appendChild(pWhen);

    // where
    const pWhere = document.createElement('p');
    pWhere.textContent = 'Where: ' + (e.location || '');
    card.appendChild(pWhere);

    // organiser
    const pOrg = document.createElement('p');
    pOrg.textContent = 'Organiser: ' + (e.org_name || '');
    card.appendChild(pOrg);

    // purpose
    const h3Purpose = document.createElement('h3');
    h3Purpose.textContent = 'Purpose';
    card.appendChild(h3Purpose);
    const pPurpose = document.createElement('p');
    pPurpose.textContent = e.purpose || '';
    card.appendChild(pPurpose);

    // about
    const h3About = document.createElement('h3');
    h3About.textContent = 'About the Event';
    card.appendChild(h3About);
    const pAbout = document.createElement('p');
    pAbout.textContent = e.description || '';
    card.appendChild(pAbout);

    // tickets (very basic)
    const h3Tickets = document.createElement('h3');
    h3Tickets.textContent = 'Tickets';
    card.appendChild(h3Tickets);
    const pPrice = document.createElement('p');
    const priceNum = Number(e.ticket_price);
    pPrice.textContent = 'Price: ' + (priceNum > 0 ? ('$' + priceNum) : 'Free');
    card.appendChild(pPrice);

    // register button (placeholder)
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Register';
    btn.addEventListener('click', () => {
      alert('This feature is under construction.');
    });
    card.appendChild(btn);

    // goal vs raised (very basic)
    const h3Goal = document.createElement('h3');
    h3Goal.textContent = 'Goal vs Progress';
    card.appendChild(h3Goal);
    const pGoal = document.createElement('p');
    pGoal.textContent = 'Goal: $' + (e.goal_amount ?? '') + ' · Raised: $' + (e.raised_amount ?? '');
    card.appendChild(pGoal);

  } catch (err) {
    card.textContent = '';
    const errBox = document.getElementById('eventError');
    if (errBox) {
      errBox.textContent = 'Failed to load event.';
      errBox.style.display = 'block';
    }
  }
}
