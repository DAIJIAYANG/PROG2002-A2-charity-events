# PROG2002 A2 — Charity Events Client

Simple client (HTML + JS). Uses the A2 API to show charity events.

## Run
- Open `index.html` in a browser, or serve the folder with a basic static server.
- Make sure the API is running on `http://localhost:3000`.
- If your API port is different, edit `public/js/config.js` (change `API_BASE`).

## Pages
- `index.html` – shows upcoming events from `/api/events?status=upcoming`.
- `search.html` – search by date / location / category.
- `event.html` – event details page with a **Register** button (placeholder).

## Notes
- The **Register** button shows an alert: “This feature is under construction.”
- Errors are shown via simple DOM updates (no frameworks).
