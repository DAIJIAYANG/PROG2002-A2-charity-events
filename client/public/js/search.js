// 加载分类下拉
async function loadCategories() {
  const sel = document.getElementById('category_id');
  try {
    const res = await fetch(`${API_BASE}/api/categories`);
    const json = await res.json();
    if (json.ok) {
      for (const c of json.data) {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        sel.appendChild(opt);
      }
    }
  } catch (e) {
    // 分类加载失败不影响主体搜索，这里静默处理或在控制台提示.
    console.warn('Load categories failed:', e);
  }
}

// 表单转查询字符串（默认只查 upcoming）
function formToQuery(form) {
  const params = new URLSearchParams();
  const date_from = form.date_from.value;
  const date_to = form.date_to.value;
  const location = form.location.value.trim();
  const category_id = form.category_id.value;

  // 默认查“即将/正在进行”的活动
  params.set('status', 'upcoming');

  if (date_from) params.set('date_from', date_from);
  if (date_to) params.set('date_to', date_to);
  if (location) params.set('location', location);
  if (category_id) params.set('category_id', category_id);

  return params.toString();
}

// 运行搜索（含日期校验与友好提示）
async function runSearch(evt) {
  evt.preventDefault();

  const form = document.getElementById('searchForm');
  const msg = document.getElementById('searchMsg');
  const err = document.getElementById('searchError');
  const grid = document.getElementById('resultsGrid');

  // 重置提示与结果
  msg.textContent = '';
  err.style.display = 'none';
  err.textContent = '';
  grid.innerHTML = '';

  // —— 简单日期校验：From 不能大于 To
  const df = form.date_from.value;
  const dt = form.date_to.value;
  if (df && dt && df > dt) {
    err.textContent = 'Date range is invalid: "From" should be earlier than "To".';
    err.style.display = 'block';
    return;
  }

  // —— 全空提示：允许查全部 upcoming，但提示用户可以设置条件
  const allEmpty =
    !df &&
    !dt &&
    !form.location.value.trim() &&
    !form.category_id.value;

  if (allEmpty) {
    msg.textContent =
      'Tip: Set date, location or category — or click Search to view all upcoming events.';
  }

  try {
    const qs = formToQuery(form);
    const url = `${API_BASE}/api/events?${qs}`;

    // 加载中的小提示
    if (!allEmpty) msg.textContent = 'Searching...';

    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');

    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'API error');

    msg.textContent = `Found ${json.count} event(s).`;

    if (json.count === 0) {
      grid.innerHTML = '<p>No matching events.</p>';
      return;
    }

    for (const e of json.data) {
      const priceText =
        Number(e.ticket_price) === 0 ? 'Free' : `$${Number(e.ticket_price).toFixed(2)}`;
      const goalPct =
        e.goal_amount > 0
          ? Math.min(100, Math.round((Number(e.raised_amount) / Number(e.goal_amount)) * 100))
          : 0;

      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${e.image_url || 'public/img/placeholder.jpg'}" alt="${e.name} image"/>
        <h3>${e.name}</h3>
        <div class="badge">${e.category_name}</div>
        <p class="small">${new Date(e.start_datetime).toLocaleString()} — ${new Date(
          e.end_datetime
        ).toLocaleString()}</p>
        <p>${e.location}</p>
        <p class="KPI">Ticket: <strong>${priceText}</strong> · Goal ${
        e.goal_amount ? '$' + Number(e.goal_amount).toLocaleString() : '$0'
      } — Raised $${Number(e.raised_amount).toLocaleString()} (${goalPct}%)</p>
        <a class="btn" href="event.html?id=${e.id}">View Details</a>
      `;
      grid.appendChild(card);
    }
  } catch (e) {
    msg.textContent = '';
    err.textContent = 'Search failed: ' + e.message;
    err.style.display = 'block';
  }
}

// 清空筛选并清理状态
function clearFilters() {
  const form = document.getElementById('searchForm');
  form.reset();
  document.getElementById('resultsGrid').innerHTML = '';
  const msg = document.getElementById('searchMsg');
  const err = document.getElementById('searchError');
  msg.textContent = '';
  err.style.display = 'none';
  err.textContent = '';
}

// 入口
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  document.getElementById('searchForm').addEventListener('submit', runSearch);
  document.getElementById('clearBtn').addEventListener('click', clearFilters);
});
