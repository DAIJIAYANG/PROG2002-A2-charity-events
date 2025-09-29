# PROG2002 A2 — Charity Events API (JIAYANG DAI)

Simple REST API for Assessment 2 using Node.js, Express and MySQL.

## Tech
- Node.js, Express, mysql2
- GET endpoints only (A2 scope)
- MySQL schema + seed data
- `.env` for config

## Quick Start

1) Create the database and import sample data in MySQL:
```sql
SOURCE sql/schema.sql;
SOURCE sql/seed.sql;

2) Copy env and set credentials:
cp .env.example .env
# edit .env to match your MySQL user/password and DB name


3) Install & run:
npm install
npm run start
# API runs at http://localhost:${PORT or 3000}


### Endpoints
- `GET /api/health` – health check
- `GET /api/categories` – list categories
- `GET /api/events` – list events with optional filters:
  - `status` = `upcoming`|`active` (end >= today) or `past`
  - `category_id` (number)
  - `location` (text contains)
  - `date_from` (YYYY-MM-DD)
  - `date_to` (YYYY-MM-DD)
  - `q` (search in name/description/purpose)
- `GET /api/events/:id` – single event detail

### Notes
- Suspended events (`is_suspended=1`) are **never** returned.
- Upcoming/active are determined by `end_datetime` vs `CURDATE()`.
- Use Postman to test (`GET http://localhost:3000/api/events?status=upcoming`).

### For A3
- Add POST/PUT/DELETE for registrations, admin, etc.
