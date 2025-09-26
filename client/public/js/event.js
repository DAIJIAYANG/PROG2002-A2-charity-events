function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function loadEvent() {
  const id = getParam('id');
  const card = document.getElementById('eventCard');
  const err = document.getElementById('eventError');
  card.innerHTML = '';
  err.style.display = 'none';

  if (!id) {
    err.textContent = 'No event selected.';
    err.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/events/${id}`);
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'API error');
    const e = json.data;
    const priceText = Number(e.ticket_price) === 0 ? 'Free' : `$${Number(e.ticket_price).toFixed(2)}`;
    const goalPct = e.goal_amount > 0 ? Math.min(100, Math.round((Number(e.raised_amount) / Number(e.goal_amount)) * 100)) : 0;

    card.innerHTML = `
      <img src="${e.image_url || 'public/img/placeholder.jpg'}" alt="${e.name} image"/>
      <h2>${e.name}</h2>
      <div class="badge">${e.category_name}</div>
      <p class="small"><strong>When:</strong> ${new Date(e.start_datetime).toLocaleString()} — ${new Date(e.end_datetime).toLocaleString()}</p>
      <p class="small"><strong>Where:</strong> ${e.location}</p>
      <p class="small"><strong>Organiser:</strong> ${e.org_name} — ${e.org_mission || ''}</p>
      <h3>Purpose</h3>
      <p>${e.purpose || ''}</p>
      <h3>About the Event</h3>
      <p>${e.description || ''}</p>

      <h3>Tickets</h3>
      <p>Price: <strong>${priceText}</strong></p>
      <button class="btn" id="registerBtn" aria-label="Register for this event">Register</button>

      <h3 style="margin-top:16px;">Goal vs Progress</h3>
      <p>Goal: $${Number(e.goal_amount).toLocaleString()} · Raised: $${Number(e.raised_amount).toLocaleString()} (${goalPct}%)</p>
    `;

    const reg = document.getElementById('registerBtn');
    reg.addEventListener('click', () => {
      alert('This feature is currently under construction.');
    });
  } catch (e) {
    err.textContent = 'Failed to load event. ' + e.message;
    err.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', loadEvent);
