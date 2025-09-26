# PROG2002 A2 — Charity Events Client (usernameA2-clientside)

This is the client-side website (HTML + JS + DOM). It consumes the REST API from `usernameA2-api`.

## Run
- Open `index.html` in a browser **or** serve with a simple static server.
- Make sure the API is running on `http://localhost:3000` (or edit `public/js/config.js`).

## Pages
- `index.html` – Home (static org info + dynamic list of active/upcoming events)
- `search.html` – Search by date/location/category
- `event.html` – Event details + "Register" placeholder

## Note
- The "Register" button shows a modal/alert saying the feature is under construction (per A2 brief).
- Error messages are rendered via basic DOM manipulation.
