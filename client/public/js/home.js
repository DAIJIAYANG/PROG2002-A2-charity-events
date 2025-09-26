async function loadHome() {
  const grid = document.getElementById('eventsGrid');
  const err = document.getElementById('homeError');
  grid.innerHTML = '';
  err.style.display = 'none';

  try {
    const url = `${API_BASE}/api/events?status=upcoming`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'API error');
    if (json.count === 0) {
      grid.innerHTML = '<p>No upcoming events found.</p>';
      return;
    }
    for (const e of json.data) {
      const priceText = Number(e.ticket_price) === 0 ? 'Free' : `$${Number(e.ticket_price).toFixed(2)}`;
      const goalPct = e.goal_amount > 0 ? Math.min(100, Math.round((Number(e.raised_amount) / Number(e.goal_amount)) * 100)) : 0;
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${e.image_url || 'public/img/placeholder.jpg'}" alt="${e.name} image"/>
        <h3>${e.name}</h3>
        <div class="badge">${e.category_name}</div>
        <p class="small">${new Date(e.start_datetime).toLocaleString()} — ${new Date(e.end_datetime).toLocaleString()}</p>
        <p>${e.location}</p>
        <p class="KPI">Ticket: <strong>${priceText}</strong> · Goal ${e.goal_amount ? '$' + Number(e.goal_amount).toLocaleString() : '$0'} — Raised $${Number(e.raised_amount).toLocaleString()} (${goalPct}%)</p>
        <a class="btn" href="event.html?id=${e.id}">View Details</a>
      `;
      grid.appendChild(card);
    }
  } catch (e) {
    err.textContent = 'Failed to load events. ' + e.message;
    err.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', loadHome);
