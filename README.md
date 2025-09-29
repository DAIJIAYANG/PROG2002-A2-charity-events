# PROG2002 A2 — Charity Events (JIAYANG DAI)

This repo has two parts:

- `api/` — Node.js + Express + MySQL (GET only for A2)
- `client/` — HTML + JS + DOM (Home / Search / Event)

## Requirements
- Node.js (LTS)
- MySQL 8+
- A web browser

## Setup — Database
1. Open MySQL and run (paths are relative to the `api/` folder):
   ```sql
   SOURCE sql/schema.sql;
   SOURCE sql/seed.sql;

Copy the env file and fill in your local DB info:
cd api
cp .env.example .env
# open .env and set DB_USER / DB_PASSWORD / DB_NAME if needed

Run — API
cd api
npm install
npm run start
# API will be at http://localhost:3000 (or PORT from .env)

Quick test endpoints:
GET /api/health
GET /api/categories
GET /api/events?status=upcoming
GET /api/events/:id
Note: A2 only needs GET. Suspended events (is_suspended = 1) are not returned.

Run — Client
Open client/index.html in your browser (or use any static server).
If your API base URL is different, edit client/public/js/config.js (API_BASE).

---

### `api/README.md`

```markdown
# PROG2002 A2 — Charity Events API (JIAYANG DAI)

Simple REST API using Node.js, Express, and MySQL.

## Stack
- Node.js, Express, mysql2
- GET endpoints only (A2 scope)
- `.env` for DB config
- MySQL schema + seed data

## Quick Start
1) Create the database and sample data:
```sql
SOURCE sql/schema.sql;
SOURCE sql/seed.sql;

Copy and edit environment variables:
cp .env.example .env
# set DB_HOST / DB_USER / DB_PASSWORD / DB_NAME / PORT if needed

Install and run:
npm install
npm run start
# http://localhost:3000 by default

Endpoints
GET /api/health — simple health check
GET /api/categories — list all categories
GET /api/events — list events with optional filters:
status = upcoming or active (end date ≥ today) or past
category_id (number)
location (substring match)
date_from (YYYY-MM-DD)
date_to (YYYY-MM-DD)
q (search name/description/purpose)
GET /api/events/:id — one event by id

Notes
Suspended events (is_suspended = 1) are not returned.
“Upcoming/active” is based on end_datetime compared with today (CURDATE()).
Use Postman or a browser to test GET endpoints.

Troubleshooting (basic)
If the API can’t connect, check .env values and make sure MySQL is running.
If you changed the DB name, also update it in .env

---

### `client/README.md`

```markdown
# PROG2002 A2 — Charity Events Client (JIAYANG DAI)

Client-side website that calls the API from `api/`.

## Run
- Open `index.html` directly in a browser, or serve the `client/` folder with any static server.
- Make sure the API is running at `http://localhost:3000`. If not, edit:
  - `public/js/config.js` → `const API_BASE = 'http://localhost:3000';`

## Pages
- `index.html` — Home, shows upcoming/active events from the API
- `search.html` — Search by date / location / category
- `event.html` — Event details; “Register” button shows a basic message (A3 will implement real actions)

## Notes
- Errors are shown with simple DOM updates.
- No POST/PUT/DELETE in A2.

